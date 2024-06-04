import { createRouter, createWebHistory } from "vue-router";
const create_story = () => import('./views/create_story.vue');
const display_story = () => import('./views/display_story.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("./views/Main.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: '/create_story',
      name: 'create_story',
      component: create_story,
    },
    {
      path: '/display_story/:id',
      name: 'display_story',
      component: display_story,
    },
  ],
});

export default router;
