import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AllAppointments from "./pages/AllAppointments";
import AddDoctor from "./pages/Alldoctor";
import AllUsers from "./pages/AllUsers";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("adminToken");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />

        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/appointments"
          element={token ? <AllAppointments /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-doctor"
          element={token ? <AddDoctor /> : <Navigate to="/login" />}
        />

        <Route
          path="/users"
          element={token ? <AllUsers /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;