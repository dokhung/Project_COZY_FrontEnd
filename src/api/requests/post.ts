// 게시글 목록 조회
import apiClient from "@/api/Axios";

export const getPostListRequest = async () => {
    const response = await apiClient.get('/api/post/list');
    return response.data;
};

// 게시글 작성 요청
export const createPostRequest = async (
    postDto: {
        nickName: string;
        title: string;
        status: string;
        createdAt: string;
        postText: string;
    }
) => {
    return await apiClient.post('/api/post/create', postDto);
};

// 게시판 삭제
export const deletedPostRequest = async (id : number) => {
    await apiClient.delete(`/api/post/${id}`);
}

// 게시판 수정
export const updatePostRequest = async (
    id: number,
    postDto: {
        title: string;
        status: string;
        postText: string;
    }
) => {
    const res = await apiClient.put(`/api/post/${id}`, postDto);
    return res.data;
};

export const getPostDetailRequest = async (id: number) => {
    const response = await apiClient.get(`/api/post/${id}`);
    return response.data;
};
