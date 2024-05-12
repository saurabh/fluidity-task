import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import Orderbook from "./orderbook/orderbook";
import { fetchOrderBook } from '@/api';
// import { DepthChart } from "./depthChart";

export const metadata: Metadata = {
  title: "Fluid Dex",
  description: "for the fluid peps",
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
          <Orderbook />
          {/* <DepthChart /> */}
        </main>
      </HydrationBoundary>
    );
  } catch (error) {
    redirect("/");
  }
}

