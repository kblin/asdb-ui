<script setup lang="ts">
import { useCategoriesStore } from "@/stores/categories";
import TabArea from "./TabArea.vue";
import CustomTab from "./CustomTab.vue";

const store = useCategoriesStore();
await store.getCategories();
</script>

<template>
    <h1>Help</h1>
    <div>
        <TabArea>
            <CustomTab title="Seach categories">
                <dl>
                    <template v-for="opt in store.categories.options" :key="opt.label">
                        <dt>{{ opt.label }}</dt>
                        <dd>{{ opt.description }}</dd>
                    </template>
                    <template v-for="group in store.categories.groups" :key="group.header">
                        <dt>{{ group.header }}</dt>
                        <dd>
                            <dl>
                                <template v-for="opt in group.options" :key="opt.label">
                                    <dt>{{ opt.label }}</dt>
                                    <dd>{{ opt.description }}</dd>
                                </template>
                            </dl>
                        </dd>
                    </template>
                </dl>
                <div class="error" v-if="store.error">
                    Could not load categories: {{ store.error }}
                </div>
            </CustomTab>
            <CustomTab title="Example use cases"> TODO: Add example use cases </CustomTab>
        </TabArea>
    </div>
</template>

<style scoped></style>
