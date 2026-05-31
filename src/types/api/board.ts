export type PostType = "BOARD" | "NOTICE";

export type PostListItem = {
    postId: string;
    title: string;
    authorName: string;
    likeCount: number;
    createdAt: string;
};

export type PostDetail = {
    postId: string;
    title: string;
    content: string;
    authorName: string;
    likeCount: number;
    commentCount: number;
    liked: boolean;
    createdAt: string;
};

export type CommentItem = {
    commentId: string;
    authorName: string;
    content: string;
    createdAt: string;
};

export type CreatePostPayload = {
    teamId: string;
    type: PostType;
    title: string;
    content: string;
};

export type UpdatePostPayload = {
    title: string;
    content: string;
};

export type TogglePostLikeResponse = {
    likeCount: number;
    liked: boolean;
};
