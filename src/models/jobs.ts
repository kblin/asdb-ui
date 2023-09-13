// object-style enum replacement
export const JobType = {
    COMPARIPPSON: "comparippson",
    CLUSTERBLAST: "clusterblast",
    STOREDQUERY: "storedquery",
} as const;

export type JobTypeT = (typeof JobType)[keyof typeof JobType];

export class Job {
    id: string;
    jobtype: JobTypeT;
    status: string;
    submitted: Date;
    results: any;
    nextUrl: string;

    constructor(
        id: string,
        nextUrl: string,
        jobtype: JobTypeT,
        status: string,
        submitted?: Date,
        results?: any
    ) {
        this.id = id;
        this.nextUrl = nextUrl;
        this.jobtype = jobtype;
        this.status = status;
        this.submitted = submitted ?? new Date();
        this.results = results;
    }

    load(data: any) {
        this.nextUrl = data.next ?? "";
        this.status = data.status;
        this.results = data.results;
    }
}
