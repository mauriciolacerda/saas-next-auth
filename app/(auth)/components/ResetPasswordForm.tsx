"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm({ token }: { token: string }) {
  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Altere sua senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input id="password" type="text" required value={token} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmpassword">Confirme a senha</Label>
            <Input id="confirmpassword" type="text" required />
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Alterar senha
          </Button>
        </form>
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
