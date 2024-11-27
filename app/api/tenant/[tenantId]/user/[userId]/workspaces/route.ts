import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userId: string, tenantId: string} }) {
  const { tenantId, userId } = await params;
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        tenantId: tenantId as string,
        users: {
          some: {
            userId: userId as string,
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