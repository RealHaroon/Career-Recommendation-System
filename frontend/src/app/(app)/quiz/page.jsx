"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useQuizStore from "@/store/quizStore";

const STEPS = [
    {
        title: "Education Background",
        fields: [
            { label: "Gender", key: "gender", type: "select",
              options: ["Male", "Female"] },
            { label: "Undergraduate Degree", key: "ug_degree", type: "select",
              options: ["BSCS", "BSSE", "BSIT", "BCS", "BE", "BBA", "BS Economics", "MCS"] },
            { label: "Specialization", key: "specialization", type: "select",
              options: ["Computer Science", "Software Engineering", "Information Technology",
                        "Artificial Intelligence", "Cyber Security", "Data Science",
                        "Electrical Engineering", "Business Administration"] },
        ],
    },
    {
        title: "Academic Performance",
        fields: [
            { label: "CGPA (0.0 – 4.0)", key: "cgpa", type: "number", placeholder: "e.g. 3.2",
              min: 0, max: 4.0, step: 0.01 },
            { label: "Do you have a certification?", key: "has_certification", type: "select",
              options: ["Yes", "No"] },
            { label: "Certification Title", key: "certification_title", type: "select",
              options: ["None", "Oracle Java Certification", "AWS Certified Developer",
                        "Google Associate Engineer", "Meta Front-End Developer",
                        "freeCodeCamp Web Dev", "Full Stack Web Development",
                        "Google Associate Android Developer", "Flutter Development Bootcamp",
                        "React Native Certificate", "IBM Data Science", "Google Data Analytics",
                        "DataCamp Data Scientist", "Coursera ML Specialization",
                        "Deep Learning Specialization", "TensorFlow Developer Certificate",
                        "AWS ML Specialty", "Google ML Engineer", "AWS Solutions Architect",
                        "Microsoft Azure Administrator", "Google Cloud Professional",
                        "CompTIA Security+", "CEH Ethical Hacker", "CISSP",
                        "CCNA", "CCNP", "CompTIA Network+",
                        "Oracle DBA Certification", "MongoDB DBA", "AWS Database Specialty",
                        "Google UX Design Certificate", "Figma Certificate", "Adobe XD Certificate",
                        "AWS DevOps Engineer", "Docker Certified Associate", "Kubernetes CKA",
                        "CBAP Certification", "Power BI Certificate", "Google Project Management",
                        "ITIL Foundation", "PMP Certification", "Scrum Master PSM",
                        "DataCamp Data Analyst", "Excel MO-200",
                        "Unity Certified Developer", "Unreal Engine Certificate",
                        "GameDev.tv Certificate"] },
            { label: "Masters Degree (if any)", key: "masters_field", type: "select",
              options: ["No Masters", "MS CS", "MS SE", "MS Software Engineering",
                        "MS Web Technologies", "MS Mobile Computing",
                        "MS Data Science", "MS Statistics", "MS AI",
                        "MS Cloud Computing", "MS Information Systems",
                        "MS Cyber Security", "MS Information Security",
                        "MS Telecommunications", "MS Computer Networks",
                        "MS HCI", "MS Design",
                        "MS Business Analytics", "MS Project Management",
                        "MBA", "MCS", "PhD CS",
                        "MS Game Development"] },
        ],
    },
    {
        title: "Skills & Interests",
        fields: [
            { label: "Primary Interest Area", key: "interests", type: "select",
              options: [
                "Programming, Problem Solving, Software Development",
                "Web Development, Frontend, Backend Development",
                "Mobile Development, App Design, Programming",
                "Data Analysis, Machine Learning, Statistics",
                "Artificial Intelligence, Deep Learning, Research",
                "Cloud Computing, Infrastructure, DevOps",
                "Cyber Security, Ethical Hacking, Networking",
                "Networking, Hardware, System Administration",
                "Database Management, Data Modeling, Backend",
                "UI Design, User Experience, Graphic Design",
                "Automation, Cloud, CI/CD, System Design",
                "Business Strategy, Data Analysis, Management",
                "IT Management, Business Analysis, Consulting",
                "Data Visualization, Reporting, SQL, Excel",
                "Game Design, Programming, 3D Modeling, Unity",
              ]},
            { label: "Primary Skills", key: "skills", type: "select",
              options: [
                "Python, Java, C++, Git, SQL",
                "HTML, CSS, JavaScript, React, Node.js",
                "Flutter, React Native, Kotlin, Swift, Java",
                "Python, R, Machine Learning, SQL, Tableau",
                "Python, TensorFlow, PyTorch, NLP, Mathematics",
                "AWS, Azure, Docker, Kubernetes, Terraform",
                "Linux, Ethical Hacking, Python, Cryptography, SIEM",
                "CCNA, TCP/IP, Routing, Firewalls, Linux",
                "SQL, Oracle, MySQL, MongoDB, PostgreSQL",
                "Figma, Adobe XD, Photoshop, Prototyping, CSS",
                "Docker, Kubernetes, Jenkins, AWS, CI/CD",
                "Excel, SQL, Power BI, Communication, JIRA",
                "ERP, Project Management, SQL, Communication, Excel",
                "Excel, SQL, Power BI, Python, Tableau",
                "Unity, C#, Unreal Engine, Blender, C++",
              ]},
            { label: "Currently Working?", key: "is_working", type: "select",
              options: ["Yes", "No"] },
        ],
    },
];

export default function QuizPage() {
    const router = useRouter();
    const { currentStep, answers, setAnswer, nextStep, prevStep, setResult } = useQuizStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const step   = STEPS[currentStep];
    const isLast = currentStep === STEPS.length - 1;

    const OPTIONAL_KEYS = ["certification_title", "masters_field"];

    const handleNext = () => {
        for (const field of STEPS[currentStep].fields) {
            if (!answers[field.key] && !OPTIONAL_KEYS.includes(field.key)) {
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
                cgpa:                parseFloat(answers.cgpa),
                certification_title: answers.certification_title || "None",
                masters_field:       answers.masters_field       || "No Masters",
            };
            const { data } = await api.post("/recommend", payload);
            setResult(data.data);
            router.push("/results");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Is the ML service running?");
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
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
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
                                    type="number"
                                    value={answers[field.key] || ""}
                                    onChange={(e) => setAnswer(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
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
                            {loading ? "Analyzing your profile..." : "Get My Recommendation →"}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 text-sm bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
                        >
                            Next Step →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}