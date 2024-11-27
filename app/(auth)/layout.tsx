import { getServerSession } from "next-auth";
import "../globals.css";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
    return null;
  }
  return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
          {children}
        </div>
  );
}
