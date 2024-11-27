"use client";

import { useTenantStore } from "@/modules/tenant/tenant.store";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";
import { useSession } from "next-auth/react";

export default function Page() {
  const { workspace } = useWorkspaceStore()
  const tenant  = useTenantStore((state) => state.tenant);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Você não está autenticado. Por favor, faça login.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard do Usuário de todos os workspaces</h1>
      <p>Este é o conteúdo da página, exibido na área principal.</p>


    <p>Workspace: {workspace?.name}</p>
    <p>Usuário: {session?.user?.name}</p>
    <p>Email: {session?.user?.email}</p>
    <p>User ID: {session?.user?.id}</p>
    {tenant ? (
        <p>Tenant Data: {tenant.id}</p>
      ) : (
        <p>Nenhum tenant selecionado</p>
      )}
    </div>
  )
}
