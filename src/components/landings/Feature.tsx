'use client';

import { easeInOut, motion } from 'motion/react';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

const FEATURE_CONTENTS = [
  { point: 1, title: '마케팅' },
  { point: 2, title: '프로젝트 & 작업' },
  { point: 3, title: '영업' },
  { point: 4, title: 'IT & 개발' },
  { point: 5, title: '운영 & 유지보수' },
  { point: 6, title: '디자인' },
];

const featureVariants = {
  initial: { opacity: 0, y: 20 },
  animate: () => ({
    opacity: 1,
    y: 0,
    transition: {
      ease: easeInOut,
    },
  }),
};

export default function Feature() {
  return (
    <>
      <section className='relative mx-auto max-w-2/5'>
        <h2 className='mb-[2.625rem] text-center text-2xl font-bold md:text-[1.75rem] lg:text-left'>다양한 상황에서 활용하세요!</h2>
        <ul className='flex flex-col gap-10 md:gap-12'>
          {FEATURE_CONTENTS.map((item, index) => (
            <motion.li
              key={index}
              className='overflow-hidden rounded-lg bg-blue-300'
              variants={featureVariants}
              initial='initial'
              whileInView='animate'
              viewport={{
                margin: '-10% 0px',
              }}
            >
              <figure className='flex items-center justify-center'>
                <Skeleton className='h-64 w-3/5' />
              </figure>
              <div className='px-8 py-[1.688rem] md:py-8'>
                <h3 className='text-2lg mb-4 text-center font-bold text-white'>{item.title}</h3>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className='mt-16 flex h-16 flex-wrap items-center justify-between gap-4 border-t border-t-gray-200 px-20'>
      <div>만든 사람</div>
      <div className='flex items-center gap-2'>
        <Link href='#' prefetch={false}>
          Privacy Policy
        </Link>
        <Link href='#' prefetch={false}>
          FAQ
        </Link>
      </div>
      <nav>소셜 정보</nav>
    </footer>
  );
}
