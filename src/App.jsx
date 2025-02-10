import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "../src/assets/pages/home/Home";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import Login from "./assets/pages/login/Login";
import Register from "./assets/pages/register/Register";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
