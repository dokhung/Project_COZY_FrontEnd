'use client';
import { useEffect, useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
    data: {
        projectName: string;
        devInterest: string;
        description: string;
        leaderName: string;
        gitHubUrl?: string | null;
    };
}


const GH_REGEX =
    /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export default function ConfirmProjectDialog({ open, onClose, onConfirm, loading, data }: Props) {
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) setAgree(false);
    }, [open]);

    if (!open) return null;


    const hasProjectName = !!data.projectName?.trim();
    const hasInterest    = !!data.devInterest?.trim();
    const hasLeader      = !!data.leaderName?.trim();
    const hasDesc        = !!data.description?.trim();
    const githubValid    = !((data.gitHubUrl ?? '').trim()) || GH_REGEX.test((data.gitHubUrl ?? '').trim());

    const allValid   = hasProjectName && hasInterest && hasLeader && hasDesc && githubValid;
    const canConfirm = allValid && agree && !loading;

    const Check = ({ ok }: { ok: boolean }) => (
        <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                ok ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-red-100 text-red-700 ring-1 ring-red-200'
            }`}
            aria-hidden
        >
      {ok ? '✓' : '!'}
    </span>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200"
            >
                <div className="mb-5 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">✓</span>
                    <h2 className="text-xl font-bold tracking-tight">프로젝트 생성 내용 확인</h2>
                    <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
            Review & Confirm
          </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">Project Name</p>
                        <p className="mt-1 font-semibold text-gray-900 break-words">{data.projectName}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-gray-500">Interest</p>
                        <p className="font-semibold">{data.devInterest}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">Leader Nickname</p>
                        <p className="mt-1 font-semibold text-gray-900 break-words">{data.leaderName}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3 sm:col-span-2">
                        <p className="text-xs text-gray-500">Description</p>
                        <div className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap text-gray-900">
                            {data.description}
                        </div>
                    </div>

                    {/* GitHub (옵션) */}
                    {typeof data.gitHubUrl !== 'undefined' && (
                        <div className="rounded-xl border border-gray-200 p-3 sm:col-span-2">
                            <p className="text-xs text-gray-500">GitHub</p>
                            <p className="mt-1 font-semibold text-gray-900 break-words">
                                {data.gitHubUrl && data.gitHubUrl.trim() !== '' ? data.gitHubUrl : '(none)'}
                            </p>
                            {!githubValid && (
                                <p className="mt-2 text-xs text-red-600">
                                    유효한 GitHub 저장소 URL이 아닙니다. 예) https://github.com/user/repo
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* ✅ 체크리스트 */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                    <p className="mb-3 text-sm font-semibold text-gray-800">검증 체크리스트</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Check ok={hasProjectName} />
                            <span>프로젝트 이름이 입력되었습니다.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check ok={hasInterest} />
                            <span>작업 타입(Interest)이 선택되었습니다.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check ok={hasLeader} />
                            <span>리더 닉네임이 확인되었습니다.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check ok={hasDesc} />
                            <span>프로젝트 설명이 입력되었습니다.</span>
                        </li>
                        {typeof data.gitHubUrl !== 'undefined' && (
                            <li className="flex items-center gap-2">
                                <Check ok={githubValid} />
                                <span>GitHub URL {data.gitHubUrl ? '형식이 올바릅니다.' : '(선택 항목) 비워도 됩니다.'}</span>
                            </li>
                        )}
                    </ul>

                    {/* 최종 동의 */}
                    <label className="mt-4 flex cursor-pointer select-none items-center gap-2 text-sm text-gray-800">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        위 내용을 모두 확인했고, 이 정보로 프로젝트를 생성합니다.
                    </label>
                </div>

                {/* 푸터 버튼 */}
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        수정하기
                    </button>
                    <button
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow ${
                            canConfirm ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                                : 'bg-blue-400 opacity-60'
                        }`}
                        onClick={onConfirm}
                        disabled={!canConfirm}
                    >
                        {loading ? '생성 중...' : '확인 후 생성'}
                    </button>
                </div>
            </div>
        </div>
    );
}
