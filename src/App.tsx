import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";

// Import store
import { useChildrenStore } from "../src/stores/childrenStore"; // Sesuaikan path
import { useFacilitiesStore } from "./stores/facilitiesStore";
import { useKecamatanStore } from "./stores/kecamatanStore";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";
import PublicLayout from "./components/layouts/PublicLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import PublicMapPage from "./pages/public/PublicMapPage";
import PublicStatsPage from "./pages/public/PublicStatsPage";

// Protected Pages
// import DashboardPage from "./pages/dashboard/DashboardPage";
import ChildrenPage from "./pages/dashboard/ChildrenPage";
import ChildFormPage from "./pages/dashboard/ChildFormPage";
// import FacilitiesPage from "./pages/dashboard/FacilitiesPage";
// import MapAnalysisPage from "./pages/dashboard/MapAnalysisPage";
// import StatisticsPage from "./pages/dashboard/StatisticsPage";
// import FacilityFormPage from "./pages/dashboard/FacilityFormPage";

//auth
import Test from "./pages/testSupabase";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Protected route component
import ProtectedRoute from "../src/helper/ProtectedRoute";

function App() {
  // Inisialisasi store
  const { initializeFromSupabase } = useChildrenStore();
  const { initializeFromSupabase: initializeFacilitiesFromSupabase } =
    useFacilitiesStore();

  const { initializeFromSupabase: initializeKecamatanFromSupabase } =
    useKecamatanStore();

  useEffect(() => {
    // Inisialisasi data dari Supabase saat aplikasi dimuat
    initializeFromSupabase();
    initializeFacilitiesFromSupabase();
    initializeKecamatanFromSupabase();
  }, [
    initializeFromSupabase,
    initializeFacilitiesFromSupabase,
    initializeKecamatanFromSupabase,
  ]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route path="test-supabase" element={<Test />} />
          <Route index element={<HomePage />} />
          <Route path="map" element={<PublicMapPage />} />
          <Route path="statistics" element={<PublicStatsPage />} />
        </Route>

        {/* auth routes */}
        <Route path="/admincore/login" element={<LoginPage />} />
        <Route path="/admincore/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route index element={<DashboardPage />} /> */}
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
          {/* <Route path="facilities" element={<FacilitiesPage />} />
          <Route
            path="facilities/add"
            element={
              <ProtectedRoute>
                <FacilityFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="facilities/edit/:id"
            element={
              <ProtectedRoute>
                <FacilityFormPage />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route path="map-analysis" element={<MapAnalysisPage />} />
          <Route path="statistics" element={<StatisticsPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
