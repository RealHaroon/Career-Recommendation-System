"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useQuizStore from "@/store/quizStore";

const STEPS = [
    {
        title: "Personal & Education",
        fields: [
            { label: "Gender", key: "gender", type: "select", options: ["Male", "Female", "Other"] },
            { label: "Undergraduate Course", key: "ug_course", type: "select", options: ["B.Tech", "BCA", "BSc", "BBA", "BCom", "BDes", "Diploma", "MSc"] },
            { label: "UG Specialization", key: "ug_specialization", type: "select", options: ["Computer Science", "Information Technology", "Software Engineering", "Electronics", "Mathematics", "Statistics", "Business Administration", "Commerce", "Management", "Design", "Visual Arts", "Physics", "Web Technology", "Engineering"] },
        ],
    },
    {
        title: "Academic Performance",
        fields: [
            { label: "CGPA / Percentage", key: "cgpa", type: "number", placeholder: "e.g. 8.5" },
            { label: "Did you complete any certification?", key: "has_certification", type: "select", options: ["Yes", "No"] },
            { label: "Certification Title (if any)", key: "certification_title", type: "text", placeholder: "e.g. AWS Solutions Architect" },
            { label: "Masters Degree (if any)", key: "masters_field", type: "text", placeholder: "e.g. M.Tech in CS or No Masters" },
        ],
    },
    {
        title: "Skills & Interests",
        fields: [
            { label: "Your Interests", key: "interests", type: "text", placeholder: "e.g. Artificial Intelligence, Deep Learning" },
            { label: "Your Skills", key: "skills", type: "text", placeholder: "e.g. Python, TensorFlow, SQL" },
            { label: "Are you currently working?", key: "is_working", type: "select", options: ["Yes", "No"] },
        ],
    },
];

export default function QuizPage() {
    const router = useRouter();
    const { currentStep, answers, setAnswer, nextStep, prevStep, setResult } = useQuizStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const step = STEPS[currentStep];
    const isLast = currentStep === STEPS.length - 1;

    const handleNext = () => {
        const current = STEPS[currentStep];
        for (const field of current.fields) {
            if (!answers[field.key] && field.key !== "certification_title" && field.key !== "masters_field") {
                setError(`Please fill in: ${field.label}`);
                return;
            }
        }
        setError("");
        nextStep();
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const payload = {
                ...answers,
                cgpa: parseFloat(answers.cgpa),
                certification_title: answers.certification_title || "None",
                masters_field: answers.masters_field || "No Masters",
            };
            const { data } = await api.post("/recommend", payload);
            setResult(data.data);
            router.push("/results");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${i <= currentStep ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-500"}`}>
                                {i + 1}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-0.5 w-12 transition-colors ${i < currentStep ? "bg-teal-700" : "bg-slate-200"}`} />
                            )}
                        </div>
                    ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{step.title}</h2>
                <p className="text-sm text-slate-400 mt-1">Step {currentStep + 1} of {STEPS.length}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {step.fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                {field.label}
                            </label>
                            {field.type === "select" ? (
                                <select
                                    value={answers[field.key] || ""}
                                    onChange={(e) => setAnswer(field.key, e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors bg-white"
                                >
                                    <option value="">Select an option</option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={answers[field.key] || ""}
                                    onChange={(e) => setAnswer(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    min={field.type === "number" ? 0 : undefined}
                                    max={field.type === "number" ? 10 : undefined}
                                    step={field.type === "number" ? 0.1 : undefined}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    {isLast ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2.5 text-sm bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60 font-medium"
                        >
                            {loading ? "Analyzing profile..." : "Get My Recommendation"}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 text-sm bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
                        >
                            Next Step
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}