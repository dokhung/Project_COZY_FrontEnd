'use client';

const columns = ['시작 전', '진행 중', '검토 중', '승인 중', '머지 신청', '머지 완료'];

export default function ProjectDashBoard() {
    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="mb-8 text-2xl font-bold text-blue-900">대쉬보드</h1>

            <div className="grid grid-cols-3 gap-6">
                {columns.map((title) => (
                    <div key={title} className="flex flex-col gap-2 rounded-xl bg-gray-100">
                        {/* TODO : 상단 제목 */}
                        <div className="bg-white border border-gray-400 py-2 text-center font-semibold text-sm">
                            {title}
                        </div>

                        {/* TODO : 하단 내용*/}
                        <div className="bg-white border border-gray-300 h-36 flex items-center justify-center text-sm text-gray-500">
                            없음
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
