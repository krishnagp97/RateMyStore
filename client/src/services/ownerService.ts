import api from "@/lib/axios";

export interface OwnerRating {
  id: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OwnerStoreRatings {
  store: {
    id: string;
    name: string;
  };
  averageRating: number;
  totalRatings: number;
  ratings: OwnerRating[];
}

export const getOwnerStoreRatings = async (storeId: string) => {
  const response = await api.get<OwnerStoreRatings>(
    `/ratings/${storeId}/ratings`,
  );

  return response.data;
};