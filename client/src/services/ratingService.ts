
import api from "@/lib/axios";

export const submitRating = async (storeId: string, rating: number) => {
  const response = await api.post(`/ratings/${storeId}`, { rating });
  return response.data;
};

export const updateRating = async (storeId: string, rating: number) => {
  const response = await api.put(`/ratings/${storeId}`, { rating });
  return response.data;
};
