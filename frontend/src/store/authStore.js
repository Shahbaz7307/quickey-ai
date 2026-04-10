import { create } from "zustand";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,

  token: localStorage.getItem("token"),

  loading: false,

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();

      set({ user });
    } catch (error) {
      console.log(error);
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true });

      const data = await registerUser(userData);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
      });

      return data;
    } catch (error) {
      console.log(error);

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (userData) => {
    try {
      set({ loading: true });

      const data = await loginUser(userData);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
      });

      return data;
    } catch (error) {
      console.log(error);

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    localStorage.removeItem("activeChatId");

    set({
      user: null,
      token: null,
    });

    window.location.href = "/login";
  },
}));

export default useAuthStore;
