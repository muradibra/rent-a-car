import axiosInstance from "../axiosInstance";
import { GetAllLocationsResponse } from "./types";

async function getAll() {
  return await axiosInstance.get<GetAllLocationsResponse>("/locations");
}

async function getById({ id }: { id: string }) {
  return await axiosInstance.get(`/locations/${id}`);
}

async function edit({ id, title }: { id: string; title: string }) {
  return await axiosInstance.put(`/locations/${id}`, { title });
}

async function create({ title }: { title: string }) {
  return await axiosInstance.post("/locations", { title });
}

async function remove({ id }: { id: string }) {
  return await axiosInstance.delete(`/locations/${id}`);
}

const locationService = {
  getAll,
  getById,
  create,
  edit,
  remove,
};

export default locationService;
