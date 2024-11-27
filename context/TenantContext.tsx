"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TenantContextProps {
  tenant: { id: string; name: string } | null;
  setTenant: (tenant: { id: string; name: string } | null) => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<{ id: string; name: string } | null>(null);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context ) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};