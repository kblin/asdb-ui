<script setup lang="ts">
import ClusterblastResults from "@/components/common/ClusterblastResults.vue";
import ComparippsonResults from "@/components/common/ComparippsonResults.vue";
import DialogView from "@/components/DialogView.vue";

import IconArrowLeft from "./icons/IconArrowLeft.vue";
import IconHelp from "@/components/icons/IconHelp.vue";
import IconTrash from "./icons/IconTrash.vue";

import { useJobsStore } from "@/stores/jobs";
import { Job, JobType } from "@/models/jobs";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
    jobId: string;
}>();

const store = useJobsStore();

const job = await store.getJob(props.jobId);

function getDisplayType(job: Job) {
    switch (job.jobtype) {
        case JobType.CLUSTERBLAST:
            return ClusterblastResults;
        case JobType.COMPARIPPSON:
            return ComparippsonResults;
        default:
            return IconHelp;
    }
}

const deleteModalOpen = ref(false);
function deleteJob() {
    if (!job) {
        return;
    }
    if (job.status == "failed") {
        store.removeJob(job.id);
        router.push({ name: "jobs" });
    }

    if (job.status != "done") {
        return;
    }
    deleteModalOpen.value = true;
}

function deleteJobConfirmed() {
    if (!job) {
        return;
    }
    store.removeJob(job.id);
    deleteModalOpen.value = false;
    router.push({ name: "jobs" });
}
</script>

<template>
    <div class="job-nav">
        <button @click="$router.push({ name: 'jobs' })"><IconArrowLeft /> Back to overview</button>
        <button v-if="job && ['done', 'failed'].includes(job.status)" @click="deleteJob">
            <IconTrash /> Remove job
        </button>
    </div>
    <div>
        <h1>
            Job {{ jobId }} <small>{{ job?.jobtype }}</small>
        </h1>
    </div>
    <div v-if="job">
        <component v-if="job.status == 'done'" :is="getDisplayType(job)" :hits="job.results.hits" />
        <div v-else-if="job.status == 'failed'">Job failed: {{ job.results?.error }}</div>
        <div v-else>Job is still {{ job.status }}, please try again later.</div>
    </div>
    <div v-else>Please select a valid job ID.</div>
    <DialogView :open="deleteModalOpen" class="dialog">
        <div>Do you really want to delete job {{ job?.id }}?</div>
        <div class="confirm_buttons">
            <button @click="deleteJobConfirmed">Yes</button>
            <button @click="deleteModalOpen = false">No</button>
        </div>
    </DialogView>
</template>

<style scoped>
.job-nav {
    display: flex;
    justify-content: space-between;
}
</style>
