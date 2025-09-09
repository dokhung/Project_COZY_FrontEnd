'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRecruitListRequest } from '@/api/requests/recruit';
import RecruitCreateDialog from '@/components/recruit/RecruitCreateDialog';
import RecruitDetailDialog, { RecruitItem } from '@/components/recruit/RecruitDetailDialog';

export default function RecruitList() {
    const [recruits, setRecruits] = useState<RecruitItem[]>([]);
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [selected, setSelected] = useState<RecruitItem | null>(null);

    type ApiRecruit = any;

    const normalize = (d: ApiRecruit) => ({
        id: d.id ?? d.recruitId,
        title: d.title ?? '',
        nickName: d.nickName ?? d.nickname ?? '',
        content: d.content ?? d.recruitText ?? '',
        createdAt: d.createdAt ?? d.createdDate ?? '',
    });

    const load = async () => {
        const data = await getRecruitListRequest();
        const normalized = (data ?? []).map(normalize);
        setRecruits(normalized);
    };

    useEffect(() => { load(); }, []);

    const formatDate = (s: string) => s?.split('T')[0] ?? '';

    const filtered = recruits.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.nickName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">계획&nbsp;&nbsp;{recruits.length}</div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 h-10"
                    />
                    <Button className="h-10 w-20">Search</Button>
                    <Button
                        className="h-10 w-24 bg-blue-600 text-white"
                        onClick={() => setShowCreate(true)}
                    >
                        Create Recruit
                    </Button>
                </div>
            </div>

            <table className="w-full border-t border-b text-center text-sm">
                <thead className="bg-white border-b">
                <tr className="text-gray-600">
                    <th className="py-2">No</th>
                    <th className="py-2 text-left pl-6">Title</th>
                    <th className="py-2">UserName</th>
                    <th className="py-2">CreateDay</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((row, index) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 border-b cursor-pointer"
                        onClick={() => setSelected(row)}
                    >
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2 text-left pl-6">
                            <Link
                                href={`/recruit/${row.id}`}
                                className="hover:underline text-black"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {row.title}
                            </Link>
                        </td>
                        <td className="py-2">{row.nickName}</td>
                        <td className="py-2">{formatDate(row.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showCreate && (
                <RecruitCreateDialog
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => {
                        setShowCreate(false);
                        load();
                    }}
                />
            )}

            <RecruitDetailDialog
                recruit={selected}
                onClose={() => setSelected(null)}
                onDeleted={(id) => {
                    setSelected(null);
                    setRecruits((prev) => prev.filter((x) => x.id !== id));
                }}
                onUpdated={(updated) => {
                    setRecruits((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
                    setSelected(updated);
                }}
            />
        </div>
    );
}
