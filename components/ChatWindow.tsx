'use client'
import {useEffect, useRef, useState} from "react";
import {useFetchHistory} from "@/hooks/useFetchHistory";
import ChatHistory from "@/components/ChatHistory";
import useWebSocket from "@/hooks/useWebSocket"

const sessionId = typeof window !== 'undefined' && localStorage.getItem("sessionId");
const generateSessionId = () => {
    return 'user-' + Math.random().toString(36).slice(2, 11);
}
const ChatWindow: React.FC<{ socketUrl: string }> = ({ socketUrl }) => {
    const [input, setInput] = useState<Readonly<string>>('')
    const {messages, loading, error, sendMessage, retryConnection } = useWebSocket(socketUrl);
    const {chatHistory: {history}, error: fetchError, isLoading} = useFetchHistory(sessionId ? sessionId : null);
    const userMessage = useRef('');

    const combinedMessage = [
        ...(history || []),
        ...(userMessage.current ? [{ message: userMessage.current, isAssistantMessage: false }] : []),
        ...(messages ? [{message: messages, isAssistantMessage: true}] : []),
    ];


    useEffect(() => {
        console.log('sessionId', typeof sessionId);
        if (!sessionId || sessionId === 'undefined') {
            console.log('in useEffect');
            const sessionId = generateSessionId();
            localStorage.setItem("sessionId", sessionId);
        }
    }, []);

    const handleSendMessage = () => {
       if (input.trim() && sessionId) {
           const message = input;
           sendMessage({sessionId, message});
           userMessage.current = message;
           setInput('');
       }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
       if (e.key === 'Enter' && input.trim()) {
           e.preventDefault();
           handleSendMessage();
       }
    };

    return (
        <div className='w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg p-4'>
            <ChatHistory history={history} isLoading={isLoading} combinedMessage={combinedMessage} />
            <div className='mt-4 flex items-center space-x-2'>
                <input
                    type='text'
                    value={input}
                    className='w-full p-2 border border-gray-200 rounded-md'
                    placeholder='Type your message...'
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSendMessage}
                    className='p-2 bg-blue-500 text-white rounded-md'
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    )
}
export default ChatWindow