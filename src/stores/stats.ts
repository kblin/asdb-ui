import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { AsdbStats } from "@/models/stats";

export const STATS_URL = "/api/stats";

export const useStatsStore = defineStore("stats", () => {
    const stats = reactive(new AsdbStats());
    const error = ref("");
    const status = ref("");

    async function getStats(force = false) {
        if (stats.hasData() && !force) {
            // Don't re-init categories
            return;
        }
        status.value = "loading";
        const statsResponse = await fetch(STATS_URL);
        if (!statsResponse.ok) {
            error.value = statsResponse.statusText;
            return;
        }
        try {
            const statsData = await statsResponse.json();
            stats.loadFromJson(statsData);
        } catch (err) {
            error.value = `${err}`;
            return;
        }
        status.value = "loaded";
    }

    return { stats, error, getStats, status };
});
