import axios from "axios";
import { getSession } from "next-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
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
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; 
  }
};

// Fungsi untuk mengambil daftar artikel
export const fetchArticles = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/articles`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error; 
  }
};

// Fungsi untuk memperbarui pengguna
export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error; 
  }
};

// Fungsi untuk menghapus pengguna
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error; 
  }
};

// Fungsi untuk mengambil profil pengguna
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; 
  }
};

export default api;
