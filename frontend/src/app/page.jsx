import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
            <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
                <span className="text-xl font-bold text-teal-700">CareerAI</span>
                <div className="flex gap-4">
                    <Link href="/login" className="text-sm text-slate-600 hover:text-teal-700 transition-colors px-4 py-2">
                        Login
                    </Link>
                    <Link href="/register" className="text-sm bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 pt-20 pb-32 text-center">
                <span className="inline-block text-xs font-medium bg-teal-100 text-teal-700 px-3 py-1 rounded-full mb-6">
                    Powered by Machine Learning
                </span>
                <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
                    Discover the career <br />
                    <span className="text-teal-700">you were built for</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
                    Answer a few questions about your education, skills, and interests. Our ML model analyzes your profile and recommends the most suitable tech careers.
                </p>
                <Link href="/register" className="inline-block bg-teal-700 text-white px-8 py-3 rounded-xl text-base font-medium hover:bg-teal-800 transition-colors shadow-lg shadow-teal-200">
                    Start Free Assessment
                </Link>

                <div className="grid grid-cols-3 gap-8 mt-24 text-left">
                    {[
                        { title: "15 Career Paths", desc: "From Software Engineer to AI Research Scientist" },
                        { title: "ML Powered", desc: "Random Forest model trained on real career data" },
                        { title: "Top 5 Matches", desc: "See ranked results with confidence scores" },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}