import { Login_register } from "./routes/Login_register.jsx";
import { Home } from "./routes/Home.jsx";
import Fill_up from "./routes/Fill_Up.jsx";
import User_info from "./routes/User_info.jsx";
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login_register />} />
          <Route path="/UserInfo" element={<User_info />} />
          <Route path="/FillUp" element={<Fill_up />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
