import { useFetch } from '../hooks/useFetch';

export const Greeting = () => {
  const { data, error, loading } = useFetch<{ message: string }>('/api');
  if (loading) {
    return <>Loading...</>;
  }

  if (error || !data) {
    return 'Hi';
  }

  return <h2>{data.message}</h2>;
};
