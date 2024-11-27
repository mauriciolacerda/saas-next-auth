import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset?token=${token}`;

  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Redefinição de Senha",
      html: `
        <p>Você solicitou uma redefinição de senha.</p>
        <p>Use o link abaixo para redefinir sua senha. Ele expira em 15 minutos:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });
    console.log(`E-mail enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw new Error("Erro ao enviar o e-mail. Tente novamente mais tarde.");
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject: "Verificação de E-mail",
      html: `
        <p>Bem-vindo! Por favor, verifique seu e-mail clicando no link abaixo:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>O link expira em 30 minutos.</p>
      `,
    });
    console.log(`E-mail enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw new Error("Erro ao enviar o e-mail. Tente novamente mais tarde.");
  }
};
