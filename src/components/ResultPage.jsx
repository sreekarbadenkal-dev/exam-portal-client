import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract the result data passed from ExamPage via navigate()
    const { result } = location.state || {};

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">No Result Data Found</h2>
                    <button 
                        onClick={() => navigate('/studentdashboard')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const percentage = (result.marksGot / result.correctAnswers) * 100;
    // Assuming a 40% pass criteria, or you can use result.exam.passpercentage if available
    const isPassed = percentage >= 40; 

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-12 text-center">
                
                {/* Header Section */}
                <div className="mb-8">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 ${
                        isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {isPassed ? '🎊 Examination Passed' : '⚠️ Needs Improvement'}
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {result.examTitle}
                    </h1>
                    <p className="text-slate-500 mt-2">Submitted on {result.submittedAt}</p>
                </div>

                {/* Score Circle */}
                <div className="relative w-48 h-48 mx-auto mb-10">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96" cy="96" r="88"
                            stroke="currentColor" strokeWidth="12" fill="transparent"
                            className="text-slate-100"
                        />
                        <circle
                            cx="96" cy="96" r="88"
                            stroke="currentColor" strokeWidth="12" fill="transparent"
                            strokeDasharray={553}
                            strokeDashoffset={553 - (553 * percentage) / 100}
                            className={`${isPassed ? 'text-blue-600' : 'text-red-500'} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-slate-900">{Math.round(percentage)}%</span>
                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Score</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-1">Correct Answers</p>
                        <p className="text-2xl font-black text-slate-900">{result.marksGot} / {result.correctAnswers}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-1">Student ID</p>
                        <p className="text-2xl font-black text-slate-900">#{result.student?.id || 'N/A'}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                    >
                        Download Report
                    </button>
                    <button 
                        onClick={() => navigate('/studenthome')}
                        className="flex-1 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Back to Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ResultPage;