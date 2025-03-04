import Link from "next/link";

export function Footer() {
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