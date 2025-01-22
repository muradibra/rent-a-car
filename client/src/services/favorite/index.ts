import axiosInstance from "../axiosInstance";
import { FavoriteResponse, GetAllFavoritesResponse } from "./types";

async function getAll() {
  return await axiosInstance.get<GetAllFavoritesResponse>("/favorites");
}

async function toggleLike({ id }: { id: string }) {
  return await axiosInstance.post<FavoriteResponse>(`/favorites/${id}`);
}

const favoriteService = {
  getAll,
  toggleLike,
};

export default favoriteService;
