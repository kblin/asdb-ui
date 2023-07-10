import { describe, it, expect } from "vitest";
import {
    QueryFilter,
    createFilter,
    QueryTerm,
    createQueryTerm,
    QueryTermError,
    QueryModuleTerm,
    ModuleStep,
} from "../queries";
import { fail } from "assert";

describe("QueryFilter", () => {
    it("stringifies numeric filters", () => {
        const filter = new QueryFilter("bob", 42, ">=");
        expect(filter.toString()).toBe(" WITH [bob|>=:42]");
    });
    it("stringifies string filters", () => {
        const filter = new QueryFilter("bob", "alice");
        expect(filter.toString()).toBe(" WITH [bob|alice]");
    });
    it("stringifies boolean filters", () => {
        const filter = new QueryFilter("bob");
        expect(filter.toString()).toBe(" WITH [bob]");
    });
    it("can be generated from a JSON-derived object", () => {
        const filter = createFilter({
            name: "bob",
            operator: ">=",
            value: 42,
        });
        expect(filter.toString()).toBe(" WITH [bob|>=:42]");
    });
});

describe("QueryTerm", () => {
    describe("creation", () => {
        it("creates simple expr terms", () => {
            const term = createExpr();
            expect(term.category).toBe("alice");
            expect(term.value).toBe("bob");
            expect(term.count).toEqual(1);
        });
        it("creates expr terms with counts", () => {
            const term = createExpr(2);
            expect(term.count).toEqual(2);
        });
        it("creates expr terms with filters", () => {
            const term = createExpr(null, [createFilter({ name: "alice", value: "bob" })]);
            expect(term.filters.length).toEqual(1);
            expect(term.filters[0].value).toBe("bob");
        });
        it("creates op terms", () => {
            const term = createOp();
            expect(term.termType).toBe("op");
            expect(term.operation).toBe("AND");
            expect(term.left?.value).toBe("bob");
        });
        it("throws an error creating other terms", () => {
            expect(() => new QueryTerm("bob")).toThrowError(QueryTermError);
        });
        it("throws an error when creating other terms via createQueryTerm", () => {
            expect(() => createQueryTerm({ termType: "bob" })).toThrowError(QueryTermError);
        });
    });

    describe("stringification", () => {
        it("stringifies simple expr terms", () => {
            const term = createExpr();
            expect(term.toString()).toBe("{[alice|bob]}");
        });
        it("stringifies boolean expressions", () => {
            const term = createQueryTerm({
                termType: "expr",
                category: "myBool",
            });
            expect(term.toString()).toBe("{[myBool]}");
        });
        it("stringifies terms with filters", () => {
            const term = createExpr(null, [createFilter({ name: "charlie", value: "eve" })]);
            expect(term.toString()).toBe("{[alice|bob] WITH [charlie|eve]}");
        });
        it("returns empty string on invalid terms", () => {
            const term = new QueryTerm("expr");
            expect(term.toString()).toBe("");
        });
        it("stringifies op terms", () => {
            const term = createOp("OR");
            expect(term.toString()).toBe("( {[alice|bob]} OR {[charlie|eve]} )");
        });
        it("stringifies only the left side of an op if the right side is invalid", () => {
            const term = createOp("AND", createExpr(), new QueryTerm("expr"));
            expect(term.toString()).toBe("{[alice|bob]}");
            term.right = null;
            expect(term.toString()).toBe("{[alice|bob]}");
        });
        it("stringifies only the right side of an op if the left side is invalid", () => {
            const term = createOp("AND", new QueryTerm("expr"));
            expect(term.toString()).toBe("{[charlie|eve]}");
            term.left = null;
            expect(term.toString()).toBe("{[charlie|eve]}");
        });
    });

    describe("addTerm", () => {
        it("throws an error when run on an op", () => {
            const term = createOp();
            expect(() => term.addTerm()).toThrowError(QueryTermError);
        });
        it("moves the existing expression to the left and creates an empty right term", () => {
            const term = createExpr();
            expect(term.category).toBe("alice");
            term.addTerm();
            expect(term.termType).toBe("op");
            expect(term.left?.termType).toBe("expr");
            expect(term.left?.category).toBe("alice");
            expect(term.right?.termType).toBe("expr");
            expect(term.right?.category).toBe("");
        });
    });
    describe("swapTerms", () => {
        it("swaps the terms", () => {
            const term = createOp();
            expect(term.left?.category).toBe("alice");
            expect(term.right?.category).toBe("charlie");

            term.swapTerms();
            expect(term.right?.category).toBe("alice");
            expect(term.left?.category).toBe("charlie");
        });
    });
    describe("removeLeft", () => {
        it("refuses to operate without a right term", () => {
            const term = createOp();
            term.right = null;
            expect(() => term.removeLeft()).toThrowError(QueryTermError);
        });
        it("creates an expr when right is an expr", () => {
            const term = createOp();
            const cat = term.right?.category;
            expect(term.termType).toBe("op");
            term.removeLeft();
            expect(term.termType).toBe("expr");
            expect(term.category).toBe(cat);
        });
        it("creates an op when right is an op", () => {
            const term = createOp();
            if (!term.right) {
                fail("Failed to create op");
            }
            expect(term.operation).toBe("AND");
            expect(term.right.termType).toBe("expr");
            term.right.addTerm();
            term.right.operation = "OR";
            expect(term.right.termType).toBe("op");
            term.removeLeft();
            expect(term.termType).toBe("op");
            expect(term.operation).toBe("OR");
        });
    });
    describe("removeRight", () => {
        it("refuses to operate without a left term", () => {
            const term = createOp();
            term.left = null;
            expect(() => term.removeRight()).toThrowError(QueryTermError);
        });
        it("creates an expr when left is an expr", () => {
            const term = createOp();
            const cat = term.left?.category;
            expect(term.termType).toBe("op");
            term.removeRight();
            expect(term.termType).toBe("expr");
            expect(term.category).toBe(cat);
        });
        it("creates an op when left is an op", () => {
            const term = createOp();
            if (!term.left) {
                fail("Failed to create op");
            }
            expect(term.operation).toBe("AND");
            expect(term.left.termType).toBe("expr");
            term.left.addTerm();
            term.left.operation = "OR";
            expect(term.left.termType).toBe("op");
            term.removeRight();
            expect(term.termType).toBe("op");
            expect(term.operation).toBe("OR");
        });
    });
    describe("addFilter", () => {
        it("adds a filter", () => {
            const term = createExpr();
            expect(term.filters.length).toEqual(0);
            term.addFilter();
            expect(term.filters.length).toEqual(1);
        });
    });
    describe("removeFilter", () => {
        it("removes a filter", () => {
            const term = createExpr(null, [new QueryFilter("alice"), new QueryFilter("bob")]);
            expect(term.filters.length).toEqual(2);
            expect(term.filters[0].name).toBe("alice");
            term.removeFilter(0);
            expect(term.filters.length).toEqual(1);
            expect(term.filters[0].name).toBe("bob");
        });
        it("doesn't crash when there's no filter to remove", () => {
            const term = createExpr();
            expect(term.filters.length).toEqual(0);
            term.removeFilter(0);
            expect(term.filters.length).toEqual(0);
        });
    });
    describe("serialisation", () => {
        it("serialises and deserialises an expr", () => {
            const term = createExpr(2);
            const data = term.toJson();
            delete data.filters;
            const restored = createQueryTerm({ termType: "expr", category: "foo", value: "bar" });
            expect(term).not.toStrictEqual(restored);
            restored.load(data);
            expect(term).toStrictEqual(restored);
        });
        it("serialises and deserialises an expr with filters", () => {
            const term = createExpr(2, [new QueryFilter("alice"), new QueryFilter("bob")]);
            const data = term.toJson();
            const restored = createQueryTerm({
                termType: "expr",
                category: "foo",
                value: "bar",
            });
            expect(term).not.toStrictEqual(restored);
            restored.load(data);
            expect(term).toStrictEqual(restored);
        });
        it("serialises and deserialises an op", () => {
            const term = createOp();
            const data = term.toJson();
            const restored = createQueryTerm({
                termType: "expr",
                category: "foo",
                value: "bar",
            });
            expect(term).not.toStrictEqual(restored);
            restored.load(data);
            expect(term).toStrictEqual(restored);
        });
        it("raises an error on an invalid termType", () => {
            const term = createExpr();
            const broken = {
                termType: "bob",
                category: "foo",
                value: "bar",
            };
            expect(() => term.load(broken)).toThrowError(QueryTermError);
        });
    });
});

function createExpr(count: number | null = null, filters: any[] | null = null) {
    const data: any = {
        termType: "expr",
        category: "alice",
        value: "bob",
    };
    if (count) {
        data.count = count;
    }
    if (filters) {
        data.filters = filters;
    }
    return createQueryTerm(data);
}

function createOp(operation: string = "AND", left: any = null, right: any = null) {
    const data: any = {
        termType: "op",
        operation: operation,
        left: createExpr(),
        right: {
            termType: "expr",
            category: "charlie",
            value: "eve",
        },
    };
    if (left) {
        data.left = left;
    }
    if (right) {
        data.right = right;
    }
    return createQueryTerm(data);
}

describe("QueryModuleTerm", () => {
    describe("creation", () => {
        it("creates an object with steps that have empty alternatives", () => {
            const term = new QueryModuleTerm();
            expect(term.steps.length).toBeGreaterThan(0);
            term.steps.forEach((step) => {
                expect(step.alternatives.length).toBe(0);
            });
        });
        it("creates an object where the number of steps match the number of prefixes", () => {
            const term = new QueryModuleTerm();
            expect(term.steps.length).toEqual(term.prefixes.length);
        });
    });
    describe("toString", () => {
        it("serialises all the steps correctly", () => {
            const term = new QueryModuleTerm();
            term.prefixes.forEach((prefix, idx) => {
                term.steps[idx].alternatives.push(["any", "bob"]);
                term.steps[idx].alternatives.push(["charlie", "none"]);
                expect(term.toString()).toBe(`${prefix}=?+bob,charlie+0`);
                term.steps[idx].alternatives.length = 0;
            });
        });
        it("serialises combinations correctly", () => {
            const term = new QueryModuleTerm();
            expect(term.steps.length).toBeGreaterThanOrEqual(2);
            const expected = `${term.prefixes[0]}=alice|${term.prefixes[1]}=bob`;
            term.steps[0].alternatives.push(["alice"]);
            term.steps[1].alternatives.push(["bob"]);
            expect(term.toString()).toBe(expected);
        });
    });
    describe("load", () => {
        it("loads all the steps correctly", () => {
            const term = new QueryModuleTerm();
            term.prefixes.forEach((prefix, idx) => {
                term.load(`${prefix}=?+bob,charlie+0`);
                expect(term.steps[idx].alternatives).toStrictEqual([
                    ["any", "bob"],
                    ["charlie", "none"],
                ]);
            });
        });
        it("loads combinations correctly", () => {
            const term = new QueryModuleTerm();
            expect(term.steps.length).toBeGreaterThanOrEqual(2);
            term.load(`${term.prefixes[0]}=alice|${term.prefixes[1]}=bob`);
            expect(term.steps[0].alternatives).toStrictEqual([["alice"]]);
            expect(term.steps[1].alternatives).toStrictEqual([["bob"]]);
        });
        it("ignores invalid combinations", () => {
            const term = new QueryModuleTerm();
            const invalid = "X";
            expect(term.steps.length).toBeGreaterThanOrEqual(2);
            expect(term.prefixes.indexOf(invalid)).toEqual(-1);
            term.load(`${term.prefixes[0]}=alice|${invalid}=nope|${term.prefixes[1]}=bob`);
            expect(term.steps[0].alternatives).toStrictEqual([["alice"]]);
            expect(term.steps[1].alternatives).toStrictEqual([["bob"]]);
        });
        it("loads during initialisation", () => {
            const ref_term = new QueryModuleTerm();
            expect(ref_term.steps.length).toBeGreaterThanOrEqual(2);
            const term = new QueryModuleTerm(
                `${ref_term.prefixes[0]}=alice|${ref_term.prefixes[1]}=bob`
            );
            expect(term.steps[0].alternatives).toStrictEqual([["alice"]]);
            expect(term.steps[1].alternatives).toStrictEqual([["bob"]]);
        });
    });
});

describe("ModuleStep", () => {
    describe("creation", () => {
        it("instantiates with just a title", () => {
            const step = new ModuleStep("bob");
            expect(step.title).toBe("bob");
            expect(step.alternatives.length).toBe(0);
            expect(step.options.length).toBe(0);
        });
        it("instantiates with title and options", () => {
            const step = new ModuleStep("bob", ["alice"]);
            expect(step.title).toBe("bob");
            expect(step.alternatives.length).toBe(0);
            expect(step.options.length).toBe(1);
            expect(step.options[0]).toBe("alice");
        });
        it("instantiates with title, options, and alternatives", () => {
            const step = new ModuleStep("bob", ["alice", "eve"], [["alice"]]);
            expect(step.title).toBe("bob");
            expect(step.options.length).toBe(2);
            expect(step.options[1]).toBe("eve");
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives[0]).toStrictEqual(["alice"]);
        });
    });
    describe("toString", () => {
        it("just returns a single domain unchanged", () => {
            const step = new ModuleStep("bob", undefined, [["alice"]]);
            expect(step.toString()).toBe("alice");
        });
        it("joins two options with a plus sign", () => {
            const step = new ModuleStep("bob", undefined, [["alice", "eve"]]);
            expect(step.toString()).toBe("alice+eve");
        });
        it("joins two alternatives with a comma", () => {
            const step = new ModuleStep("bob", undefined, [["alice", "eve"], ["charlie"]]);
            expect(step.toString()).toBe("alice+eve,charlie");
        });
        it("serialises 'any' to '?'", () => {
            const step = new ModuleStep("bob", undefined, [["any"]]);
            expect(step.toString()).toBe("?");
        });
        it("serialises 'none' to '0'", () => {
            const step = new ModuleStep("bob", undefined, [["none"]]);
            expect(step.toString()).toBe("0");
        });
    });
    describe("load", () => {
        it("loads a single domain", () => {
            const step = new ModuleStep("bob");
            step.load("alice");
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives[0]).toStrictEqual(["alice"]);
        });
        it("loads two options", () => {
            const step = new ModuleStep("bob");
            step.load("alice+eve");
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives[0]).toStrictEqual(["alice", "eve"]);
        });
        it("loads two alternatives", () => {
            const step = new ModuleStep("bob");
            step.load("alice+eve,charlie");
            expect(step.alternatives.length).toBe(2);
            expect(step.alternatives).toStrictEqual([["alice", "eve"], ["charlie"]]);
        });
        it("loads '?' as 'any'", () => {
            const step = new ModuleStep("bob");
            step.load("?");
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives[0]).toStrictEqual(["any"]);
        });
        it("loads '0' as 'none'", () => {
            const step = new ModuleStep("bob");
            step.load("0");
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives[0]).toStrictEqual(["none"]);
        });
    });
    describe("removeDomain", () => {
        it("removes the right option", () => {
            const step = new ModuleStep("bob");
            step.load("alice+eve,charlie");
            step.removeDomain(0, 1);
            expect(step.alternatives.length).toBe(2);
            expect(step.alternatives).toStrictEqual([["alice"], ["charlie"]]);
        });
        it("removes the alternative if the last option is removed", () => {
            const step = new ModuleStep("bob");
            step.load("alice,charlie");
            step.removeDomain(0, 0);
            expect(step.alternatives.length).toBe(1);
            expect(step.alternatives).toStrictEqual([["charlie"]]);
        });
    });
});
