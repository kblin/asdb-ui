import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { useCitationsStore } from "../citations";

describe("Cication Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("has citations", () => {
        const store = useCitationsStore();
        expect(store.citations.length).toBeGreaterThanOrEqual(3);
    });

    it("provides the correct latest citation", () => {
        const store = useCitationsStore();
        let maxYear = 0;
        store.citations.forEach((citation) => {
            if (citation.year > maxYear) {
                maxYear = citation.year;
            }
        });
        expect(store.latest.year).toEqual(maxYear);
    });
});
