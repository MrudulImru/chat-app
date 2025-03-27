import axios from "axios";
import type { App } from "vue";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // switch (status) {
    //   case 401: // Unauthorized
    //     // Token might be expired, redirect to login or refresh token
    //     localStorage.removeItem("authToken");
    //     window.location.href = "/login";
    //     break;
    //   case 403: // Forbidden
    //     console.error("Access denied");
    //     break;
    //   case 404: // Not Found
    //     console.error("Resource not found");
    //     break;
    //   case 500: // Server Error
    //     console.error("Internal server error");
    //     break;
    //   default:
    //     console.error("An unexpected error occurred");
    // }

    return Promise.reject(error);
  }
);

export const apiService = {
  // Generic GET request
  get: <T>(url: string, params?: object) => {
    return apiClient.get<T>(url, { params });
  },

  // Generic POST request
  post: <T>(url: string, data: object) => {
    return apiClient.post<T>(url, data);
  },

  // Generic PUT request
  put: <T>(url: string, data: object) => {
    return apiClient.put<T>(url, data);
  },

  // Generic PATCH request
  patch: <T>(url: string, data: object) => {
    return apiClient.patch<T>(url, data);
  },

  // Generic DELETE request
  delete: <T>(url: string) => {
    return apiClient.delete<T>(url);
  },

  // Authentication specific methods
  //   auth: {
  //     login: (credentials: { username: string; password: string }) => {
  //       return apiClient.post<{ user: any; token: string }>('/login', credentials);
  //     },

  //     logout: () => {
  //       return apiClient.post('/logout');
  //     },

  //     register: (userData: object) => {
  //       return apiClient.post('/register', userData);
  //     },

  //     verifyToken: () => {
  //       return apiClient.get('/verify-token');
  //     }
  //   }
};
export const axiosPlugin = {
  install: (app: App) => {
    // Provide axios instance globally
    app.config.globalProperties.$axios = apiClient;

    // Provide api service globally
    app.config.globalProperties.$api = apiService;
  },
};
export { apiClient };
