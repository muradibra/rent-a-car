import axiosInstance from "../axiosInstance";
import { GetAllCategoriesResponse } from "./types";

async function getAll() {
  return await axiosInstance.get<GetAllCategoriesResponse>("/categories");
}

async function getById({ id }: { id: string }) {
  return await axiosInstance.get(`/categories/${id}`);
}

async function edit({ id, title }: { id: string; title: string }) {
  return await axiosInstance.put(`/categories/${id}`, { title });
}

async function create({ title }: { title: string }) {
  return await axiosInstance.post("/categories", { title });
}

async function remove({ id }: { id: string }) {
  return await axiosInstance.delete(`/categories/${id}`);
}

const categoryService = {
  getAll,
  getById,
  edit,
  create,
  remove,
};

export default categoryService;
