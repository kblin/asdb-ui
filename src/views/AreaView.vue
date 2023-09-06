<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import ResultsList from "@/components/common/ResultsList.vue";

const AREA_API_URL = "/api/area";

const route = useRoute();
const record = route.query.record ? route.query.record : route.query.acc;
const start = route.query.start;
const end = route.query.end;

const state = ref("invalid");
const error = ref("");
const regions: Ref<any[]> = ref([]);

onMounted(async () => {
    state.value = "in-progress";
    let response = await fetch(`${AREA_API_URL}/${record}/${start}-${end}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        state.value = "invalid";
        error.value = `Network request returned ${response.status}:${response.statusText}`;
        return;
    }
    let data: any = {};
    try {
        data = await response.json();
    } catch (err) {
        state.value = "invalid";
        error.value = `${err}`;
        return;
    }
    state.value = "done";
    data.regions.forEach((region: any) => {
        regions.value.push(region);
    });

    if (regions.value.length == 1) {
        const region = regions.value[0];
        const url = `/output/${region.assembly_id}/index.html#r${region.record_number}c${region.region_number}`;
        window.location.assign(url);
    }
});
</script>

<template>
    <main class="container">
        <div class="invalid" v-show="state == 'invalid'">Invalid request: {{ error }}.</div>
        <div class="in-progress" v-show="state == 'in-progress'">
            Fetching regions, please wait...
        </div>
        <div class="done" v-show="state == 'done'">
            <ResultsList :results="regions" />
        </div>
    </main>
</template>

<style scoped></style>
