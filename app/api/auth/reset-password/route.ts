import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/modules/user/user.service";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  try {
    await resetPassword(token, newPassword);
    return NextResponse.json({ message: "Senha redefinida com sucesso." });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
