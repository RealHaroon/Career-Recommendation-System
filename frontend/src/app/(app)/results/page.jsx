"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useQuizStore from "@/store/quizStore";

const careerEmoji = {
    "Software Engineer": "💻",
    "Data Scientist": "📊",
    "Machine Learning Engineer": "🤖",
    "Web Developer": "🌐",
    "Mobile App Developer": "📱",
    "Cybersecurity Analyst": "🔐",
    "Network Engineer": "🔌",
    "Database Administrator": "🗄️",
    "UI/UX Designer": "🎨",
    "DevOps Engineer": "⚙️",
    "Cloud Engineer": "☁️",
    "Business Analyst": "📈",
    "Product Manager": "🧭",
    "AI Research Scientist": "🔬",
    "IT Consultant": "🤝",
};

export default function ResultsPage() {
    const router = useRouter();
    const { result, resetQuiz } = useQuizStore();

    useEffect(() => {
        if (!result) router.push("/quiz");
    }, [result, router]);

    if (!result) return null;

    const { career, confidence, top_5 } = result;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <span className="text-5xl mb-4 block">{careerEmoji[career] || "🎯"}</span>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Best Match</h1>
                <p className="text-teal-700 text-2xl font-semibold">{career}</p>
                <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full mt-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className="text-sm font-medium">{confidence}% confidence</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-5">Your Top 5 Career Matches</h2>
                <div className="space-y-4">
                    {top_5.map((item, index) => (
                        <div key={item.career} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-400 w-4">#{index + 1}</span>
                            <span className="text-lg">{careerEmoji[item.career] || "💼"}</span>
                            <span className="text-sm font-medium text-slate-700 flex-1">{item.career}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 bg-slate-100 rounded-full h-1.5">
                                    <div
                                        className="bg-teal-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${item.confidence}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-10 text-right">{item.confidence}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => { resetQuiz(); router.push("/quiz"); }}
                    className="flex-1 py-3 text-sm border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Retake Quiz
                </button>
                <Link href="/dashboard" className="flex-1 py-3 text-sm bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-center font-medium">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}