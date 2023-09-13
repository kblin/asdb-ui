<script setup lang="ts">
const props = defineProps<{
    filename: string;
}>();
</script>

<template>
    <div v-if="props.filename">
        Your download is ready <a :href="props.filename" target="_blank">here</a>
    </div>
</template>
