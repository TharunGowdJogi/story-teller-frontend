<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  snackbar: Object,
});
const snackbar = toRef(props, 'snackbar');
function closeSnackBar() {
  snackbar.value.value = false;
}
</script>


<template>
<v-snackbar v-model="snackbar.value" rounded="pill">
{{ snackbar.text }}
    <template v-slot:actions>
        <v-btn
        :color="snackbar.color"
        variant="text"
        @click="closeSnackBar()"
        >
        Close
        </v-btn>
    </template>
</v-snackbar>
</template>