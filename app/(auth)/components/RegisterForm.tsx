"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validationSchema";

interface RegisterFormProps {
  onSubmit: (data: { user: { id: string } }) => void | Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [message, setMessage] = useState<{
    type: "default" | "destructive";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const onFormSubmit = async (data: RegisterSchema) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage({ type: "default", text: responseData.message });
        onSubmit(responseData);
      } else {
        setMessage({ type: "destructive", text: responseData.message });
      }
    } catch {
      setMessage({
        type: "destructive",
        text: "Erro ao realizar cadastro. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Você pode criar uma conta em segundos!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <User size={16} />
              </span>
              <Input
                id="fullName"
                type="text"
                {...register("fullName")}
                className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                placeholder="Digite seu nome completo"
                aria-invalid={errors.fullName ? "true" : "false"}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
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
                {...register("email")}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                placeholder="Digite seu e-mail"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
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
                {...register("password")}
                className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                placeholder="Escolha uma senha"
                aria-invalid={errors.password ? "true" : "false"}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Carregando..." : "Continuar"}
          </Button>
        </form>
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">ou</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Button variant="outline" className="w-full">
          Cadastrar com Google
        </Button>
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
