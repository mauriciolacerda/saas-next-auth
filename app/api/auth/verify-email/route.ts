import { sendVerificationEmail } from "@/lib/email";
import {
  findUserByVerificationToken,
  markEmailAsVerified,
} from "@/modules/user/user.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();
  if (!email || !token) {
    return NextResponse.json(
      { message: "E-mail ou token não fornecido." },
      { status: 400 }
    );
  }

  try {
    await sendVerificationEmail(email, token);
    return NextResponse.json({ message: "E-mail de verificação enviado." });
  } catch (error: unknown) {
    console.error("Erro ao enviar o e-mail:", error);
    return NextResponse.json(
      { message: "Erro ao enviar o e-mail. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { message: "Token não fornecido." },
      { status: 400 }
    );
  }
  const user = await findUserByVerificationToken(token);
  if (!user) {
    return NextResponse.json(
      { message: "Usuário não encontrado ou token expirado." },
      { status: 404 }
    );
  }
  await markEmailAsVerified(user.id);
  return NextResponse.json({ message: "E-mail verificado com sucesso." });
}
