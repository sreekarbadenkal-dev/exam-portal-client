import React, { useContext, useEffect, useState } from 'react';
import { studentuser } from '../contexts/StudentContext'; // Ensure this path is correct
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link,useNavigate } from 'react-router-dom';
import { ExamService } from '../services/ExamService';

const StudentHome = () => {
    const { globalstate,logout } = useContext(studentuser);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate()

    useEffect(() => {
        const fetchMyExams = async () => {
            if (!globalstate.user) return;

            try {
                setLoading(true);
                // We send the whole user object as the RequestBody
                // const response = await axios.post(
                //     "http://localhost:8080/api/exams/studentexampage", 
                //     globalstate.user
                // );
                // setExams(response.data);
                const response=await ExamService.findExamsforStudnet(globalstate.user);
                setExams(response);
            } catch (err) {
                // If the backend returns 404 "No Exams for Now", we catch it here
                if (err.response?.status === 404) {
                    setExams([]);
                } else {
                    toast.error("Failed to connect to server");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyExams();
    }, [globalstate.user]);


    console.log(globalstate);
    
    const handleSelectedExam=(examId)=>{
        console.log(examId);
        navigate(`/exampage/${examId}`);
    }

    if (loading) return <div className="p-10 text-center">Loading Exams...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, {globalstate.user?.name}
                    </h1>
                    <p className="text-gray-600">
                        Showing exams for {globalstate.user?.department} - Semester {globalstate.user?.semester}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 hover:shadow-lg transition">
                                <h2 className="text-xl font-bold mb-2">{exam.title}</h2>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                    <span>⏱ {exam.examtime} Mins</span>
                                    <span>📚 {exam.questions?.length || 0} Questions</span>
                                </div>
                                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => handleSelectedExam(exam.id)}>
                                    Start Exam
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-300">
                            <p className="text-gray-400 text-lg">No exams found for your department and semester.</p>
                        </div>
                    )}
                </div>
                <div className='mt-8 text-center'>
                    <Link className="text-blue-600 hover:underline" to="/studentlogin" onClick={logout}>
                        
                        Do you want to login with another account?
                    </Link>
                    <p className="text-gray-500 mt-2">
                        This will clear your current session. If you want to login with another account, please click the link above.
                    </p>
                    <p className="text-gray-500 mt-2">
                        Don't have an account?{' '}
                        <Link className="text-blue-600 hover:underline" to="/studentregister" onClick={logout}>
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
            
        </div>
    );
};

export default StudentHome;