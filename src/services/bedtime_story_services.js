import apiClient from "./services";

export default {
  get_all_Stories(queryParams) {
    return apiClient.get("stories", {
      params: queryParams,
    });
  },
  get_story(id) {
    return apiClient.get(`stories/${id}`);
  },
  create_story(story) {
    return apiClient.post("stories", story);
  },
  update_story(story) {
    return apiClient.put(`stories/${story.id}`, story);
  },
  delete_story(id) {
    return apiClient.delete(`stories/${id}`);
  },
  get_story_by_user_id(id) {
    return apiClient.get(`stories/user/${id}`);
  }
};
