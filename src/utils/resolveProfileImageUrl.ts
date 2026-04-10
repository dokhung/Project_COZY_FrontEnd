const API_BASE =
    (
        process.env.NEXT_PUBLIC_API_BASE ||
        process.env.NEXT_PUBLIC_API_BASE_LOCAL ||
        "http://13.114.84.210:18000"
    ).replace(/\/+$/, "");

export const resolveProfileImageUrl = (image?: string | null) => {
    if (!image) return null;
    let normalized = image.trim();
    if (normalized.startsWith("uploads/profile_images") && !normalized.startsWith("uploads/profile_images/")) {
        normalized = normalized.replace("uploads/profile_images", "uploads/profile_images/");
    }
    if (normalized.startsWith("profile_images") && !normalized.startsWith("profile_images/")) {
        normalized = normalized.replace("profile_images", "profile_images/");
    }
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (normalized.startsWith("/")) return `${API_BASE}${normalized}`;
    if (normalized.startsWith("profile_images/")) return `${API_BASE}/${normalized}`;
    if (normalized.startsWith("uploads/")) return `${API_BASE}/${normalized}`;
    return `${API_BASE}/uploads/${normalized}`;
};
