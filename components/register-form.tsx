"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User } from "lucide-react";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    router.push("/login");
  }

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Você pode criar uma conta em segundos!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <User size={16} />
              </span>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail profissional</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Mail size={16} />
              </span>
              <Input
                id="email"
                type="email"
                required
                value={email}
                className="pl-10"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Escolha a senha</Label>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Lock size={16} />
              </span>
              <Input
                id="password"
                type="password"
                required
                value={password}
                className="pl-10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Continuar
          </Button>
          <div className="flex items-center mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <Button variant="outline" className="w-full">
            Cadastrar com Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
