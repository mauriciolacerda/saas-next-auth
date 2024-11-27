import "../globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderSidebar } from "@/components/header-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode; params: { workspaceSlug: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
    return null;
  }
  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon"/>
      <SidebarInset>
        <HeaderSidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
