import { Inter } from "next/font/google";
import "../styles/globals.css";

export const metadata = {
    title: "CareerAI — Find Your Path",
    description: "ML-powered career recommendation system",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}