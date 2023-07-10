<script setup lang="ts">
import { ref, type Ref } from "vue";
import ResultsList from "@/components/common/ResultsList.vue";
import JsTree from "@/components/JsTree.vue";

const state = ref("input");

const results: Ref<any> = ref([]);

function handleStatus(status: string) {
    state.value = status;
}

function handleDisplay(regions: any[]) {
    results.value.length = 0;
    regions.forEach((region) => {
        results.value.push(region);
    });
}
</script>

<template>
    <main class="wide-container">
        <h1>Browse <small>by taxa</small></h1>
        <div class="browse__container">
            <JsTree class="jstree-container" @status="handleStatus" @display="handleDisplay" />
            <div v-show="state == 'input'">Select a genome to show.</div>
            <div v-show="state == 'loading'">Loading genome regions...</div>
            <div class="results" v-show="state == 'done'">
                <ResultsList :results="results" />
            </div>
        </div>
    </main>
</template>

<style scoped>
.browse__container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.jstree-container {
    border: 1px solid var(--color-border-hover);
    border-radius: 5px;
    padding-right: 2em;
}
</style>
