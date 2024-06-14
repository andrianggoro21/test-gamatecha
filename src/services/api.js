import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = "http://103.164.54.252:8000";

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor untuk menambahkan access token ke setiap request
api.interceptors.request.use(async (config) => {
    try {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
      } else {
        throw new Error('Access token is missing or invalid');
      }
      return config;
    } catch (error) {
      console.error("Error retrieving session:", error);
      throw error;
    }
  });

// Fungsi untuk mengambil daftar pengguna
export const fetchUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Melempar error untuk ditangani di tempat pemanggilan
  }
};

// Fungsi untuk mengambil daftar artikel
export const fetchArticles = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/articles`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error; // Melempar error untuk ditangani di tempat pemanggilan
  }
};

// Fungsi untuk memperbarui pengguna
export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error; // Melempar error untuk ditangani di tempat pemanggilan
  }
};

// Fungsi untuk menghapus pengguna
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error; // Melempar error untuk ditangani di tempat pemanggilan
  }
};

// Fungsi untuk mengambil profil pengguna
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Melempar error untuk ditangani di tempat pemanggilan
  }
};

export default api;
