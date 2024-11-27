import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}