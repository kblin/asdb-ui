import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { fetchErrorResponse, fetchInvalidJsonResponse, fetchJsonResponse } from "../test_utils";
import { useQueriesStore, SEARCH_URL, CONVERT_URL } from "../queries";

global.fetch = vi.fn();

const DATA = {
    clusters: [
        {
            acc: "NZ_CP047694",
            assembly_id: "GCF_028472785.1",
            bgc_id: 119571,
            category: "hybrid",
            cbh_acc: "BGC0001465",
            cbh_description: "bromophene/bistribromopyrrole/pentabromopseudilin",
            cbh_rank: 1,
            contig_edge: false,
            description:
                "Hybrid region: Butyrolactone & polybrominated diphenyl ethers ( PBDEs ) & Type I polyketide",
            end_pos: 4557165,
            genus: "Marinomonas",
            record_number: 1,
            region_number: 8,
            similarity: 100,
            species: "Unknown",
            start_pos: 4503787,
            strain: "MMB-3 (CPR1)",
            term: "butyrolactone - pbde - t1pks hybrid",
            version: 1,
        },
    ],
    offset: 0,
    paginate: 1,
    total: 10,
};

const MORE_DATA = {
    clusters: [
        {
            acc: "NZ_CP060140",
            assembly_id: "GCF_022376295.1",
            bgc_id: 160795,
            category: "other",
            cbh_acc: "BGC0001490",
            cbh_description: "6,6'-oxybis(2,4-dibromophenol)",
            cbh_rank: 1,
            contig_edge: false,
            description: "polybrominated diphenyl ethers ( PBDEs )",
            end_pos: 1898966,
            genus: "Nodularia",
            record_number: 1,
            region_number: 9,
            similarity: 62,
            species: "sphaerocarpa",
            start_pos: 1872281,
            strain: "UHCC 0038",
            term: "pbde",
            version: 1,
        },
    ],
    offset: 1,
    paginate: 1,
    total: 10,
};

const TERM = {
    termType: "expr",
    category: "type",
    value: "pbde",
    filters: [],
    count: 1,
};

const QUERY = {
    query: {
        search: "cluster",
        terms: TERM,
        return_type: "json",
    },
    paginate: 1,
    offset: 0,
};

describe("Queries Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        // @ts-ignore
        global.fetch.mockReset();
    });

    describe("runSearch", () => {
        it("searches for the term", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            store.term.load(TERM);
            store.paginate = 1;
            const promise = store.runSearch();
            expect(store.state).toBe("running");
            await promise;
            expect(fetch).toHaveBeenCalledWith(SEARCH_URL, {
                method: "POST",
                body: JSON.stringify(QUERY),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(store.error).toBe("");
            expect(store.state).toBe("done");
            expect(store.results.length).toEqual(1);
            expect(store.results[0].bgc_id).toBe(119571);
            expect(store.offset).toEqual(1);
        });
        it("handles fetch errors", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchErrorResponse("ruhroh"));
            store.term.load(TERM);
            store.paginate = 1;
            await store.runSearch();
            expect(store.state).toBe("error");
            expect(store.error).toBe("ruhroh: 418");
        });
        it("handles JSON parse errors", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchInvalidJsonResponse(new Error("ruhroh")));
            store.term.load(TERM);
            store.paginate = 1;
            await store.runSearch();
            expect(store.state).toBe("error");
            expect(store.error).toBe("Error: ruhroh");
        });
    });
    describe("loadMore", () => {
        it("loads more data from the server", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(MORE_DATA));
            store.term.load(TERM);
            store.paginate = 1;
            store.offset = 1;
            const promise = store.loadMore();
            expect(store.loadingMore).toBe(true);
            await promise;
            const query = JSON.parse(JSON.stringify(QUERY));
            query.offset = 1;
            expect(fetch).toHaveBeenCalledWith(SEARCH_URL, {
                method: "POST",
                body: JSON.stringify(query),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(store.error).toBe("");
            expect(store.results.length).toEqual(1); // because we cheat and don't actually have data yet
            expect(store.results[0].bgc_id).toBe(160795);
            expect(store.offset).toEqual(2);
        });
        it("handles fetch errors", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchErrorResponse("ruhroh"));
            store.term.load(TERM);
            store.paginate = 1;
            await store.loadMore();
            expect(store.state).toBe("error");
            expect(store.error).toBe("ruhroh: 418");
        });
        it("handles JSON parse errors", async () => {
            const store = useQueriesStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchInvalidJsonResponse(new Error("ruhroh")));
            store.term.load(TERM);
            store.paginate = 1;
            await store.loadMore();
            expect(store.state).toBe("error");
            expect(store.error).toBe("Error: ruhroh");
        });
    });
    describe("loadExample", () => {
        it("loads some data into term", () => {
            const store = useQueriesStore();
            expect(store.term.toString()).toBe("");
            store.loadExample();
            expect(store.term.toString()).toContain("{[");
        });
    });
    describe("convertSearch", () => {
        it("converts a string search to json and loads the term", async () => {
            const store = useQueriesStore();
            const search = "{[type|nrps]}";
            // @ts-ignore
            fetch.mockResolvedValue(
                fetchJsonResponse({
                    terms: {
                        category: "type",
                        termType: "expr",
                        value: "nrps",
                    },
                })
            );
            await store.convertSearch(search);
            const expectedUrl = new URL(CONVERT_URL, `${window.location}`);
            expectedUrl.searchParams.set("search_string", search);
            expect(fetch).toHaveBeenCalledWith(expectedUrl);
            expect(store.term.toString()).toBe(search);
        });
        it("handles fetch errors gracefully", async () => {
            const store = useQueriesStore();
            const search = "{[type|nrps]}";
            // @ts-ignore
            fetch.mockResolvedValue(fetchErrorResponse("ruhroh"));
            expect(store.error).toBe("");
            await store.convertSearch(search);
            expect(store.error).toBe("ruhroh: 418");
        });
        it("handles JSON decode errors gracefully", async () => {
            const store = useQueriesStore();
            const search = "{[type|nrps]}";
            // @ts-ignore
            fetch.mockResolvedValue(fetchInvalidJsonResponse("ruhroh"));
            expect(store.error).toBe("");
            await store.convertSearch(search);
            expect(store.error).toBe("Error: ruhroh");
        });
    });
    describe("clearSearch", () => {
        it("clears out the term", () => {
            const store = useQueriesStore();
            store.loadExample();
            expect(store.term.toString()).not.toBe("");
            store.clearSearch();
            expect(store.term.toString()).toBe("");
        });
    });
});
