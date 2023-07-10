import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { Categories } from "@/models/categories";

export const useCategoriesStore = defineStore("categories", () => {
    const categories = reactive(new Categories());
    const error = ref("");
    const status = ref("");

    async function getCategories(force = false) {
        if (categories.hasData() && !force) {
            // Don't re-init categories
            return;
        }
        status.value = "loading";
        const categoryResponse = await fetch("/api/v1.0/available_categories");
        if (!categoryResponse.ok) {
            error.value = categoryResponse.statusText;
            status.value = "error";
            return;
        }
        try {
            const categoryData = await categoryResponse.json();
            categories.loadFromJson(categoryData);
        } catch (err: any) {
            error.value = `${err}`;
            status.value = "error";
            return;
        }
        status.value = "loaded";
    }

    return { categories, error, getCategories, status };
});
