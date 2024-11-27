import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/modules/user/user.type";
import { Check, Pencil, X } from "lucide-react";

interface ProfileProps {
  user: User;
  onSave?: (data: Partial<User>) => void;
}

export function CardProfilePersonal({ user, onSave }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    company: user.company || "",
    jobTitle: user.jobTitle || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave?.(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      company: user.company || "",
      jobTitle: user.jobTitle || "",
    });
    setIsEditing(false);
  };
  return (
    <Card className="p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Dados pessoais
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            {isEditing
              ? "Edite seus dados pessoais"
              : "Suas informações pessoais"}
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome completo</Label> <span className="text-red-500">*</span>
          {isEditing ? (
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full sm:max-w-lg"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 py-2">
              {user.name || "Não informado"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">E-mail de contato</Label> <span className="text-red-500">*</span>
          {isEditing ? (
            <Input
              type="email"
              id="email"
              disabled
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full sm:max-w-lg"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 py-2">
              {user.email || "Não informado"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="company">Empresa</Label>
          {isEditing ? (
            <Input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full sm:max-w-lg"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 py-2">
              {user.company || "Não informado"}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="jobTitle">Cargo</Label>
          {isEditing ? (
            <Input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full sm:max-w-lg"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 py-2">
              {user.jobTitle || "Não informado"}
            </p>
          )}
        </div>
        {isEditing && (
          <div className="flex items-center gap-3">
            <Button type="submit" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Salvar alterações
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
        </div>
      </form>
    </Card>
  );
}
