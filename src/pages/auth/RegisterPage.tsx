import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Client-side validation
      if (!username.trim()) {
        throw new Error("Username wajib diisi");
      }

      if (!email.trim()) {
        throw new Error("Email wajib diisi");
      }

      if (!password) {
        throw new Error("Password wajib diisi");
      }

      if (!confirmPassword) {
        throw new Error("Konfirmasi password wajib diisi");
      }

      if (password !== confirmPassword) {
        throw new Error("Password dan konfirmasi password tidak cocok");
      }

      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      // Username validation
      if (username.length < 3) {
        throw new Error("Username minimal 3 karakter");
      }

      // Check for special characters in username
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username hanya boleh mengandung huruf, angka, dan underscore"
        );
      }

      console.log("Attempting to register with:", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
      });

      const registrationSuccess = await register(
        username.trim(),
        email.trim().toLowerCase(),
        password
      );

      if (registrationSuccess) {
        setSuccess(
          "Pendaftaran berhasil! Anda akan diarahkan ke halaman login..."
        );

        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/admincore/login");
        }, 2000);
      } else {
        // Use error from auth store if available
        const errorMsg = authError || "Pendaftaran gagal. Silakan coba lagi.";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Logo className="h-16" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Lengkapi formulir di bawah untuk membuat akun
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Username (min. 3 karakter)"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().trim())
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full"
              isLoading={isLoading}
              leftIcon={<UserPlus size={18} />}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to="/admincore/login"
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
