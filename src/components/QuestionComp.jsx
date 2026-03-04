const QuestionComp = ({ question, selectedAnswer, onSelect }) => {
  return (
    <div className='p-4 md:p-8'>
      {/* Question Header */}
      <div className='flex flex-row items-center gap-4 mb-8'>
        <span className='whitespace-nowrap px-3 py-1 bg-blue-100 text-blue-700 text-md font-bold rounded-lg uppercase'>
            Q. No {question?.qno}
        </span>
        
        <h2 className='text-lg md:text-xl font-medium text-gray-800 leading-relaxed'>
            {question?.questiontext}
        </h2>
      </div>

      {/* Options List */}
      <div className='grid grid-cols-1 gap-3'>
        {question?.options?.map((option) => (
          <button 
            key={option.id}
            // Line 144: Triggers the parent's handleAnswerSelect with the unique Option ID
            onClick={() => onSelect(option.id)}
            
            // Line 146: Highlights the container if this ID is the current selection
            className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all shadow-sm flex items-center gap-3 active:scale-[0.98] ${
                String(selectedAnswer) === String(option.id) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-100 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {/* Line 153: Radio button circle filling logic */}
            <div className={`h-4 w-4 rounded-full border-2 transition-all ${
                String(selectedAnswer) === String(option.id) 
                ? 'border-blue-600 bg-blue-600' 
                : 'border-gray-300'
            }`} /> 
            
            {/* Line 159: Text styling for the selected option */}
            <span className={`text-sm md:text-base ${
                String(selectedAnswer) === String(option.id) ? 'text-blue-700 font-semibold' : ''
            }`}>
                {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionComp;