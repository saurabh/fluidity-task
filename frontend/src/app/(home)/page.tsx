import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import OrderbookAndCharts from "./home";
import { fetchOrderBook } from '@/api';

export const metadata: Metadata = {
  title: "Fluid Cex ( ͡° ͜ʖ ͡°) for fluid peps",
};

export const revalidate = 60;

export default async function Home() {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["orderbook"],
      queryFn: () => fetchOrderBook(),
      retry: 1,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main className="flex min-h-screen items-center justify-center p-24">
          <OrderbookAndCharts />
        </main>
      </HydrationBoundary>
    );
  } catch (error) {
    redirect("/");
  }
}

