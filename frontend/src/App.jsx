import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import AI from "./pages/AI";
import Auth from "./pages/Auth";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Auth />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/tasks"
          element={<ProtectedRoute><Tasks /></ProtectedRoute>}
        />

        <Route
          path="/add"
          element={<ProtectedRoute><AddTask /></ProtectedRoute>}
        />

        <Route
          path="/ai"
          element={<ProtectedRoute><AI /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;