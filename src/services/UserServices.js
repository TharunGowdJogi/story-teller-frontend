import apiClient from "./services";

export default {
  getUser(id) {
    if(!id)
      return apiClient.get("users");
    return apiClient.get("users/"+id)
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.email + ":" + user.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  }
};
