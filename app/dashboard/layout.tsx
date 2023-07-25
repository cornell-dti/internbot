import { UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className='flex flex-row flex-nowrap w-full h-32 absolute top-0 left-0'>
                <UserButton afterSignOutUrl='/' />
            </div>
            <div className='flex flex-row flex-nowrap w-full h-screen'>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </>
    );
}
