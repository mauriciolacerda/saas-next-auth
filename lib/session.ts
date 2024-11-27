import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function fetchSession() {
  return await getServerSession(authOptions);
}