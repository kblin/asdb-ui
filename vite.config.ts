import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nightwatchPlugin from "vite-plugin-nightwatch";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({ script: { defineModel: true, propsDestructure: true } }), nightwatchPlugin()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:5566",
            "/go": "http://localhost:5566",
            "/output": "http://localhost:5566",
            "/jobs": "http://localhost:5566",
        },
    },
});
