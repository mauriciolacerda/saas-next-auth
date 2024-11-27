"use client";

import { useState } from "react";
import CardProfileAvatar from "../../app/(dashboard)/profile/components/card-profile-avatar";
import { CardProfilePersonal } from "../../app/(dashboard)/profile/components/card-profile-personal";
import { CardProfileAuth }  from "../../app/(dashboard)/profile/components/card-profile-auth";
import { CardProfileWorkspaces } from "../../app/(dashboard)/profile/components/card-profile-workspaces";
import { User } from "@/modules/user/user.type";
import { toast } from "@/hooks/use-toast";
import { Subscription } from "@/app/(dashboard)/profile/components/subscription";
import { Toaster } from "../ui/toaster";

interface ProfileProps {
  user: User;
}

export function Profile( { user }: ProfileProps ) {
  const [userData, setUserData] = useState<User>(user);

  const handleSave = async (newData: Partial<User>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserData(prev => ({ ...prev, ...newData }));
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
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
