import springExamAxios from "../axiosinstance/SpringExamsAxios.js";

export const ExamService = {
    // This sends your "Paper" object to PostgreSQL
    createExam: async (payload) => {
        try {
            // This hits http://localhost:8080/api/exams/create
            const { data } = await springExamAxios.post("api/exams/create", payload);
            return data;
        } catch (error) {
            console.error("Error in createExam Service:", error);
            throw error; // Pass the error back to the component to handle
        }
    },

    // Optional: Get all exams to verify they saved
    getAllExams: async () => {
        const { data } = await springExamAxios.get("api/exams/all");
        return data;
    }
};