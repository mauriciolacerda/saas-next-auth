"use client";

import { useState } from "react";
import CardProfileAvatar from "./card-profile-avatar";
import { CardProfilePersonal } from "./card-profile-personal";
import { CardProfileAuth }  from "./card-profile-auth";
import { CardProfileWorkspaces } from "./card-profile-workspaces";
import { User } from "@/modules/user/user.type";
import { toast } from "@/hooks/use-toast";
import { Subscription } from "@/app/(dashboard)/profile/components/subscription";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

interface ProfileProps {
  user: User;
}

export function Profile( { user }: ProfileProps ) {
  const [userData, setUserData] = useState<User>(user);
  const { data: session, update } = useSession();

  const handleSave = async (newData: Partial<User>) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        await update({ name: updatedUser.name, company: updatedUser.company, jobTitle: updatedUser.jobTitle, image: updatedUser.image });
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o perfil.",
        variant: "destructive",
      });
    }
  };
  const [activeTab, setActiveTab] = useState("Perfil");
  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">
        Minha conta
      </h1>
      <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
        Gerencie os dados de sua conta.
      </p>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {["Perfil", "Segurança", "Workspaces", "Financeiro"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8 space-y-8">
        {activeTab === "Perfil" && (
          <div>
            <CardProfileAvatar user={userData}/>
            <CardProfilePersonal user={userData} onSave={handleSave}/>
          </div>
        )}
        {activeTab === "Segurança" && (
          <div>
            <CardProfileAuth />
          </div>
        )}
        {activeTab === "Workspaces" && (
          <div>
            <CardProfileWorkspaces />
          </div>
        )}
        {activeTab === "Financeiro" && (
          <div>
            <Subscription />
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}
