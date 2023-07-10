<script setup lang="ts">
import StatsComponent from "../components/StatsComponent.vue";
</script>

<template>
    <main class="container">
        <Suspense>
            <StatsComponent />
        </Suspense>
    </main>
</template>
