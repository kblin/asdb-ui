import { reactive, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { QueryTerm, createQueryTerm, type QueryState } from "@/models/queries";

export const SEARCH_URL = "/api/search";
export const CONVERT_URL = "/api/convert";

export const useQueriesStore = defineStore("queries", () => {
    const term = reactive(new QueryTerm("expr"));
    const paginate = ref(50);
    const offset = ref(0);
    const total = ref(0);
    const loadingMore = ref(false);
    const state: Ref<QueryState> = ref("input");
    const error = ref("");

    async function runSearch() {
        const req = {
            query: {
                search: "cluster",
                terms: term.toJson(),
                return_type: "json",
            },
            paginate: paginate.value,
            offset: offset.value,
        };
        state.value = "running";
        const raw = await fetch(SEARCH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });
        if (!raw.ok) {
            state.value = "error";
            error.value = `${raw.statusText}: ${raw.status}`;
            return;
        }
        try {
            const data = await raw.json();
            results.value = data.regions;
            offset.value = data.offset + paginate.value;
            paginate.value = data.paginate;
            total.value = data.total;
            state.value = "done";
        } catch (err) {
            state.value = "error";
            error.value = `${err}`;
        }
    }

    function loadExample() {
        const exampleSearch = createQueryTerm({
            termType: "op",
            operation: "AND",
            left: createQueryTerm({
                termType: "expr",
                category: "type",
                value: "nrps",
            }),
            right: createQueryTerm({
                termType: "expr",
                category: "genus",
                value: "Streptomyces",
            }),
        });
        term.load(exampleSearch);
    }

    async function loadMore() {
        const req = {
            query: {
                search: "cluster",
                terms: term.toJson(),
                return_type: "json",
            },
            paginate: paginate.value,
            offset: offset.value,
        };
        loadingMore.value = true;
        const raw = await fetch(SEARCH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });
        if (!raw.ok) {
            state.value = "error";
            error.value = `${raw.statusText}: ${raw.status}`;
            return;
        }
        try {
            const data = await raw.json();
            results.value = results.value.concat(data.clusters);
            offset.value = data.offset + paginate.value;
            paginate.value = data.paginate;
            total.value = data.total;
            loadingMore.value = false;
        } catch (err) {
            state.value = "error";
            error.value = `${err}`;
        }
    }

    async function convertSearch(terms_string: string) {
        const convertUrl = new URL(CONVERT_URL, `${window.location}`);
        convertUrl.searchParams.set("search_string", terms_string);

        const response = await fetch(convertUrl);
        if (!response.ok) {
            state.value = "error";
            error.value = `${response.statusText}: ${response.status}`;
            return;
        }
        try {
            const query = await response.json();
            term.load(query.terms);
        } catch (err) {
            state.value = "error";
            error.value = `${err}`;
        }
    }

    function clearSearch() {
        term.clear();
        state.value = "input";
        error.value = "";
    }

    const results: Ref<any[]> = ref([]);

    return {
        term,
        paginate,
        offset,
        total,
        loadingMore,
        state,
        error,
        results,
        runSearch,
        loadExample,
        loadMore,
        convertSearch,
        clearSearch,
    };
});
