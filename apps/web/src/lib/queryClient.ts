import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

export const makeQueryClient = (config?: QueryClientConfig) => {
  return new QueryClient(config);
};

const client = makeQueryClient();
export default client;
