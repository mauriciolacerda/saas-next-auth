import { Profile } from "@/app/(dashboard)/profile/components/profile";
import { authOptions } from "@/lib/authOptions";
import { getUserData } from "@/modules/user/user.service";
import { User } from "@/modules/user/user.type";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
    return null;
  }
  const userId = session.user.id;
  const user : User = await getUserData(userId);
  return <Profile user={user} />;
}
