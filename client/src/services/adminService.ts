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
  const response = await api.get<{ users: AdminUser[] }>(
    "/admin/users",
    { params },
  );

  return response.data;
};

export const createAdminUser = async (data: CreateAdminUserData) => {
  const response = await api.post("/admin/users", data);

  return response.data;
};

export interface AdminStore {
  id: string;
  name: string;
  email: string;
  address: string;
  overallRating: number;
}

export const getAdminStores = async (params?: {
  name?: string;
  email?: string;
  address?: string;
}) => {
  const response = await api.get<{ stores: AdminStore[] }>(
    "/admin/stores",
    { params },
  );

  return response.data;
};

export interface CreateAdminStoreData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export const createAdminStore = async (data: CreateAdminStoreData) => {
  const response = await api.post("/admin/stores", data);

  return response.data;
};

export interface AdminUserDetails {
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    role: "ADMIN" | "USER" | "OWNER";
    createdAt: string;
  };
  stores?: {
    id: string;
    name: string;
    email: string;
    address: string;
    totalRatings: number;
    averageRating: number;
  }[];
}

export const getAdminUserDetails = async (userId: string) => {
  const response = await api.get<AdminUserDetails>(
    `/admin/users/${userId}`,
  );

  return response.data;
};