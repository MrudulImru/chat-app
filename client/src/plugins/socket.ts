// src/plugins/socket.ts
import { App } from "vue";
import { io, Socket } from "socket.io-client";
const token = localStorage.getItem("token") || null;
class SocketPlugin {
  private socket: Socket | null = null;

  install(app: App) {
    // Create socket instance
    this.socket = io("http://localhost:4040", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token,
        w,
      },
    });

    // Global error handling
    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("connect", () => {
      console.log("socket connection established");
    });

    // Expose socket to all components
    app.config.globalProperties.$socket = this.socket;

    // Provide socket for composition API
    app.provide("socket", this.socket);
  }

  // Optional: method to get socket
  getSocket() {
    return this.socket;
  }
}

export default new SocketPlugin();
