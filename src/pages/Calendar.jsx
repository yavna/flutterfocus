import { useState } from "react";
import { format } from "date-fns";

function Calendar() {
  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  const addExam = () => {
    setExams([...exams, { name: examName, date: examDate }]);
    setExamName("");
    setExamDate("");
  };

  return (
    <div>
      <h2>Study Calendar</h2>
      <input
        type="text"
        placeholder="Exam Name"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
      />
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />
      <button onClick={addExam}>Add Exam</button>

      <ul>
        {exams.map((exam, index) => (
          <li key={index}>
            {exam.name} - {format(new Date(exam.date), "PP")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Calendar;