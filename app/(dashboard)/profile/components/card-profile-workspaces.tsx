import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Settings } from "lucide-react";

const workspaces = [
  {
    id: 1,
    name: "Personal Workspace",
    role: "Owner",
    members: 1,
    created: "2024-01-15",
  },
  {
    id: 2,
    name: "Acme Corp",
    role: "Admin",
    members: 12,
    created: "2024-02-01",
  },
  {
    id: 3,
    name: "Startup Project",
    role: "Member",
    members: 5,
    created: "2024-03-10",
  },
];

export function CardProfileWorkspaces() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seus workspaces</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Workspace
        </Button>
      </div>

      <div className="grid gap-4">
        {workspaces.map((workspace) => (
          <Card key={workspace.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{workspace.name}</CardTitle>
                    <CardDescription>
                      Criado em {new Date(workspace.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{workspace.role}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {workspace.members} membro{workspace.members !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <Button variant="outline">Gerenciar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}