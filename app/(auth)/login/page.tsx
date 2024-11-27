import { getProviders } from "next-auth/react";
import { LoginForm } from "@/app/(auth)/components/LoginForm"

export default async function Page() {
  const providers = await getProviders();
  return (
      <LoginForm providers={providers || {}}/>
  )
}
