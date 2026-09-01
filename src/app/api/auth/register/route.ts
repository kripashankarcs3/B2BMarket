import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, success, badRequest } from '@/lib/auth-helpers';
import { mapUser } from '@/lib/mappers/user.mapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, company, accountType } = body;

    if (!name || !email || !password) {
      return badRequest('Name, email, and password are required');
    }

    if (password.length < 8) {
      return badRequest('Password must be at least 8 characters');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return badRequest('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        companyName: company || null,
        role: accountType === 'supplier' ? 'SUPPLIER' : 'BUYER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        companyName: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    });

    return success({
      user: mapUser(user),
      token,
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return badRequest('Registration failed. Please try again.');
  }
}
