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


