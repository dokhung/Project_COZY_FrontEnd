import { useState } from 'react';
import {verifyPasswordRequest} from "@/api/requests/login";

export default function VerifyPassword({ onVerify }: { onVerify: () => void }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleVerifyPassword = async () => {
        try {
            const result = await verifyPasswordRequest(password);
            if (result.valid) {
                onVerify();
            } else {
                setError('⚠비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setError('❌ 비밀번호 확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">보안 확인</h2>
            <p className="text-gray-600 mb-4">내 정보를 확인하려면 비밀번호를 입력하세요.</p>

            <input
                type="password"
                placeholder="비밀번호 입력"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
                className="w-full bg-black text-white p-2 mt-4 rounded-md"
                onClick={handleVerifyPassword}
            >
                확인
            </button>
        </div>
    );
}
