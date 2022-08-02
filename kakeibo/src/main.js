import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import router from "./router";
import "sanitize.css";
import "./assets/css/styles.css";

import {
  applyPolyfills,
  defineCustomElements,
} from "@aws-amplify/ui-components/loader";

import { Amplify } from "aws-amplify";
import AwsExports from "./aws-exports";
import AmplifyVue from "@aws-amplify/ui-vue";

Amplify.configure(AwsExports);

applyPolyfills().then(() => {
  defineCustomElements(window);
});

const app = createApp(App);
const head = createHead();

app.config.isCustomElement = (tag) => tag.startsWith("amplify-");

app.use(head);
app.use(router);
app.use(AmplifyVue);
app.mount("#app");
