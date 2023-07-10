<script setup lang="ts">
import { ref, type Ref, watch } from "vue";

interface AutocompleteOption {
    val: string;
    desc: string;
}

const data = defineModel<string>();

const props = defineProps<{
    category: string;
}>();

const options: Ref<AutocompleteOption[]> = ref([]);
const shownOptions: Ref<AutocompleteOption[]> = ref([]);
const error = ref("");
const selectedOption = ref("");

watch(data, async (newVal) => {
    if (!newVal || newVal == "" || newVal == selectedOption.value) {
        shownOptions.value.length = 0;
        return;
    }
    try {
        let raw_completions = await fetch(`/api/v1.0/available/${props.category}/${newVal}`);
        options.value = await raw_completions.json();
        shownOptions.value = options.value.slice(0, 10);
    } catch (err) {
        error.value = `${err}`;
    }
});

function setOption(option: string) {
    selectedOption.value = option;
    data.value = option;
    shownOptions.value.length = 0;
}

function focusLost() {
    setTimeout(() => (shownOptions.value.length = 0), 200);
}
</script>

<template>
    <div class="autocomplete">
        <input
            type="text"
            v-model="data"
            class="autocomplete-input"
            placeholder="Please enter value"
            @focusout="focusLost()"
        />
        <ul class="autocomplete-results" v-show="shownOptions.length">
            <li>Showing {{ shownOptions.length }} of {{ options.length }}</li>
            <li
                v-for="option in shownOptions"
                :key="option.val"
                class="autocomplete-result"
                @click="setOption(option.val)"
            >
                <strong>{{ option.val }}</strong> ({{ option.desc }})
            </li>
        </ul>
    </div>
</template>

<style scoped>
.autocomplete {
    display: inline-block;
    position: relative;
}

.autocomplete-input {
    width: 100%;
    height: 100%;
}

strong {
    font-weight: bold;
}
.autocomplete-results {
    position: absolute;
    padding: 0;
    margin: 0;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    list-style: none;
    min-height: 1em;
    max-height: 8em;
    overflow: auto;
    z-index: 2;
}

.autocomplete-result {
    cursor: pointer;
    padding: 4px 2px;
}

.autocomplete-result:hover {
    background-color: var(--color-background-soft);
}
</style>
