import { Login_register } from "./routes/Login_register.jsx";
import { Home } from "./routes/Home.jsx";
import User_info from "./routes/User_info.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login_register />} />
          <Route path="/userInfo" element={<User_info />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
