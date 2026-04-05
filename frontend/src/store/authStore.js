import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setAuth: (user, token) => {
        if (typeof window !== "undefined") {
            window.__authToken = token;
        }
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== "undefined") {
            window.__authToken = null;
        }
        set({ user: null, token: null, isAuthenticated: false });
    },

    updateUser: (user) => set({ user }),
}));

export default useAuthStore;