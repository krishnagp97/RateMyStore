import api from "../lib/axios";

export interface SignupData {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await api.patch("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};