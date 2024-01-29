import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      // url: "http://127.0.0.1:8000/api/v1/users/login",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    // If user Logged In successfully then move user to homepage
    if (res.data.status === "success") {
      showAlert("success", "LoggedIn successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 0);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      // url: "http://127.0.0.1:8000/api/v1/users/logout",
      url: "/api/v1/users/logout",
    });
    // If user logout the reload the page
    showAlert("success", "Logout Successfully");
    if ((res.data.status = "success")) location.assign("/");
  } catch (err) {
    showAlert("error", "Error logging out! Try Again");
  }
};
