import React, { useRef, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { OrderbookTableProps } from '@/types';

const OrderbookTable: React.FC<OrderbookTableProps> = ({ dataType = 'ask', data }) => {
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dataType !== 'bid' && tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    }, [dataType, data]);

    return (
        <div ref={tableRef} className={`h-96 overflow-x-auto`}>
            <Table className="min-w-[350px] divide-y divide-gray-200">
                <TableBody>
                    {data.map((d, index) => (
                        <TableRow key={index} className={`flex ${d.side === 'ask' ? 'bg-red-50' : 'bg-green-50'} `}>
                            <TableCell className={`flex-1 px-6 py-4 text-left text-sm font-medium ${d.side === 'ask' ? 'text-red-600' : 'text-green-600'}`}>{d.price.toFixed(2)}</TableCell>
                            <TableCell className="flex-1 px-6 py-4 text-left text-sm text-gray-500">{d.amount.toFixed(2)}</TableCell>
                            <TableCell className="flex-1 px-6 py-4 text-right text-sm text-gray-500">{(d.price * d.amount).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderbookTable;