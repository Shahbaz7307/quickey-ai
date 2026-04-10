import axios from "axios";

const API_URL =
  "http://localhost:5000/api/vision";

export const analyzeImage =
  async (imageFile) => {
    const token =
      localStorage.getItem(
        "token"
      );

    const formData =
      new FormData();

    formData.append(
      "image",
      imageFile
    );

    const response =
      await axios.post(
        API_URL,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };