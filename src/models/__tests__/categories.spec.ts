import { describe, it, expect } from "vitest";

import { Categories, CategoryOption, CategoryGroup } from "../categories";

export const DATA = {
    options: [
        {
            label: "ungrouped option 1",
            value: "u_opt_1",
            type: "text",
            countable: true,
            description: "Ungrouped option 1",
        },
    ],
    groups: [
        {
            header: "first group",
            options: [
                {
                    label: "group 1 option 1",
                    value: "group_1_opt_1",
                    type: "number",
                    countable: false,
                    description: "First option of first group",
                    filters: [
                        {
                            label: "group 1 option 1 filter 1",
                            type: "number",
                            value: 30,
                            choices: {
                                strong: 30,
                                medium: 20,
                                weak: 10,
                            },
                        },
                    ],
                },
            ],
        },
        {
            header: "second group",
            options: [
                {
                    label: "group 2 option 1",
                    value: "group_2_opt_1",
                    type: "text",
                    countable: true,
                    description: "First option of second group",
                    filters: [
                        {
                            label: "group 2 option 1 filter 1",
                            type: "text",
                            value: "bob",
                        },
                    ],
                },
            ],
        },
    ],
};

describe("Categories", () => {
    describe("init", () => {
        it("is happy with empty defaults", () => {
            const category = new Categories();
            expect(category.groups.length).toEqual(0);
            expect(category.options.length).toEqual(0);
        });
        it("supports passing groups and options", () => {
            const option = new CategoryOption("alice", "bob", "text", true, "a test option");
            const group = new CategoryGroup("test group", [
                new CategoryOption("foo", "bar", "number", false, "test option in group"),
            ]);
            const category = new Categories([option], [group]);
            expect(category.groups.length).toEqual(1);
            expect(category.options.length).toEqual(1);
        });
    });
    describe("hasData", () => {
        it("returns false if no group and option data was loaded", () => {
            const category = new Categories();
            expect(category.hasData()).toBeFalsy();
        });
        it("returns true if group and option data was loaded", () => {
            const option = new CategoryOption("alice", "bob", "text", true, "a test option");
            const group = new CategoryGroup("test group", [
                new CategoryOption("foo", "bar", "number", false, "test option in group"),
            ]);
            const category = new Categories([option], [group]);
            expect(category.hasData()).toBeTruthy();
        });
    });
    describe("loadFromJson", () => {
        it("can load JSON data", () => {
            const category = new Categories();
            category.loadFromJson(DATA);
            expect(category.hasData()).toBeTruthy();
            expect(category.options.length).toEqual(1);
            expect(category.options[0].value).toBe("u_opt_1");
            expect(category.groups.length).toEqual(2);
            expect(category.groups[0].options.length).toEqual(1);
            expect(category.groups[0].options[0].value).toBe("group_1_opt_1");
        });
    });
    describe("getType", () => {
        const category = new Categories();
        category.loadFromJson(DATA);

        it("returns 'unset' if no type can be found for name", () => {
            expect(category.getType("bob")).toBe("unset");
        });

        it("returns the correct type when name has a mapping", () => {
            expect(category.getType("u_opt_1")).toBe("text");
            expect(category.getType("group_1_opt_1")).toBe("number");
        });
    });
    describe("getFilters", () => {
        const category = new Categories();
        category.loadFromJson(DATA);

        it("returns an empty list if no filters can be found for name", () => {
            expect(category.getFilters("bob")).toStrictEqual([]);
        });

        it("returns the correct filters when name has a mapping", () => {
            expect(category.getFilters("u_opt_1")).toStrictEqual([]);
            const g1o1_filters = category.getFilters("group_1_opt_1");
            expect(g1o1_filters.length).toEqual(1);
            expect(g1o1_filters[0].choices.labels.length).toEqual(3);
            expect(g1o1_filters[0].choices.labels).toStrictEqual(["strong", "medium", "weak"]);
            expect(g1o1_filters[0].choices.choices.get("strong")).toEqual(30);
        });
    });
});
