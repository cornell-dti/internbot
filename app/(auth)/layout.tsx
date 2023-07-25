import { Suspense } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className='w-full flex flex-col justify-center align-middle'>
                <Suspense fallback={<div>Loading...</div>}>
                    <center>{children}</center>
                </Suspense>
            </div>
        </>
    );
}
