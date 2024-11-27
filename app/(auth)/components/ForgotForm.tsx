"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export function ForgotForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("Instruções enviadas para o e-mail.");
    } else {
      const error = await res.json();
      alert(error.message);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Esqueceu sua senha?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-500">
              <Mail size={16} />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="Seu e-mail"
              required
              value={email}
              className="pl-10"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" onClick={handleSubmit}>
          Enviar e-mail de redefinição
        </Button>
        <div className="mt-4 text-center text-sm">
          ou faça o login{" "}
          <Link href="/login" className="underline">
            aqui
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
