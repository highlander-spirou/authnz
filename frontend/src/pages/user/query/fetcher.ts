import axios from "axios";

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("No environment variable: SERVER_URL");
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/user",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export const fetchUserInfo = async () => {
  try {
    const response = await axiosClient.get("/info");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const changeUserInfo = async (payload) => {
  try {
    const response = await axiosClient.put("/info", payload);
    return response.data;
  } catch (error) {
    return null;
  }
}