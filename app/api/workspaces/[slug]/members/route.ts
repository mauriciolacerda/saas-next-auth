import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const members = await prisma.workspace.findMany({
      where: { slug },
      include: { users: true },
    });

    if (members.length === 0) {
      return NextResponse.json({ error: 'Workspace does not have members.' }, { status: 404 });
    }

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('Error fetching members from workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}