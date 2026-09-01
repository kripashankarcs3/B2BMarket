import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, notFound, badRequest } from '@/lib/auth-helpers';
import { mapSupplier } from '@/lib/mappers/supplier.mapper';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
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
    });

    if (!supplier) {
      return notFound('Supplier not found');
    }

    const mapped = mapSupplier(supplier);

    return success(mapped);
  } catch (error) {
    console.error('Supplier detail error:', error);
    return badRequest('Failed to fetch supplier');
  }
}
