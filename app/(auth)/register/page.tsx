import { RegisterForm } from '@/components/register-form';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/")
  }
  return (
    <RegisterForm />
  );
}