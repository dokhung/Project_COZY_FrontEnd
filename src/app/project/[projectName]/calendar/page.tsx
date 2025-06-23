'use client';

import { useState } from 'react';

const weekDays = ['월', '화', '수', '목', '금'];

export default function CalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth()); // 0-indexed (0 = Jan)
    const [search, setSearch] = useState('');

    // 선택한 연도+월 기준으로 1일이 무슨 요일인지
    const firstDay = new Date(year, month, 1).getDay(); // 0=일~6=토
    const startIndex = (firstDay + 6) % 7; // 월요일=0 기준 맞추기

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(startIndex).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    // 5주 기준으로 행 구성
    const rows = Array.from({ length: Math.ceil(days.length / 5) }, (_, rowIdx) =>
        days.slice(rowIdx * 5, rowIdx * 5 + 5)
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* 상단: 검색 & 년/월 표시 */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-2 py-1 rounded"
                        placeholder="검색"
                    />
                    <button className="border px-4 py-1 rounded bg-white">검색</button>
                </div>

                <div>
                    <input
                        type="text"
                        value={`${year}년 ${month + 1}월`}
                        className="border px-3 py-1 text-center"
                        readOnly
                    />
                </div>
            </div>

            {/* 달력 테이블 */}
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
                        {week.map((day, j) => (
                            <td key={j} className="border h-20 align-top">
                                {day ?? ''}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
