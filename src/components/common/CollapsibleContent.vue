<script setup lang="ts">
import { computed, ref } from "vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import IconChevronRight from "../icons/IconChevronRight.vue";

const props = withDefaults(
    defineProps<{
        collapsed?: boolean;
    }>(),
    { collapsed: true }
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
    <div class="content">
        <component :is="current_icon" @click="collapsed = !collapsed" />
        <div v-if="collapsed" @click="collapsed = !collapsed">Click to expand</div>
        <slot v-if="!collapsed"></slot>
    </div>
</template>

<style scoped>
.content {
    display: flex;
}
</style>
