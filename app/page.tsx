import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Prisma does not support Edge without the Data Proxy currently
// export const runtime = 'edge'
export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main className='relative flex min-h-screen flex-col items-center justify-center'>
            <h1 className='pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl'>
                Internbot
            </h1>
            <p className='font-light text-gray-600 w-full max-w-lg text-center mt-6'>
                A serverless Slackbot built on Prisma, Next.js, and PostgreSQL,
                for Cornell DTI.
            </p>
            <Link
                href='#'
                className='group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all'
            >
                <p>Sign In to Continue</p>
            </Link>
        </main>
    );
}
