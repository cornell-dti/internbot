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

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <ClerkProvider>
        <html lang='en'>
            <body className={inter.variable + "w-screen h-screen"}>
                {children}
            </body>
        </html>
    </ClerkProvider>
);

export default RootLayout;
