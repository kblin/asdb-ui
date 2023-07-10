import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/stats",
            name: "stats",
            component: () => import("../views/StatsView.vue"),
        },
        {
            path: "/query",
            name: "query",
            component: () => import("../views/QueryView.vue"),
        },
        {
            path: "/search",
            name: "Search",
            component: () => import("../views/SearchView.vue"),
        },
        {
            path: "/browse",
            name: "browse",
            component: () => import("../views/BrowseView.vue"),
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/help",
            name: "help",
            component: () => import("../views/HelpView.vue"),
        },
        {
            path: "/area",
            name: "area",
            component: () => import("../views/AreaView.vue"),
        },
        {
            path: "/jobs",
            name: "jobs",
            component: () => import("../views/JobsView.vue"),
        },
        {
            path: "/job/:jobid",
            name: "job",
            component: () => import("../views/JobView.vue"),
        },
    ],
});

export default router;
