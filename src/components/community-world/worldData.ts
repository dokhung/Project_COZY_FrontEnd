import type { MovementState, WorldHelperData } from "./types";

export const createMovementState = (): MovementState => ({
    forward: false,
    backward: false,
    left: false,
    right: false,
});

export const worldHelpers: WorldHelperData[] = [
    { name: "NOVA", role: "광장 안내", color: "#f472b6", position: [-4, 0, -3], message: "COZY 월드에 오신 것을 환영해요!" },
    { name: "ROUTE", role: "이동 안내", color: "#fbbf24", position: [4, 0, -2], message: "WASD 또는 방향키로 이동할 수 있어요." },
    { name: "TALKY", role: "대화 안내", color: "#a78bfa", position: [2.5, 0, 4], message: "오른쪽 채팅창에서 메시지를 보내보세요." },
    { name: "LINK", role: "커뮤니티 안내", color: "#34d399", position: [-5.5, 0, 3.8], message: "다른 사용자와 가까이에서 대화해 보세요." },
    { name: "HELPER", role: "도우미", color: "#fb7185", position: [6, 0, 3], message: "월드 이용이 궁금한 점을 알려드릴게요." },
];
