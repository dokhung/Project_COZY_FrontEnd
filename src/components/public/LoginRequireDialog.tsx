"use client";

import React from "react";

interface Props {
    onClose: () => void;
}

export default function LoginRequiredDialog({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-full max-w-xs text-center shadow-lg">
                <h2 className="text-lg font-semibold mb-3">로그인이 필요합니다</h2>
                <p className="text-sm text-gray-600 mb-6">
                    이 기능은 로그인 후 이용하실 수 있습니다.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    확인
                </button>
            </div>
        </div>
    );
}
