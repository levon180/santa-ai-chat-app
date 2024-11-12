import React from "react";

interface Message {
    message: string;
    isAssistantMessage: boolean;
}

interface ChatHistoryProps {
    isLoading: boolean;
    history: [];
    message: string;
    combinedMessage: Message[]
}

const ChatHistory:React.FC<ChatHistoryProps> = ({isLoading, history, message, combinedMessage}) => {


    return (
        <div className="flex flex-col h-96 overflow-y-auto p-4 bg-gray-100 rounded-md">
            {isLoading || history === undefined ? (
                <p>Loading...</p>
            ) : history.length === 0 && !message ? (
                <p>Start chatting with Santa</p>
            ) : combinedMessage.map(({isAssistantMessage, message}, index) => (
                <div key={index} className={`flex ${isAssistantMessage ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-lg ${isAssistantMessage ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}>
                        {message}
                    </div>
                </div>
            ))}
        </div>

    )
}
export default ChatHistory;