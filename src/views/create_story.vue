<template>
  <v-container>
    <div v-if="step === 1">
      <h3>Select Genre</h3>
      <v-row>
        <v-col v-for="genre in genres" :key="genre.genre_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedGenre === genre, 'card': true}"
            @click="selectGenre(genre)"
          >
            <p>{{ genre.genre_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="nextStep">Next</v-btn>
    </div>

    <div v-if="step === 2">
      <h3>Select Country</h3>
      <v-row>
        <v-col v-for="country in countries" :key="country.country_id" cols="12" md="4">
          <div
            :class="{'selected-card': selectedCountry === country, 'card': true}"
            @click="selectCountry(country)"
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
            :class="{'selected-card': selectedRole === role, 'card': true}"
            @click="selectRole(role)"
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
            :class="{'selected-card': selectedLanguage === language, 'card': true}"
            @click="selectLanguage(language)"
          >
            <p>{{ language.language_name }}</p>
          </div>
        </v-col>
      </v-row>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="nextStep">Next</v-btn>
    </div>

    <div v-if="step === 5">
      <h3>Create Story</h3>
      <v-text-field v-model="story.title" label="Story Title"></v-text-field>
      <v-btn @click="prevStep">Prev</v-btn>
      <v-btn @click="createStory">Generate Story</v-btn>
    </div>

    <Alert :snackbar="snackbar" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GenreServices from '../services/story_genre_services';
import CountryServices from '../services/story_country_services';
import RoleServices from '../services/stoy_role_services';
import LanguageServices from '../services/story_language_services';
import storyServices from '../services/bedtime_story_services';
import { useRouter } from 'vue-router';
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
const story = ref({ title: '' });
const errorMessage = ref('');
const user  = ref(null);
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  try {
    user.value = JSON.parse(localStorage.getItem("user"))
    if(!user.value || user.value.role_id != 2) {
        router.push({ name: 'login'})
    } else {
        genres.value = (await GenreServices.get_all_genres()).data;
        countries.value = (await CountryServices.get_all_countries()).data;
        roles.value = (await RoleServices.get_all_roles()).data;
        languages.value = (await LanguageServices.get_all_languages()).data;
    }
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to retrieve details";
    snackbar.value.color = "red";
  }
});

const selectGenre = (genre) => {
  selectedGenre.value = genre;
};

const selectCountry = (country) => {
  selectedCountry.value = country;
};

const selectRole = (role) => {
  selectedRole.value = role;
};

const selectLanguage = (language) => {
  selectedLanguage.value = language;
};

const nextStep = () => {
  if (step.value < 5) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const createStory = async () => {
  try {
    if(!selectedGenre || !selectedCountry || !selectedRole || !selectedLanguage || story.value.title == '') {
        snackbar.value.value = true;
        snackbar.value.text = "Please fill all the fields!";
        snackbar.value.color = "error";
        return;
    }
    const newStory = {
      title: story.value.title,
      genre_id: selectedGenre.value.genre_id,
      country_id: selectedCountry.value.country_id,
      role_id: selectedRole.value.role_id,
      language_id: selectedLanguage.value.language_id,
      user_id: user.value.id
    }
    const { data } = await storyServices.create_story(newStory);
    snackbar.value.value = true;
    snackbar.value.text = "Story Generated Successfully!";
    snackbar.value.color = "green";
    router.push({ name: 'display_story', params: { id: data.story_id}})
  } catch (error) {
    errorMessage.value = error?.reponse?.data?.messag || 'Failed to generate story';
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
