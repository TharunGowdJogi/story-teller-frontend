<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="stories"
        class="elevation-1"
        item-key="story_id"
        :sort-by="[{ key: 'story_id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>My Stories</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="createStory"
              style="margin-left: 20px"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Story
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="openEditModal(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteModal(item)"> mdi-delete </v-icon>
          <v-icon small @click="displayStory(item)"> mdi-eye </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Story Dialog -->
    <v-dialog v-model="dialog.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Story</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="editedStory.story_name"
              label="Story Name"
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

    <!-- Delete Story Dialog -->
    <v-dialog v-model="dialog.delete" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete Story</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this story?
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
import storyStoryServices from "../services/bedtime_story_services";
import Alert from "../components/Alert.vue";

const stories = ref([]);
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
const editedStory = ref({});
const valid = ref(true);
const rules = {
  required: (value) => !!value || "Required.",
};

const headers = [
  { title: "ID", key: "story_id" },
  { title: "Name", key: "title" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchStories = async () => {
  try {
    const response = await storyStoryServices.get_all_Stories({ author_id: user.value.id});
    stories.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to fetch stories";
  }
};

const openEditModal = (story) => {
  editedStory.value = { ...story, create: false };
  dialog.value.edit = true;
};

const closeEditModal = () => {
  dialog.value.edit = false;
};

const saveEdit = async () => {
  try {
    if (editedStory.value.create) {
      await storyStoryServices.create_story(editedStory.value);
      snackbar.value.text = "Story created successfully";
    } else {
      await storyStoryServices.update_story(editedStory.value);
      snackbar.value.text = "Story updated successfully";
    }
    fetchStories();
    closeEditModal();
    snackbar.value.value = true;
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to update story";
    snackbar.value.color = "red";
  }
};

const openDeleteModal = (story) => {
  editedStory.value = { ...story, create: false };
  dialog.value.delete = true;
};

const closeDeleteModal = () => {
  dialog.value.delete = false;
};

const confirmDelete = async () => {
  try {
    await storyStoryServices.delete_story(editedStory.value.story_id);
    fetchStories();
    closeDeleteModal();
    snackbar.value.value = true;
    snackbar.value.text = "Story deleted successfully";
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to delete story";
    snackbar.value.color = "red";
  }
};

const createStory = () => {
  router.push({ name: 'create_story'})
};

const displayStory = (story) => {
    router.push({ name: "display_story", params: { id: story.story_id }})
}

onMounted(async ()=> {
  user.value = JSON.parse(localStorage.getItem("user"))
  if( !user || user.value.role_id != 2) {
    router.push({ name: "login"})
  } else {
    await fetchStories();
  }
})
</script>