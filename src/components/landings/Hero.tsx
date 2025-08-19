'use client';

import { easeInOut, motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import Logo from '../../logo/LogiImg.svg';
import {ProjectList} from "@/components/landings/ProjectList";

const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const childVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { ease: easeInOut } },
};

const MotionLink = motion.create(Link);

export default function Hero() {
    const { isLoggedIn } = useUserStore();

    return (
        <motion.section
            initial="initial"
            whileInView="animate"
            variants={containerVariants}
            className="py-20 md:py-40"
        >
            <motion.div
                variants={childVariants}
                className="mb-8 flex items-center justify-center gap-2"
            >
                <Image
                    src={Logo}
                    alt="COZY 로고"
                    width={80}
                    height={80}
                    className="h-10 w-10"
                />
                <span className="text-3xl font-bold text-blue-500">COZY</span>
            </motion.div>

            <motion.h1
                variants={childVariants}
                className="mb-6 text-center text-4xl font-bold text-gray-600 md:text-5xl"
            >
                목표 달성을 위한 모두의
                <br />
                프로젝트 관리 협업툴
            </motion.h1>

            {!isLoggedIn ? (
                <MotionLink
                    href="/login"
                    variants={childVariants}
                    className="text-md md:text-2lg mx-auto flex h-10 w-60 items-center justify-center rounded-lg bg-blue-400 font-medium text-white shadow-lg hover:bg-blue-700 md:h-14 md:w-64"
                >
                    시작하기
                </MotionLink>
            ) : (
                <ProjectList />
            )}
        </motion.section>
    );
}
