'use client';

import { useEffect, useState } from 'react';
import BoardCreateDialog from "@/components/community/BoardCreateDialog";
import { getPostListRequest } from "@/api/requests/post";
import PostDetailDialog from "@/components/ProjectPlan/PostDetaiDialog";

export default function PlanPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // 게시글 목록 조회
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPostListRequest();
                setPosts(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // 개별 체크박스 토글
    const handleCheckboxChange = (id: number) => {
        setSelectedCheckbox((selectedCheckbox) =>
            selectedCheckbox.includes(id)
                ? selectedCheckbox.filter((selectedId) => selectedId !== id)
                : [...selectedCheckbox, id]
        );
    };

    // 전체 선택 토글
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedCheckbox([]);
        } else {
            const allIds = posts.map((post: any) => post.id);
            setSelectedCheckbox(allIds);
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-4 flex items-center gap-2">
                <input type="text" placeholder="검색" className="border px-2 py-2 rounded text-base" />
                <button className="border px-4 py-2 rounded bg-white text-base">검색</button>
            </div>

            <table className="w-full border bg-white text-lg">
                <thead>
                <tr className="border-b text-center font-semibold">
                    <th className="p-4">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                        />
                    </th>
                    <th className="p-4">상태</th>
                    <th className="p-4">제목</th>
                    <th className="p-4">작성자</th>
                    <th className="p-4">작성일</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-base">
                            로딩 중...
                        </td>
                    </tr>
                ) : posts.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-base">
                            게시글이 없습니다.
                        </td>
                    </tr>
                ) : (
                    posts.map((post: any) => (
                        <tr
                            key={post.id}
                            className="text-center border-b hover:bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedPostId(post.id)}
                        >
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedCheckbox.includes(post.id)}
                                    onChange={() => handleCheckboxChange(post.id)}
                                />
                            </td>
                            <td className="p-4">
                              <span
                                  className={`inline-block px-5 py-2 rounded-full text-xs font-semibold
                                  ${
                                      post.status === "계획"
                                          ? "bg-gray-200 text-gray-700"
                                          : post.status === "진행중"
                                              ? "bg-yellow-200 text-yellow-800"
                                              : post.status === "완료"
                                                  ? "bg-green-200 text-green-800"
                                                  : "bg-gray-200 text-gray-700"
                                  }
                                `}
                              >
                                {post.status}
                              </span>
                            </td>

                            <td className="p-4">{post.title}</td>
                            <td className="p-4">{post.nickname}</td>
                            <td className="p-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="mt-6 flex justify-center gap-2">
                <button
                    className="px-6 py-2 border rounded bg-white text-lg"
                    onClick={() => setIsOpen(true)}
                >
                    추가하기
                </button>
            </div>

            {isOpen && (
                <BoardCreateDialog
                    onClose={() => setIsOpen(false)}
                    onSuccess={async () => {
                        setIsLoading(true);
                        const data = await getPostListRequest();
                        setPosts(data);
                        setIsLoading(false);
                    }}
                />
            )}

            {selectedPostId && (
                <PostDetailDialog
                    postId={selectedPostId}
                    onClose={() => setSelectedPostId(null)}
                    onDeleted={async () => {
                        setIsLoading(true);
                        const data = await getPostListRequest();
                        setPosts(data);
                        setIsLoading(false);
                        setSelectedPostId(null);
                    }}
                    onUpdated={async () => {
                        setIsLoading(true);
                        const data = await getPostListRequest();
                        setPosts(data);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
}
