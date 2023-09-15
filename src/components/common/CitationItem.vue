<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
    title: string;
    authors: Array<string>;
    journal: string;
    year: number;
    doi: string;
}>();

const author_list = ref(props.authors?.join("; "));
</script>

<template>
    <p>
        <strong>{{ props.title }}</strong
        ><br />
        {{ author_list }}<br />
        <em>{{ props.journal }}</em> ({{ props.year }}), DOI:
        <a :href="`https://doi.org/${props.doi}`" target="_blank">{{ props.doi }}</a>
    </p>
</template>

<style scoped>
strong {
    font-weight: bold;
}
</style>
