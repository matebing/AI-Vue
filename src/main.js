import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import "./style.css";
import "element-plus/dist/index.css";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from "element-plus";

const app = createApp(App);

const pinia = createPinia();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(pinia).use(ElementPlus).mount("#app");
