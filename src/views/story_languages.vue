<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="languages"
        class="elevation-1"
        item-key="language_id"
        :sort-by="[{ key: 'language_id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Languages</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="openCreateModal"
              style="margin-left: 20px"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Language
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

    <!-- Edit Language Dialog -->
    <v-dialog v-model="dialog.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Language</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="editedLanguage.language_name"
              label="Language Name"
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

    <!-- Delete Language Dialog -->
    <v-dialog v-model="dialog.delete" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete Language</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this language?
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
import storyLanguageServices from "../services/story_language_services";
import Alert from "../components/Alert.vue";

const languages = ref([]);
const dialog = ref({
  edit: false,
  delete: false,
});
const user = ref(null);
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const editedLanguage = ref({});
const valid = ref(true);
const rules = {
  required: (value) => !!value || "Required.",
};

const headers = [
  { title: "ID", key: "language_id" },
  { title: "Name", key: "language_name" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchLanguages = async () => {
  try {
    const response = await storyLanguageServices.get_all_languages();
    languages.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to fetch languages";
  }
};

const openEditModal = (language) => {
  editedLanguage.value = { ...language, create: false };
  dialog.value.edit = true;
};

const closeEditModal = () => {
  dialog.value.edit = false;
};

const saveEdit = async () => {
  try {
    if (editedLanguage.value.create) {
      await storyLanguageServices.create_language(editedLanguage.value);
      snackbar.value.text = "Language created successfully";
    } else {
      await storyLanguageServices.update_language(editedLanguage.value);
      snackbar.value.text = "Language updated successfully";
    }
    fetchLanguages();
    closeEditModal();
    snackbar.value.value = true;
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to update language";
    snackbar.value.color = "red";
  }
};

const openDeleteModal = (language) => {
  editedLanguage.value = { ...language, create: false };
  dialog.value.delete = true;
};

const closeDeleteModal = () => {
  dialog.value.delete = false;
};

const confirmDelete = async () => {
  try {
    await storyLanguageServices.delete_language(editedLanguage.value.language_id);
    fetchLanguages();
    closeDeleteModal();
    snackbar.value.value = true;
    snackbar.value.text = "Language deleted successfully";
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to delete language";
    snackbar.value.color = "red";
  }
};

const openCreateModal = () => {
  editedLanguage.value = { language_name: "", create: true };
  dialog.value.edit = true;
};

onMounted(async ()=> {
  user.value = JSON.parse(localStorage.getItem("user"))
  if( !user || user.value.role_id != 2) {
    router.push({ name: "login"})
  } else {
    await fetchLanguages();
  }
})
</script>
