import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Delete auth cookies
  cookieStore.delete('auth_token');
  cookieStore.delete('user');

  return NextResponse.json({ success: true });
}
