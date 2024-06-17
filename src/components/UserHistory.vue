<template>
  <v-container>
    <v-card>
      <v-card-title>Recently Read Stories</v-card-title>
      <v-data-table
        :headers="headers"
        :items="stories"
        item-value="story_id"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="viewStory(item.story_id)">mdi-eye</v-icon>
            <v-icon small  @click="editStory(item.story_id)"
            :disabled="!canEditOrDelete(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteStory(item.story_id)"
            :disabled="!canEditOrDelete(item)">mdi-delete</v-icon>
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
const headers = [
    { title: "ID", key: "story_id" },
    { title: 'Title', key: 'title' },
    { title: 'Actions', key: 'actions', sortable: false },
];
const stories = ref([]);
const user = ref(null);

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem('user'));
  const storyIds = JSON.parse(localStorage.getItem('recentStories')) || [];

  if (storyIds.length) {
    try {
      const { data } = await bedtimeStoryServices.get_stories_by_ids(storyIds);
      stories.value = data;
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }
});

const viewStory = (storyId) => {
  router.push({ name: 'display_story', params: { id: storyId } });
};

const editStory = (storyId) => {
  router.push({ name: 'edit_story', params: { id: storyId } });
};

const deleteStory = async (storyId) => {
  try {
    await bedtimeStoryServices.delete_story(storyId);
    stories.value = stories.value.filter((story) => story.story_id !== storyId);
  } catch (error) {
    console.error('Error deleting story:', error);
  }
};

const canEditOrDelete = (story) => {
  return user.value.role_id === 2 || story.author_id === user.value.id;
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
