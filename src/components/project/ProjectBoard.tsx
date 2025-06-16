'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectBoard({ project }: { project: any }) {
    return (
        <div className="pt-4">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">
                📁 {project.projectName} 프로젝트 보드
            </h1>

            <div className="flex gap-4 overflow-x-auto">
                {/* 해야 할 일 */}
                <div className="bg-white w-80 rounded-xl shadow p-4">
                    <h2 className="font-bold text-gray-700 mb-3">
                        해야 할 일 <span className="text-sm text-gray-400">2</span>
                    </h2>
                    <div className="space-y-3">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="font-medium text-sm">(모두해당)3월전까지 협업툴 분석</p>
                            <p className="text-xs text-gray-500 mt-1">📅 01 MAR</p>
                            <p className="text-xs text-gray-500">✅ COL-1</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="font-medium text-sm">회의록</p>
                            <p className="text-xs text-gray-500 mt-1">🗂️ 0/1</p>
                            <p className="text-xs text-gray-500">✅ COL-2</p>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                            <Plus size={16} className="mr-1" /> 만들기
                        </Button>
                    </div>
                </div>

                {/* 진행 중 */}
                <div className="bg-white w-80 rounded-xl shadow p-4">
                    <h2 className="font-bold text-gray-700 mb-3">진행 중 <span className="text-sm text-gray-400">0</span></h2>
                    <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                        <Plus size={16} className="mr-1" /> 만들기
                    </Button>
                </div>

                {/* 완료 */}
                <div className="bg-white w-80 rounded-xl shadow p-4">
                    <h2 className="font-bold text-gray-700 mb-3">완료 <span className="text-sm text-gray-400">0</span></h2>
                    <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                        <Plus size={16} className="mr-1" /> 만들기
                    </Button>
                </div>
            </div>
        </div>
    );
}
