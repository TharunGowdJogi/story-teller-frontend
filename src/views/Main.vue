<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";

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
  <div class="container" style="margin-top: 20px">
    <div style="display: flex;">
    </div>
    <br/>
    <PageLoader v-if="isLoading" />
  <Alert :snackbar="snackbar"/>
  <br/>
  </div>
</v-container>
</template>

<style scoped>
.dashboard {
    background-color: white;
    padding: 30px;
}
.col-6{
    margin-bottom: 50px;
}
.dashboard-static-data {
    display: flex;
    width: 40%;
    justify-content: space-between;
}
.static {
    margin-top: 40px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
table {
    width: 80%;
}
td {
    width: 80%;
    padding: 10px;
}
th {
    padding: 10px;
}
</style>