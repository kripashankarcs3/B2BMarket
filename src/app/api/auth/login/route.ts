import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, success, badRequest } from '@/lib/auth-helpers';
import { mapUser } from '@/lib/mappers/user.mapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return badRequest('Email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        avatar: true,
        companyName: true,
      },
    });

    if (!user) {
      return badRequest('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return badRequest('Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    });

    return success({
      user: mapUser(user),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return badRequest('Login failed. Please try again.');
  }
}
