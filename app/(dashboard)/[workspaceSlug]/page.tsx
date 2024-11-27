"use client";

import { useSyncWorkspace } from "@/hooks/use-sync-workspace";
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug;
  useSyncWorkspace(workspaceSlug as string);
  const workspace = useWorkspaceStore((state) => state.workspace);
  if (!workspace) {
    return <div>Carregando workspace...</div>;
  }


  return (
    <div>
      <h1>Bem-vindo ao Workspace: {workspace.name}</h1>
      <p>ID: {workspace.id}</p>
      <p>Slug: {workspace.slug}</p>
      {/* Outros detalhes do workspace */}
    </div>
  );
}
