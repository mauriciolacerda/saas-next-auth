"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Building,
  Building2,
  Castle,
  Factory,
  Hospital,
  Landmark,
  Plus,
  School,
  Store,
  X,
} from "lucide-react";
import { useTenantStore } from "@/modules/tenant/tenant.store";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceDialog({
  isOpen,
  onClose,
}: CreateWorkspaceDialogProps) {
  const { data: session } = useSession();
  const { tenant } = useTenantStore();
  const { setWorkspace } = useWorkspaceStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Building2",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.name || !formData.slug) {
      setError("Os campos Nome e Slug são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tenantId: tenant?.id,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar o workspace. Tente novamente.");
      }

      const newWorkspace = await response.json();

      // Atualiza o Zustand com o novo workspace criado
      setWorkspace(newWorkspace);

      // Reseta o formulário
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "Building2",
      });
      toast({
        title: "Registro criado",
        description: "Seu novo workspace foi criado com sucesso.",
      });
      // Fecha o diálogo
      onClose();
    } catch (err) {
      setError((err as Error).message || "Erro ao criar workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const icons = [
    { name: "Building2", component: Building2 },
    { name: "Building", component: Building },
    { name: "Landmark", component: Landmark },
    { name: "Store", component: Store },
    { name: "Castle", component: Castle },
    { name: "Factory", component: Factory },
    { name: "Hospital", component: Hospital },
    { name: "School", component: School },
  ];

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-screen h-screen max-w-none border-none bg-white flex flex-col items-center gap-y-0">
        <DialogHeader className="w-full max-w-lg py-24">
          <DialogTitle>Novo Workspace</DialogTitle>
          <DialogDescription >
            Preencha os campos do formulário para criar um novo workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-lg mx-auto size-1/2 block sm:min-w-96">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {error && (
              <div className="text-red-600 bg-red-100 p-2 rounded-md">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="name">Nome do workspace</Label>
              <Input
                id="name"
                name="name"
                placeholder="Insira o nome do workspace"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">URL do workspace</Label>
              <div className="flex items-center">
                <span className="text-gray-400 font-thin text-sm absolute pl-3">https://app.tenancy.io/</span>
              <Input
                id="slug"
                name="slug"
                placeholder="Insira uma URL para o workspace"
                className="pl-40"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Insira uma descrição para o workspace"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Selecione o ícone que represente melhor o workspace</Label>
              <ToggleGroup
                type="single"
                value={formData.icon}
                onValueChange={handleIconSelect}
                className="grid grid-cols-4 gap-2"
              >
                {icons.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <ToggleGroupItem
                      key={icon.name}
                      value={icon.name}
                      aria-label={icon.name}
                      className={`flex items-center justify-center p-2 border rounded-sm ${
                        formData.icon === icon.name
                          ? "bg-gray-200 ring-2 ring-blue-500"
                          : "bg-white"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          formData.icon === icon.name
                            ? "text-blue-500"
                            : "text-gray-700"
                        }`}
                      />
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
            <div className="flex">
                <Button type="submit" disabled={isSubmitting} className="w-1/2 sm:w-96">
                {isSubmitting ? "Criando..." : <><Plus /> Criar Workspace</>}
                </Button>
                <Button variant={"outline"} onClick={onClose} className="ml-2 w-1/2 sm:w-96">
                <X />Cancelar
                </Button>
            </div>
          </form>
        </div>
        <DialogClose />
      </DialogContent>
      <DialogFooter />
    </Dialog>
    <Toaster />
    </>
  );
}
