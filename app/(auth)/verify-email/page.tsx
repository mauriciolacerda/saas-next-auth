"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/modules/user/user.service";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setMessage("Token inválido ou ausente.");
        setLoading(false);
        return;
      }
      try {
        await verifyEmail(token);
        setMessage("E-mail verificado com sucesso!");
        setTimeout(() => router.push("/login"), 2000);
      } catch (error: unknown) {
        setMessage((error as Error).message || "Erro ao verificar o e-mail.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmailToken();
  }, [router, token]);

  return (
    <div>
      <h1>{loading ? "Verificando E-mail..." : message}</h1>
    </div>
  );
}
