import ChatRoom from "@/components/chat/ChatRoom";

export default async function TeamChatPage({
    params,
}: {
    params: Promise<{ teamName: string }>;
}) {
    const { teamName } = await params;
    return <ChatRoom type="TEAM" roomName={decodeURIComponent(teamName)} />;
}
