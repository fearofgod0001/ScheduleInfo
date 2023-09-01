import "./App.css";
import ContentsStore from "./context/contextApi";
import CalndarInfo from "./page/calender";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ContentsStore>
      <Router>
        <Routes>
          <Route path="/" element={<CalndarInfo />} />
        </Routes>
      </Router>
    </ContentsStore>
  );
}

export default App;
