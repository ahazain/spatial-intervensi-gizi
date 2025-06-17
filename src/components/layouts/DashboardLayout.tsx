import React, { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Map,
  BarChart3,
  Building2,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import Logo from "../ui/Logo";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Data Balita",
      path: "/dashboard/children",
      icon: <Users size={20} />,
    },
    {
      name: "Fasilitas Kesehatan",
      path: "/dashboard/facilities",
      icon: <Building2 size={20} />,
    },
    {
      name: "Peta & Analisis",
      path: "/dashboard/map-analysis",
      icon: <Map size={20} />,
    },
    {
      name: "Statistik",
      path: "/dashboard/statistics",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <Logo className="h-10" />
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">
              {user?.username}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="fixed top-0 bottom-0 left-0 w-64 bg-white shadow-lg z-40 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Logo className="h-8" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4">
              <div className="px-4 mb-4">
                <div className="text-sm font-medium text-gray-400">
                  Logged in as
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.username}
                </div>
              </div>

              <nav>
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-sm ${
                          isActive(item.path)
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                        {isActive(item.path) ? (
                          <ChevronDown size={16} className="ml-auto" />
                        ) : (
                          <ChevronRight size={16} className="ml-auto" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="px-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 px-4 py-3 w-full text-sm text-left hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center px-4 py-5 flex-shrink-0">
            <Logo className="h-8" />
          </div>

          <div className="px-4 mb-6">
            <div className="text-sm font-medium text-gray-400">
              Logged in as
            </div>
            <div className="text-sm font-medium text-gray-900">
              {user?.username}
            </div>
          </div>

          <nav className="flex-1">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className="mb-1 px-2">
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 text-sm rounded-lg ${
                      isActive(item.path)
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {isActive(item.path) ? (
                      <ChevronDown size={16} className="ml-auto" />
                    ) : (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-2 py-4 mt-auto border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 px-3 py-3 w-full text-sm hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
