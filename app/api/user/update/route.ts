import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";
import { User } from "@/modules/user/user.type";

const prisma = new PrismaClient();
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const data: User = await request.json();

    if (!data.name && !data.email) {
      return NextResponse.json(
        { message: "Nenhum dado para atualizar" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        jobTitle: data.jobTitle,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
