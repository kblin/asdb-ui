<script setup lang="ts">
import { useRoute } from "vue-router";
import RenderJob from "@/components/RenderJob.vue";

const route = useRoute();
const jobId = typeof route.params.jobid == "object" ? route.params.jobid[0] : route.params.jobid;
</script>

<template>
    <main class="container">
        <Suspense>
            <RenderJob :job-id="jobId" />
        </Suspense>
    </main>
</template>
