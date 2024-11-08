import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: 'Usuário criado com sucesso' });
}