import ChatRoom from "@/components/chat/ChatRoom";

export default async function ProjectChatPage({
    params,
}: {
    params: Promise<{ projectName: string }>;
}) {
    const { projectName } = await params;
    return <ChatRoom type="PROJECT" roomName={decodeURIComponent(projectName)} />;
}
