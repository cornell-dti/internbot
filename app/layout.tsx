import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
    title: "Internbot",
    description: "Serverless Slackbot",
};

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={inter.variable + "w-screen h-screen"}>
                    <div className='flex flex-row-reverse flex-nowrap w-full h-24 p-4'>
                        <UserButton afterSignOutUrl='/' />
                    </div>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
