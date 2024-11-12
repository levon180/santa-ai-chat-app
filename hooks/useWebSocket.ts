import {useCallback, useEffect, useState} from "react";

type WebSocketMessage = {sessionId: string, message: string};

interface UseWebSocketReturn {
    messages: string;
    loading: boolean;
    error: string | null;
    sendMessage: (message: WebSocketMessage) => void;
    retryConnection: () => void;
}

const useWebSocket = (url: string): UseWebSocketReturn => {
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const initializeSocket = useCallback(() => {
        console.log('url', url);
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Connected to WebSocket server.');
            setError(null);
        };

        ws.onmessage = (e: MessageEvent) => {
            console.log('Received message', e);
            if (typeof e.data === 'string' && e.data !== 'undefined') {
                setMessages((prevMessages) => prevMessages.concat(e.data));
            }
            setLoading(false);
        };

        ws.onerror = (error) => {
            console.log('Received error', error);
            setError('Error connecting to WebSocket server.');
            setLoading(false);
        };

        ws.onclose = () => {
            console.log('Closed websocket server.');
            setError('Connection closed');
        };

        setSocket(ws);
    }, [url]);

    useEffect(() => {
        if (!socket) {
            initializeSocket();
        }

        return () => {
           if (socket) {
               socket.close();
           }
        };
    }, [initializeSocket, socket]);

    const sendMessage = (message: WebSocketMessage) => {
        console.log('message', message);
        if (socket && socket.readyState === WebSocket.OPEN) {
            setLoading(true);
            socket.send(JSON.stringify(message));
        } else {
            setError('Unable to send a message!');
        }
    };

    const retryConnection = () => {
        setError(null);
        setLoading(false);
        initializeSocket();
    };

    return {
        messages,
        loading,
        error,
        sendMessage,
        retryConnection,
    };
};

export default useWebSocket;
