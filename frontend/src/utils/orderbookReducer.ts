import { aggregateData } from "./aggregateOrderbookData";
import { OrderbookState, OrderbookAction } from "@/types";

export function orderbookReducer(state: OrderbookState, action: OrderbookAction): OrderbookState {
    switch (action.type) {
        case 'SET_BIDS':
            return { ...state, bids: action.bids };
        case 'SET_ASKS':
            return { ...state, asks: action.asks };
        case 'SET_SALES':
            return { ...state, sales: action.sales };
        case 'UPDATE_DATA':
            const newData = [action.data];
            const updatedData = aggregateData([...state.bids, ...state.asks], newData);
            return { 
                bids: updatedData.bids, 
                asks: updatedData.asks,
                sales: [...state.sales, ...updatedData.sales]
            };
        default:
            return state;
    }
}