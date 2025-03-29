import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { axiosPlugin } from "./plugins/api";
import SocketPlugin from "./plugins/socket";

const app = createApp(App);
app.use(createPinia());
app.use(router).use(axiosPlugin).use(SocketPlugin);
app.mount("#app");
