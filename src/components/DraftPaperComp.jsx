import React from 'react'
import { CiSquareRemove } from "react-icons/ci";
import Loader from './Loader'; // Ensure the path is correct

const DraftPaperComp = ({ examtitle, handleSubmit, examquestions, onDelete, isLoading }) => {
  return (
    <div className="flex flex-col gap-8 w-full items-center pb-20">
      <h1 className='min-h-16 w-full bg-white text-blue-600 text-3xl font-black flex justify-center items-center capitalize rounded-2xl shadow-2xl px-6 text-center border-b-4 border-blue-100'>
        {examtitle || "Untitled Exam"}
      </h1>

      {examquestions.map((e, index) => (
        <div className='w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 relative group' key={e.id}>
          <div className='flex justify-between items-start gap-4'>
            <div className='flex gap-4 items-start'>
              <span className='size-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg'>Q{index+1}</span>
              <p className='text-2xl font-bold text-gray-800 leading-tight pt-1'>{e.questiontext}</p>
            </div>
            <button 
              onClick={() => onDelete(e.id)} 
              disabled={isLoading} 
              className='text-gray-300 hover:text-red-500 transition-colors cursor-pointer pt-1 disabled:hidden'
            >
              <CiSquareRemove size={40}/>
            </button>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {e.options.map((opt, i) => (
              <div key={opt.id} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${opt.id === e.correctoption ? 'border-green-500 bg-green-50/50 shadow-md' : 'border-gray-50 bg-gray-50'}`}>
                <span className='font-black text-blue-600 text-xl'>{String.fromCharCode(65+i)}.</span>
                <span className='text-gray-700 text-lg font-medium'>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {examquestions.length > 0 && (
        <button 
          className='h-16 w-full rounded-2xl bg-amber-300 text-2xl font-black text-amber-900 shadow-2xl hover:bg-amber-400 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer border-b-4 border-amber-500 flex justify-center items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed' 
          onClick={handleSubmit}
          disabled={isLoading} // PREVENTS DUPLICATE ENTRIES
        >
          {isLoading ? (
            <>
              <Loader /> <span>SUBMITTING...</span>
            </>
          ) : (
            "FINISH & SUBMIT EXAM"
          )}
        </button>
      )}
    </div>
  )
}
export default DraftPaperComp