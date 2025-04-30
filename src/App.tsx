import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import MemberManagement from "./pages/MemberManagement";
import AdminManagement from "./pages/AdminManagement";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
          <Route path="*" element={<Navigate to="/overview" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
