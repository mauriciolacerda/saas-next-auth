import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/modules/user/user.service";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const token = await requestPasswordReset(email);
    await sendPasswordResetEmail(email, token);
    

    console.log(`E-mail enviado para ${email}`);
    return NextResponse.json({ message: "Instruções de redefinição enviadas por e-mail." });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
