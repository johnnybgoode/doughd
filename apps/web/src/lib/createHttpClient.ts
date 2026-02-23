import httpClient from '@/lib/http';

export type BaseModel = {
  id: number;
  slug: string;
};
export type BaseCreate = Omit<BaseModel, 'id'>;
export type BaseUpdate = Partial<BaseModel> & { id: number };

export type HttpClient<
  T extends BaseModel,
  C extends BaseCreate,
  U extends BaseUpdate,
> = ReturnType<typeof createHttpClient<T, C, U>>;

export const createHttpClient = <
  T extends BaseModel,
  C extends BaseCreate,
  U extends BaseUpdate,
>(
  apiBase: string,
) =>
  ({
    getAll: () => httpClient.get<T[]>(apiBase),
    getOne: (id: number) => httpClient.get<T>(`${apiBase}/${id}`),
    getOneBySlug: (slug: string) =>
      httpClient.get<T>(`${apiBase}/by-slug/${slug}`),
    createOne: (data: C) => httpClient.post<T>(apiBase, data),
    updateOne: (data: U) => httpClient.put<T>(`${apiBase}/${data.id}`, data),
    deleteOne: (id: number) => httpClient.delete<T>(`${apiBase}/${id}`),
  }) as const;
