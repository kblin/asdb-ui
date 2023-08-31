<script setup lang="ts">
import $ from "jquery";
import "jstree";
import "jstree/dist/themes/default/style.min.css";
import "jstree/dist/themes/default/32px.png";
import "jstree/dist/themes/default/throbber.gif";
import { onMounted, ref } from "vue";
const j = ref();

const ASSEMBLY_URL = "/api/assembly";

const emit = defineEmits<{
    status: [status: string];
    display: [regions: any[]];
}>();

onMounted(() => {
    $(j.value)
        .jstree({
            core: {
                themes: {
                    name: "default",
                },
                data: {
                    url: "/api/v1.0/tree/taxa",
                    data: (node: any) => {
                        return { id: node.id === "#" ? 1 : node.id };
                    },
                },
            },
            types: {
                default: {
                    icon: "/src/assets/code-branch-solid.svg",
                },
                strain: {
                    icon: "/src/assets/file-alt-regular.svg",
                },
            },
            plugins: ["wholerow", "types"],
        })
        .on("click", ".jstree-node", function (this: any, e: any) {
            $(this).jstree(true).toggle_node(e.target);
            const assembly = $(this).attr("data-assembly");
            if (!assembly) {
                return;
            }
            emit("status", "loading");
            $.ajax({
                method: "get",
                url: `${ASSEMBLY_URL}/${assembly}`,
                dataType: "json",
                contentType: "application/json",
                processData: false,
                async: true,
                success: function (data) {
                    emit("display", data);
                    emit("status", "done");
                },
            });
        });
});
</script>

<template>
    <div ref="j"></div>
</template>
