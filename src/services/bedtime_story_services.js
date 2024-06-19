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
  },
  get_recommendations(userId) {
    return apiClient.get(`stories/recommendations/${userId}`);
  },
  async get_stories_by_ids(ids) {
    try {
      // Fetch each story by ID
      const requests = ids.map((id) => this.get_story(id));
      const responses = await Promise.all(requests);
  
      // Extract the data from each response
      const stories = responses.map((response) => response.data);
      return { data: stories };
    } catch (error) {
      console.error('Error fetching stories by IDs:', error);
      throw error;
    }
  }
};
