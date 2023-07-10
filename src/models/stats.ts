export class AsdbBgcTypeStats {
    name: string = "Loading...";
    category: string = "Loading...";
    description: string = "Loading...";
    count: number = 0;
}

export class AsdbStats {
    numClusters: number = 0;
    numGenomes: number = 0;
    numSequences: number = 0;

    topSecmetAssemblyId: string = "Loading...";
    topSecmetSpecies: string = "Loading...";
    topSecmetTaxon: number = 0;
    topSecmetTaxonCount: number = 0;

    topSeqSpecies: string = "Loading...";
    topSeqTaxon: number = 0;
    topSeqTaxonCount: number = 0;

    bgcTypeStats: AsdbBgcTypeStats[] = [];

    hasData() {
        return this.numClusters > 0 && this.bgcTypeStats.length > 0;
    }

    loadFromJson(data: any) {
        this.numClusters = data.num_clusters;
        this.numGenomes = data.num_genomes;
        this.numSequences = data.num_sequences;

        this.topSecmetAssemblyId = data.top_secmet_assembly_id;
        this.topSecmetSpecies = data.top_secmet_species;
        this.topSecmetTaxon = data.top_secmet_taxon;
        this.topSecmetTaxonCount = data.top_secmet_taxon_count;

        this.topSeqSpecies = data.top_seq_species;
        this.topSeqTaxon = data.top_seq_taxon;
        this.topSeqTaxonCount = data.top_seq_taxon_count;

        data.clusters.forEach((cluster: any) => {
            const stats = new AsdbBgcTypeStats();
            stats.name = cluster.name;
            stats.category = cluster.category;
            stats.description = cluster.description;
            stats.count = cluster.count;
            this.bgcTypeStats.push(stats);
        });
    }
}
