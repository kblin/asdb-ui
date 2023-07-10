import { describe, it, expect } from "vitest";

import { AsdbBgcTypeStats, AsdbStats } from "../stats";

const DATA = {
    num_clusters: 1,
    num_genomes: 1,
    num_sequences: 1,
    top_secmet_assembly_id: "AB_12345",
    top_secmet_species: "Examplomyces obviensis",
    top_secmet_taxon: 12345,
    top_secmet_taxon_count: 123,
    top_seq_species: "Examplococcus abundensis",
    top_seq_taxon: 54321,
    top_seq_taxon_count: 321,
    clusters: [
        {
            name: "nrps",
            category: "nrps",
            describe: "non-ribosomal peptide synthases",
            count: 42,
        },
    ],
};

describe("AsdbStats", () => {
    describe("loadFromJson", () => {
        it("loads data from JSON", () => {
            const stats = new AsdbStats();
            expect(stats.numClusters).toEqual(0);
            stats.loadFromJson(DATA);
            expect(stats.numClusters).toEqual(DATA.num_clusters);
            expect(stats.bgcTypeStats.length).toEqual(DATA.clusters.length);
        });
    });
    describe("hasData", () => {
        it("returns false if there is no data", () => {
            const stats = new AsdbStats();
            expect(stats.hasData()).toBeFalsy();
        });
        it("returns false if there are clusters but no stats", () => {
            const stats = new AsdbStats();
            stats.numClusters = 1;
            expect(stats.hasData()).toBeFalsy();
        });
        it("returns false if there are stats but no clusters", () => {
            const stats = new AsdbStats();
            stats.bgcTypeStats = [new AsdbBgcTypeStats()];
            expect(stats.hasData()).toBeFalsy();
        });
        it("returns true if there are clusters and stats", () => {
            const stats = new AsdbStats();
            stats.numClusters = 1;
            stats.bgcTypeStats = [new AsdbBgcTypeStats()];
            expect(stats.hasData()).toBeTruthy();
        });
    });
});
