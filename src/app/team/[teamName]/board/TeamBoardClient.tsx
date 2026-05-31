"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/team/team-board/PostList";
import PostForm from "@/components/team/team-board/PostForm";
import PostDetail from "@/components/team/team-board/PostDetail";
import { useTeamStore } from "@/store/teamStore";
import {
    createComment,
    createPost,
    deleteComment,
    deletePost,
    getComments,
    getPostDetail,
    getTeamPosts,
    togglePostLike,
    updatePost,
} from "@/api/requests/board";
import type { CommentItem, PostDetail as PostDetailType, PostListItem } from "@/types/api/board";

type ViewMode = "list" | "detail" | "create" | "edit";

export default function TeamBoardClient() {
    const { currentTeamId } = useTeamStore();
    const [view, setView] = useState<ViewMode>("list");
    const [posts, setPosts] = useState<PostListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<PostDetailType | null>(null);
    const [comments, setComments] = useState<CommentItem[]>([]);

    const refreshList = async () => {
        if (!currentTeamId) return;
        setLoading(true);
        try {
            const data = await getTeamPosts(currentTeamId, "BOARD");
            setPosts(data);
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (postId: string) => {
        setView("detail");
        setSelectedId(postId);
        const [post, commentList] = await Promise.all([
            getPostDetail(postId),
            getComments(postId),
        ]);
        setDetail(post);
        setComments(commentList);
    };

    useEffect(() => {
        refreshList();
    }, [currentTeamId]);

    return (
        <main className="theme-page relative min-h-[calc(100vh-4rem)] overflow-hidden py-8">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-6 h-48 w-48 rounded-full blur-2xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />

            <div className="relative z-10">
                {view === "list" && (
                    <PostList
                        onCreate={() => setView("create")}
                        onOpenDetail={openDetail}
                        i18nPrefix="board"
                        posts={posts}
                        loading={loading}
                    />
                )}
                {view === "detail" && (
                    <PostDetail
                        onBack={() => setView("list")}
                        i18nPrefix="board"
                        post={detail}
                        comments={comments}
                        onLike={async () => {
                            if (!selectedId) return;
                            const res = await togglePostLike(selectedId);
                            setDetail((prev) =>
                                prev ? { ...prev, likeCount: res.likeCount, liked: res.liked } : prev
                            );
                            await refreshList();
                        }}
                        onDelete={async () => {
                            if (!selectedId) return;
                            await deletePost(selectedId);
                            await refreshList();
                            setView("list");
                        }}
                        onEdit={() => setView("edit")}
                        onCommentSubmit={async (content) => {
                            if (!selectedId) return;
                            const newComment = await createComment(selectedId, content);
                            setComments((prev) => [...prev, newComment]);
                        }}
                        onCommentDelete={async (commentId) => {
                            await deleteComment(commentId);
                            setComments((prev) => prev.filter((c) => c.commentId !== commentId));
                        }}
                    />
                )}
                {(view === "create" || view === "edit") && (
                    <PostForm
                        onBack={() => setView("list")}
                        i18nPrefix="board"
                        mode={view}
                        initialTitle={detail?.title ?? ""}
                        initialContent={detail?.content ?? ""}
                        onSubmit={async (title, content) => {
                            if (!currentTeamId) return;
                            if (view === "edit" && selectedId) {
                                const updated = await updatePost(selectedId, { title, content });
                                setDetail(updated);
                            } else {
                                await createPost({
                                    teamId: currentTeamId,
                                    type: "BOARD",
                                    title,
                                    content,
                                });
                            }
                            await refreshList();
                        }}
                    />
                )}
            </div>
        </main>
    );
}
