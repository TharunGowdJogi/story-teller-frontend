import apiClient from "./services";

export default {
  get_all_roles() {
    return apiClient.get("roles");
  },
  get_role(id) {
    return apiClient.get(`roles/${id}`);
  },
  create_role(role) {
    return apiClient.post("roles", role);
  },
  update_role(role) {
    return apiClient.put(`roles/${role.role_id}`, role);
  },
  delete_role(id) {
    return apiClient.delete(`roles/${id}`);
  }
};
