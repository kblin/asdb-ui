<script setup lang="ts">
const props = defineProps<{
    src: string;
    title: string;
    count?: string;
}>();
</script>
<template>
    <div class="figure">
        <img :src="props.src" />
        <div class="legend">
            <span class="count" v-if="props.count">Figure {{ props.count }}:&nbsp;</span
            >{{ props.title }}
        </div>
    </div>
</template>
<style>
.figure {
    display: flex;
    flex-direction: column;

    border: 1px var(--color-border) solid;
}
.figure img {
    margin: auto;
    aspect-ratio: auto;
    max-width: 100%;
    max-height: 20rem;
}
.count {
    font-weight: bold;
}
.legend {
    margin-left: 0.5rem;
}
</style>
