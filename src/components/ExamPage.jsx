import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamService } from '../services/ExamService';
import { studentuser } from '../contexts/StudentContext';
import QuestionComp from './QuestionComp';
import axios from 'axios';

const ExamPage = () => {
    // --- 1. State Management ---
    const [exam, setExam] = useState();
    const [currenttime, setCurrentTime] = useState();
    const { examid } = useParams();
    const navigate = useNavigate();

    const { globalstate } = useContext(studentuser);
    const student = globalstate.user;

    const [currentQuestion, setCurrentQuestion] = useState({});
    
    // This state tracks: { questionId: "selectedOptionText" }
    const [selectedAnswers, setSelectedAnswers] = useState({}); 

    // --- 2. Data Loading Logic ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await ExamService.getExamById(examid);
                setExam(data);
                setCurrentQuestion({ ...data.questions[0], qno: 1 });
                setCurrentTime(data.examtime * 60);
                console.log("Exam Loaded:", data);
            } catch (err) {
                console.error("Error fetching exam:", err);
            }
        };

        if (examid) loadData();
    }, [examid]);


    // --- 3. Timer & Auto-Submit Logic ---
    useEffect(() => {
        if (currenttime <= 0) {
            if (currenttime === 0) handleSubmit(); // Trigger auto-submit at 0
            return;
        }

        const timerId = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [currenttime]);


    // --- 4. Result Handling Logic (The "Java Way") ---
    
    // Function to handle answer selection from QuestionComp
    const handleAnswerSelect = (questionId, optionId) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionId.toString()
        }));
    };

    // The Main Submission Function
    const handleSubmit = async () => {
        // Construct the DTO to match your Java AnswerSubmissionDTO
        const submissionData = {
            examid: exam.id,
            studentid: student.id,
            selectedOptions: selectedAnswers 
        };

        try {
            console.log("Submitting to Backend:", submissionData);
            
            // Sending to your new ResultController
            const response = await ExamService.submitExamResult(submissionData);
            
            console.log("Result Saved Successfully:", response.data);

            // Redirect to a summary page and pass the result object
            navigate('/resultsummary', { state: { result: response } });
            
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Error submitting exam. Please check your connection.");
        }
    };


    // --- 5. Navigation Logic ---
    const handleCurrentQuestion = (question, ind) => {
        setCurrentQuestion({ ...question, qno: ind });
    };

    const displayTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };


    // --- 6. Render ---
    return (
        <div className='min-h-screen w-full flex flex-col bg-[#f8fafc] text-slate-800 font-sans'>

            {/* Global Navigation Bar */}
            <div className='w-full h-16 flex items-center justify-between px-6 bg-white shadow-sm border-b border-slate-200 z-10'>
                <h1 className='text-xl font-black text-blue-600 tracking-tighter'>MY EXAM APP</h1>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        Finish Exam
                    </button>
                </div>
            </div>

            <div className='flex-1 w-full flex flex-col md:flex-row p-4 md:p-6 gap-6 overflow-hidden'>

                {/* Left Side: Question Area (75%) */}
                <div className='w-full md:w-3/4 flex flex-col gap-4 p-6 md:p-8 rounded-3xl bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-200 overflow-y-auto'>
                    
                    {/* Header */}
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight'>
                                {exam?.title} <span className='text-blue-600 font-medium'>Exam</span>
                            </h1>
                            <p className='text-slate-500 font-medium mt-1'>Student: {student["username"]}</p>
                        </div>

                        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl font-mono text-xl font-bold transition-all duration-300 ${
                            currenttime < 60 ? 'bg-red-50 text-red-600 animate-pulse border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                            <span>{displayTime(currenttime)}</span>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className='w-full mt-2'>
                        {currentQuestion.id ? (
                            <div className="w-full">
                                {/* Added onSelect prop to capture answer in the parent state */}
                                <QuestionComp 
                                    question={currentQuestion} 
                                    selectedAnswer={selectedAnswers[currentQuestion.id]}
                                    onSelect={(optionId) => handleAnswerSelect(currentQuestion.id, optionId)}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                                <p>Initializing Exam Content...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sidebar Palette (25%) */}
                <div className='w-full md:w-1/4 flex flex-col bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] rounded-3xl border border-slate-200 p-6 gap-6 h-fit md:sticky md:top-6'>
                    <h2 className='text-xl font-bold text-slate-900 border-b pb-4'>Questions</h2>
                    
                    <div className='grid grid-cols-5 gap-3'>
                        {exam?.questions?.map((question, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleCurrentQuestion(question, index + 1)} 
                                className={`h-12 w-12 text-sm font-bold rounded-xl border-2 transition-all ${
                                    currentQuestion?.qno === index + 1
                                        ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-md'
                                        : selectedAnswers[question.id] // Highlight answered questions
                                            ? 'bg-green-50 text-green-600 border-green-200'
                                            : 'bg-gray-50 text-slate-500 border-gray-50 hover:border-blue-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamPage;