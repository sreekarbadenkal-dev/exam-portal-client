import springExamAxios from "../axiosinstance/SpringExamsAxios";

export const StudentService={
    createStudent: async (payload)=>{
        try{
            const {data}=await springExamAxios.post("api/studentlogin/create",payload);
            return data;
        }
        catch(err){
            console.error(err);
            throw err;
        }
    },

    getStudent: async ()=>{
        try{
            const {data}=await springExamAxios.get("api/studentlogin/all");
            return data;
        }
        catch(err){
            console.error(err);
            throw err;
        }
    },

    loginStudent: async (payload)=>{
        try{
            const {data}=await springExamAxios.post("api/studentlogin",payload);
            return data;
        }
        catch(err)
        {
            console.error(err);
            throw err;
        }
    }
};