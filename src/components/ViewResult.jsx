import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentuser } from '../contexts/StudentContext';
import { ExamService } from '../services/ExamService';
import { IoMdArrowBack } from "react-icons/io";
import { FaTrophy, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";
import toast from 'react-hot-toast';

const ViewResult = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { globalstate } = useContext(studentuser);
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Calls your new ExamService.getResultById
                const data = await ExamService.getResultById(id);
                setResultData(data);
            } catch (err) {
                toast.error("Could not fetch result details");
                navigate('/studenthome');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Fetching your scores...</p>
        </div>
    );

    if (!resultData) return null;

    // Logic based on your Result entity fields
    const score = resultData.marksGot;
    const total = resultData.correctAnswers; // In your controller, you set this to totalQuestions
    const percentage = (score / total) * 100;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-10">
            <div className="max-w-4xl mx-auto">
                
                {/* Navigation Header */}
                <button 
                    onClick={() => navigate('/studenthome')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-semibold transition-colors"
                >
                    <IoMdArrowBack /> Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    
                    {/* Top Banner */}
                    <div className="bg-linear-to-r from-green-500 to-teal-600 p-8 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-black">{resultData.examTitle}</h1>
                                <p className="text-green-50 mt-2 opacity-90 flex items-center gap-2">
                                    <FaCalendarAlt /> Attempted on {resultData.submittedAt}
                                </p>
                            </div>
                            <FaTrophy className="text-6xl text-yellow-300 drop-shadow-lg hidden sm:block" />
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Score Visualization */}
                        <div className="flex flex-col items-center justify-center mb-12">
                            <div className="relative">
                                {/* Large Progress Circle */}
                                <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="block text-6xl font-black text-gray-800">{score}</span>
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Out of {total}</span>
                                    </div>
                                </div>
                                {/* Percentage Badge */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full font-bold shadow-xl">
                                    {percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                                    <FaUserGraduate size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Candidate</p>
                                    <p className="text-xl font-bold text-gray-800">{globalstate.user?.username}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="bg-green-100 p-4 rounded-full text-green-600">
                                    <FaTrophy size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Performance</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {percentage >= 40 ? "Pass" : "Not Qualified"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 text-center">
                            {/* NEW: Button to navigate to Detailed Review */}
                            <div className="mb-6">
                                <button 
                                    onClick={() => navigate(`/viewdetailedresult/${id}`, { state: { resultData } })}
                                    className="px-8 py-2 bg-blue-50 text-blue-600 font-bold rounded-full border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
                                >
                                    Review Detailed Analysis
                                </button>
                                <p className="text-gray-400 text-xs mt-3">
                                    Click above to view question-wise corrections and explanations.
                                </p>
                            </div>

                            {/* Existing Print Button */}
                            <button 
                                onClick={() => window.print()}
                                className="px-10 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                Print Official Result
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewResult;