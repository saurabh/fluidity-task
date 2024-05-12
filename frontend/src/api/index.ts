export interface OrderbookItem {
    side: 'bid' | 'ask';
    price: number;
    amount: number;
}

export const fetchOrderBook = async (): Promise<OrderbookItem[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orderbook`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error("Failed to fetch order book:", error);
        throw error;
    }
}