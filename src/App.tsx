import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import MemberManagement from "./pages/MemberManagement";
import AdminManagement from "./pages/AdminManagement";
import NewMember from "./pages/NewMember";
import FollowUpMembers from "./pages/FollowUpMembers";
import Evangelism from "./pages/Evangelism";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/follow-up"
            element={
              <ProtectedRoute>
                <FollowUpMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MemberManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins"
            element={
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comms"
            element={
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evangelism"
            element={
              <ProtectedRoute>
                <Evangelism />
              </ProtectedRoute>
            }
          />
          <Route path="/new" element={<NewMember />} />
          <Route path="*" element={<Navigate to="/overview" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
