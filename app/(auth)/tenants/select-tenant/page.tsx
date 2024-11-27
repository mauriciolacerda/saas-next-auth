"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserTenants } from "@/modules/user/user.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Tenant } from "@/modules/tenant/tenant.type";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import { useTenantStore } from "@/modules/tenant/tenant.store";

export default function SelectTenantPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setTenant } = useTenantStore();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      if (session?.user?.id) {
        const data = await getUserTenants(session.user.id);
        if (data.length === 1) {
          setTenant(data[0]);
          router.push("/");
        } else {
          setTenants(data);
          setIsLoading(false);
        }
      }
    };
    fetchTenants();
  }, [session, router, setTenant]);

  const handleSelectTenant = (tenant: Tenant) => {
    setTenant(tenant);
    router.push("/");
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!session?.user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg pt-10 pb-10">
      <Alert className="mb-5">
        <Terminal className="w-6 h-6 mr-2" />
        <AlertTitle>Selecione o Tenant</AlertTitle>
        <AlertDescription>
          O seu usuário esta vinculado as seguintes organizações
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <Card
            key={tenant.id}
            className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg z-10"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <Building />
                  </div>
                  <div className="w-full text-justify">
                    <p className="text-base text-gray-800">{tenant.name}</p>
                    <p className="text-sm text-gray-500">{tenant.slug}</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tenant.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  handleSelectTenant({
                    id: tenant.id,
                    name: tenant.name,
                    slug: tenant.slug,
                    description: tenant.description,
                  })
                }
              >
                Acessar esta organização
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
