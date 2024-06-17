import { createRouter, createWebHistory } from "vue-router";
const create_story = () => import('./views/create_story.vue');
const display_story = () => import('./views/display_story.vue');
const user_history = () => import('./views/user_history.vue');
const story_countries = () => import('./views/story_countries.vue');
const story_genres = () => import('./views/story_genres.vue');
const story_languages = () => import('./views/story_languages.vue');
const story_roles = () => import('./views/story_roles.vue');
const all_stories = () => import('./views/all_stories.vue');
const edit_story = () => import('./views/edit_story.vue');

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
    {
      path: '/my_history',
      name: 'my_history',
      component: user_history,
    },
    {
      path: '/story_countries',
      name: 'story_countries',
      component: story_countries,
    },
    {
      path: '/story_genres',
      name: 'story_genres',
      component: story_genres,
    },
    {
      path: '/story_languages',
      name: 'story_languages',
      component: story_languages,
    },
    {
      path: '/story_roles',
      name: 'story_roles',
      component: story_roles,
    },
    {
      path: '/all_stories/',
      name: 'all_stories',
      component: all_stories,
    },
    {
      path: '/edit_story/:id',
      name: 'edit_story',
      component: edit_story,
    },
  ],
});

export default router;
