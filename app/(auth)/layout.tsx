import { Suspense } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className='w-full flex flex-row justify-center align-middle p-16'>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </>
    );
}
