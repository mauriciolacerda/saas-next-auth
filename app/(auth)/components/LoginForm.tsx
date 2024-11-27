"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { ClientSafeProvider } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/validationSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginFormProps {
  providers: Record<string, ClientSafeProvider>;
}

export function LoginForm({ providers }: LoginFormProps) {
  const [message, setMessage] = useState<{
    type: "default" | "destructive";
    text: string;
  } | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onFormSubmit = async (data: LoginSchema) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setMessage({ type: "destructive", text: result.error });
      } else if (result?.ok) {
        setMessage({ type: "default", text: "Login realizado com sucesso!" });
        router.push("/tenants/select-tenant");
      }
    } catch {
      setMessage({
        type: "destructive",
        text: "Erro ao realizar login. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-center text-gray-500 mb-6">
          Insira seu email abaixo para fazer login na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {message.type === "destructive" ? "Erro" : "Sucesso"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
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
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/forgot"
                className="ml-auto inline-block text-sm underline"
              >
                Esqueceu sua senha?
              </Link>
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
                placeholder="Digite sua senha"
                aria-invalid={errors.password ? "true" : "false"}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Carregando..." : "Entrar"}
          </Button>
          <div className="flex items-center mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>
        </form>
        {providers &&
          Object.values(providers).map((provider) =>
            provider.id === "credentials" ? null : (
              <Button
                key={provider.name}
                variant="outline"
                className="w-full"
                onClick={() => signIn(provider.id)}
              >
                Continuar com {provider.name}
              </Button>
            )
          )}
        <div className="mt-4 text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="underline">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
