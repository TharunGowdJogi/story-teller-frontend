<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";
import Recommendations from "../components/recommendations.vue"
import UserHistory from "../components/UserHistory.vue"

const isLoading = ref(true);
const router = useRouter();
const user = ref(null);
const id = null
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
});
</script>

<template>
<v-container>
    <UserHistory />
    <Recommendations />
    <PageLoader v-if="isLoading" />
  <Alert :snackbar="snackbar"/>
  <br/>
</v-container>
</template>

<style scoped>

</style>