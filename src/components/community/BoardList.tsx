'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    nickname: string;
    createdAt: string;
}

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await axios.get('/api/board');
        setPosts(res.data);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <div className="flex justify-between items-center mb-4">
                <div>광고 0</div>
                <div className="flex gap-2">
                    <Input
                        placeholder="검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button>검색</Button>
                    <Link href="/board/write">
                        <Button className="bg-blue-600 text-white">글쓰기</Button>
                    </Link>
                </div>
            </div>

            <table className="w-full border text-center">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">UserName</th>
                    <th className="p-2 border">CreateDay</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border text-left">
                            <Link href={`/board/${post.id}`}>{post.title}</Link>
                        </td>
                        <td className="p-2 border">{post.nickname}</td>
                        <td className="p-2 border">{post.createdAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
