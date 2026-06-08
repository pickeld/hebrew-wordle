import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, auth } from '../firebase/auth';

interface AuthStore {
  user: User | null;
  loading: boolean;
  initAuth: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },
}));
