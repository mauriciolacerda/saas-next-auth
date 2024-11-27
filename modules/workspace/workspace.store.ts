import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workspace } from "@/modules/workspace/workspace.type";

interface WorkspaceState {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get, api) => ({
      workspace: null,
      setWorkspace: (workspace) => set({ workspace }),
      hasHydrated: false, // Adiciona o estado de hidratação
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      clearWorkspace: () => {
        api.persist.clearStorage();
        set({ workspace: null, hasHydrated: false });
      },
    }),
    {
      name: "workspace-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
