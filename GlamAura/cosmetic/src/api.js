import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


// 🔐 Attach access token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🔄 Handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        // ❗ if no refresh token → logout
        if (!refresh) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const res = await axios.post(
          "http://127.0.0.1:8000/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        // save new token
        localStorage.setItem("access", newAccess);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);

      } catch (err) {
        console.log("Session expired");

        // logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;