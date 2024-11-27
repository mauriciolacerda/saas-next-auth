import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "O nome completo deve ter pelo menos 2 caracteres.")
    .max(50, "O nome completo não deve exceder 50 caracteres."),
  email: z
    .string()
    .email("Endereço de e-mail inválido.")
    .min(5, "O e-mail deve ter pelo menos 5 caracteres.")
    .max(100, "O e-mail não deve exceder 100 caracteres."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(100, "A senha não deve exceder 100 caracteres."),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Endereço de e-mail inválido.")
    .min(5, "O e-mail deve ter pelo menos 5 caracteres.")
    .max(100, "O e-mail não deve exceder 100 caracteres."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(100, "A senha não deve exceder 100 caracteres."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
