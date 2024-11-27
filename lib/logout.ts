import { useTenantStore } from "@/modules/tenant/tenant.store";
import { useWorkspaceStore } from "@/modules/workspace/workspace.store";
import { signOut } from "next-auth/react";

const handleLogout = async () => {
    const tenantLogout = useTenantStore.getState().clearTenant;
    const workspaceLogout = useWorkspaceStore.getState().clearWorkspace;

    tenantLogout();
    workspaceLogout();

    await signOut({ callbackUrl: "/" });
}

export default handleLogout;