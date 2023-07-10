import { describe, it, expect } from "vitest";

import { Job } from "../jobs";

describe("Job", () => {
    describe("constructor", () => {
        it("initialises", () => {
            const job = new Job("test-id", "/api/job/test-id", "clusterblast", "running");
            expect(job.submitted.getTime()).toBeLessThanOrEqual(new Date().getTime());
        });
    });
    describe("load", () => {
        it("loads updated data", () => {
            const job = new Job("test-id", "/api/job/test-id", "clusterblast", "running");
            expect(job.status).toBe("running");
            expect(job.results).toBeUndefined();
            job.load({ status: "done", results: "Bob, please put the results here." });
            expect(job.status).toBe("done");
            expect(job.results).toBe("Bob, please put the results here.");
        });
    });
});
