import { useState, useEffect, useRef } from 'react';

/**
 * A custom React hook for managing a WebSocket connection to receive messages.
 * 
 * @returns An object with the WebSocket state, the last data received, and error status.
 */
export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WSS_URL! + '/api/updates');

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            setData(JSON.parse(event.data));
        };

        ws.current.onerror = (event: Event) => {
            console.error('WebSocket error:', event);
            if (event instanceof ErrorEvent) {
                setError(new Error(event.message));
            } else {
                setError(new Error('Unknown error occurred in WebSocket.'));
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            ws.current = null;
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return {
        isConnected,
        data,
        error,
    };
}
