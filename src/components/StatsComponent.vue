<script setup lang="ts">
import { useStatsStore } from "@/stores/stats";

const store = useStatsStore();
await store.getStats();

function getRouterLink(type: string) {
    return `/query?terms={[type|${type}]}`;
}

function getTopTaxonLink() {
    return `/go/${store.stats.topSecmetAssemblyId}`;
}
</script>

<template>
    <h1>Stats</h1>
    <div class="row general-stats">
        <h3>General statistics <small>database contains</small></h3>
        <ul class="list-group">
            <li class="list-group-item-top">
                <span class="stats-def">Total Secondary Metabolite Regions</span>
                <span class="stats-data">{{ store.stats.numClusters }}</span>
            </li>
            <li class="list-group-item">
                <span class="stats-def">Most regions:</span>
                <span class="stats-data"
                    ><a :href="getTopTaxonLink()" target="_blank">{{
                        store.stats.topSecmetSpecies
                    }}</a></span
                >
            </li>
            <li class="list-group-item">
                <span class="stats-def">Regions in top taxon</span>
                <span class="stats-data">{{ store.stats.topSecmetTaxonCount }}</span>
            </li>
            <li class="list-group-item">
                <span class="stats-def">Unique species/strains:</span>
                <span class="stats-data">{{ store.stats.numGenomes }}</span>
            </li>
            <li class="list-group-item">
                <span class="stats-def">Unique sequences:</span>
                <span class="stats-data">{{ store.stats.numSequences }}</span>
            </li>
            <li class="list-group-item">
                <span class="stats-def">Species with most sequences:</span>
                <span class="stats-data">{{ store.stats.topSeqSpecies }}</span>
            </li>
            <li class="list-group-item">
                <span class="stats-def">Sequences in top taxon:</span>
                <span class="stats-data">{{ store.stats.topSeqTaxonCount }}</span>
            </li>
        </ul>
    </div>
    <div class="row stats-region-count">
        <h3>Secondary metabolite region counts <small>by type</small></h3>
        <ul class="list-group">
            <li class="list-group-item" v-for="stat in store.stats.bgcTypeStats" :key="stat.name">
                <RouterLink :to="getRouterLink(stat.name)">{{ stat.description }}</RouterLink>
                <span class="badge secmet" :class="[stat.category, stat.name]">{{
                    stat.count
                }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.list-group {
    width: 100%;
    list-style: none;
    padding-left: 0;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075);
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.list-group-item {
    grid-column: auto;
    padding: 10px 15px;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    margin: 0;
}

.list-group-item-top {
    grid-column: span 2;
    padding: 10px 15px;
    background-color: var(--color-background-mute);
    border: 1px solid var(--color-border);
}
.list-group-item a {
    text-decoration: none;
    color: var(--color-brand);
}
.list-group-item a:hover {
    text-decoration: underline;
}
.list-group-item a:visited {
    color: var(--color-brand);
}
.stats-def {
    font-weight: bold;
}
.stats-data {
    float: right;
    font-weight: bold;
    color: #31708f;
}
.badge {
    display: block;
    float: right;
    min-width: 10px;
    padding: 3px 7px;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    border-radius: 10px;
}
.row::after {
    display: table;
    content: "";
    clear: both;
}
</style>
