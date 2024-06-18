<template>
  <v-container>
    <div v-if="step === 1">
      <h3>Select Genre</h3>
      <v-row>
        <v-col v-for="genre in genres" :key="genre.genre_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedGenre === genre.genre_id, 'card': true}"
            @click="selectGenre(genre.genre_id)"
          >
            <p>{{ genre.genre_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="nextStep" v-if="genres.length !== 0">Next</v-btn>
    </div>

    <div v-if="step === 2">
      <h3>Select Country</h3>
      <v-row>
        <v-col v-for="country in countries" :key="country.country_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedCountry === country.country_id, 'card': true}"
            @click="selectCountry(country.country_id)"
          >
            <p>{{ country.country_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="nextStep">Next</v-btn>
    </div>

    <div v-if="step === 3">
      <h3>Select Role</h3>
      <v-row>
        <v-col v-for="role in roles" :key="role.role_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedRole === role.role_id, 'card': true}"
            @click="selectRole(role.role_id)"
          >
            <p>{{ role.role_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="nextStep">Next</v-btn>
    </div>

    <div v-if="step === 4">
      <h3>Select Language</h3>
      <v-row>
        <v-col v-for="language in languages" :key="language.language_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedLanguage === language.language_id, 'card': true}"
            @click="selectLanguage(language.language_id)"
          >
            <p>{{ language.language_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="nextStep">Next</v-btn>
    </div>

    <div v-if="step === 5">
      <h3>Update Story</h3>
      <v-text-field v-model="story.title" label="Story Title"></v-text-field>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="updateStory">Update Story</v-btn>
    </div>

    <Alert :snackbar="snackbar" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GenreServices from '../services/story_genre_services';
import CountryServices from '../services/story_country_services';
import RoleServices from '../services/story_role_services';
import LanguageServices from '../services/story_language_services';
import storyServices from '../services/bedtime_story_services';
import { useRouter, useRoute } from 'vue-router';
import Alert from "../components/Alert.vue";

const step = ref(1);
const genres = ref([]);
const countries = ref([]);
const roles = ref([]);
const languages = ref([]);
const selectedGenre = ref(null);
const selectedCountry = ref(null);
const selectedRole = ref(null);
const selectedLanguage = ref(null);
const story = ref({ title: '', text: '' });
const errorMessage = ref('');
const user = ref(null);
const router = useRouter();
const route = useRoute();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const storyId = ref(null);

onMounted(async () => {
  try {
    const id = parseInt(route.params.id);
    storyId.value = id;
    user.value = JSON.parse(localStorage.getItem("user"));
    if (!user.value || user.value.role_id !== 2) {
      router.push({ name: 'login' });
    } else {
      genres.value = (await GenreServices.get_all_genres()).data;
      countries.value = (await CountryServices.get_all_countries()).data;
      roles.value = (await RoleServices.get_all_roles()).data;
      languages.value = (await LanguageServices.get_all_languages()).data;

      const { data } = await storyServices.get_story(storyId.value);
      story.value.title = data.title;
      selectedGenre.value = data.story_genre_id;
      selectedCountry.value = data.story_country_id;
      selectedRole.value = data.story_role_id;
      selectedLanguage.value = data.story_language_id;
    }
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to retrieve details";
    snackbar.value.color = "red";
  }
});

const selectGenre = (genreId) => {
  selectedGenre.value = genreId;
};

const selectCountry = (countryId) => {
  selectedCountry.value = countryId;
};

const selectRole = (roleId) => {
  selectedRole.value = roleId;
};

const selectLanguage = (languageId) => {
  selectedLanguage.value = languageId;
};

const nextStep = () => {
  if (step.value < 5) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const updateStory = async () => {
  try {
    if (!selectedGenre.value || !selectedCountry.value || !selectedRole.value || !selectedLanguage.value || story.value.title === '') {
      snackbar.value.value = true;
      snackbar.value.text = "Please fill all the fields!";
      snackbar.value.color = "error";
      return;
    }
    const newStory = {
      title: story.value.title,
      text: story.value.text,
      genre_id: selectedGenre.value,
      country_id: selectedCountry.value,
      role_id: selectedRole.value,
      language_id: selectedLanguage.value,
      user_id: user.value.id,
      id: storyId.value
    };
    const { data } = await storyServices.update_story(newStory);
    snackbar.value.value = true;
    snackbar.value.text = "Story updated successfully!";
    snackbar.value.color = "green";
    router.push({ name: 'display_story', params: { id: storyId.value } });
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Failed to update story';
  }
};
</script>

<style scoped>
.card {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 24px 16px 16px 16px;
  margin: 8px;
  text-align: center;
  cursor: pointer;
}

.selected-card {
  border: 2px solid #5E9400;
}
</style>
