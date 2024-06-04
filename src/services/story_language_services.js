import apiClient from "./services";

export default {
  get_all_languages() {
    return apiClient.get("languages");
  },
  get_language(id) {
    return apiClient.get(`languages/${id}`);
  },
  create_language(language) {
    return apiClient.post("languages", language);
  },
  update_language(language) {
    return apiClient.put(`languages/${language.language_id}`, language);
  },
  delete_language(id) {
    return apiClient.delete(`languages/${id}`);
  }
};
