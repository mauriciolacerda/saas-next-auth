"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TenantFormProps {
  ownerId: string;
}

export function TenantForm({ ownerId }: TenantFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{
    type: "default" | "destructive";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ownerId }),
    });
    const data = await response.json();
    setMessage(data);
    if (response.ok) {
      router.push("/login");
    } else {
      setMessage({ type: "destructive", text: data.message });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Precisamos de apenas mais alguns dados
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
        <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="hidden" value={ownerId} />
        <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          <Button
            type="submit"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Finalizar o cadastro
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ou faça o login {" "}
          <Link href="/login" className="underline">
            aqui
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
