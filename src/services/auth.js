import { fetchUserProfile } from "./api";

export const checkUserRole = async (session, router) => {
  if (session) {
    try {
      // Panggil fetchUserProfile dari api.js
      const userProfile = await fetchUserProfile();

      // Periksa role dari data userProfile
      if (userProfile.role === "admin") {
        router.push("/admin");
      } else if (userProfile.role === "owner") {
        router.push("/owner");
      } else {
        router.push("/auth/signin"); 
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      router.push("/auth/signin"); 
    }
  } else {
    router.push("/auth/signin"); 
  }
};
