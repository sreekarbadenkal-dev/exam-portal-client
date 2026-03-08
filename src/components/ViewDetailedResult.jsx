import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const ViewDetailedResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.resultData;

    if (!result) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-4 font-medium">No review data found.</p>
                <button 
                    onClick={() => navigate('/studenthome')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 mb-8 text-gray-600 hover:text-blue-600 font-bold transition-colors"
                >
                    <IoMdArrowBack /> Back to Scorecard
                </button>

                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-gray-800 mb-2">Detailed Analysis</h2>
                        <p className="text-gray-500 font-medium">
                            Exam: <span className="text-blue-600">{result.examTitle}</span>
                        </p>
                    </div>
                    {/* Visual Legend */}
                    <div className="hidden md:flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Correct Choice</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Your Mistake</div>
                    </div>
                </div>

                <div className="space-y-8">
                    {result.exam?.questions?.map((q, idx) => (
                        <div key={q.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-start gap-4 mb-8">
                                <span className="bg-gray-100 text-gray-500 h-8 w-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="text-xl font-bold text-gray-800 leading-tight">
                                    {q.questiontext}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options?.map((opt) => {
                                    const isCorrect = String(opt.id) === String(q.correctoption);
                                    
                                    // Identify if the student selected this specific option
                                    const isStudentPick = result.studentAnswers?.some(
                                        ans => String(ans.questionId) === String(q.id) && String(ans.selectedOptionId) === String(opt.id)
                                    );

                                    // Determine the color logic requested
                                    let cardStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
                                    let icon = null;

                                    if (isCorrect && isStudentPick) {
                                        // Student matched the correct option
                                        cardStyle = "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-md ring-2 ring-blue-100";
                                        icon = <FaCheckCircle className="text-blue-600 text-xl" />;
                                    } else if (isCorrect) {
                                        // Option is correct but student didn't pick it
                                        cardStyle = "bg-green-50 border-green-500 text-green-700 font-bold opacity-100";
                                        icon = <FaCheckCircle className="text-green-600 text-xl" />;
                                    } else if (isStudentPick) {
                                        // Student picked this, but it is wrong
                                        cardStyle = "bg-red-50 border-red-500 text-red-700 font-bold opacity-100";
                                        icon = <FaTimesCircle className="text-red-600 text-xl" />;
                                    }

                                    return (
                                        <div 
                                            key={opt.id} 
                                            className={`p-5 rounded-2xl border-2 flex justify-between items-center transition-all duration-300 ${cardStyle}`}
                                        >
                                            <span className="text-lg">{opt.text}</span>
                                            <div className="flex items-center gap-2">
                                                {isCorrect && isStudentPick && <span className="text-[10px] uppercase">Excellent</span>}
                                                {isStudentPick && !isCorrect && <span className="text-[10px] uppercase">Your Pick</span>}
                                                {isCorrect && !isStudentPick && <span className="text-[10px] uppercase tracking-tighter">Answer</span>}
                                                {icon}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {!result.studentAnswers || result.studentAnswers.length === 0 ? (
                    <div className="mt-12 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center gap-4 text-yellow-800">
                        <FaInfoCircle className="shrink-0 text-xl" />
                        <p className="text-sm font-medium">
                            Attempt history is unavailable for this older record. Only the correct answer keys (Green) are displayed.
                        </p>
                    </div>
                ) : null}

                <div className="mt-12 text-center text-gray-400 text-sm font-medium">
                    End of Analysis • {result.examTitle}
                </div>
            </div>
        </div>
    );
};

export default ViewDetailedResult;