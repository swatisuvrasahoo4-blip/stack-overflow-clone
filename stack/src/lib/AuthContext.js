import { useState, useEffect } from "react";
import { createContext } from "react";

import axiosInstance from "./axiosinstance";

import { toast } from "react-toastify";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation("auth");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  const Signup = async ({
    name,
    username,
    email,
    mobile,
    password,
  }) => {
    setloading(true);
    seterror(null);

    try {
      let deviceId = localStorage.getItem("deviceId");

      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
      }

      const res = await axiosInstance.post("/user/signup", {
        name,
        username,
        email,
        mobile,
        password,
        deviceId,
      });

      const { data, token } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token,
        })
      );

      setUser({
        ...data,
        token,
      });

      toast.success(
        t("messages.signup_successful")
      );
    } catch (error) {
      console.error(
        "Signup failed:",
        error
      );

      const msg =
        t("messages.signup_failed");

      seterror(msg);

      toast.error(msg);
    } finally {
      setloading(false);
    }
  };

  const Login = async ({
    email,
    password,
  }) => {
    setloading(true);
    seterror(null);

    try {
      let deviceId = localStorage.getItem("deviceId");

      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
      }

      const res = await axiosInstance.post("/user/login", {
        email,
        password,
        deviceId,
      });

      if (res.data.requiresDeviceVerification) {
        return {
          requiresDeviceVerification: true,
          userId: res.data.userId,
          deviceId: res.data.deviceId,
        };
      }

      const { data, token } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          token,
        })
      );

      setUser({
        ...data,
        token,
      });

      toast.success(
        t("messages.login_successful")
      );

      return true;
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      const msg =
        t("messages.login_failed");

      seterror(msg);

      toast.error(msg);

      return false;
    } finally {
      setloading(false);
    }
  };

  const completeLogin = ({
    data,
    token,
  }) => {
    const loggedInUser = {
      ...data,
      token,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  };

  const updateUser = (updatedUser) => {
    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("user")
        : null;

    const currentUser =
      storedUser
        ? JSON.parse(storedUser)
        : null;

    const nextUser =
      currentUser
        ? {
            ...currentUser,
            ...updatedUser,
          }
        : updatedUser;

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "user",
        JSON.stringify(nextUser)
      );
    }

    setUser(nextUser);
  };

  const Logout = async () => {
    try {
      await axiosInstance.patch(
        "/user/sessions/logout"
      );

      setUser(null);

      localStorage.removeItem("user");

      toast.info(
        t("messages.logged_out")
      );
    } catch (error) {
      console.log(
        "Logout failed",
        error
      );

      toast.error(
        t("messages.failed_to_logout")
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        Signup,
        Login,
        Logout,
        updateUser,
        completeLogin,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);