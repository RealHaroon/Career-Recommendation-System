"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", form);
            setAuth(data.data.user, data.data.token);
            router.push("/quiz");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <Link href="/" className="text-teal-700 font-bold text-lg block mb-8">CareerAI</Link>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h2>
                <p className="text-sm text-slate-500 mb-8">Get your personalized career recommendation</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: "Full Name", key: "name", type: "text", placeholder: "Haroon Ahmed" },
                        { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
                        { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                            <input
                                type={field.type}
                                required
                                value={form[field.key]}
                                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-slate-500 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-teal-700 font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}