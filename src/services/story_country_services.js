import apiClient from "./services";

export default {
  get_all_countries() {
    return apiClient.get("countries");
  },
  get_country(id) {
    return apiClient.get(`countries/${id}`);
  },
  create_country(country) {
    return apiClient.post("countries", country);
  },
  update_country(country) {
    return apiClient.put(`countries/${country.country_id}`, country);
  },
  delete_country(id) {
    return apiClient.delete(`countries/${id}`);
  }
};
