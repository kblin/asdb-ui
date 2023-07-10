import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { fetchErrorResponse, fetchInvalidJsonResponse, fetchJsonResponse } from "../test_utils";

import { useCategoriesStore } from "../categories";
import { DATA } from "../../models/__tests__/categories.spec";

global.fetch = vi.fn();

describe("Categories Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        // @ts-ignore
        global.fetch.mockReset();
    });
    it("loads with an empty categories list", () => {
        const store = useCategoriesStore();
        expect(store.categories.hasData()).toBeFalsy();
    });

    describe("getCategories", () => {
        it("loads data category data from the API", async () => {
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            const store = useCategoriesStore();
            const promise = store.getCategories();
            expect(store.status).toBe("loading");
            await promise;
            expect(store.status).toBe("loaded");
            expect(fetch).toHaveBeenCalledWith("/api/v1.0/available_categories");
            expect(store.categories.hasData()).toBeTruthy();
        });
        it("doesn't reload the category data on consecutive calls", async () => {
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            const store = useCategoriesStore();
            await store.getCategories();
            await store.getCategories();
            expect(fetch).toHaveBeenCalledOnce();
        });
        it("reloads the category data on consecutive calls if forced", async () => {
            // @ts-ignore
            fetch.mockResolvedValue(fetchJsonResponse(DATA));
            const store = useCategoriesStore();
            await store.getCategories();
            await store.getCategories(true);
            expect(fetch).toHaveBeenCalledTimes(2);
        });
        it("sets an error status on fetch errors", async () => {
            // @ts-ignore
            fetch.mockResolvedValue(fetchErrorResponse("ruhroh"));
            const store = useCategoriesStore();
            expect(store.error).toBe("");
            await store.getCategories();
            expect(store.status).toBe("error");
            expect(store.error).toBe("ruhroh");
        });
        it("sets an error status on json decode errors", async () => {
            // @ts-ignore
            fetch.mockResolvedValue(fetchInvalidJsonResponse("ruhroh"));
            const store = useCategoriesStore();
            expect(store.error).toBe("");
            await store.getCategories();
            expect(store.status).toBe("error");
            expect(store.error).toBe("Error: ruhroh");
        });
    });
});
