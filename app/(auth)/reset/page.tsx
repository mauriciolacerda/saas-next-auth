"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const handleSubmit = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (res.ok) {
      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } else {
      const error = await res.json();
      alert(error.message);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          {" "}
          Redefinir senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 grid gap-4">
        <Input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={handleSubmit}>Redefinir</Button>
      </CardContent>
    </Card>
  );
}
