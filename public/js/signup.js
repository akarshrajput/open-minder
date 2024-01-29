import axios from "axios";
import { showAlert } from "./alert";

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      // url: "http://127.0.0.1:8000/api/v1/users/signup",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    // If user Logged In successfully then move user to homepage
    if (res.data.status === "success") {
      showAlert("success", "Welcome to Open Minder");
      window.setTimeout(() => {
        location.assign("/");
      }, 0);
    }
  } catch (err) {
    showAlert("error", "Error");
  }
};
