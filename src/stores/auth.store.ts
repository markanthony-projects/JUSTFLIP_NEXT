//this store manages authentication state for both visitors and brokers.  It is persisted to localStorage, so that users can remain logged in across page reloads.  The store also provides a bootstrap method to restore the session from the backend on app load, and a refreshAccessToken method to refresh the JWT when it expires.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AuthService from '../services/AuthService'
import { AuthUser } from '../types'
import { useCompareStore } from './useCompare.store';
import { useFavouritesStore } from './favourites.store';

export type AuthType = 'visitor' | 'broker' | null;

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  authType: AuthType;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
}

export interface AuthActions {
  visitorLogin: (payload: any) => Promise<{ success: boolean; error?: string }>;
  brokerLogin: (payload: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setSession: (user: AuthUser, token: string, authType: AuthType) => void;
  updateUser: (data: Partial<AuthUser>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      authType: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,

      visitorLogin: async (payload) => {
        set({ isLoading: true, error: null })

        try {
          const { user, token } = await AuthService.verifyOtp(payload)

          set({
            user,
            token,
            authType: 'visitor',
            isAuthenticated: true,
            isLoading: false
          })

          useCompareStore.getState().setUserStorageKey()
          useFavouritesStore.getState().setUserStorageKey()

          return { success: true }
        } catch (err: any) {
          set({
            error: err?.message || 'Visitor login failed',
            isLoading: false
          })

          return { success: false, error: err?.message }
        }
      },

      /* ---------------- BROKER LOGIN ---------------- */
      brokerLogin: async (payload) => {
        set({ isLoading: true, error: null })

        try {
          const { user, token } = await AuthService.brokerLogin(payload)
          set({
            user,
            token,
            authType: 'broker',
            isAuthenticated: true,
            isLoading: false
          })

          useCompareStore.getState().setUserStorageKey()
          useFavouritesStore.getState().setUserStorageKey()

          return { success: true }
        } catch (err: any) {
          set({
            error: err.message || 'Broker login failed',
            isLoading: false
          })

          return { success: false, error: err.message }
        }
      },

      /* ---------------- LOGOUT (CENTRAL) ---------------- */
      logout: async () => {
        const { authType } = get()

        try {
          if (authType === 'broker') {
            await AuthService.brokerLogout()
          } else if (authType === 'visitor') {
            await AuthService.logout()
          }
        } catch {
          // ignore API errors
        } finally {
          set({
            user: null,
            token: null,
            authType: null,
            isAuthenticated: false,
            error: null
          })
          useCompareStore.getState().setUserStorageKey();
          useFavouritesStore.getState().setUserStorageKey();
        }
      },

      /* ---------------- SESSION BOOTSTRAP ---------------- */
      bootstrap: async () => {
        try {
          const data = await AuthService.getSession()

          set({
            user: data.user,
            isAuthenticated: true
          })
        } catch {
          get().logout()
        }
      },

      /* ---------------- TOKEN REFRESH ---------------- */
      refreshAccessToken: async () => {
        try {
          const { user, authType } = get()

          // Guard: if store hasn't rehydrated yet, authType will be null.
          // Sending role: null causes a 400.  Abort early and let logout clean up.
          if (!authType || !user?.email) {
            throw new Error('Auth state not ready')
          }

          // Map authType → role the backend expects
          const role = authType === 'visitor' ? 'user' : authType

          const token = await AuthService.refreshAccessToken({
            email: user.email,
            role,
            app: 'portal'
          })

          if (!token) throw new Error('Refresh failed — no token returned')

          set({ token })
        } catch {
          get().logout()
          throw new Error('Session expired')
        }
      },

      /* ---------------- HELPERS ---------------- */
      setSession: (user, token, authType) => {
        set({
          user,
          token,
          authType,
          isAuthenticated: true
        })
        useCompareStore.getState().setUserStorageKey();
        useFavouritesStore.getState().setUserStorageKey();
      },

      updateUser: (data) =>
        set({
          user: {
            ...(get().user as AuthUser),
            ...data
          }
        }),

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHydrated: () => set({ hydrated: true })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      }
    }
  )
)
