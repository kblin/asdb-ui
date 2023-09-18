<script setup lang="ts">
import { QueryFilter } from "@/models/queries";
import IconTrash from "../icons/IconTrash.vue";
import { useCategoriesStore } from "@/stores/categories";
import type { CategoryFilter, CategoryFilterChoices } from "@/models/categories";
import { computed, ref, type Ref } from "vue";

const props = defineProps<{
    name: string;
    operator: string;
    value: string | number;
    availableFilters: CategoryFilter[];
}>();
const emit = defineEmits<{
    changed: [filter: QueryFilter];
    deleted: [];
}>();
const store = useCategoriesStore();
store.getCategories();

const filter = ref(new QueryFilter(props.name, props.value, props.operator));

const filterTypes: Ref<Map<string, string>> = ref(new Map());
const filterChoices: Ref<Map<string, CategoryFilterChoices>> = ref(new Map());

props.availableFilters.forEach((filter) => {
    filterTypes.value.set(filter.value, filter.type);
    filterChoices.value.set(filter.value, filter.choices);
});
const currentType = computed(() => {
    if (!filter.value || !filter.value.name) {
        return "unset";
    }
    return filterTypes.value.get(filter.value.name) ?? "unset";
});
const currentChoices = computed(() => {
    if (!filter.value || !filter.value.name) {
        return undefined;
    }
    return filterChoices.value.get(filter.value.name);
});
const hasChoices = computed(() => {
    if (!currentChoices.value) {
        return false;
    }
    return currentChoices.value.labels.length > 0;
});

function filterChanged() {
    emit("changed", filter.value);
}
</script>

<template>
    <div class="filter-item">
        <div class="filter-with">WITH</div>
        <select v-model="filter.name" @change="filterChanged">
            <option label="Select filter" value="" />
            <option
                v-for="opt in availableFilters"
                :key="opt.label"
                :label="opt.label"
                :value="opt.value"
            />
        </select>
        <input
            class="expression"
            v-if="currentType == 'text'"
            placeholder="enter value"
            v-model="filter.value"
            @keypress="filterChanged"
        />
        <template v-else-if="currentType == 'numeric' || currentType == 'qualitative'">
            <select v-model="filter.operator" @change="filterChanged">
                <option label="pick one" value=""></option>
                <option label="greater than" value=">"></option>
                <option label="greater than or equal to" value=">="></option>
                <option label="equal to" value="=="></option>
                <option label="less than or equal to" value="<="></option>
                <option label="less than" value="<"></option>
            </select>
            <select v-if="hasChoices" v-model="filter.value" @change="filterChanged">
                <option
                    v-for="choice in currentChoices?.labels"
                    :key="choice"
                    :value="currentChoices?.choices.get(choice)"
                    :label="choice"
                />
            </select>
            <input
                v-else
                type="number"
                class="expression"
                placeholder="number"
                v-model="filter.value"
                @keypress="filterChanged"
            />
        </template>
        <button @click="emit('deleted')"><IconTrash /></button>
    </div>
</template>

<style scoped>
.expression {
    width: 40%;
    padding: 6px 0;
    margin: 0 2px;
}
.filter-item {
    display: block;
}
.filter-with {
    display: inline-block;
    padding: 6px 12px;
}
</style>
