import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-in-production');

// Initialize SQLite database
const db = new Database('users.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    discriminator TEXT,
    avatar TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/verify?error=no_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const { id, username, discriminator, avatar } = userData;

    // Store user in database
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO users (id, username, discriminator, avatar, access_token, refresh_token, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        discriminator = excluded.discriminator,
        avatar = excluded.avatar,
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      id,
      username,
      discriminator || '0',
      avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null,
      access_token,
      refresh_token || null,
      now,
      now
    );

    // Create JWT token
    const token = await new SignJWT({ userId: id, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Also set user data cookie for client-side access
    cookieStore.set('user', JSON.stringify({
      id,
      username,
      avatar: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/success', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/verify?error=auth_failed', request.url));
  }
}
