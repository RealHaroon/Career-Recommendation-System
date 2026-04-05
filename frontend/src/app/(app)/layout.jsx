"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function AppLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="text-teal-700 font-bold text-lg">
                        CareerAI
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/quiz" className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                            New Quiz
                        </Link>
                        <span className="text-sm text-slate-400">|</span>
                        <span className="text-sm text-slate-600">{user?.name}</span>
                        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="max-w-5xl mx-auto px-8 py-10">{children}</main>
        </div>
    );
}