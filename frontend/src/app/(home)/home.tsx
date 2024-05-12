"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useOrderbook } from "@/hooks/useOrderbook";
import { useWebSocket } from '@/hooks/useWebsocket';
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import OrderbookTable from "./orderbook-table";
import { aggregateData } from "@/utils/aggregateOrderbookData";
import { orderbookReducer } from "@/utils/orderbookReducer";
import { DepthChart } from "./d3-charts/depth-chart";
import { PriceChart } from "./d3-charts/price-chart";

export default function OrderbookAndCharts() {
    const { data: orderbookData, isLoading, isRefetching } = useOrderbook();
    const { data: wsData } = useWebSocket();
    const [state, dispatch] = useReducer(orderbookReducer, { bids: [], asks: [], sales: []});

    useEffect(() => {
        if (wsData) {
            console.log('wsData', wsData);
            dispatch({ type: 'UPDATE_DATA', data: wsData });
        }
    }, [wsData]);

    useEffect(() => {
        if (orderbookData) {
            const { bids, asks, sales } = aggregateData(orderbookData);
            dispatch({ type: 'SET_BIDS', bids: bids });
            dispatch({ type: 'SET_ASKS', asks: asks });
            dispatch({ type: 'SET_SALES', sales: sales });
        }
    }, [orderbookData]);

    if (isLoading || isRefetching) {
        return "Loading..."
    }

    return (
        <section className="flex space-x-12">
            <div className="overflow-x-auto">
                <Table className="min-w-[350px] divide-y divide-gray-200">
                    <TableHeader>
                        <TableRow className="flex">
                            <TableHead className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
                            <TableHead className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableHead>
                            <TableHead className="flex-1 px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <OrderbookTable data={state.asks} />
                <OrderbookTable dataType="bid" data={state.bids} />
            </div>
            <DepthChart data={[...state.asks, ...state.bids]} />
            <PriceChart data={state.sales} />
        </section>
    );
}