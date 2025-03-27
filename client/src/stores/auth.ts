import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "../plugins/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    access: null,
    refresh: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.access,
    getRefreshToken: (state) => state.refresh,
    isUserAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    async login(username: string, password: string) {
      // user.value = { username };
      // isAuthenticated.value = true;
      try {
        const response = await apiService.post("/auth/login", {
          username,
          password,
        });

        const { access_token, user }: any = response;
        this.user = user;
        this.access = access_token;
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.log("login:", error);
      }
    },
  },
});
