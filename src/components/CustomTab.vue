<script setup lang="ts">
import { inject } from "vue";

const props = defineProps<{
    title: string;
}>();

const selectedTitle = inject("selectedTitle");
</script>

<template>
    <div v-show="props.title == selectedTitle">
        <slot />
    </div>
</template>
