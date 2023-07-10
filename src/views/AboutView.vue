<script setup lang="ts">
import InfoText from "@/components/common/InfoText.vue";
import CitationItem from "@/components/common/CitationItem.vue";
import { useCitationsStore } from "@/stores/citations";
const store = useCitationsStore();
</script>

<template>
    <main class="container">
        <h2>About the antiSMASH database</h2>
        <InfoText />

        <h2>How to cite</h2>
        <CitationItem
            v-for="citation in store.citations"
            :key="citation.doi"
            :title="citation.title"
            :authors="citation.authors"
            :journal="citation.journal"
            :year="citation.year"
            :doi="citation.doi"
        />
    </main>
</template>

<style scoped></style>
