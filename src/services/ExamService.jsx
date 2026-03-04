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
    },

    findExamsforStudnet: async (payload) => {
        try{
            const { data } = await springExamAxios.post("api/exams/studentexampage", payload);
            return data;
        }
        catch (error) {
            console.error("Error in findExamsforStudnet Service:", error);
            throw error;
        }
    },

    getExamById: async (id) => {
        try {
            const { data } = await springExamAxios.get(`api/exams/${id}`);          
            return data;
        } catch (error) {
            console.error("Error in getExamById Service:", error);  
            throw error;
        }
    },

    // Add this inside your ExamService object
    submitExamResult: async (submissionData) => {
        try {
            // This uses your instance to hit: https://your-render-url.com/api/results/submit
            const { data } = await springExamAxios.post("api/results/submit", submissionData);
            return data;
        } catch (error) {
            console.error("Error in submitExamResult Service:", error);
            throw error;
        }
    }
}