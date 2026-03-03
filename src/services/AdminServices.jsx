import axiosInstance from "../axiosinstance/AxiosInstance";

export const AdminServices={
    registerAdmin:async(payload)=>{ 
            let {data}=await axiosInstance.post("api/auth/admin-register",payload)
            console.log(data);
            return data

    },
    loginAdmin:async(payload)=>{
        let {data}=await axiosInstance.post("api/auth/login",payload)
        return data
    },
    createExaminer:async(payload,token)=>{
        let {data}=await axiosInstance.post("api/auth/create-examiner",payload,{
            headers:{
                "Authorization":`${token}`
            }
        })
        return data
    }
}