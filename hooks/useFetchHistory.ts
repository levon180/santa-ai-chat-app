import useSWR from "swr";
const fetcher = async (sessionId: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}api/chat/history/${sessionId}`).then(res => res.json())
}

export const useFetchHistory = (sessionId: string | null) => {
    const { data, error, isLoading } = useSWR(sessionId ? sessionId : null, fetcher)

    return {
        chatHistory: data || [],
        isLoading,
        error,
    }
}