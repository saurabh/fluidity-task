import { useQuery } from '@tanstack/react-query';
import { fetchOrderBook } from '../api';

export const useOrderbook = () => {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: [
      "orderbook",
    ],
    queryFn: () => fetchOrderBook(),
  });

  return {
    data,
    isLoading,
    isRefetching,
  };
};
