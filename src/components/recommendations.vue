<template>
  <v-container>
    <v-card>
      <v-card-title>Story Recommendations</v-card-title>
      <v-data-table
        :headers="headers"
        :items="stories"
        item-value="story_id"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="editStory(item.story_id)">mdi-pencil</v-icon>
            <v-icon small @click="deleteStory(item.story_id)">mdi-delete</v-icon>
            <v-icon small @click="viewStory(item.story_id)">mdi-eye</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import bedtimeStoryServices from '../services/bedtime_story_services.js';

const router = useRouter();
const stories = ref([]);
const headers = [
    { title: "ID", key: "story_id" },
    { title: 'Title', key: 'title' },
    { title: 'Actions', key: 'actions', sortable: false },
];

const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role_id === 2;

onMounted(async () => {
  try {
    const { data } = await bedtimeStoryServices.get_recommendations(user.id);
    stories.value = data;
  } catch (error) {
    console.error(error.message);
  }
});

const viewStory = (storyId) => {
  router.push({ name: 'story', params: { id: storyId } });
};

const editStory = (storyId) => {
  router.push({ name: 'edit_story', params: { id: storyId } });
};

const deleteStory = async (storyId) => {
  try {
    await bedtimeStoryServices.delete_story(storyId);
    stories.value = stories.value.filter(story => story.story_id !== storyId);
  } catch (error) {
    console.error(error.message);
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
