'use client'

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function NewProjectButton(){
    const router = useRouter();

    return(
        <Button
            className={"px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"}
            onClick={()=>
            {
                alert("개발중 입니다.");
                router.push("/");
            }}
        >
            새 프로젝트 생성
        </Button>
    )
}