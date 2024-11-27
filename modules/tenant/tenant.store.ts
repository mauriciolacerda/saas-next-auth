import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tenant } from "@/modules/tenant/tenant.type";

interface TenantState {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get, api) => ({
      tenant: null,
      setTenant: (tenant) => set({ tenant }),
      clearTenant: () => {
        api.persist.clearStorage();
        set({ tenant: null });
      },
    }),
    {
      name: "tenant-storage",
    }
  )
);
