import api from "@/lib/axios";

export interface AdminDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export const getAdminDashboard = async () => {
  const response = await api.get<AdminDashboardStats>("/admin/dashboard");

  return response.data;
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: "ADMIN" | "USER" | "OWNER";
  createdAt: string;
}

export interface CreateAdminUserData {
  name: string;
  email: string;
  address: string;
  password: string;
  role: "ADMIN" | "USER" | "OWNER";
}

export const getAdminUsers = async (params?: {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
}) => {
  const response = await api.get<{ users: AdminUser[] }>("/admin/users", {
    params,
  });

  return response.data;
};

export const createAdminUser = async (data: CreateAdminUserData) => {
  const response = await api.post("/admin/users", data);

  return response.data;
};