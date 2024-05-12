export interface OrderbookItem {
    side: "bid" | "ask";
    price: number;
    amount: number;
    total?: number;
}

export interface Sale {
    side: "bid" | "ask";
    price: number;
    amount: number;
    timestamp?: number;
}

export interface OrderbookState {
    bids: OrderbookItem[];
    asks: OrderbookItem[];
    sales: Sale[];
}

export type OrderbookAction =
    | { type: 'SET_BIDS', bids: OrderbookItem[] }
    | { type: 'SET_ASKS', asks: OrderbookItem[] }
    | { type: 'SET_SALES', sales: Sale[] }
    | { type: 'UPDATE_DATA', data: OrderbookItem };

// orderbook table

export interface OrderbookItem {
    price: number;
    amount: number;
    side: 'bid' | 'ask';
}

export interface OrderbookTableProps {
    dataType?: 'bid' | 'ask' | 'sale';
    data: OrderbookItem[];
}
    