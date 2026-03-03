import React, { useState } from 'react'
import { SiTicktick } from "react-icons/si";
import { IoIosCloseCircle } from "react-icons/io";

const ExamBuilder = ({ examquestions, setExamQuestions }) => {
  const [question, setQuestion] = useState({ id: "", questiontext: "", options: [], correctoption: "" });
  const [showstate, setShowState] = useState(true);
  const [currentcorrectoption, setCurrentCorrectOption] = useState("");

  const handleOption = () => setQuestion(p => ({ ...p, options: [...p.options, { id: Date.now(), text: "" }] }));
  
  const addQuestion = () => {
    setExamQuestions([...examquestions, { ...question, id: Date.now() }]);
    setQuestion({ id: "", questiontext: "", options: [], correctoption: "" });
    setShowState(true);
    setCurrentCorrectOption("");
  };

  return (
    <div className='w-full bg-gray-50 p-6 rounded-2xl flex flex-col gap-6 border border-gray-200 shadow-inner'>
      
      {/* Question Input Container */}
      <div className='w-full h-14 border-2 bg-white rounded-xl relative overflow-visible'>
        <input 
          /* REMOVED inset-0, kept width/height full and added z-20 for cursor priority */
          className="w-full h-full px-4 bg-transparent outline-none text-xl z-20 relative rounded-xl" 
          type="text" 
          value={question.questiontext} 
          onChange={(e) => setQuestion(p => ({...p, questiontext: e.target.value}))}
        />
        <label className={`absolute left-3 transition-all pointer-events-none z-10 px-2 bg-white
          ${question.questiontext 
            ? "top-0 -translate-y-1/2 text-[15px] text-blue-600 font-black" 
            : "top-1/2 -translate-y-1/2 text-xl text-gray-400"}`}>
          Question Text
        </label>
      </div>

      <button className='h-12 px-6 self-end rounded-xl bg-green-500 text-white font-bold shadow-md hover:bg-green-600 cursor-pointer active:scale-95 transition-all' onClick={handleOption}>+ Add Option</button>

      {question.options.map((e) => (
        <div className='flex flex-row gap-3 items-center w-full' key={e.id}>
          <div className='flex-1 h-14 border-2 bg-white rounded-xl relative overflow-visible'>
            <input 
              /* Consistent change for options as well */
              className="w-full h-full px-4 bg-transparent outline-none text-lg z-20 relative rounded-xl" 
              type="text" 
              value={e.text} 
              onChange={(ex) => setQuestion(p => ({...p, options: p.options.map(o => o.id === e.id ? {...o, text: ex.target.value} : o)}))}
            />
            <label className={`absolute left-3 transition-all pointer-events-none z-10 px-2 
              ${e.text 
                ? "top-0 -translate-y-1/2 text-[12px] text-blue-500 font-black bg-white" 
                : "top-1/2 -translate-y-1/2 text-gray-400 bg-transparent"}`}>
              Option Content
            </label>
          </div>
          <button className='h-12 px-4 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 cursor-pointer' onClick={() => setQuestion(p => ({...p, options: p.options.filter(o => o.id !== e.id)}))}>Del</button>
          <button className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${currentcorrectoption === e.id ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}`} onClick={() => { setCurrentCorrectOption(e.id); setShowState(false); }}><SiTicktick size={24}/></button>
        </div>
      ))}

      {!showstate && (
        <button className='h-14 w-full bg-blue-600 text-white font-bold rounded-xl shadow-lg animate-pulse cursor-pointer' onClick={() => { setQuestion(p => ({...p, correctoption: currentcorrectoption})); setShowState(true); }}>Confirm Correct Option</button>
      )}

      <button className='h-14 w-full bg-gray-800 text-white font-black text-xl rounded-xl disabled:opacity-20 transition-all cursor-pointer' onClick={addQuestion} disabled={!question.correctoption || !question.questiontext}>Add to Paper</button>
    </div>
  )
}
export default ExamBuilder;