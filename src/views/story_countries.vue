<template>
  <v-container v-if="countries">
    <v-card>
      <v-data-table
        :headers="headers"
        :items="countries"
        class="elevation-1"
        item-key="country_id"
        
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Countries</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="openCreateModal"
              style="margin-left: 20px"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Country
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

    <!-- Edit Country Dialog -->
    <v-dialog v-model="dialog.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Country</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="editedCountry.country_name"
              label="Country Name"
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

    <!-- Delete Country Dialog -->
    <v-dialog v-model="dialog.delete" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete Country</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this country?
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
import storyCountryServices from "../services/story_country_services";
import Alert from "../components/Alert.vue";

const countries = ref(null);
const dialog = ref({
  edit: false,
  delete: false,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref(null);
const router = useRouter();
const editedCountry = ref({});
const valid = ref(true);
const rules = {
  required: (value) => !!value || "Required.",
};

const headers = [
  { title: "ID", key: "country_id" },
  { title: "Name", key: "country_name" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchCountries = async () => {
  try {
    const response = await storyCountryServices.get_all_countries();
    countries.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to fetch countries";
  }
};

const openEditModal = (country) => {
  editedCountry.value = { ...country, create: false };
  dialog.value.edit = true;
};

const closeEditModal = () => {
  dialog.value.edit = false;
};

const saveEdit = async () => {
  try {
    if (editedCountry.value.create) {
      await storyCountryServices.create_country(editedCountry.value);
      snackbar.value.text = "Country created successfully";
    } else {
      await storyCountryServices.update_country(editedCountry.value);
      snackbar.value.text = "Country updated successfully";
    }
    fetchCountries();
    closeEditModal();
    snackbar.value.value = true;
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to update country";
    snackbar.value.color = "red";
  }
};

const openDeleteModal = (country) => {
  editedCountry.value = { ...country, create: false };
  dialog.value.delete = true;
};

const closeDeleteModal = () => {
  dialog.value.delete = false;
};

const confirmDelete = async () => {
  try {
    await storyCountryServices.delete_country(editedCountry.value.country_id);
    fetchCountries();
    closeDeleteModal();
    snackbar.value.value = true;
    snackbar.value.text = "Country deleted successfully";
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to delete country";
    snackbar.value.color = "red";
  }
};

const openCreateModal = () => {
  editedCountry.value = { country_name: "", create: true };
  dialog.value.edit = true;
};

onMounted(async ()=> {
  user.value = JSON.parse(localStorage.getItem("user"))
  if( !user || user.value.role_id != 2) {
    router.push({ name: "login"})
  } else {
    await fetchCountries();
  }
})

onMounted(fetchCountries);
</script>
