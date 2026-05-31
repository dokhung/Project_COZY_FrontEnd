import apiClient from "@/api/Axios";
import type {
    CommentItem,
    CreatePostPayload,
    PostDetail,
    PostListItem,
    PostType,
    TogglePostLikeResponse,
    UpdatePostPayload,
} from "@/types/api/board";

export const getTeamPosts = async (teamId: string, type: PostType) => {
    const res = await apiClient.get<PostListItem[]>("/api/team/post/list", {
        params: { teamId, type },
    });
    return res.data ?? [];
};

export const getPostDetail = async (postId: string) => {
    const res = await apiClient.get<PostDetail>(`/api/team/post/${postId}`);
    return res.data;
};

export const createPost = async (payload: CreatePostPayload) => {
    const res = await apiClient.post<PostDetail>("/api/team/post", payload);
    return res.data;
};

export const updatePost = async (postId: string, payload: UpdatePostPayload) => {
    const res = await apiClient.patch<PostDetail>(`/api/team/post/${postId}`, payload);
    return res.data;
};

export const deletePost = async (postId: string) => {
    await apiClient.delete(`/api/team/post/${postId}`);
};

export const togglePostLike = async (postId: string) => {
    const res = await apiClient.post<TogglePostLikeResponse>(
        `/api/team/post/${postId}/like`
    );
    return res.data;
};

export const getComments = async (postId: string) => {
    const res = await apiClient.get<CommentItem[]>(`/api/team/post/${postId}/comments`);
    return res.data ?? [];
};

export const createComment = async (postId: string, content: string) => {
    const res = await apiClient.post<CommentItem>(`/api/team/post/${postId}/comments`, { content });
    return res.data;
};

export const deleteComment = async (commentId: string) => {
    await apiClient.delete(`/api/team/post/comment/${commentId}`);
};
