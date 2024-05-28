<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const role = ref("User")
const user = ref({
  name: "",
  email: "",
  password: "",
  role_id: ""
});

const roleOptions =  [
        "Admin","User"
      ]

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "main" });
  }
});

const getRoleId = () => {
  if(role.value === "Admin") return 2
  return 1
}

async function createAccount() {
    if(user.value.email == "" || user.value.password == "" || user.value.name == "") {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "please enter all values";
      return;
  }  
  await UserServices.addUser({...user.value, role_id: getRoleId()})
    .then((res) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "failed to signup!";
    });
}

async function login() {
  if(user.value.email == "" || user.value.password == "") {
    console.log("inv")
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "please enter email and password";
      return;
  }  
  await UserServices.loginUser(user.value)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "main" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error?.response?.data?.message || "failed to login!";
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Login </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()"
            >Create Account</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Password"
              required
            ></v-text-field>
             <v-select
                v-model="role"
                label="Role"
                :items="roleOptions"
                required
              ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="closeCreateAccount()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="createAccount()"
              >Create Account</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

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
    </div>
  </v-container>
</template>
