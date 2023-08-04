import { UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

const Layout = ({
    children,
    gated,
    nongated,
}: {
    children: React.ReactNode;
    gated: React.ReactNode;
    nongated: React.ReactNode;
}) => {
    return (
        <div className='w-full h-full flex flex-row align-middle justify-center p-16'>
            <div className='h-fit w-96 shadow-lg bg-white border-gray-200 rounded-md p-8'>
                <div className='flex flex-row-reverse'>
                    <UserButton afterSignOutUrl='/' />
                </div>
                <Suspense fallback={<div>Loading...</div>}>{gated}</Suspense>
                <hr className='my-8' />
                <Suspense fallback={<div>Loading...</div>}>{nongated}</Suspense>
            </div>
        </div>
    );
};

export default Layout;
