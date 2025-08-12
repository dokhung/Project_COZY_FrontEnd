'use client';

import { useState, useEffect } from 'react';
import { getPostListRequest } from '@/api/requests/plan';

const weekDays = ['월', '화', '수', '목', '금'];

export default function CalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [search, setSearch] = useState('');

    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPostListRequest();
                console.log("받아온 posts:", data);
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const changeMonth = (offset: number) => {
        let newMonth = month + offset;
        let newYear = year;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        setMonth(newMonth);
        setYear(newYear);
    };

    const firstDay = new Date(year, month, 1).getDay();
    const startIndex = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = Array(startIndex >= 5 ? 5 : startIndex).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const rows = [];
    for (let i = 0; i < days.length; i += 5) {
        rows.push(days.slice(i, i + 5));
    }

    const formatDate = (d: number) => {
        const m = (month + 1).toString().padStart(2, '0');
        const day = d.toString().padStart(2, '0');
        return `${year}-${m}-${day}`;
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-2 py-1 rounded"
                        placeholder="제목 검색"
                    />
                    <button
                        className="border px-4 py-1 rounded bg-white"
                        onClick={() => setSearch('')}
                    >
                        초기화
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                        ◀
                    </button>
                    <div className="px-3 py-1 border rounded bg-white font-semibold">
                        {year}년 {month + 1}월
                    </div>
                    <button
                        onClick={() => changeMonth(1)}
                        className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-500">로딩 중...</div>
            ) : (
                <table className="w-full border border-black bg-gray-200 text-center">
                    <thead>
                    <tr>
                        {weekDays.map((day) => (
                            <th key={day} className="border p-2">{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((week, i) => (
                        <tr key={i}>
                            {week.map((day, j) => {
                                const dateStr = day ? formatDate(day) : null;
                                const dayPosts = dateStr
                                    ? posts
                                        .filter((post) => {
                                            if (!post.createdAt) return false;
                                            const datePart = post.createdAt.split('T')[0];
                                            return datePart === dateStr;
                                        })
                                        .filter((post) => post.title.includes(search))
                                    : [];

                                return (
                                    <td key={j} className="border h-24 align-top p-1 bg-white">
                                        <div className="text-sm font-semibold">{day ?? ''}</div>
                                        {dayPosts.map((post, idx) => (
                                            <div
                                                key={idx}
                                                className="mt-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded"
                                            >
                                                {post.title}
                                            </div>
                                        ))}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
