import { prisma } from '@/lib/prisma';
import { success, badRequest } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return success(categories);
  } catch (error) {
    console.error('Categories error:', error);
    return badRequest('Failed to fetch categories');
  }
}
