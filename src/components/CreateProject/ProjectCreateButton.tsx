'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProjectCreateButton() {
    const router = useRouter();

    return (
        <div className="flex justify-center">
            <Button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() =>
                    alert("개발중")
                    // router.push('/projects/create')
                    }
            >
                새 프로젝트 생성
            </Button>
        </div>
    );
}
