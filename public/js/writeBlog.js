import axios from "axios";
import { showAlert } from "./alert";

export const writeBlog = async (
  heading,
  description,
  categories,
  tags,
  content
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/blogs",
      data: {
        heading,
        description,
        categories,
        tags,
        content,
      },
    });
    showAlert("success", "Article Posted Successfully");
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.error(err);
  }
};
