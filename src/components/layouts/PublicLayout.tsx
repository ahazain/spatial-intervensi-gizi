import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Map, BarChart3, LogIn } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import Logo from "../ui/Logo";

const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Peta", path: "/map", icon: <Map size={18} className="mr-2" /> },
    {
      name: "Statistik",
      path: "/statistics",
      icon: <BarChart3 size={18} className="mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="h-10" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive(item.path)
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-3 text-base font-medium text-teal-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 text-base font-medium text-teal-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-semibold text-gray-700">
                Sistem Informasi Spasial Intervensi Gizi
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Kota Surabaya &copy; {new Date().getFullYear()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Link Terkait
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="https://surabaya.go.id"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Website Resmi Kota Surabaya
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Dinas Kesehatan Kota Surabaya
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Pusat Informasi Gizi
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
