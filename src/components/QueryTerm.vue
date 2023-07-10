<script setup lang="ts">
import AutoComplete from "./common/AutoComplete.vue";
import DialogView from "./DialogView.vue";
import FilterItem from "./common/FilterItem.vue";
import IconAdd from "./icons/IconAdd.vue";
import IconFilter from "./icons/IconFilter.vue";
import IconPen from "./icons/IconPen.vue";
import IconSwap from "./icons/IconSwap.vue";
import IconTrash from "./icons/IconTrash.vue";
import ModuleQuery from "./common/ModuleQuery.vue";

import type { QueryFilter, QueryTerm as TQueryTerm } from "@/models/queries";
import { useCategoriesStore } from "@/stores/categories";
import { computed, ref } from "vue";

const term = defineModel<TQueryTerm>();
const store = useCategoriesStore();
store.getCategories();

const mQDialogOpen = ref(false);

const wantShowFilters = ref(false);
const availableFilters = computed(() => {
    if (!term.value || !term.value.category) {
        return [];
    }
    return store.categories.getFilters(term.value.category);
});
const hasFilters = computed(() => {
    return availableFilters.value.length > 0;
});
const showFilters = computed(() => {
    return (hasFilters.value && wantShowFilters.value) || (term.value?.filters ?? []).length > 0;
});

function getTermKind() {
    if (!term.value) {
        return "unset";
    }
    return store.categories.getType(term.value.category);
}

function updateFilter(idx: number, filter: QueryFilter) {
    if (!term.value) {
        return;
    }
    term.value.filters[idx] = filter;
}
</script>

<template>
    <div class="query-term" v-if="term?.termType == 'expr'">
        <div class="query-input">
            <select v-model="term.category">
                <option label="--- Select a category" value="" />
                <option
                    v-for="opt in store.categories.options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
                <optgroup
                    v-for="group in store.categories.groups"
                    :key="group.header"
                    :label="group.header"
                >
                    <option
                        v-for="opt in group.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </optgroup>
            </select>
            <AutoComplete
                v-if="
                    getTermKind() == 'text' &&
                    (typeof term.value == 'string' || typeof term.value == 'undefined')
                "
                class="expression"
                v-model="term.value"
                :category="term.category"
            />
            <input
                v-else-if="getTermKind() == 'number'"
                type="number"
                class="expression"
                placeholder="Please enter value"
                v-model="term.value"
            />
            <div v-else-if="getTermKind() == 'bool'" class="expression">is true</div>
            <div v-else-if="getTermKind() == 'modulequery'" class="expression">
                <input
                    type="text"
                    placeholder="Use the edit button to change"
                    v-model="term.value"
                    disabled
                    class="mq-display"
                />
                <span @click="mQDialogOpen = true" class="btn"><IconPen /> Edit</span>
            </div>
            <input
                v-else
                type="text"
                class="expression"
                placeholder="Select a category first"
                disabled
            />
            <button @click="term.addTerm()"><IconAdd /> Add term</button>
            <button v-show="hasFilters" @click="wantShowFilters = !wantShowFilters">
                <IconFilter /> Filters
            </button>
        </div>
        <ul class="filter-list" v-show="showFilters">
            <li v-for="(filter, index) in term.filters" :key="index">
                <FilterItem
                    :name="filter.name"
                    :operator="filter.operator"
                    :value="filter.value"
                    :availableFilters="availableFilters"
                    @changed="(filter) => updateFilter(index, filter)"
                    @deleted="term.removeFilter(index)"
                />
            </li>
            <li class="btn" @click="term.addFilter()"><IconAdd /> Add filter</li>
        </ul>
    </div>
    <div class="query-term" v-else-if="term?.termType == 'op' && term.left && term.right">
        <ul class="operation-group">
            <li class="term">
                <QueryTerm v-model="term.left" />
                <button v-if="term.left.termType == 'expr'" @click="term.removeLeft()">
                    <IconTrash />
                </button>
            </li>
            <li class="operation">
                <div class="button-group">
                    <label
                        @click="term.operation = 'AND'"
                        class="btn"
                        :class="term.operation == 'AND' ? 'active' : ''"
                        >AND</label
                    >
                    <label
                        @click="term.operation = 'OR'"
                        class="btn"
                        :class="term.operation == 'OR' ? 'active' : ''"
                        >OR</label
                    >
                    <label
                        @click="term.operation = 'EXCEPT'"
                        class="btn"
                        :class="term.operation == 'EXCEPT' ? 'active' : ''"
                        >EXCEPT</label
                    >
                </div>
                <button @click="term.swapTerms()"><IconSwap /> Swap terms</button>
            </li>
            <li class="term">
                <QueryTerm v-model="term.right" /><button
                    v-if="term.right.termType == 'expr'"
                    @click="term.removeRight()"
                >
                    <IconTrash />
                </button>
            </li>
        </ul>
    </div>
    <DialogView :open="mQDialogOpen" class="mq-dialog">
        <ModuleQuery
            v-if="term && (typeof term.value == 'string' || typeof term.value == 'undefined')"
            @cancel="mQDialogOpen = false"
            @done="mQDialogOpen = false"
            v-model="term.value"
        />
    </DialogView>
</template>

<style scoped>
.expression {
    width: 40%;
}
div.expression {
    display: inline-block;
    padding-left: 4px;
    padding-right: 4px;
}
.query-term {
    display: block;
    width: 95%;
    margin: 0 auto;
}
.operation-group {
    list-style: none;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    padding: 1em 0.25em;
}
.operation-group li {
    display: flex;
    border: 1px solid var(--color-border);
    padding: 10px 15px;
}
.operation-group li:first-child {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
}
.operation-group li:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.term {
    justify-content: space-between;
}
.operation {
    justify-content: space-around;
    background-color: var(--color-background-mute);
    border-radius: 2px;
}

.filter-list {
    display: block;
    list-style: none;
    margin: 0;
    padding: 6px 0 0 0;
}
.filter-list li {
    padding-bottom: 6px;
}
.mq-dialog {
    width: 100svw;
}
.mq-display {
    width: 80%;
    margin-right: 0.5rem;
}
</style>
