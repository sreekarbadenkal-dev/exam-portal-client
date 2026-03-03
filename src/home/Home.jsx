import React, { useState } from 'react'
import ExamBuilder from '../components/ExamBuilder'
import DraftPaperComp from '../components/DraftPaperComp'
import toast from 'react-hot-toast';
import { ExamService } from '../services/ExamService';
// import { IoMdArrowDropdownCircle } from "react-icons/io";
import Loader from '../components/Loader';

const Home = () => {
  const [examquestions, setExamQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [examData, setExamData] = useState({ title: "", examtime: "", department:[], semester: "", passpercentage:"" });
  const alldepts=[{value:"COMPUTER_SCIENCE",label:"Computer Science"},{value:"ARTIFICIAL_INTELLIGENCE",label:"Artificial Intelligence"},{value:"ACCOUNTING",label:"Accounting"},{value:"BOTANY", label:"Botany"},{value:"ZOOLOGY",label:"Zoology"}];
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "examtime" || name === "semester" || name==="passpercentage") && value !== "" && !/^\d+$/.test(value)) return;
    setExamData(prev => ({ ...prev, [name]: value }));
  };

  const deleteQuestion = (id) => setExamQuestions(prev => prev.filter(q => q.id !== id));
  const handleShow = () => setShow(!show);

  const handleSubmit = async (e) => {
      e.preventDefault();

      // 1. Guard Clause: Prevent double submission
      if (isLoading) return;

      if (!examData.title || examquestions.length === 0) {
          toast.error("Please provide a title and questions.");
          return;
      }

      // 2. Start Loader
      setIsLoading(true);

      try {
          const cleanPayload = {
              ...examData,
              id: null,
              questions: examquestions.map((q) => {
                  // Find index for correct option mapping
                  const correctIdx = q.options.findIndex(opt => opt.id === q.correctoption);
                  return {
                      ...q,
                      correctoption: correctIdx.toString(),
                      id: null,
                      options: q.options.map(({ id, ...optRest }) => ({ ...optRest, id: null }))
                  };
              })
          };

          const response = await ExamService.createExam(cleanPayload);
          console.log("Success:", response);
          toast.success("Exam Created Successfully!");

          // 3. Reset State on Success
          setExamData({ title: '', examtime: '', department: [], semester: '', passpercentage: '' });
          setExamQuestions([]);

      } catch (error) {
          console.error("Save failed:", error);
          toast.error(error.response?.data?.message || "Internal Server Error");
      } finally {
          // 4. Stop Loader regardless of success or failure
          setIsLoading(false);
      }
    };
  console.log(examData,examquestions);
  
  return (
    <div className='h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white'>
      
      {/* LEFT SIDE - Configuration */}
      <div className='w-full md:w-1/2 h-full flex flex-col p-4 md:p-10 overflow-y-auto border-r-2 border-gray-100'>
        <div className='flex flex-col gap-8 items-center w-[95%] mx-auto'>
          <h2 className="text-3xl font-black text-gray-800 self-start">Exam Setup</h2>
          
          {[
            { name: "title", label: "Exam Title", mode: "text" },
            { name: "examtime", label: "Time (mins)", mode: "numeric" },
            { name: "semester", label: "Semester", mode: "numeric" },
            { name: "passpercentage", label: "Pass Percentage %", mode:"numeric"}
          ].map((field) => (
            <div key={field.name} className='w-full h-14 border-2 rounded-xl relative shrink-0 bg-white'>
              <input 
                className="absolute px-4 w-full h-full bg-transparent outline-none text-xl z-1" 
                type="text" 
                autoComplete="off"
                inputMode={field.mode}
                name={field.name} 
                value={examData[field.name]} 
                onChange={handleChange} 
              />
              <label className={`absolute left-5 transition-all pointer-events-none z-10  bg-white
                ${examData[field.name] 
                  ? "top-0 -translate-y-1/2 text-[15px] text-blue-600 font-black px-1" 
                  : "top-1/2 -translate-y-1/2 text-xl text-gray-400"}`}>
                {field.label}
              </label>
            </div>
          ))}

          <div className='w-full flex flex-col gap-3 shrink-0'>
            <label className="text-sm font-bold text-gray-500 ml-1">Select Applicable Departments</label>
            <div className='flex flex-wrap gap-2'>
              {alldepts.map((dept) => {
                const isSelected = examData.department.includes(dept.value);
                return (
                  <button
                    key={dept.value}
                    onClick={() => {
                      const newDepts = isSelected 
                        ? examData.department.filter(d => d !== dept.value)
                        : [...examData.department, dept.value];
                      setExamData(prev => ({ ...prev, department: newDepts }));
                    }}
                    className={`px-4 py-2 rounded-full border-2 transition-all font-medium ${
                      isSelected 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {dept.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button className='h-14 w-full rounded-xl bg-amber-300 text-xl font-bold shadow-lg hover:bg-amber-400 cursor-pointer active:scale-95 transition-all' onClick={handleShow}>
            {show ? "Close Question Builder" : "Add New Question"}
          </button>
          
          {show && <ExamBuilder examquestions={examquestions} setExamQuestions={setExamQuestions} />}
        </div>
      </div>

      {/* RIGHT SIDE - Preview */}
      <div className='w-full md:w-1/2 h-full bg-blue-500 flex flex-col overflow-y-auto p-4 md:p-10'>
        {(examquestions.length > 0 || examData.title) ? (
          <DraftPaperComp 
            examquestions={examquestions} 
            handleSubmit={handleSubmit} 
            examtitle={examData.title} 
            onDelete={deleteQuestion}
            isLoading={isLoading} // <-- Pass this down!
          />
        ) : (
          <div className='m-auto text-white/50 text-2xl italic font-light'>
            Preview will appear here...
          </div>
        )}
      </div>
    </div>
  )
}
export default Home