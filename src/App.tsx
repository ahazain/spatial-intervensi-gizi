import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useChildrenStore } from "./stores/childrenStore";
import { useFacilitiesStore } from "./stores/facilitiesStore";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";
import PublicLayout from "./components/layouts/PublicLayout";

import Test from "./pages/testSupabase";

// Public Pages
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import PublicMapPage from "./pages/public/PublicMapPage";
import PublicStatsPage from "./pages/public/PublicStatsPage";

// Protected Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ChildrenPage from "./pages/dashboard/ChildrenPage";
import ChildFormPage from "./pages/dashboard/ChildFormPage";
import FacilitiesPage from "./pages/dashboard/FacilitiesPage";
import FacilityFormPage from "./pages/dashboard/FacilityFormPage";
import MapAnalysisPage from "./pages/dashboard/MapAnalysisPage";
import StatisticsPage from "./pages/dashboard/StatisticsPage";

// Protected route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "officer" | "guest">;
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { fetchChildren } = useChildrenStore();
  const { fetchFacilities } = useFacilitiesStore();

  useEffect(() => {
    // Load initial data
    fetchChildren();
    fetchFacilities();
  }, [fetchChildren, fetchFacilities]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route path="/test-supabase" element={<Test />} />
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="map" element={<PublicMapPage />} />
          <Route path="statistics" element={<PublicStatsPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="children" element={<ChildrenPage />} />
          <Route
            path="children/add"
            element={
              <ProtectedRoute>
                <ChildFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="children/edit/:id"
            element={
              <ProtectedRoute>
                <ChildFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route
            path="facilities/add"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FacilityFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="facilities/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FacilityFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="map-analysis" element={<MapAnalysisPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
