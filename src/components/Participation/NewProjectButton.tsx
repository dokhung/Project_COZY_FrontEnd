'use client'

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function NewProjectButton(){
    const router = useRouter();

    return(
        <Button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
                setTimeout(() => router.push('/createproject'), 500);
            }}
        >
            새 프로젝트 생성
        </Button>
    )
}