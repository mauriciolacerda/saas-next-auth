import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';

// Função para decodificar Base64 e salvar a imagem
const saveImage = async (base64: string, userId: string) => {
  const buffer = Buffer.from(base64.split(',')[1], 'base64');
  const fileName = `avatar-${userId}-${Date.now()}.png`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Certifique-se de que o diretório exista
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
};
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { base64, userId } = await request.json();

    if (!base64 || !userId) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    const imageUrl = await saveImage(base64, userId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao atualizar avatar' }, { status: 500 });
  }
}