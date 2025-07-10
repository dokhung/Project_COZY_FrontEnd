'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BoardCreateDialog from '@/components/community/BoardCreateDialog';
import {getPostListRequest} from "@/api/requests/post";

interface Post {
    id: number;
    title: string;
    nickname: string;
    createdAt: string;
}

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const getPostListData = async () => {
        const data = await getPostListRequest();
        if (data) setPosts(data);
    };

    useEffect(() => {
        getPostListData();
    }, []);

    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">공고&nbsp;&nbsp;{posts.length}</div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 h-10"
                    />
                    <Button className="h-10 w-20">검색</Button>
                    <Button
                        className="h-10 w-24 bg-blue-600 text-white"
                        onClick={() => setShowDialog(true)}
                    >
                        글쓰기
                    </Button>
                </div>
            </div>

            {/* 테이블 */}
            <table className="w-full border-t border-b text-center text-sm">
                <thead className="bg-white border-b">
                <tr className="text-gray-600">
                    <th className="py-2">No</th>
                    <th className="py-2 text-left pl-6">Title</th>
                    <th className="py-2">UserName</th>
                    <th className="py-2">CreateDay</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50 border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2 text-left pl-6">
                            <Link href={`/board/${post.id}`} className="hover:underline text-black">
                                {post.title}
                            </Link>
                        </td>
                        <td className="py-2">{post.nickname}</td>
                        <td className="py-2">{formatDate(post.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showDialog && (
                <BoardCreateDialog
                    onClose={() => setShowDialog(false)}
                    onSuccess={() => {
                        setShowDialog(false);
                        getPostListData();
                    }}
                />
            )}
        </div>
    );
}
