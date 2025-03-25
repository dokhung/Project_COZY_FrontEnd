'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProjectDropdownProps {
    projects: { id: number; name: string }[];
}

export default function ProjectDropdown({ projects }: ProjectDropdownProps) {
    const router = useRouter();

    return (
        <div>
            {projects.length > 0 ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="px-4 py-2 rounded-md">
                            진행 중인 프로젝트 ▼
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-60 bg-white shadow-lg border border-gray-200 rounded-md">
                        {projects.map((project) => (
                            <DropdownMenuItem key={project.id} asChild>
                                <Link href={`/projects/${project.id}`} className="block px-4 py-2 hover:bg-gray-100">
                                    {project.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                        setTimeout(() => router.push('/createproject'), 500);
                    }}
                >
                    새 프로젝트 생성
                </Button>
            )}
        </div>
    );
}
