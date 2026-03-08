import React, { useContext, useEffect, useState } from 'react';
import { studentuser } from '../contexts/StudentContext'; 
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { ExamService } from '../services/ExamService';

const StudentHome = () => {
    const { globalstate, logout } = useContext(studentuser);
    const [pendingexams, setPendingExams] = useState([]);
    const [completedexams, setCompletedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyExams = async () => {
            if (!globalstate.user) return;
            try {
                setLoading(true);
                const response = await ExamService.findExamsforStudnet(globalstate.user);
                setPendingExams(response.pending || []);
                setCompletedExams(response.attempted || []); 
            } catch (err) {
                toast.error("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };
        fetchMyExams();
    }, [globalstate.user]);

    const handleSelectedExam = (examId) => navigate(`/exampage/${examId}`);
    
    // Placeholder for your future result details method
    const handleViewResult = (resultId) => {
        console.log("Viewing result:", resultId);
        navigate(`/viewresult/${resultId}`);
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 font-medium">Loading Dashboard...</div>;

    return (
        <div className="h-screen bg-gray-100 p-4 md:p-6 overflow-hidden flex flex-col">
            <div className="max-w-8xl mx-auto w-full bg-white rounded-lg shadow-lg flex flex-col grow overflow-hidden">
                
                {/* Header Section */}
                <header className="p-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {globalstate.user?.username}</h1>
                    <p className="text-gray-600">Showing exams for {globalstate.user?.department} - Semester {globalstate.user?.semester}</p>
                </header>

                {/* Main Content Area */}
                <main className="grow overflow-y-auto p-6 custom-scrollbar">
                    
                    {/* Pending Exams Section */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Exams</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pendingexams.length > 0 ? (
                                pendingexams.map((exam) => (
                                    <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 hover:shadow-lg transition">
                                        <h2 className="text-xl font-bold mb-2 text-gray-800">{exam.title}</h2>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                            <span>⏱ {exam.examtime} Mins</span>
                                            <span>📚 {exam.questions?.length || 0} Questions</span>
                                        </div>
                                        <button 
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" 
                                            onClick={() => handleSelectedExam(exam.id)}
                                        >
                                            Start Exam
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-300">
                                    <p className="text-gray-400 text-lg">Rejoice no exams are left</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Completed Exams Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Completed Exams</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {completedexams.length > 0 ? (
                                completedexams.map((result, index) => (
                                    <div key={index} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500 hover:shadow-lg transition">
                                        <h2 className="text-xl font-bold mb-2 text-gray-800">{result.examTitle}</h2>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                            <span className="font-bold text-green-600">Score: {result.marksGot}</span>
                                            <span>📅 {new Date(result.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                        <button 
                                            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                                            onClick={() => handleViewResult(result.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-300">
                                    <p className="text-gray-400 text-lg">No completed exams found.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer Links */}
                <footer className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                        <div className="text-center">
                            <Link className="text-blue-600 font-bold hover:underline" to="/studentlogin" onClick={logout}>
                                Login with another account?
                            </Link>
                            <p className="text-gray-500 text-xs mt-1">This will clear your current session.</p>
                        </div>
                        <div className="hidden md:block h-8 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <Link className="text-blue-600 font-bold hover:underline" to="/studentregister" onClick={logout}>
                                Register New Account
                            </Link>
                            <p className="text-gray-500 text-xs mt-1">Create a new student profile.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default StudentHome;