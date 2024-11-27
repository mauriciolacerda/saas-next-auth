import { create } from 'zustand';

interface AuthState {
  user: {
    email: string | null;
    name: string | null;
    image: string | null;
    providers: string[];
    primaryProvider: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
  signIn: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  unlinkProvider: (provider: string) => Promise<void>;
  setPrimaryProvider: (provider: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: {
    email: "john.doe@example.com",
    name: "John Doe",
    image: "https://github.com/shadcn.png",
    providers: ["github", "email"],
    primaryProvider: "github"
  },
  isLoading: false,
  error: null,

  signIn: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        user: {
          ...state.user!,
          providers: [...(state.user?.providers || []), provider]
        }
      }));
    } catch (error) {
      set({ error: "Failed to sign in" });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ user: null });
    } catch (error) {
      set({ error: "Failed to sign out" });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      set({ error: "Failed to update password" });
    } finally {
      set({ isLoading: false });
    }
  },

  unlinkProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        user: {
          ...state.user!,
          providers: state.user!.providers.filter(p => p !== provider),
          primaryProvider: state.user!.primaryProvider === provider
            ? state.user!.providers.find(p => p !== provider) || null
            : state.user!.primaryProvider
        }
      }));
    } catch (error) {
      set({ error: "Failed to unlink provider" });
    } finally {
      set({ isLoading: false });
    }
  },

  setPrimaryProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        user: {
          ...state.user!,
          primaryProvider: provider
        }
      }));
    } catch (error) {
      set({ error: "Failed to set primary provider" });
    } finally {
      set({ isLoading: false });
    }
  }
}));