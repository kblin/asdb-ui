<script setup lang="ts">
import { computed, ref } from "vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import IconChevronRight from "../icons/IconChevronRight.vue";

const props = withDefaults(
    defineProps<{
        collapsed?: boolean;
        title?: string;
    }>(),
    { collapsed: true, title: "Click to expand" }
);

const collapsed = ref(props.collapsed);

const current_icon = computed(() => {
    if (collapsed.value) {
        return IconChevronRight;
    }
    return IconChevronDown;
});
</script>

<template>
    <div class="header" :class="{ active: !collapsed }">
        <component :is="current_icon" @click="collapsed = !collapsed" />
        <div class="collapsible-title" @click="collapsed = !collapsed">{{ props.title }}</div>
    </div>
    <div class="content" v-if="!collapsed">
        <slot></slot>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    touch-action: manipulation;
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
    background-image: linear-gradient(
        to bottom,
        var(--color-background-soft) 0,
        var(--color-background-mute) 100%
    );
    background-repeat: repeat-x;
    margin-top: 0.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.5rem;
}

.header.active {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.content {
    display: flex;
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
    border-bottom-left-radius: 4px;
    padding: 0.25rem;
    border-bottom-right-radius: 4px;
}
</style>
