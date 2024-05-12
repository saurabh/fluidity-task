import React, { useRef, useEffect } from 'react';
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";

interface OrderbookItem {
    price: number;
    amount: number;
}

interface OrderbookTableProps {
    dataType?: 'bid' | 'ask';
    data: OrderbookItem[];
}

const OrderbookTable: React.FC<OrderbookTableProps> = ({ dataType = 'ask', data }) => {
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dataType === 'ask' && tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    }, [dataType, data]);

    const rowBgColor = dataType === 'ask' ? 'bg-red-50' : 'bg-green-50';
    const textColor = dataType === 'ask' ? 'text-red-600' : 'text-green-600';

    return (
        <div ref={tableRef} className="h-96 overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200">
                <TableBody>
                    {data.map((d, index) => (
                        <TableRow key={index} className={`flex ${rowBgColor}`}>
                            <TableCell className={`flex-1 px-6 py-4 text-sm font-medium ${textColor}`}>{d.price.toFixed(2)}</TableCell>
                            <TableCell className="flex-1 px-6 py-4 text-sm text-gray-500">{d.amount.toFixed(2)}</TableCell>
                            <TableCell className="flex-1 px-6 py-4 text-sm text-gray-500">{(d.price * d.amount).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderbookTable;