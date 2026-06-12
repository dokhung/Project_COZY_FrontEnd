export type ChatMessage = {
    id: number;
    author: string;
    text: string;
    own?: boolean;
};

export type MovementKey = "forward" | "backward" | "left" | "right";
export type MovementState = Record<MovementKey, boolean>;
export type BearExpression = "neutral" | "happy" | "sad";

export type WorldHelperData = {
    name: string;
    role: string;
    color: string;
    position: readonly [number, number, number];
    message: string;
};
