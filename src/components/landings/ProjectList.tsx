'use client';

import { useProjectStore } from '@/store/projectStore';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProjectList = () => {
  const { projects } = useProjectStore();

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-3/5 mb-6 text-center"
      >
        {projects.length === 0 ? (
            <div className="flex flex-col items-center space-y-3 p-6 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-600">
                현재 참여 중인 프로젝트가 없습니다.
              </p>
              <p className="text-sm text-gray-500">
                새로운 프로젝트를 시작하거나 참여해보세요!
              </p>
            </div>
        ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-600">참여 중인 프로젝트</p>
              <ul className="space-y-3">
                {projects.map((project) => (
                    <li key={project.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-md">
                      <div>
                        <p className="text-md font-semibold">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.description}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>자세히 보기</Link>
                      </Button>
                    </li>
                ))}
              </ul>
            </div>
        )}
      </motion.div>
  );
};

export default ProjectList;
