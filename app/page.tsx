import Link from "next/link";

// Prisma does not support Edge without the Data Proxy currently
// export const runtime = 'edge'
export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main>
            <Link
                href='/gated'
                className='group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all'
            >
                Go to Admin Action
            </Link>
            <Link
                href='/nongated'
                className='group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all'
            >
                Go to Default Actions
            </Link>
        </main>
    );
}
