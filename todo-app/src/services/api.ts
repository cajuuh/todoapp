import axios, { AxiosResponse } from "axios";
import { WithId } from "../interfaces/WithIdInterface";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const GenericAPI = {
  getAll: <T extends WithId>(endpoint: string): Promise<AxiosResponse<T[]>> =>
    api.get<T[]>(endpoint),

  getById: <T extends WithId>(
    endpoint: string,
    id: string
  ): Promise<AxiosResponse<T>> => api.get<T>(`${endpoint}/${id}`),

  create: <T extends WithId, K extends Omit<T, "_id">>(
    endpoint: string,
    item: K
  ): Promise<AxiosResponse<T>> => api.post<T>(endpoint, item),

  update: <T extends WithId>(
    endpoint: string,
    id: string,
    updates: Partial<T>
  ): Promise<AxiosResponse<T>> => api.put<T>(`${endpoint}/${id}`, updates),

  delete: (endpoint: string, id: string): Promise<AxiosResponse<void>> =>
    api.delete(`${endpoint}/${id}`),

  deleteMany: (endpoint: string): Promise<AxiosResponse<void>> =>
    api.delete(endpoint),
};
