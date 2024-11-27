import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return NextResponse.json(workspaces, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}