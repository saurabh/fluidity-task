import { OrderbookItem } from '@/api';

interface OrderbookItems extends OrderbookItem {
    total: number;
}

interface OrderbookCollection {
    [price: number]: OrderbookItems;
}

interface AggregatedOrderbook {
    bids: OrderbookItems[];
    asks: OrderbookItems[];
}

export function aggregateData(data: OrderbookItem[]): AggregatedOrderbook {
    const bids: OrderbookCollection = {};
    const asks: OrderbookCollection = {};

    data.forEach(item => {
        const collection = item.side === 'bid' ? bids : asks;
        if (collection[item.price]) {
            collection[item.price].amount += item.amount;
            collection[item.price].total = (collection[item.price].total || 0) + item.price * item.amount;
        } else {
            collection[item.price] = {
                price: item.price,
                amount: item.amount,
                total: item.price * item.amount,
                side: item.side
            };
        }
    });

    return {
        bids: Object.values(bids).sort((a, b) => b.price - a.price),
        asks: Object.values(asks).sort((a, b) => a.price - b.price)
    };
}