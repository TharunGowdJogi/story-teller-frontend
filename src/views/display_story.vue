<template>
  <v-container>
    <div>
    <v-card v-if="story.story_id">
      <v-card-title>{{ story.title }}</v-card-title>
      <v-card-subtitle>{{ formatDate(story.created_at) }}</v-card-subtitle>
      <v-card-text>{{ story.text }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions v-if="story.story_genre != null">
        <v-chip>{{ story.story_genre?.genre_name }}</v-chip>
        <v-chip>{{ story.story_country?.country_name }}</v-chip>
        <v-chip>{{ story.story_role?.role_name }}</v-chip>
        <v-chip>{{ story.story_language?.language_name }}</v-chip>
      </v-card-actions>
    </v-card>
    <br/>
    </div>
    <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import bedtimeStoryServices from '../services/bedtime_story_services.js';

const route = useRoute();
const story = ref({});
const errorMessage = ref('');

onMounted(async () => {
  const storyId = parseInt(route.params.id);
  if (!isNaN(storyId)) {
    try {
      const {data} = await bedtimeStoryServices.get_story(storyId);
      story.value = data;
    } catch (error) {
      errorMessage.value = error.message;
    }
  } else {
    errorMessage.value = 'Invalid story ID';
  }
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>
