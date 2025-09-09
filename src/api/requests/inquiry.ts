import apiClient from "@/api/Axios";

export async function getInquiriesRequest() {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get("/api/inquiries/list", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function createInquiryRequest(
    type: string,
    title: string,
    content: string
) {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(
        "/api/inquiries/create",
        { type, title, content },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function updateInquiryRequest(
    id: number,
    payload: { title: string; content: string; status?: string }
) {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.put(`/api/inquiries/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function deleteInquiryRequest(id: number) {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.delete(`/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
