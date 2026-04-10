import axios from "axios";

const API_URL = "http://localhost:5000/api/chat/image";

export const saveImageChat = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
