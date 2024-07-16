import axios, { AxiosError } from "axios";

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("No environment variable: SERVER_URL");
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/auth",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export const loginRequest = async (
  loginInfo
): Promise<{ data: any; error: any }> => {
  try {
    const response = await axiosClient.post("/login", loginInfo);
    return { data: response.data, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { data: null, error: error.response?.data.message };
    } else {
      return { data: null, error: "Unknown error" };
    }
  }
};

export const registerRequest = async (
  registerInfo
): Promise<{ data: any; error: any }> => {
  try {
    const response = await axiosClient.post("/register", registerInfo);
    return { data: response.data, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { data: null, error: error.response?.data.message };
    } else {
      return { data: null, error: "Unknown error" };
    }
  }
};
