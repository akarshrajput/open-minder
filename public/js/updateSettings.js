import axios from "axios";
import { showAlert } from "./alert";

export const updateData = async (data) => {
  try {
    // const url = "http://127.0.0.1:8000/api/v1/users/updateMe";
    const url = "/api/v1/users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `Data updated successfully!`);
      location.reload(true);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updatePassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      // url: "http://127.0.0.1:8000/api/v1/users/updateMyPassword",
      url: "/api/v1/users/updateMyPassword",
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Password updated successfully");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
