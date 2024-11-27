import crypto from "crypto";
import { addMinutes, isAfter } from "date-fns";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  updateUserResetToken,
  findUserByResetToken,
  updateUserPassword,
  createVerificationToken,
} from "./user.repository";

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Usuário não encontrado.");

  const token = crypto.randomBytes(32).toString("hex");
  const expires = addMinutes(new Date(), 15);

  await updateUserResetToken(email, token, expires);

  return token;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await findUserByResetToken(token);
  if (!user) throw new Error("Token inválido ou expirado.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (isAfter(new Date(), user.resetTokenExpiry!)) {
    throw new Error("Token expirado.");
  }
  await updateUserPassword(user.id, hashedPassword);

  return true;
};


export const getUserTenants = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/tenants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user tenants: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user tenants:", error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const data = await response.json();
  return data;
};

export const sendEmailVerification = async (userId: string, email: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = addMinutes(new Date(), 30);

  await createVerificationToken(userId, token, expires);

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Falha ao enviar e-mail de verificação.");
  }
};

export const verifyEmail = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Token inválido ou expirado.");
  }

  return true;
};