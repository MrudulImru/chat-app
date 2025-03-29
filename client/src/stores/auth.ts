import { defineStore } from "pinia";
import { apiService } from "../plugins/api";

interface AuthResponse {
  token: string;
  user?: {};
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    refresh: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.token,
    getRefreshToken: (state) => state.refresh,
    isUserAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    async login(username: string, password: string) {
      // user.value = { username };
      // isAuthenticated.value = true;
      try {
        const response: any = await apiService.post("/auth/login", {
          username,
          password,
        });

        const { token, user }: any = response;
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;
        localStorage.setItem("token", token);
        return true;
      } catch (error) {
        console.log("login:", error);
      }
    },
  },
});
