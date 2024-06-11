<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="genres"
        class="elevation-1"
        item-key="genre_id"
        :sort-by="[{ key: 'genre_id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Genres</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="openCreateModal"
              style="margin-left: 20px"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Genre
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="openEditModal(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteModal(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Genre Dialog -->
    <v-dialog v-model="dialog.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Genre</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="editedGenre.genre_name"
              label="Genre Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditModal"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Genre Dialog -->
    <v-dialog v-model="dialog.delete" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete Genre</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this genre?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteModal"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="confirmDelete"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Alert :snackbar="snackbar" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import storyGenreServices from "../services/story_genre_services";
import Alert from "../components/Alert.vue";

const genres = ref([]);
const dialog = ref({
  edit: false,
  delete: false,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const editedGenre = ref({});
const valid = ref(true);
const rules = {
  required: (value) => !!value || "Required.",
};
const user = ref(null);
const router = useRouter();

const headers = [
  { title: "ID", key: "genre_id" },
  { title: "Name", key: "genre_name" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchGenres = async () => {
  try {
    const response = await storyGenreServices.get_all_genres();
    genres.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to fetch genres";
  }
};

const openEditModal = (genre) => {
  editedGenre.value = { ...genre, create: false };
  dialog.value.edit = true;
};

const closeEditModal = () => {
  dialog.value.edit = false;
};

const saveEdit = async () => {
  try {
    if (editedGenre.value.create) {
      await storyGenreServices.create_genre(editedGenre.value);
      snackbar.value.text = "Genre created successfully";
    } else {
      await storyGenreServices.update_genre(editedGenre.value);
      snackbar.value.text = "Genre updated successfully";
    }
    fetchGenres();
    closeEditModal();
    snackbar.value.value = true;
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to update genre";
    snackbar.value.color = "red";
  }
};

const openDeleteModal = (genre) => {
  editedGenre.value = { ...genre, create: false };
  dialog.value.delete = true;
};

const closeDeleteModal = () => {
  dialog.value.delete = false;
};

const confirmDelete = async () => {
  try {
    await storyGenreServices.delete_genre(editedGenre.value.genre_id);
    fetchGenres();
    closeDeleteModal();
    snackbar.value.value = true;
    snackbar.value.text = "Genre deleted successfully";
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to delete genre";
    snackbar.value.color = "red";
  }
};

const openCreateModal = () => {
  editedGenre.value = { genre_name: "", create: true };
  dialog.value.edit = true;
};

onMounted(async ()=> {
  user.value = JSON.parse(localStorage.getItem("user"))
  if( !user || user.value.role_id != 2) {
    router.push({ name: "login"})
  } else {
    await fetchGenres();
  }
})
</script>
