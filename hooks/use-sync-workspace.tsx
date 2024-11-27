import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";
import { reservedRoutes } from "@/config/reservedRoutes";

export const useSyncWorkspace = (slug: string) => {
  const { data: session, status } = useSession();
  const { workspace, setWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (workspace?.slug === slug || !session || !session.user) {
      return;
    }
    if (reservedRoutes.includes(`/${slug}`)) {
      console.log(
        `Rota ${slug} é reservada. Ignorando sincronização do workspace.`
      );
      return;
    }
    const fetchWorkspace = async () => {
      if (workspace?.slug === slug) {
        console.log("Workspace já está sincronizado:", workspace);
        return;
      }

      const userId = session?.user?.id;
      if (!userId) {
        console.error("User not found");
        return;
      }
      
      const response = await fetch(`/api/workspaces/${slug}/members`);
      if (!response.ok) {
        console.error("Failed to fetch workspace");
        return;
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data structure: workspace data not found");
        return;
      }
      const workspaceData = data[0];
      if (!workspaceData.users || !Array.isArray(workspaceData.users)) {
        console.error("Invalid data structure: users not found");
        return;
      }
      const userExistsOnWorkspace = workspaceData.users.some(
        (user: { userId: string }) => user.userId === userId
      );
      if (!session || !session.user || !userExistsOnWorkspace) {
        console.error("User does not belong to the workspace");
        return;
      }
      const { users, ...workspaceWithoutUsers } = workspaceData; // eslint-disable-line @typescript-eslint/no-unused-vars

      setWorkspace(workspaceWithoutUsers);
    };
    if (status === "authenticated") {
      fetchWorkspace();
    }
  }, [slug, session, status, setWorkspace, workspace]);
};
