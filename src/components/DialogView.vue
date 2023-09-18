<script setup lang="ts">
import { onMounted, ref, useAttrs, watchEffect } from "vue";

const dialog = ref();

const attrs = useAttrs();

const _open = ref(false);

interface Props {
    open?: boolean;
    modal?: boolean;
}

const props = withDefaults(defineProps<Props>(), { open: false, modal: true });

function handleDialog() {
    if (!dialog?.value) {
        return;
    }
    if (props.open) {
        if (props.modal) {
            if (!dialog.value.showModal) {
                alert(
                    "Your browser does not support dialog options, please use a more recent browser."
                );
                return;
            }
            dialog.value.showModal();
            return;
        }
        dialog.value.show();
        return;
    }
    dialog.value.close();
}

onMounted(() => {
    watchEffect(() => {
        if (props.open !== _open.value) {
            handleDialog();
            _open.value = props.open;
        }
    });
});
</script>

<template>
    <dialog ref="dialog" v-bind="attrs"><slot /></dialog>
</template>
