import { queryOptions } from '@tanstack/react-query';
import type {
  BaseCreate,
  BaseModel,
  BaseUpdate,
  HttpClient,
} from './createHttpClient';

export const createQueryClient = <
  T extends BaseModel,
  C extends BaseCreate,
  U extends BaseUpdate,
>(
  queryKey: string,
  httpClient: HttpClient<T, C, U>,
) =>
  ({
    getAllQuery: () =>
      queryOptions({
        queryFn: httpClient.getAll,
        queryKey: [queryKey],
      }),
    getOneQuery: (id: number) =>
      queryOptions({
        queryFn: () => httpClient.getOne(id),
        queryKey: [queryKey, id],
      }),
    getOneBySlugQuery: (slug: string) =>
      queryOptions({
        queryFn: () => httpClient.getOneBySlug(slug),
        queryKey: [queryKey, slug],
      }),
  }) as const;
