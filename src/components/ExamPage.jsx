import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamService } from '../services/ExamService';
import { studentuser } from '../contexts/StudentContext';
import QuestionComp from './QuestionComp';
import toast from 'react-hot-toast';

const ExamPage = () => {
    // --- 1. State Management ---
    const [exam, setExam] = useState();
    const [currenttime, setCurrentTime] = useState();
    const { examid } = useParams();
    const navigate = useNavigate();

    const { globalstate } = useContext(studentuser);
    const student = globalstate.user;

    const [currentQuestion, setCurrentQuestion] = useState({});
    
    // Tracks: { questionId: "selectedOptionId" }
    const [selectedAnswers, setSelectedAnswers] = useState({}); 

    // --- 2. Data Loading Logic ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await ExamService.getExamById(examid);
                setExam(data);
                // Initialize first question with number 1
                setCurrentQuestion({ ...data.questions[0], qno: 1 });
                setCurrentTime(data.examtime * 60);
            } catch (err) {
                console.error("Error fetching exam:", err);
                toast.error("Failed to load exam details.");
            }
        };

        if (examid) loadData();
    }, [examid]);


    // --- 3. Timer & Auto-Submit Logic ---
    useEffect(() => {
        if (currenttime === 0) {
            handleSubmit(); 
            return;
        }
        if (currenttime < 0) return;

        const timerId = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [currenttime]);


    // --- 4. Result Handling Logic ---
    
    // Capture answer selection and store as String to match Java Map<Long, String>
    const handleAnswerSelect = (questionId, optionId) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionId.toString()
        }));
    };

    // The Main Submission Function updated for the new ResultController
    const handleSubmit = async () => {
        // Construct DTO: keys must match your AnswerSubmissionDTO.java exactly
        const submissionData = {
            examid: parseInt(examid),
            studentid: student.id,
            selectedOptions: selectedAnswers // Your controller uses 'getSelectedOptions()'
        };

        try {
            toast.loading("Grading your exam...", { id: "submit-toast" });
            
            // Sending to ResultController @PostMapping("/submit")
            const response = await ExamService.submitExamResult(submissionData);
            
            toast.success("Exam submitted successfully!", { id: "submit-toast" });

            // Navigate to view the scorecard using the newly created Result ID
            navigate(`/viewresult/${response.id}`);
            
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Submission failed. Please try again.", { id: "submit-toast" });
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
                <h1 className='text-xl font-black text-blue-600 tracking-tighter'>EXAM PORTAL</h1>
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

                {/* Left Side: Question Area */}
                <div className='w-full md:w-3/4 flex flex-col gap-4 p-6 md:p-8 rounded-3xl bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-200 overflow-y-auto'>
                    
                    {/* Header */}
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight'>
                                {exam?.title} <span className='text-blue-600 font-medium'>Exam</span>
                            </h1>
                            <p className='text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest'>Candidate: {student?.username}</p>
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
                                <QuestionComp 
                                    question={currentQuestion} 
                                    selectedAnswer={selectedAnswers[currentQuestion.id]}
                                    onSelect={(optionId) => handleAnswerSelect(currentQuestion.id, optionId)}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                                <p>Loading Exam Questions...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sidebar Palette */}
                <div className='w-full md:w-1/4 flex flex-col bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] rounded-3xl border border-slate-200 p-6 gap-6 h-fit md:sticky md:top-6'>
                    <div className='flex justify-between items-center border-b pb-4'>
                        <h2 className='text-xl font-bold text-slate-900'>Progress</h2>
                        <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md'>
                            {Object.keys(selectedAnswers).length} / {exam?.questions?.length} Solved
                        </span>
                    </div>
                    
                    <div className='grid grid-cols-5 gap-3'>
                        {exam?.questions?.map((question, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleCurrentQuestion(question, index + 1)} 
                                className={`h-11 w-11 text-sm font-bold rounded-xl border-2 transition-all ${
                                    currentQuestion?.qno === index + 1
                                        ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-md'
                                        : selectedAnswers[question.id] 
                                            ? 'bg-green-50 text-green-600 border-green-200 shadow-sm'
                                            : 'bg-gray-50 text-slate-400 border-transparent hover:border-slate-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className='mt-4 pt-4 border-t border-slate-100'>
                         <div className='flex items-center gap-2 text-xs font-bold text-slate-400 uppercase'>
                            <span className='w-2 h-2 bg-green-400 rounded-full'></span> Answered
                         </div>
                         <div className='flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mt-2'>
                            <span className='w-2 h-2 bg-blue-600 rounded-full'></span> Current
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamPage;