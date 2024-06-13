// services/auth.js

import axios from "axios";

const baseURL = "http://103.164.54.252:8000";

export const checkUserRole = async (session, router) => {
  if (session) {
    try {
      const response = await axios.get(`${baseURL}/api/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });

      const data = response.data;

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "owner") {
        router.push("/owner");
      } else {
        // Handle other roles or scenarios
        router.push("/"); // Redirect to homepage or handle appropriately
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      router.push("/auth/signin"); // Redirect to sign-in if error occurs
    }
  } else {
    router.push("/auth/signin"); // Redirect to sign-in if session not found
  }
};
