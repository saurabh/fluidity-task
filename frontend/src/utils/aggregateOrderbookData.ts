import { ApiResponse } from '@/api';

interface OrderbookCollection {
    [price: number]: ApiResponse;
}

interface NewDataInfo {
    price: number;
    amount: number;
    oldAmount: number;
    side: 'bid' | 'ask';
}

interface AggregatedOrderbook {
    bids: ApiResponse[];
    asks: ApiResponse[];
    sales: Sale[];
    newDataDetails: NewDataInfo[];
}


export interface Sale {
    side: "bid" | "ask";
    price: number;
    amount: number;
    timestamp: number;
}

export function aggregateData(data: ApiResponse[], newData: ApiResponse[] = []): AggregatedOrderbook {
    const bids: OrderbookCollection = {};
    const asks: OrderbookCollection = {};
    const sales: Sale[] = [];
    const newDataDetails: NewDataInfo[] = [];

    data.forEach(item => {
        const collection = item.side === 'bid' ? bids : asks;
        if (collection[item.price]) {
            collection[item.price].amount += item.amount;
        } else {
            collection[item.price] = {
                price: item.price,
                amount: item.amount,
                side: item.side
            };
        }
    });

    if (newData.length > 0) {
        const collection = newData[0].side === 'bid' ? bids : asks;
        let oldAmount = 0;
        if (collection[newData[0].price]) {
            oldAmount = collection[newData[0].price].amount;
            console.log('price exists', oldAmount, newData[0].amount)
            collection[newData[0].price].amount += newData[0].amount;
        } else {
            collection[newData[0].price] = {
                price: newData[0].price,
                amount: newData[0].amount,
                side: newData[0].side
            };
            console.log('price does not exist', collection[newData[0].price])
        }

        newDataDetails.push({
            price: newData[0].price,
            amount: newData[0].amount,
            oldAmount: oldAmount,
            side: newData[0].side
        });
    }

    let bidArray = Object.values(bids).sort((a, b) => b.price - a.price);
    let askArray = Object.values(asks).sort((a, b) => a.price - b.price);

    let i = 0;
    let j = 0;
    
    while (newData[0] && i < bidArray.length && j < askArray.length) {
        const bid = bidArray[i];
        const ask = askArray[j];
        const saleSide = newData[0].price === ask.price ? 'ask' : 'bid';
    
        if (bid.price >= ask.price) {
            const fulfilledAmount = Math.min(bid.amount, ask.amount);
            sales.push({
                price: ask.price,
                amount: fulfilledAmount,
                side: saleSide,
                timestamp: Date.now()
            });
    
            bidArray[i].amount -= fulfilledAmount;
            askArray[j].amount -= fulfilledAmount;
    
            if (bidArray[i].amount === 0) {
                i++;
            }
            if (askArray[j].amount === 0) {
                j++;
            }
        } else {
            break; 
        }
    }
    
    // Filter out zero-amount bids and asks after processing
    bidArray = bidArray.filter(bid => bid.amount > 0);
    askArray = askArray.filter(ask => ask.amount > 0);
    
    console.log('Post-matching bid array:', bidArray.length)
    console.log('Post-matching ask array:', askArray.length);
    console.log('newdata', newData[0])
    console.log('Sales executed:', sales);
    
    console.log('newDataDetails', newDataDetails)
    console.log('-------------------------------------------------')
    return {
        bids: bidArray,
        asks: askArray,
        sales,
        newDataDetails: newDataDetails
    };
}