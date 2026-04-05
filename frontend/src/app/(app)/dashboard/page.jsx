"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";

const careerEmoji = {
    "Software Engineer": "💻", "Data Scientist": "📊", "Machine Learning Engineer": "🤖",
    "Web Developer": "🌐", "Mobile App Developer": "📱", "Cybersecurity Analyst": "🔐",
    "Network Engineer": "🔌", "Database Administrator": "🗄️", "UI/UX Designer": "🎨",
    "DevOps Engineer": "⚙️", "Cloud Engineer": "☁️", "Business Analyst": "📈",
    "Product Manager": "🧭", "AI Research Scientist": "🔬", "IT Consultant": "🤝",
};

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/recommend/history")
            .then(({ data }) => setHistory(data.data))
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, []);

    const latest = history[0];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
                    <p className="text-sm text-slate-500 mt-1">Here's your career recommendation history</p>
                </div>
                <Link href="/quiz" className="bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors">
                    New Assessment
                </Link>
            </div>

            {latest && (
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 text-white mb-8">
                    <p className="text-teal-200 text-sm mb-2">Latest Recommendation</p>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{careerEmoji[latest.career] || "🎯"}</span>
                        <div>
                            <h2 className="text-2xl font-bold">{latest.career}</h2>
                            <p className="text-teal-200 text-sm">{latest.confidence}% confidence match</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-4">Assessment History</h2>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                        <p className="text-4xl mb-4">🎯</p>
                        <h3 className="font-semibold text-slate-700 mb-2">No assessments yet</h3>
                        <p className="text-sm text-slate-400 mb-6">Take your first quiz to get a career recommendation</p>
                        <Link href="/quiz" className="inline-block bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors">
                            Start Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((rec) => (
                            <div key={rec._id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{careerEmoji[rec.career] || "💼"}</span>
                                    <div>
                                        <p className="font-semibold text-slate-800">{rec.career}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(rec.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-teal-700 font-semibold text-sm">{rec.confidence}%</span>
                                    <p className="text-xs text-slate-400">confidence</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}