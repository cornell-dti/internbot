import { UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Image from "next/image";

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
            <div className='h-fit w-96 shadow-lg bg-white border-gray-200 rounded-md p-8 text-sm '>
                <div className='flex flex-row-reverse'>
                    <UserButton afterSignOutUrl='/' />
                </div>
                <Suspense fallback={<div>Loading...</div>}>{gated}</Suspense>
                <hr className='my-8' />
                <Suspense fallback={<div>Loading...</div>}>{nongated}</Suspense>
            </div>
            <Image
                className='fixed bottom-8'
                src='/internbot-transparent.png'
                width={96}
                height={96}
                alt='Internbot Logo'
            />
        </div>
    );
};

export default Layout;
