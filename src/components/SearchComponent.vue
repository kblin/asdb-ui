<script setup lang="ts">
import ClusterBlast from "./ClusterBlast.vue";
import CompaRiPPson from "./CompaRiPPson.vue";
import CustomTab from "./CustomTab.vue";
import TabArea from "./TabArea.vue";
</script>

<template>
    <h1>Search <small>by protein sequence</small></h1>
    <TabArea>
        <CustomTab title="Search for RiPP precursors">
            <Suspense>
                <CompaRiPPson />
            </Suspense>
        </CustomTab>
        <CustomTab title="Search for protein sequences in annotated regions">
            <ClusterBlast />
        </CustomTab>
    </TabArea>
</template>

<style scoped></style>
