import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { createPersistedState } from "pinia-plugin-persistedstate"; //pinia持久化引用

const app = createApp(App);

app.use(createPinia().use(createPersistedState()));
app.use(router);
app.use(ElementPlus);

app.mount("#app");
