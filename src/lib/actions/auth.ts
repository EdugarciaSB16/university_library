'use server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { signIn } from '@/lib/auth';
import { AuthCredentials } from '@/types';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, 'email' | 'password'>
) => {
  const { email, password } = params;

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast');

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error(error, 'SignIn error');
    return { success: false, error: 'Failed to sign in' };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityId, universityCard } = params;

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast');

  // Check if the user already exits
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: 'User already exists' };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({
      email,
      password,
    });
    return { success: true };
  } catch (error) {
    console.error(error, 'SignUp error');
    return { success: false, error: 'Failed to create user' };
  }
};
