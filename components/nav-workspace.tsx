"use client";

import { useCallback, useEffect, useState } from "react";
import { useTenantStore } from "@/modules/tenant/tenant.store";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";
import {
  Check,
  ChevronsUpDown,
  LucideSettings,
  LucideSettings2,
  PlusSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Workspace } from "@/modules/workspace/workspace.type";
import CreateWorkspaceDialog from "@/app/(dashboard)/workspaces/components/CreateWorkspace";
import { useRouter } from "next/navigation";
import { getWorkspacesByUserAndTenant } from "@/modules/workspace/workspace.service";

export function NavWorkspace({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const { workspace, setWorkspace, hasHydrated } = useWorkspaceStore();
  const tenant = useTenantStore((state) => state.tenant);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n, i, arr) => (i === 0 || i === arr.length - 1 ? n[0] : ""))
      .join("")
      .toUpperCase();
  };

  const fetchWorkspaces = useCallback(async () => {
    console.log(tenant, user.id);
    if (tenant) {
      try {
        const response = await getWorkspacesByUserAndTenant(tenant.id, user.id);        
        setWorkspaces(response);

        // Define o primeiro workspace apenas se ainda não houver um selecionado
        if (response.length > 0 && !workspace) {
          setWorkspace(response[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar workspaces:", error);
      }
    }
  }, [tenant, user.id, setWorkspace, workspace]);

  useEffect(() => {
    if (hasHydrated && tenant) {
      fetchWorkspaces();
    }
  }, [hasHydrated, tenant, fetchWorkspaces]);

  if (!hasHydrated) {
    return <div>Carregando estado...</div>;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between w-full px-2 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              >
                <Avatar className="rounded-lg h-8 w-8 ">
                  <AvatarImage
                    src={workspace?.icon || user.avatar}
                    alt={workspace?.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white ">
                    {getInitials(workspace?.name) || "W"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {workspace ? workspace.name : "Default"}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg"
              side="bottom"
              sideOffset={4}
            >
              {workspaces.map((ws) => (
                <div key={ws.id}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="text-xs"
                      onSelect={() => {
                        setWorkspace(ws);
                        router.push(`/${ws.slug}`);
                      }}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ws.icon} alt={ws.name} />
                            <AvatarFallback>
                              {getInitials(ws?.name) || "W"}
                            </AvatarFallback>
                          </Avatar>
                          {ws.name}
                        </div>
                        {workspace?.id === ws.id && (
                          <Check className="ml-auto size-4" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-xs" onClick={openDialog}>
                  <PlusSquare className="size-3 stroke-[1.25]" />
                  Novo workspace
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-xs" onClick={openDialog}>
                  <LucideSettings className="size-3 stroke-[1.25]" />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-xs" onClick={openDialog}>
                  <LucideSettings2 className="size-3 stroke-[1.25]" />
                  Administração Geral
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
            <CreateWorkspaceDialog
              isOpen={isDialogOpen}
              onClose={closeDialog}
            />
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
