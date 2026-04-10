"use client";
import { useTranslation } from "react-i18next";

type Help = {
    id: number;
    type: string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
    writer?: string;
};

interface Props {
    data: Help[];
    loading: boolean;
    username: string;
    onSelect: (help: Help) => void;
    selectable?: boolean;
    selectedIds?: number[];
    onToggleSelect?: (id: number) => void;
    onToggleAll?: (checked: boolean) => void;
    preferWriter?: boolean;
}

export default function HelpTable({
                                      data,
                                      loading,
                                      username,
                                      onSelect,
                                      selectable = false,
                                      selectedIds = [],
                                      onToggleSelect,
                                      onToggleAll,
                                      preferWriter = false,
                                  }: Props) {
    const { t } = useTranslation();
    const isWaitStatus = (status: string) =>
        status === "WAIT" || status === "처리대기" || status === "PENDING";

    if (loading) {
        return (
            <div className="theme-card rounded-2xl py-20 text-center text-sm text-white/70">
                {t("common.loading")}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="theme-card rounded-2xl py-20 text-center text-sm text-white/70">
                {t("help.empty")}
            </div>
        );
    }

    const allSelected =
        selectable && data.length > 0 && data.every((item) => selectedIds.includes(item.id));

    return (
        <div className="theme-card overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-sm text-white/80">
                <thead className="border-b border-white/20 bg-white/10 text-white/70">
            <tr>
                {selectable && (
                    <th className="p-3 text-center">
                        <input
                            type="checkbox"
                            aria-label="select all"
                            checked={allSelected}
                            onChange={(e) => onToggleAll?.(e.target.checked)}
                            className="h-4 w-4 accent-white"
                        />
                    </th>
                )}
                <th className="p-3 text-center">{t("help.type")}</th>
                <th className="p-3 text-center">{t("help.status")}</th>
                <th className="p-3 text-center">{t("help.title")}</th>
                <th className="p-3 text-center">{t("help.author")}</th>
                <th className="p-3 text-center">{t("help.createdAt")}</th>
            </tr>
            </thead>
            <tbody>
            {data.map((help) => (
                <tr key={help.id} className="border-b border-white/10 transition hover:bg-white/10">
                    {selectable && (
                        <td className="p-3 text-center">
                            <input
                                type="checkbox"
                                aria-label={`select ${help.id}`}
                                checked={selectedIds.includes(help.id)}
                                onChange={() => onToggleSelect?.(help.id)}
                                className="h-4 w-4 accent-white"
                            />
                        </td>
                    )}
                    <td className="p-3 text-center">
                        {t(`help.${help.type}`)}
                    </td>
                    <td className="p-3 text-center">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isWaitStatus(help.status)
                                    ? "theme-chip-wait"
                                    : "theme-chip-done"
                            }`}
                        >
                            {isWaitStatus(help.status)
                                ? t("help.status_wait")
                                : t("help.status_done")}
                        </span>
                    </td>
                    <td
                        className="cursor-pointer p-3 text-center text-white hover:underline"
                        onClick={() => onSelect(help)}
                    >
                        {help.title}
                    </td>
                    <td className="p-3 text-center">
                        {preferWriter ? help.writer ?? username : username}
                    </td>
                    <td className="p-3 text-center">
                        {new Date(help.createdAt).toISOString().slice(0, 10)}
                    </td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        </div>
    );
}
