import { create } from "zustand";

const useQuizStore = create((set) => ({
    currentStep: 0,
    answers: {
        gender: "",
        ug_course: "",
        ug_specialization: "",
        interests: "",
        skills: "",
        cgpa: "",
        has_certification: "No",
        certification_title: "None",
        is_working: "No",
        masters_field: "No Masters",
    },
    result: null,

    setAnswer: (key, value) =>
        set((state) => ({
            answers: { ...state.answers, [key]: value },
        })),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetQuiz: () => set({ currentStep: 0, answers: {}, result: null }),
    setResult: (result) => set({ result }),
}));

export default useQuizStore;