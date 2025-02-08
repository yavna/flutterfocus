import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import StudyNow from "./pages/StudyNow";
import Garden from "./pages/Garden";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/study" element={<StudyNow />} />
        <Route path="/garden" element={<Garden />} />
      </Routes>
    </Router>
  );
}

export default App;
