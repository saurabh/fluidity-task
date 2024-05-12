"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useOrderbook } from "@/hooks/useOrderbook";
import { useWebSocket } from '@/hooks/useWebsocket';
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import OrderbookTable from "./orderbook-table";
import { aggregateData } from "@/utils/aggregateOrderbookData";

export interface OrderbookItem {
    side: "bid" | "ask";
    price: number;
    amount: number;
    total?: number;
}

export interface OrderbookState {
    bids: OrderbookItem[];
    asks: OrderbookItem[];
}

export type OrderbookAction =
    | { type: 'SET_BIDS', bids: OrderbookItem[] }
    | { type: 'SET_ASKS', asks: OrderbookItem[] }
    | { type: 'UPDATE_DATA', data: OrderbookItem };

export function orderbookReducer(state: OrderbookState, action: OrderbookAction): OrderbookState {
    switch (action.type) {
        case 'SET_BIDS':
            return { ...state, bids: action.bids };
        case 'SET_ASKS':
            return { ...state, asks: action.asks };
        case 'UPDATE_DATA':
            const newData = [action.data];
            const updatedData = aggregateData([...state.bids, ...state.asks, ...newData]);
            return { bids: updatedData.bids, asks: updatedData.asks };
        default:
            return state;
    }
}

export default function Orderbook() {
    const { data: orderbookData, isLoading, isRefetching } = useOrderbook();
    const { data: wsData } = useWebSocket();
    const [state, dispatch] = useReducer(orderbookReducer, { bids: [], asks: [] });

    useEffect(() => {
        if (wsData) {
            console.log('wsData', wsData)
            dispatch({ type: 'UPDATE_DATA', data: wsData });
        }
    }, [wsData]);

    useEffect(() => {
        if (orderbookData) {
            const { bids, asks } = aggregateData(orderbookData);
            dispatch({ type: 'SET_BIDS', bids: bids });
            dispatch({ type: 'SET_ASKS', asks: asks });
        }
    }, [orderbookData]);

    if (isLoading || isRefetching) {
        return "Loading..."
    }

    return (
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
    );
}