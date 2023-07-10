<script setup lang="ts">
const props = defineProps<{
    hits: any[];
}>();

function getAreaLink(hit: any) {
    return `/area?record=${hit.s_acc}&start=${hit.s_rec_start}&end=${hit.s_rec_end}`;
}
</script>

<template>
    <div v-if="props.hits.length > 0">
        <table>
            <thead>
                <tr>
                    <th>Query</th>
                    <th>Hit ID</th>
                    <th class="identity">% Identity</th>
                    <th>Hit Record</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(hit, index) in props.hits" :key="index">
                    <td>{{ hit.q_acc }}</td>
                    <td>{{ hit.s_locus }}</td>
                    <td class="digits identity">{{ hit.identity }}</td>
                    <td>
                        <a :href="getAreaLink(hit)" target="_blank">{{ hit.s_acc }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>Your search gave no results, try again with a different sequence.</div>
</template>
