import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className='h-screen flex justify-center items-center bg-gray-200'>
      <ChatWindow socketUrl={`ws://${process.env.NEXT_PUBLIC_WS_URL}`} />
    </div>
  );
}
