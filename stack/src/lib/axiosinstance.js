import axios from "axios";
import i18n from "@/i18n/config";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000",

  headers: {
    "Content-Type": "application/json",
  },
});

let isLoggingOut = false;

// Request Interceptor
axiosInstance.interceptors.request.use(
  (req) => {
    if (typeof window !== "undefined") {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        const token =
          parsedUser.token;

        if (token) {
          req.headers.Authorization =
            `Bearer ${token}`;
        }
      }
    }

    // Let the browser set the correct
    // Content-Type for FormData
    if (
      typeof FormData !== "undefined" &&
      req.data instanceof FormData
    ) {
      delete req.headers[
        "Content-Type"
      ];
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("API ERROR:", {
      url: error.config?.url,
      status:
        error.response?.status,
      data:
        error.response?.data,
    });

    if (
      typeof window === "undefined"
    ) {
      return Promise.reject(
        error
      );
    }

    const storedUser =
      localStorage.getItem(
        "user"
      );

    const requestUrl =
      error.config?.url || "";

    // Login can legitimately return 401
    // for invalid email/password.
    // Do NOT treat that as session expiry.
    const isLoginRequest =
      requestUrl.includes(
        "/user/login"
      );

    if (
      error.response?.status ===
        401 &&
      storedUser &&
      !isLoggingOut &&
      !isLoginRequest
    ) {
      isLoggingOut = true;

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