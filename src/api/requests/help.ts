import apiClient from "@/api/Axios";

export async function getHelpRequest() {
    const res = await apiClient.get("/api/help/list", { timeout: 5000 });
    return res.data;
}

export async function createHelpRequest(
    type: string,
    title: string,
    content: string
) {
    const res = await apiClient.post(
        "/api/help/create",
        { type, title, content },
    );
    return res.data;
}

export async function updateHelpRequest(
    id: number,
    updateHelpContent: { title?: string; content?: string; status?: string; answer?: string }
) {
    const res = await apiClient.put(`/api/help/${id}`, updateHelpContent);
    return res.data;
}

export async function deleteHelpRequest(id: number) {
    const res = await apiClient.delete(`/api/help/${id}`,);
    return res.data;
}
