<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import ResultsList from "./common/ResultsList.vue";
import QueryTerm from "./QueryTerm.vue";
import { useQueriesStore } from "@/stores/queries";
import IconAdd from "./icons/IconAdd.vue";

const store = useQueriesStore();
const route = useRoute();
const router = useRouter();

const term_string = route.query.terms;
if (typeof term_string == "string") {
    await store.convertSearch(term_string);
}

const searchValid = computed(() => {
    return store.term.toString() !== "";
});

const showLoadMore = computed(() => {
    if (store.loadingMore || store.results.length >= store.total) {
        return false;
    }
    return true;
});

function clearSearch() {
    store.clearSearch();
    router.replace({ query: undefined });
}
</script>

<template>
    <h1>Query</h1>
    <div class="query-buttons">
        <button @click="store.state = 'input'" v-show="store.state != 'input'">Edit Search</button>
        <button @click="clearSearch">Clear Search</button>
    </div>
    <div class="pattern-list" v-if="store.state == 'input'">
        <QueryTerm v-model="store.term" />
        <div>
            {{ store.term.toString() }}
        </div>
        <div class="button-group">
            <button class="search btn-primary" @click="store.runSearch" :disabled="!searchValid">
                Search
            </button>
            <button class="example" @click="store.loadExample">Load example</button>
        </div>
    </div>
    <div v-if="store.state == 'running'">Running search, please wait...</div>
    <div v-if="store.state == 'error'">Some error happened: {{ store.error }}</div>
    <div v-if="store.state == 'done'">
        <div class="stats" v-if="store.results.length > 0">
            Your search gave <strong>{{ store.total }}</strong> results, showing
            <strong>1</strong> to <strong>{{ store.results.length }}</strong>
        </div>
        <ResultsList :results="store.results" />
        <div class="more-results" v-show="showLoadMore">
            <button class="btn-primary" @click="store.loadMore">
                <IconAdd /> Load more results
            </button>
        </div>
        <div class="loading-more" v-show="store.loadingMore">
            Loading more results, please wait...
        </div>
    </div>
</template>

<style scoped>
.pattern-list {
    margin: 1em 0;
    padding: 2em 1em;
    border-radius: 8px;
    border: 1px dashed #444;
}
.button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 2em;
}
.search {
    width: 25%;
}
.example {
    margin-left: 25%;
}

.query-buttons {
    display: flex;
    justify-content: flex-end;
}
</style>
