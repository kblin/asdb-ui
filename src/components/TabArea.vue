<script setup lang="ts">
import { ref, useSlots, provide } from "vue";

const slots = useSlots();
const tabTitles = ref(slots.default?.().map((tab: any) => tab.props.title));
const selectedTitle = ref(tabTitles.value?.[0]);
provide("selectedTitle", selectedTitle);
</script>

<template>
    <div class="tabs__nav">
        <ul class="tabs__header">
            <li
                v-for="title in tabTitles"
                :key="title"
                @click="selectedTitle = title"
                :class="{ tabs__selected: title == selectedTitle }"
            >
                {{ title }}
            </li>
        </ul>
    </div>
    <div class="tab_content">
        <slot />
    </div>
</template>

<style scoped>
.tabs__nav {
    max-width: 90%;
    margin: 0 auto;
}
.tabs__header {
    margin-bottom: 10px;
    list-style: none;
    padding: 0;
    display: flex;
}

.tabs__header li {
    text-align: center;
    padding: 10px 20px;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1);
    font-size: 110%;
    font-weight: bold;
    flex-grow: 1;
}
.tabs__selected {
    background-color: var(--bgcolor-tab-active);
    color: var(--color-tab-active);
}
</style>
