import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createUser, findUserByEmail } from "@/modules/user/user.repository";
import { sendEmailVerification } from "@/modules/user/user.service";

export async function POST(request: Request) {
  const { email, password, fullName: name } = await request.json();

  const hashedPassword = await hash(password, 12);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return NextResponse.json({ message: "Usuário já existe" }, { status: 400 });
  }

  try {
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

//TODO: Enviar email de para validação de email do usuário com link de confirmação

    await sendEmailVerification(newUser.id, newUser.email);
    
    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
