'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useUserStore} from '@/store/userStore';

export default function DescriptionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectName = searchParams.get('projectName');
    const devInterest = searchParams.get('devInterest');
    const { user } = useUserStore();

    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!projectName || !devInterest) router.replace('/createproject');
    }, [projectName, devInterest, router]);

    const handleNext = () => {
        if (!description.trim()) {
            setError('프로젝트 설명을 입력해 주세요.');
            return;
        }
        if (!user?.nickname) {
            setError('로그인이 필요합니다.');
            return;
        }
        router.push(
            `/createproject/github?projectName=${encodeURIComponent(projectName!)}&devInterest=${encodeURIComponent(devInterest!)}&description=${encodeURIComponent(description)}`
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</span>
                    <h1 className="text-2xl font-bold tracking-tight">프로젝트 설명</h1>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
            <span className="text-gray-500">Project:</span> <span className="font-medium text-gray-900">{projectName}</span>
          </span>
                    <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
            <span className="text-gray-500">Interest:</span> <span className="font-medium text-gray-900">{devInterest}</span>
          </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 ring-1 ring-blue-200">Step 3 of 4</span>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        프로젝트 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="h-72 w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="팀과 이해관계자가 빠르게 이해할 수 있도록, 프로젝트 목표/핵심 기능/대상 사용자 등을 간단히 적어주세요."
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); setError(''); }}
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => router.push(`/createproject/interest?projectName=${encodeURIComponent(projectName || '')}`)}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                        >
                            이전
                        </button>
                        <button
                            onClick={handleNext}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 active:scale-[0.99]"
                        >
                            다음
                        </button>
                    </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                    Tip: 한 문단으로 요약 → 핵심 기능 2~3줄 → 기대 효과 1줄 순으로 작성하면 읽기 좋아요.
                </p>
            </div>
        </div>
    );
}
