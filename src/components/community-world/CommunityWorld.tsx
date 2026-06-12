"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, RoundedBox, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userStore";
import type { BearExpression, ChatMessage, MovementKey, MovementState } from "./types";
import { createMovementState, worldHelpers } from "./worldData";
import { ChatHistory, ChatInput, MovementControls, WorldHeader } from "./WorldHud";

function BearBody({
    color,
    bellyColor,
    glow = false,
    moving,
    phase = 0,
    expression = "neutral",
}: {
    color: string;
    bellyColor: string;
    glow?: boolean;
    moving?: React.RefObject<boolean>;
    phase?: number;
    expression?: BearExpression;
}) {
    const root = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const leftArm = useRef<THREE.Mesh>(null);
    const rightArm = useRef<THREE.Mesh>(null);
    const leftLeg = useRef<THREE.Mesh>(null);
    const rightLeg = useRef<THREE.Mesh>(null);
    const moveBlend = useRef(0);
    const furMaterial = {
        color,
        roughness: 0.72,
        emissive: glow ? color : "#000000",
        emissiveIntensity: glow ? 0.22 : 0,
    };

    useFrame(({ clock }, delta) => {
        if (!root.current || !head.current || !torso.current) return;

        const elapsed = clock.elapsedTime + phase;
        const targetBlend = moving?.current ? 1 : 0;
        moveBlend.current = THREE.MathUtils.damp(moveBlend.current, targetBlend, 8, delta);

        const walk = Math.sin(elapsed * 10);
        const walkOpposite = Math.sin(elapsed * 10 + Math.PI);
        const idleBreath = Math.sin(elapsed * 2.15);
        const blend = moveBlend.current;
        const idle = 1 - blend;

        root.current.position.y = Math.abs(walk) * 0.075 * blend + idleBreath * 0.018 * idle;
        root.current.rotation.z = walk * 0.035 * blend + Math.sin(elapsed * 0.8) * 0.012 * idle;

        head.current.position.y = idleBreath * 0.018 * idle + Math.abs(walk) * 0.018 * blend;
        head.current.rotation.x = walkOpposite * 0.035 * blend;
        head.current.rotation.z = walk * 0.025 * blend + Math.sin(elapsed * 0.7) * 0.018 * idle;

        const breathScale = 1 + idleBreath * 0.022 * idle;
        torso.current.scale.set(1 - idleBreath * 0.008 * idle, breathScale, 1 + idleBreath * 0.012 * idle);

        if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
            leftArm.current.rotation.x = walk * 0.55 * blend;
            rightArm.current.rotation.x = walkOpposite * 0.55 * blend;
            leftLeg.current.rotation.x = walkOpposite * 0.42 * blend;
            rightLeg.current.rotation.x = walk * 0.42 * blend;

            leftArm.current.rotation.z = -0.35 - Math.abs(walk) * 0.08 * blend;
            rightArm.current.rotation.z = 0.35 + Math.abs(walk) * 0.08 * blend;
        }
    });

    return (
        <group ref={root}>
            <group ref={head}>
                <mesh position={[-0.31, 1.73, 0]} castShadow>
                    <sphereGeometry args={[0.22, 20, 20]} />
                    <meshStandardMaterial {...furMaterial} />
                </mesh>
                <mesh position={[0.31, 1.73, 0]} castShadow>
                    <sphereGeometry args={[0.22, 20, 20]} />
                    <meshStandardMaterial {...furMaterial} />
                </mesh>
                <mesh position={[0, 1.47, 0]} castShadow>
                    <sphereGeometry args={[0.48, 28, 28]} />
                    <meshStandardMaterial {...furMaterial} />
                </mesh>
                <mesh position={[0, 1.34, 0.39]} scale={[1, 0.72, 0.72]} castShadow>
                    <sphereGeometry args={[0.25, 20, 20]} />
                    <meshStandardMaterial color={bellyColor} roughness={0.8} />
                </mesh>
                {expression === "happy" ? (
                    <>
                        <mesh position={[-0.16, 1.53, 0.43]} rotation={[0, 0, 0.18]}>
                            <torusGeometry args={[0.055, 0.014, 8, 18, Math.PI]} />
                            <meshStandardMaterial color="#172033" roughness={0.4} />
                        </mesh>
                        <mesh position={[0.16, 1.53, 0.43]} rotation={[0, 0, 0.18]}>
                            <torusGeometry args={[0.055, 0.014, 8, 18, Math.PI]} />
                            <meshStandardMaterial color="#172033" roughness={0.4} />
                        </mesh>
                    </>
                ) : (
                    <>
                        <mesh position={[-0.16, 1.53, 0.42]} scale={[1, expression === "sad" ? 1.25 : 1, 1]}>
                            <sphereGeometry args={[0.045, 12, 12]} />
                            <meshStandardMaterial color="#172033" roughness={0.4} />
                        </mesh>
                        <mesh position={[0.16, 1.53, 0.42]} scale={[1, expression === "sad" ? 1.25 : 1, 1]}>
                            <sphereGeometry args={[0.045, 12, 12]} />
                            <meshStandardMaterial color="#172033" roughness={0.4} />
                        </mesh>
                    </>
                )}
                <mesh position={[0, 1.39, 0.57]}>
                    <sphereGeometry args={[0.06, 12, 12]} />
                    <meshStandardMaterial color="#172033" roughness={0.4} />
                </mesh>
                {expression !== "neutral" && (
                    <mesh
                        position={[0, 1.28, 0.56]}
                        rotation={[0, 0, expression === "happy" ? 0 : Math.PI]}
                    >
                        <torusGeometry args={[0.09, 0.018, 8, 20, Math.PI]} />
                        <meshStandardMaterial color="#172033" roughness={0.4} />
                    </mesh>
                )}
                {expression === "sad" && (
                    <>
                        <mesh position={[-0.17, 1.43, 0.47]} scale={[0.55, 1.15, 0.45]}>
                            <sphereGeometry args={[0.055, 12, 12]} />
                            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.85} />
                        </mesh>
                        <mesh position={[0.17, 1.43, 0.47]} scale={[0.55, 1.15, 0.45]}>
                            <sphereGeometry args={[0.055, 12, 12]} />
                            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.85} />
                        </mesh>
                    </>
                )}
            </group>

            <group ref={torso}>
                <mesh position={[0, 0.76, 0]} scale={[1, 1.08, 0.9]} castShadow>
                    <sphereGeometry args={[0.52, 28, 28]} />
                    <meshStandardMaterial {...furMaterial} />
                </mesh>
                <mesh position={[0, 0.78, 0.43]} scale={[1, 1.15, 0.55]} castShadow>
                    <sphereGeometry args={[0.3, 20, 20]} />
                    <meshStandardMaterial color={bellyColor} roughness={0.82} />
                </mesh>
                <mesh position={[0, 0.82, -0.43]} castShadow>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial color={bellyColor} roughness={0.85} />
                </mesh>
            </group>

            <mesh ref={leftArm} position={[-0.5, 0.82, 0]} rotation={[0, 0, -0.35]} castShadow>
                <capsuleGeometry args={[0.14, 0.42, 6, 12]} />
                <meshStandardMaterial {...furMaterial} />
            </mesh>
            <mesh ref={rightArm} position={[0.5, 0.82, 0]} rotation={[0, 0, 0.35]} castShadow>
                <capsuleGeometry args={[0.14, 0.42, 6, 12]} />
                <meshStandardMaterial {...furMaterial} />
            </mesh>
            <mesh ref={leftLeg} position={[-0.25, 0.23, 0.04]} castShadow>
                <capsuleGeometry args={[0.17, 0.35, 6, 12]} />
                <meshStandardMaterial {...furMaterial} />
            </mesh>
            <mesh ref={rightLeg} position={[0.25, 0.23, 0.04]} castShadow>
                <capsuleGeometry args={[0.17, 0.35, 6, 12]} />
                <meshStandardMaterial {...furMaterial} />
            </mesh>
        </group>
    );
}

function WorldHelper({
    name,
    role,
    color,
    position,
    message,
}: {
    name: string;
    role: string;
    color: string;
    position: readonly [number, number, number];
    message: string;
}) {
    const helper = useRef<THREE.Group>(null);
    const leftArm = useRef<THREE.Group>(null);
    const rightArm = useRef<THREE.Group>(null);
    const phase = position[0] * 0.7 + position[2];

    useFrame(({ clock }) => {
        const elapsed = clock.elapsedTime + phase;
        if (helper.current) {
            helper.current.position.y = 0.22 + Math.sin(elapsed * 1.7) * 0.08;
            helper.current.rotation.y = Math.sin(elapsed * 0.55) * 0.12;
        }
        if (leftArm.current && rightArm.current) {
            leftArm.current.rotation.z = -0.18 + Math.sin(elapsed * 1.9) * 0.12;
            rightArm.current.rotation.z = 0.18 - Math.sin(elapsed * 1.9) * 0.12;
        }
    });

    return (
        <group position={position}>
            <group ref={helper}>
                <mesh position={[0, 1.82, 0]} castShadow>
                    <cylinderGeometry args={[0.035, 0.035, 0.42, 10]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
                </mesh>
                <mesh position={[0, 2.08, 0]}>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
                </mesh>

                <RoundedBox args={[1.05, 0.72, 0.72]} radius={0.22} position={[0, 1.43, 0]} castShadow>
                    <meshStandardMaterial color="#dbeafe" metalness={0.35} roughness={0.3} />
                </RoundedBox>
                <RoundedBox args={[0.76, 0.4, 0.08]} radius={0.12} position={[0, 1.43, 0.38]}>
                    <meshStandardMaterial color="#102238" emissive="#07111f" emissiveIntensity={0.4} />
                </RoundedBox>
                <mesh position={[-0.2, 1.46, 0.435]}>
                    <sphereGeometry args={[0.065, 14, 14]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.2, 1.46, 0.435]}>
                    <sphereGeometry args={[0.065, 14, 14]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
                </mesh>
                <mesh position={[0, 1.31, 0.44]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.09, 0.018, 8, 20, Math.PI]} />
                    <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={1.2} />
                </mesh>

                <RoundedBox args={[0.8, 0.62, 0.58]} radius={0.2} position={[0, 0.78, 0]} castShadow>
                    <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.32} />
                </RoundedBox>
                <mesh position={[0, 0.8, 0.31]}>
                    <circleGeometry args={[0.2, 24]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.15} />
                </mesh>

                <group ref={leftArm} position={[-0.55, 0.9, 0]}>
                    <mesh rotation={[0, 0, -0.18]} castShadow>
                        <capsuleGeometry args={[0.1, 0.38, 5, 10]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.3} />
                    </mesh>
                </group>
                <group ref={rightArm} position={[0.55, 0.9, 0]}>
                    <mesh rotation={[0, 0, 0.18]} castShadow>
                        <capsuleGeometry args={[0.1, 0.38, 5, 10]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.3} />
                    </mesh>
                </group>

                <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.34, 0.055, 12, 32]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.8} />
                </mesh>
                <pointLight position={[0, 0.45, 0]} color={color} intensity={1.5} distance={3.5} />
            </group>
            <Html position={[0, 2.72, 0]} center distanceFactor={9}>
                <div className="pointer-events-none min-w-max rounded-xl border border-sky-200/30 bg-slate-950/80 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-xl backdrop-blur-md">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-sky-300">NPC · {role}</span>
                    <span className="block">{name}</span>
                    <span className="mt-0.5 block max-w-48 text-[10px] font-normal text-white/65">{message}</span>
                </div>
            </Html>
        </group>
    );
}

function Player({ name, speech, expression }: { name: string; speech: string | null; expression: BearExpression }) {
    const { gl } = useThree();
    const player = useRef<THREE.Group>(null);
    const isMoving = useRef(false);
    const jumpVelocity = useRef(0);
    const isGrounded = useRef(true);
    const isCameraDragging = useRef(false);
    const cameraYaw = useRef(0);
    const cameraPitch = useRef(0);
    const cameraDistance = useRef(11.5);
    const targetCameraDistance = useRef(11.5);
    const previousPointer = useRef({ x: 0, y: 0 });
    const keys = useRef<MovementState>(createMovementState());
    const lastPressedAt = useRef<Record<MovementKey, number>>({
        forward: 0,
        backward: 0,
        left: 0,
        right: 0,
    });
    const direction = useMemo(() => new THREE.Vector3(), []);
    const cameraTarget = useMemo(() => new THREE.Vector3(), []);
    const cameraOffset = useMemo(() => new THREE.Vector3(), []);
    const lookTarget = useMemo(() => new THREE.Vector3(), []);

    useEffect(() => {
        const resolveMovementKey = (event: KeyboardEvent): MovementKey | null => {
            const codeMap: Record<string, MovementKey> = {
                KeyW: "forward",
                ArrowUp: "forward",
                KeyS: "backward",
                ArrowDown: "backward",
                KeyA: "left",
                ArrowLeft: "left",
                KeyD: "right",
                ArrowRight: "right",
            };
            const keyMap: Record<string, MovementKey> = {
                w: "forward",
                s: "backward",
                a: "left",
                d: "right",
            };
            return codeMap[event.code] ?? keyMap[event.key.toLowerCase()] ?? null;
        };

        const down = (event: KeyboardEvent) => {
            if (["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;
            if (event.code === "Space") {
                event.preventDefault();
                if (isGrounded.current && player.current) {
                    jumpVelocity.current = 7;
                    isGrounded.current = false;
                }
                return;
            }
            const movementKey = resolveMovementKey(event);
            if (!movementKey) return;
            event.preventDefault();
            keys.current[movementKey] = true;
            lastPressedAt.current[movementKey] = performance.now();
        };
        const up = (event: KeyboardEvent) => {
            const movementKey = resolveMovementKey(event);
            if (!movementKey) return;
            event.preventDefault();
            keys.current[movementKey] = false;
        };
        const reset = () => {
            keys.current = createMovementState();
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        window.addEventListener("blur", reset);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            window.removeEventListener("blur", reset);
        };
    }, []);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            targetCameraDistance.current = THREE.MathUtils.clamp(
                targetCameraDistance.current + event.deltaY * 0.012,
                4.5,
                17
            );
        };
        const handlePointerDown = (event: PointerEvent) => {
            if (event.button !== 2) return;
            event.preventDefault();
            isCameraDragging.current = true;
            previousPointer.current = { x: event.clientX, y: event.clientY };
            canvas.setPointerCapture?.(event.pointerId);
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (!isCameraDragging.current) return;

            const deltaX = event.clientX - previousPointer.current.x;
            const deltaY = event.clientY - previousPointer.current.y;
            previousPointer.current = { x: event.clientX, y: event.clientY };

            cameraYaw.current -= deltaX * 0.006;
            cameraPitch.current = THREE.MathUtils.clamp(
                cameraPitch.current - deltaY * 0.012,
                0,
                3.8
            );
        };
        const stopCameraDrag = (event?: PointerEvent) => {
            isCameraDragging.current = false;
            if (event && canvas.hasPointerCapture?.(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        };

        canvas.addEventListener("contextmenu", handleContextMenu);
        canvas.addEventListener("wheel", handleWheel, { passive: false });
        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerup", stopCameraDrag);
        canvas.addEventListener("pointercancel", stopCameraDrag);
        window.addEventListener("blur", stopCameraDrag);

        return () => {
            canvas.removeEventListener("contextmenu", handleContextMenu);
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerup", stopCameraDrag);
            canvas.removeEventListener("pointercancel", stopCameraDrag);
            window.removeEventListener("blur", stopCameraDrag);
        };
    }, [gl]);

    useFrame((state, delta) => {
        if (!player.current) return;
        const now = performance.now();
        const active = (key: MovementKey) => keys.current[key] || now - lastPressedAt.current[key] < 120;
        const horizontal = Number(active("right")) - Number(active("left"));
        const vertical = Number(active("backward")) - Number(active("forward"));

        direction.set(horizontal, 0, vertical);
        isMoving.current = direction.lengthSq() > 0;
        if (direction.lengthSq() > 0) {
            direction.normalize();
            player.current.position.addScaledVector(direction, delta * 4.2);
            player.current.position.x = THREE.MathUtils.clamp(player.current.position.x, -8.5, 8.5);
            player.current.position.z = THREE.MathUtils.clamp(player.current.position.z, -8.5, 8.5);
            player.current.rotation.y = Math.atan2(direction.x, direction.z);
        }

        if (!isGrounded.current || player.current.position.y > 0) {
            jumpVelocity.current -= 18 * delta;
            player.current.position.y += jumpVelocity.current * delta;

            if (player.current.position.y <= 0) {
                player.current.position.y = 0;
                jumpVelocity.current = 0;
                isGrounded.current = true;
            }
        }

        cameraDistance.current = THREE.MathUtils.damp(
            cameraDistance.current,
            targetCameraDistance.current,
            10,
            delta
        );
        const distanceScale = cameraDistance.current / 11.5;
        cameraOffset
            .set(0, 7.4 * distanceScale, 8.8 * distanceScale)
            .applyAxisAngle(THREE.Object3D.DEFAULT_UP, cameraYaw.current);
        cameraTarget.copy(player.current.position).add(cameraOffset);
        state.camera.position.lerp(cameraTarget, 1 - Math.pow(0.002, delta));
        lookTarget.set(
            player.current.position.x,
            0.8 + cameraPitch.current,
            player.current.position.z
        );
        state.camera.lookAt(lookTarget);
    });

    return (
        <group ref={player} position={[0, 0, 2]}>
            <BearBody color="#22d3ee" bellyColor="#cffafe" glow moving={isMoving} expression={expression} />
            <pointLight position={[0, 1, 0]} color="#22d3ee" intensity={1.4} distance={4} />
            <Html position={[0, 2.25, 0]} center distanceFactor={9}>
                <div className="pointer-events-none flex min-w-max flex-col items-center">
                    {speech && (
                        <div className="mb-2 max-w-56 animate-in fade-in zoom-in-95 duration-200">
                            <div className="relative rounded-2xl border border-cyan-100/40 bg-white px-4 py-2.5 text-center text-xs font-semibold leading-relaxed text-slate-800 shadow-[0_10px_32px_rgba(0,0,0,0.35)]">
                                <span className="block max-w-48 break-words">{speech}</span>
                                <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-cyan-100/40 bg-white" />
                            </div>
                        </div>
                    )}
                    <div className="rounded-full border border-cyan-200/50 bg-cyan-950/80 px-3 py-1 text-xs font-bold text-cyan-50 shadow-xl backdrop-blur-md">
                        {name}
                    </div>
                </div>
            </Html>
        </group>
    );
}

function Plaza() {
    const lamps = [
        [-7, -7], [7, -7], [-7, 7], [7, 7],
    ];

    return (
        <>
            <color attach="background" args={["#06182b"]} />
            <fog attach="fog" args={["#07192d", 12, 34]} />
            <ambientLight intensity={0.75} />
            <directionalLight position={[7, 12, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
            <Stars radius={45} depth={20} count={900} factor={2.2} fade speed={0.35} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[13, 64]} />
                <meshStandardMaterial color="#12364a" roughness={0.82} metalness={0.08} />
            </mesh>
            <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <ringGeometry args={[9.2, 13, 64]} />
                <meshStandardMaterial color="#082338" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3.25, 3.45, 64]} />
                <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={0.5} />
            </mesh>

            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.45}>
                <RoundedBox args={[4.2, 1.2, 0.35]} radius={0.18} position={[0, 2.6, -7.7]}>
                    <meshStandardMaterial color="#0e7490" emissive="#164e63" emissiveIntensity={0.5} />
                    <Html transform position={[0, 0, 0.19]} distanceFactor={5.2}>
                        <div className="w-72 text-center text-2xl font-black tracking-[0.18em] text-cyan-50">COZY PLAZA</div>
                    </Html>
                </RoundedBox>
            </Float>

            {lamps.map(([x, z]) => (
                <group key={`${x}-${z}`} position={[x, 0, z]}>
                    <mesh position={[0, 1.4, 0]} castShadow>
                        <cylinderGeometry args={[0.08, 0.12, 2.8, 12]} />
                        <meshStandardMaterial color="#475569" metalness={0.7} />
                    </mesh>
                    <mesh position={[0, 2.9, 0]}>
                        <sphereGeometry args={[0.22, 16, 16]} />
                        <meshStandardMaterial color="#cffafe" emissive="#67e8f9" emissiveIntensity={2} />
                    </mesh>
                    <pointLight position={[0, 2.8, 0]} color="#67e8f9" intensity={4} distance={7} />
                </group>
            ))}

            {worldHelpers.map((helper) => <WorldHelper key={helper.name} {...helper} />)}
        </>
    );
}

export default function CommunityWorld() {
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);
    const [draft, setDraft] = useState("");
    const [playerSpeech, setPlayerSpeech] = useState<string | null>(null);
    const [playerExpression, setPlayerExpression] = useState<BearExpression>("neutral");
    const speechTimer = useRef<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, author: "NOVA · NPC", text: "COZY 광장에 오신 걸 환영해요!" },
        { id: 2, author: "ROUTE · NPC", text: "WASD로 이동하면서 둘러보세요." },
    ]);

    const sendMessage = () => {
        const text = draft.trim();
        if (!text) return;
        const expression: BearExpression = /(?:ㅠㅠ+|ㅜㅜ+|😢|😭|슬프|흑흑)/i.test(text)
            ? "sad"
            : /(?:ㅋ{2,}|ㅎ{2,}|😂|🤣|😄|😁|웃)/i.test(text)
                ? "happy"
                : "neutral";
        setMessages((current) => [
            ...current.slice(-5),
            { id: Date.now(), author: user?.nickname || t("communityWorld.you"), text, own: true },
        ]);
        setPlayerSpeech(text);
        setPlayerExpression(expression);
        if (speechTimer.current) {
            window.clearTimeout(speechTimer.current);
        }
        speechTimer.current = window.setTimeout(() => {
            setPlayerSpeech(null);
            setPlayerExpression("neutral");
            speechTimer.current = null;
        }, 5000);
        setDraft("");
    };

    useEffect(() => {
        return () => {
            if (speechTimer.current) {
                window.clearTimeout(speechTimer.current);
            }
        };
    }, []);

    const nudgePlayer = (code: "KeyW" | "KeyA" | "KeyS" | "KeyD", key: "w" | "a" | "s" | "d") => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code, key }));
        window.setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { code, key }));
        }, 50);
    };

    const jumpPlayer = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", key: " " }));
    };

    return (
        <main className="relative h-[calc(100dvh-64px)] min-h-[620px] overflow-hidden bg-[#06182b] text-white">
            <Canvas shadows camera={{ position: [0, 7.4, 10.8], fov: 48 }} dpr={[1, 1.7]}>
                <Plaza />
                <Player
                    name={user?.nickname || t("communityWorld.you")}
                    speech={playerSpeech}
                    expression={playerExpression}
                />
            </Canvas>

            <WorldHeader helpers={worldHelpers} t={t} />
            <MovementControls onMove={nudgePlayer} onJump={jumpPlayer} />
            <ChatHistory messages={messages} t={t} />
            <ChatInput draft={draft} onDraftChange={setDraft} onSend={sendMessage} t={t} />
        </main>
    );
}
