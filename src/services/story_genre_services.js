import apiClient from "./services";

export default {
  get_all_genres() {
    return apiClient.get("genres");
  },
  get_genre(id) {
    return apiClient.get(`genres/${id}`);
  },
  create_genre(genre) {
    return apiClient.post("genres", genre);
  },
  update_genre(genre) {
    return apiClient.put(`genres/${genre.genre_id}`, genre);
  },
  delete_genre(id) {
    return apiClient.delete(`genres/${id}`);
  }
};
