import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID!;
const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID!;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;
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

    // Get IP information from ipinfo.io
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    let ipInfo = null;
    try {
      const ipResponse = await fetch(`https://ipinfo.io/${clientIp}/json`);
      if (ipResponse.ok) {
        ipInfo = await ipResponse.json();
      }
    } catch (error) {
      console.error('Failed to fetch IP info:', error);
    }

    // Add user to Discord server using bot
    try {
      const addMemberResponse = await fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: access_token,
          }),
        }
      );

      // Check if user is already in server (status 204) or was just added (status 201)
      if (addMemberResponse.status === 204 || addMemberResponse.status === 201) {
        // User is in server, check and assign role if needed
        const memberResponse = await fetch(
          `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${id}`,
          {
            headers: {
              'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            },
          }
        );

        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          const hasRole = memberData.roles?.includes(DISCORD_ROLE_ID);

          if (!hasRole) {
            // Add role to user
            await fetch(
              `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${id}/roles/${DISCORD_ROLE_ID}`,
              {
                method: 'PUT',
                headers: {
                  'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                },
              }
            );
          }
        }
      }
    } catch (error) {
      console.error('Failed to add user to server or assign role:', error);
    }

    // Send webhook to Discord with verification logs
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      let ipInfoText = 'No IP information available';
      
      if (ipInfo) {
        ipInfoText = Object.entries(ipInfo)
          .map(([key, value]) => `**${key}:** ${value}`)
          .join('\n');
      }

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [
            {
              author: {
                name: 'Archive Industries Systems',
                icon_url: 'https://www.archiveant.org/ArchiveIndustries2.png',
              },
              title: 'Verification Logs',
              description: `**User:** ${username} | ${id} | <@${id}>\n**Time:** <t:${timestamp}:F>\n\n**IPInfo Info:**\n${ipInfoText}`,
              color: 0xFFFFFF,
            },
          ],
        }),
      });
    } catch (error) {
      console.error('Failed to send webhook:', error);
    }

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
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.archiveant.org';
    return NextResponse.redirect(new URL('/auth/success', domain));
  } catch (error) {
    console.error('OAuth callback error:', error);
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.archiveant.org';
    return NextResponse.redirect(new URL('/verify?error=auth_failed', domain));
  }
}
