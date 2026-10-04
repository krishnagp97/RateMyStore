import api from "@/lib/axios";

export interface CreateStoreData {
  name: string;
  email: string;
  address: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  userRating: number | null;
}

export const getStores = async (search = "") => {
  const response = await api.get<{ stores: Store[] }>("/stores", {
    params: search ? { search } : undefined,
  });

  return response.data;
};

export const createStore = async (data: CreateStoreData) => {
  const response = await api.post("/stores", data);
  return response.data;
};