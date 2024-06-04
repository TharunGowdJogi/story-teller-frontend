<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import user_services from "../services/user_services";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref(null);
const title = ref("Story Teller");
const logoURL = ref("");
const drawerOpen = ref(false)
onMounted(() => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
});

const routes = {
  1:[
    {
    path: "/",
    name: "Home"
  },
  {
    path: "/create_story",
    name: "Create a Story"
  },
  {
    path: "/my_history",
    name: "My Stories History"
  }
  ],
  2:[
       {
    path: "/",
    name: "Home"
  },
  {
    path: "/create_story",
    name: "Create a Story"
  },
  {
    path: "/my_history",
    name: "My Stories History"
  },
     {
    path: "/story_countries",
    name: "Story Countries"
  },
  {
    path: "/story_genres",
    name: "Story Genres"
  },
  {
    path: "/story_languages",
    name: "Story Languages"
  },
  {
    path: "/story_roles",
    name: 'Story Roles'
  }
    ]
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function logout() {
  user_services.logout_user()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}
</script>

<template>
  <div>
    <v-navigation-drawer v-if="user != null" app>
      <v-list style="margin-top:20px;">
        <v-list-item v-for="route in routes[user?.role_id]" :key="route.path" :to="route.path" link>
          <div style="display:flex">
            <p style="color:black;">{{ route.name }}</p>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color='#5E9400' app dark>
      <v-toolbar-title class="title" :style="{color:'#FFFFFF',cursor:'pointer'}" >
        <a href="/" style="text-decoration:none;">{{ title }}</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user === null" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${user.name.charAt(0)}${user.email.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.name.charAt(0)}${user.email.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.name}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
    
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
</template>

<style scoped>
 a {
  color: #FFFFFF;
 }
 a:hover {
  color: #FFFFFF;
 }
</style>