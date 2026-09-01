import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, badRequest } from '@/lib/auth-helpers';
import { mapSupplier } from '@/lib/mappers/supplier.mapper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const premium = searchParams.get('premium') === 'true';

    const prismaWhere: Record<string, unknown> = {};
    if (premium) {
      prismaWhere.isPremium = true;
    }

    const suppliers = await prisma.supplier.findMany({
      where: prismaWhere as any,
      include: {
        certifications: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { isPremium: 'desc' },
    });

    const mapped = suppliers.map(mapSupplier);

    return success(mapped);
  } catch (error) {
    console.error('Suppliers error:', error);
    return badRequest('Failed to fetch suppliers');
  }
}
