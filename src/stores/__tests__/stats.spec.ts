import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { fetchErrorResponse, fetchInvalidJsonResponse, fetchJsonResponse } from "../test_utils";

import { useStatsStore } from "../stats";

global.fetch = vi.fn();

const DATA = {
    clusters: [
        {
            category: "nrps",
            count: 47079,
            description: "Non-ribosomal peptide synthase",
            name: "nrps",
        },
        {
            category: "terpene",
            count: 30641,
            description: "Terpene",
            name: "terpene",
        },
    ],
    num_clusters: 214804,
    num_genomes: 36350,
    num_sequences: 111250,
    top_secmet_assembly_id: "GCF_002021875.1",
    top_secmet_species: "Streptomyces Unknown XM201",
    top_secmet_taxon: 36920,
    top_secmet_taxon_count: 53,
    top_seq_species: "Pseudomonas Unknown None",
    top_seq_taxon: 4120,
    top_seq_taxon_count: 369,
};

describe("Stats Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        // @ts-ignore
        global.fetch.mockReset();
    });
    describe("getStats", () => {
        it("should get the stats", async () => {
            const store = useStatsStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            const promise = store.getStats();
            expect(store.status).toBe("loading");
            await promise;
            expect(store.status).toBe("loaded");
            expect(store.stats.bgcTypeStats.length).toEqual(2);
            expect(fetch).toHaveBeenCalledWith("/api/v2.0/stats");
        });
        it("shouldn't refetch the stats once fetched", async () => {
            const store = useStatsStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            await store.getStats();
            await store.getStats();
            expect(fetch).toHaveBeenCalledOnce();
        });
        it("should refetch the stats if forced", async () => {
            const store = useStatsStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            await store.getStats();
            await store.getStats(true);
            expect(fetch).toHaveBeenCalledTimes(2);
        });
        it("should handle fetch errors", async () => {
            const store = useStatsStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchErrorResponse("ruhroh"));
            await store.getStats();
            expect(store.error).toBe("ruhroh");
        });
        it("should handle JSON decode errors", async () => {
            const store = useStatsStore();
            // @ts-ignore
            fetch.mockResolvedValue(fetchInvalidJsonResponse("ruhroh"));
            await store.getStats();
            expect(store.error).toBe("Error: ruhroh");
        });
    });
});
