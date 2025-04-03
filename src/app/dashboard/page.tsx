'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getMyProjectInfoRequest } from '@/api/auth';
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoggedIn } = useUserStore();
    const [project, setProject] = useState<{ projectName: string; interest: string; createdAt: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            const fetchProject = async () => {
                const data = await getMyProjectInfoRequest();
                if (data && data.projectName) {
                    setProject(data);
                }
                setLoading(false);
            };
            fetchProject();
        }
    }, [isLoggedIn, router]);

    if (loading) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 space-y-8">

            <h1 className="text-4xl font-bold">🌟 Dashboard</h1>
            <p className="text-gray-500">환영합니다, {user?.nickname || '사용자'}님</p>

            {project ? (
                <div className="w-full max-w-4xl space-y-6">

                    {/* 프로젝트 카드 */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h2 className="text-2xl font-semibold text-purple-600">{project.projectName}</h2>
                        <p className="text-sm text-gray-400">📅 생성일: {project.createdAt}</p>
                        <p className="text-sm text-gray-400">🎯 관심사: {project.interest}</p>
                        <div className="flex space-x-3 pt-2">
                            <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => router.push('/project')}>
                                프로젝트로 이동
                            </Button>
                            <Button className="flex-1 bg-gray-300 hover:bg-gray-400 text-black" disabled>
                                설정 (준비중)
                            </Button>
                        </div>
                    </section>

                    {/* 활동 로그 */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h3 className="text-xl font-semibold">🗂 최근 활동 로그</h3>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>✅ [3분 전] 프로젝트 생성 완료</li>
                            <li>✅ [5시간 전] 회원가입 완료</li>
                            <li>✅ [1일 전] 닉네임 설정 완료</li>
                            <li className="text-gray-400">(* 향후 백엔드에서 진짜 로그 불러오면 교체 예정)</li>
                        </ul>
                    </section>

                    {/* 공지사항 */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h3 className="text-xl font-semibold">📢 공지사항</h3>
                        <p className="text-sm text-gray-500">⏰ 다음 주부터 팀 기능 오픈 예정입니다.</p>
                        <p className="text-sm text-gray-500">🚀 Beta 버전 서비스 중. 피드백 환영!</p>
                    </section>

                    {/* 추천 작업 */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-2">
                        <h3 className="text-xl font-semibold">🔔 추천 작업</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li>프로필 사진 등록</li>
                            <li>팀원 초대 (준비중)</li>
                            <li>할 일 목록 만들기 (준비중)</li>
                        </ul>
                    </section>

                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg p-6 shadow text-center space-y-2">
                        <p className="text-gray-700 font-medium">아직 참여 중인 프로젝트가 없습니다.</p>
                        <p className="text-sm text-gray-500">새로운 프로젝트를 만들어 시작해보세요!</p>
                        <Button
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                            onClick={() => router.push('/createproject')}
                        >
                            ➕ 새 프로젝트 생성
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
