import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, LayoutGrid, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/stores/authStore";

export function CardProfileAuth() {
    
  const { user, isLoading, signIn, unlinkProvider, setPrimaryProvider, updatePassword } = useAuth();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(oldPassword, newPassword);
      setIsPasswordDialogOpen(false);
      setOldPassword("");
      setNewPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProviderAction = async (provider: string, action: "connect" | "unlink") => {
    try {
      if (action === "connect") {
        await signIn(provider);
        toast({
          title: "Account connected",
          description: `Successfully connected ${provider} account.`,
        });
      } else {
        await unlinkProvider(provider);
        toast({
          title: "Account unlinked",
          description: `Successfully unlinked ${provider} account.`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${action} account. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (provider: string) => {
    try {
      await setPrimaryProvider(provider);
      toast({
        title: "Primary provider updated",
        description: `${provider} is now your primary authentication method.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update primary provider. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ProviderButton = ({ provider, connected, isPrimary }: { provider: string; connected: boolean; isPrimary: boolean }) => {
    if (connected) {
      return (
        <div className="flex items-center gap-2">
          {isPrimary ? (
            <Badge>Primário</Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPrimary(provider)}
              disabled={isLoading}
            >
              Tornar primário
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleProviderAction(provider, "unlink")}
            disabled={isLoading}
          >
            Desconectar
          </Button>
        </div>
      );
    }
    return (
      <Button
        variant="outline"
        onClick={() => handleProviderAction(provider, "connect")}
        disabled={isLoading}
      >
        Connect
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>Gerencie sua senha e as configurações de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Senha</p>
              <p className="text-sm text-muted-foreground">Última alteração 3 meses</p>
            </div>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Alterar senha</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Atualizar senha</DialogTitle>
                  <DialogDescription>
                    Informe a sua senha atual e uma nova senha para atualizar suas credenciais de acesso.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Senha Atual</Label>
                    <Input
                      id="current"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">Nova Senha</Label>
                    <Input
                      id="new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handlePasswordUpdate} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Alterar senha
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contas conectadas</CardTitle>
          <CardDescription>Gerencie seus provedores de autenticação conectados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Github className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  {user?.providers.includes("github") ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <ProviderButton
              provider="github"
              connected={user?.providers.includes("github") ?? false}
              isPrimary={user?.primaryProvider === "github"}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <LayoutGrid className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Microsoft</p>
                <p className="text-sm text-muted-foreground">
                  {user?.providers.includes("microsoft") ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <ProviderButton
              provider="microsoft"
              connected={user?.providers.includes("microsoft") ?? false}
              isPrimary={user?.primaryProvider === "microsoft"}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Email/Senha</p>
                <p className="text-sm text-muted-foreground">
                  {user?.providers.includes("email") ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {user?.providers.includes("email") && (
              <div className="flex items-center gap-2">
                {user.primaryProvider === "email" ? (
                  <Badge>Primário</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary("email")}
                    disabled={isLoading}
                  >
                    Tornar Primário
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                  Gerenciar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}