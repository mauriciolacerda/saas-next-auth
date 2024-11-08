'use client';

import { useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session } = useSession();

  if (session) {
    return <p>Bem-vindo, {session.user?.email}!</p>;
  } else {
    return <p>Carregando...</p>;
  }
}