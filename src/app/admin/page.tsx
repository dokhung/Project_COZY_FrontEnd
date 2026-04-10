import AdminPageClient from "./AdminPageClient";
import AdminGuard from "./AdminGuard";

export default function AdminPage() {
    return (
        <AdminGuard>
            <AdminPageClient />
        </AdminGuard>
    );
}
