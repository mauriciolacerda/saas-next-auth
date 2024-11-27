"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
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
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTenantStore } from "@/modules/tenant/tenant.store";

export default function Page() {
  const { data: session } = useSession();
  const { tenant } = useTenantStore();

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Building",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.name || !formData.slug) {
      setError("O nome e o slug são obrigatórios.");
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
        throw new Error("Falha ao criar o workspace. Tente novamente.");
      }

      router.push("/workspaces");
    } catch (err) {
      setError((err instanceof Error ? err.message : "Erro ao criar workspace."));
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
    <div className="max-w-lg mx-auto min-w-96">
      <h1 className="text-2xl font-bold mb-6">Crie um novo workspace</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md">{error}</div>
        )}

        <div>
          <Label htmlFor="name">Nome do workspace</Label>
          <Input
            id="name"
            name="name"
            placeholder="Insira o nome do workspace"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="Insira um slug para o workspace"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
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
                  className={`flex items-center justify-center p-2 border rounded-md ${
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

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : <><Plus /> Criar Workspace</>}
        </Button>
      </form>
    </div>
  );
}
