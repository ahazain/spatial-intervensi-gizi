import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BarChart, User, Building, Shield } from 'lucide-react';
import { ButtonLink } from '../../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-teal-700">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Sistem Informasi Spasial
              <span className="block text-teal-300">Intervensi Gizi Surabaya</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-teal-100">
              Memantau dan menganalisis status gizi anak di Kota Surabaya dengan visualisasi spasial untuk intervensi yang lebih tepat sasaran.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <ButtonLink to="/map" className="bg-white text-teal-700 hover:bg-teal-50">
                Lihat Peta
                <MapPin className="ml-2 -mr-1 h-5 w-5" />
              </ButtonLink>
              <ButtonLink to="/statistics" variant="outline" className="bg-transparent text-white border-white hover:bg-teal-800">
                Lihat Statistik
                <BarChart className="ml-2 -mr-1 h-5 w-5" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-teal-600 tracking-wide uppercase">Fitur</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Membantu Intervensi Gizi yang Tepat Sasaran
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Sistem berbasis spasial untuk memudahkan pemantauan dan analisis status gizi anak di Kota Surabaya.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-teal-600 p-3 shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Peta Interaktif</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Visualisasi sebaran kasus gizi buruk, kurang, dan stunting di seluruh kecamatan Surabaya secara interaktif.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-teal-600 p-3 shadow-lg">
                        <Building className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Fasilitas Kesehatan</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Informasi lokasi puskesmas dan pustu di Kota Surabaya lengkap dengan jangkauan layanan 1 km.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-teal-600 p-3 shadow-lg">
                        <BarChart className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Analisis Statistik</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Visualisasi data dan tren kasus gizi dalam bentuk grafik dan statistik yang informatif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-teal-600 tracking-wide uppercase">Pengguna</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Layanan untuk Berbagai Pengguna
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Akses berbeda untuk kebutuhan yang berbeda
            </p>
          </div>

          <div className="mt-16 space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-teal-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-teal-700" />
                  <h3 className="ml-2 text-lg font-medium text-teal-900">Admin</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Akses penuh ke sistem
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mengelola data balita dan fasilitas
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Melihat analisis spasial lengkap
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-700" />
                  <h3 className="ml-2 text-lg font-medium text-blue-900">Petugas Gizi</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Melihat dan menambah data balita
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Melihat peta untuk wilayah tugasnya
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mengakses statistik wilayah kerja
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-gray-700" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">Masyarakat</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Akses tanpa login
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Melihat peta sebaran kasus
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Melihat statistik per kecamatan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Tertarik mengakses sistem?</span>
            <span className="block text-teal-300">Login untuk akses lebih lengkap.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
              >
                Login
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/map"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                Lihat Peta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;