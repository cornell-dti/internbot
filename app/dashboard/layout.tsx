import { UserButton } from "@clerk/nextjs";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div>
                <UserButton afterSignOutUrl='/' />
            </div>
            <p>Dashboard Layout</p>
            {children}
        </>
    );
}
