<script setup>
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
  <v-app :style="{ background: '#F4F4F4' }">
    <MenuBar :key="$route.fullPath" />
    <h1> Welcome to Story Teller Frontend</h1>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
