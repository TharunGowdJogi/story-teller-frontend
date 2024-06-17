<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="roles"
        class="elevation-1"
        item-key="role_id"
        :sort-by="[{ key: 'role_id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Story Roles</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="openCreateModal"
              style="margin-left: 20px"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Role
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

    <!-- Edit Role Dialog -->
    <v-dialog v-model="dialog.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Role</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="editedRole.role_name"
              label="Role Name"
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

    <!-- Delete Role Dialog -->
    <v-dialog v-model="dialog.delete" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete Role</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this role?
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
import storyRoleServices from "../services/story_role_services";
import Alert from "../components/Alert.vue";

const roles = ref([]);
const dialog = ref({
  edit: false,
  delete: false,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const editedRole = ref({});
const user = ref(null);
const router = useRouter();
const valid = ref(true);
const rules = {
  required: (value) => !!value || "Required.",
};

const headers = [
  { title: "ID", key: "role_id" },
  { title: "Name", key: "role_name" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchRoles = async () => {
  try {
    const response = await storyRoleServices.get_all_roles();
    roles.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to fetch roles";
  }
};

const openEditModal = (role) => {
  editedRole.value = { ...role, create: false };
  dialog.value.edit = true;
};

const closeEditModal = () => {
  dialog.value.edit = false;
};

const saveEdit = async () => {
  try {
    if (editedRole.value.create) {
      await storyRoleServices.create_role(editedRole.value);
      snackbar.value.text = "Role created successfully";
    } else {
      await storyRoleServices.update_role(editedRole.value);
      snackbar.value.text = "Role updated successfully";
    }
    fetchRoles();
    closeEditModal();
    snackbar.value.value = true;
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to update role";
    snackbar.value.color = "red";
  }
};

const openDeleteModal = (role) => {
  editedRole.value = { ...role, create: false };
  dialog.value.delete = true;
};

const closeDeleteModal = () => {
  dialog.value.delete = false;
};

const confirmDelete = async () => {
  try {
    await storyRoleServices.delete_role(editedRole.value.role_id);
    fetchRoles();
    closeDeleteModal();
    snackbar.value.value = true;
    snackbar.value.text = "Role deleted successfully";
    snackbar.value.color = "green";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.text = "Failed to delete role";
    snackbar.value.color = "red";
  }
};

const openCreateModal = () => {
  editedRole.value = { role_name: "", create: true };
  dialog.value.edit = true;
};

onMounted(async ()=> {
  user.value = JSON.parse(localStorage.getItem("user"))
  if( !user || user.value.role_id != 2) {
    router.push({ name: "login"})
  } else {
    await fetchRoles();
  }
})
</script>
