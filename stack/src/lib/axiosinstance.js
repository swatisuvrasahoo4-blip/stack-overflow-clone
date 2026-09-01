import axios from "axios";

import i18n from "@/i18n/config";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000",

  headers: {
    "Content-Type":
      "application/json",
  },
});

let isLoggingOut = false;

// Request Interceptor

axiosInstance.interceptors.request.use(
  (req) => {
    if (
      typeof window !==
      "undefined"
    ) {
      const user =
        localStorage.getItem(
          "user"
        );

      if (user) {
        const token =
          JSON.parse(
            user
          ).token;

        if (token) {
          req.headers.Authorization =
            `Bearer ${token}`;
        }
      }
    }

    // For FormData, let the browser set Content-Type automatically

    if (
      req.data instanceof
      FormData
    ) {
      delete req.headers[
        "Content-Type"
      ];
    }

    return req;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log(
      "API ERROR:",
      {
        url:
          error.config
            ?.url,

        status:
          error.response
            ?.status,

        data:
          error.response
            ?.data,
      }
    );

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (
      error.response
        ?.status ===
        401 &&
      storedUser &&
      !isLoggingOut
    ) {
      isLoggingOut =
        true;

      localStorage.removeItem(
        "user"
      );

      alert(
        i18n.t(
          "messages.session_expired",
          {
            ns: "auth",
          }
        )
      );

      window.location.replace(
        "/auth"
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default axiosInstance;