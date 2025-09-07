'use client';

import {useMemo, useState} from 'react';

export type Task = {
    id: number;
    title: string;
    nickName: string;
    status: string;
    createdAt: string;
    taskText: string;
};

type Props = {
    tasks: Task[];
    onRowClick: (taskId: number) => void;
    onAddClick: () => void;
    loading?: boolean;
};

const statusClass = (s: string) => {
    switch (s) {
        case '시작 전':   return 'bg-gray-100 text-gray-700';
        case '진행 중':   return 'bg-blue-100 text-blue-800';
        case '검토 중':   return 'bg-purple-100 text-purple-800';
        case '승인 중':   return 'bg-amber-100 text-amber-800';
        case '머지 신청': return 'bg-pink-100 text-pink-800';
        case '머지 완료': return 'bg-emerald-100 text-emerald-800';
        default:          return 'bg-gray-100 text-gray-700';
    }
};

export default function TaskTable({tasks, onRowClick, onAddClick, loading}: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const allChecked = selected.length > 0 && selected.length === tasks.length;

    const filtered = useMemo(
        () => tasks.filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.nickName ?? '').toLowerCase().includes(search.toLowerCase())
        ),
        [tasks, search]
    );

    const toggleAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(tasks.map(t => t.id));
    };

    const toggleOne = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <div className="w-full">
            {/* 헤더 라인 */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">Task List</h1>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                            className="h-10 w-72 rounded-md border border-gray-300 pl-8 pr-3 text-sm focus:border-gray-400 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={onAddClick}
                        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* 카드 테이블 */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="border-b text-left text-gray-500">
                            <th className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={toggleAll}
                                    aria-label="select all"
                                />
                            </th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-3 py-4" />
                        </tr>
                        </thead>

                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    불러오는 중…
                                </td>
                            </tr>
                        ) : tasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    현재 등록된 작업이 없습니다.
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                                    onClick={() => onRowClick(t.id)}
                                >
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(t.id)}
                                            onChange={() => toggleOne(t.id)}
                                            aria-label={`select task ${t.id}`}
                                        />
                                    </td>

                                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(t.status)}`}>
                        {t.status}
                      </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-900">{t.title}</td>
                                    <td className="px-6 py-4 text-gray-700">{t.nickName}</td>
                                    <td className="px-6 py-4 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>

                                    {/* 액션 자리(점3개 아이콘 자리) */}
                                    <td className="px-3 py-4">
                                        <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-400 grid place-items-center select-none">⋯</div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-xs text-gray-500">
                        총 {filtered.length}개
                    </div>
                </div>
            </div>
        </div>
    );
}
