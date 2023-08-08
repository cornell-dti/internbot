import { Suspense } from "react";
import Image from "next/image";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className='w-full flex flex-row justify-center align-middle p-16'>
                <Image
                    className='fixed bottom-8'
                    src='/internbot-transparent.png'
                    width={96}
                    height={96}
                    alt='Internbot Logo'
                />
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </>
    );
}
