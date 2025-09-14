// app/createproject/github/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createProjectSaveRequest } from '@/api/requests/project';
import { useUserStore } from '@/store/userStore';
import ConfirmProjectDialog from '@/components/CreateProject/ConfirmProjectDialog';

const GH_REGEX = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export default function GithubPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUserStore();

    const projectName  = useMemo(() => searchParams.get('projectName')  || '', [searchParams]);
    const devInterest  = useMemo(() => searchParams.get('devInterest')  || '', [searchParams]); // ✅ 변경
    const description  = useMemo(() => searchParams.get('description')  || '', [searchParams]);

    const [githubUrl, setGithubUrl] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        if (!projectName || !devInterest || !description) { // ✅ 변경
            router.replace('/createproject');
        }
    }, [projectName, devInterest, description, router]);   // ✅ 변경

    const doCreate = async (finalUrl: string | null) => {
        try {
            if (!user?.nickname) {
                setError('로그인이 필요합니다.');
                return;
            }
            setSubmitting(true);
            await createProjectSaveRequest({
                projectName,
                devInterest,                 // ✅ 정의된 값 전달
                description,
                leaderName: user.nickname,
                gitHubUrl: finalUrl,
            });
            router.push(`/project/${encodeURIComponent(projectName)}`);
        } catch (e) {
            console.error(e);
            setError('CreateProjectSaveRequest Error');
            alert('CreateProjectSaveRequest Error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        if (githubUrl && !GH_REGEX.test(githubUrl)) {
            setError('유효한 GitHub 저장소 URL을 입력하세요. 예) https://github.com/user/repo');
            return;
        }
        setError('');
        setOpenConfirm(true);
    };

    const handleSkip = () => {
        setError('');
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        await doCreate(githubUrl || null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                {/* 스텝 헤더 */}
                <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">4</span>
                    <h1 className="text-2xl font-bold tracking-tight">GitHub URL (선택)</h1>
                </div>

                {/* 요약 배지 */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
            <span className="text-gray-500">Project:</span>{' '}
              <span className="font-medium text-gray-900">{projectName}</span>
          </span>
                    <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
            <span className="text-gray-500">DevInterest:</span>{' '}
                        <span className="font-medium text-gray-900">{devInterest}</span> {/* ✅ 변경 */}
          </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 ring-1 ring-blue-200">Step 4 of 4</span>
                </div>

                {/* 카드 */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        저장소 URL
                        <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 ring-1 ring-gray-200">선택</span>
                    </label>

                    <input
                        className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="https://github.com/owner/repository"
                        value={githubUrl}
                        onChange={(e) => { setGithubUrl(e.target.value.trim()); setError(''); }}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        * 개인/조직 저장소의 메인 URL을 입력하세요. 브랜치/이슈/PR 링크는 권장하지 않습니다.
                    </p>

                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                    {/* 푸터 버튼 */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                            onClick={() =>
                                router.push(
                                    `/createproject/description?projectName=${encodeURIComponent(projectName)}&devInterest=${encodeURIComponent(devInterest)}&description=${encodeURIComponent(description)}`
                                ) // ✅ devInterest로 변경
                            }
                            disabled={submitting}
                        >
                            이전
                        </button>

                        <div className="flex gap-2">
                            <button
                                className="rounded-lg bg-stone-500 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-600 disabled:opacity-50"
                                onClick={handleSkip}
                                disabled={submitting}
                            >
                                건너뛰기
                            </button>
                            <button
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
                                onClick={handleNext}
                                disabled={submitting}
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </div>

                {/* 도움말 */}
                <p className="mt-4 text-xs text-gray-500">
                    저장소가 아직 없다면 나중에 프로젝트 설정에서 추가할 수 있어요.
                </p>
            </div>

            {/* 최종 확인 다이얼로그 */}
            <ConfirmProjectDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirm}
                loading={submitting}
                data={{
                    projectName,
                    devInterest,              // ✅ 전달 키 변경
                    description,
                    leaderName: user?.nickname || '',
                    gitHubUrl: githubUrl || '(none)',
                }}
            />
        </div>
    );
}
