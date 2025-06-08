import React from "react";
import { Users, Building2, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useAuthStore } from "../../stores/authStore";
import { mockDistrictStats } from "../../lib/mockData";
import PageHeader from "../../components/ui/PageHeader";
import { ButtonLink } from "../../components/ui/Button";

const DashboardPage: React.FC = () => {
  const { children } = useChildrenStore();
  const { facilities } = useFacilitiesStore();
  const { user } = useAuthStore();

  // Get display name from available user data
  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  // Use all data since we don't have role-based filtering
  const allChildren = children;
  const allFacilities = facilities;
  const allDistricts = mockDistrictStats;

  // Calculate nutrition status counts
  const normalCount = allChildren.filter(
    (child) => child.nutritionStatus === "normal"
  ).length;
  const underweightCount = allChildren.filter(
    (child) => child.nutritionStatus === "underweight"
  ).length;
  const severelyUnderweightCount = allChildren.filter(
    (child) => child.nutritionStatus === "severely_underweight"
  ).length;
  const stuntingCount = allChildren.filter(
    (child) => child.nutritionStatus === "stunting"
  ).length;

  // Calculate health facility counts
  const puskesmasCount = allFacilities.filter(
    (facility) => facility.type === "puskesmas"
  ).length;
  const pustuCount = allFacilities.filter(
    (facility) => facility.type === "pustu"
  ).length;

  // Get districts with highest issues for overview
  const districtsWithIssues = [...mockDistrictStats]
    .sort((a, b) => {
      const aIssues =
        a.nutritionCases.severely_underweight + a.nutritionCases.stunting;
      const bIssues =
        b.nutritionCases.severely_underweight + b.nutritionCases.stunting;
      return bIssues - aIssues;
    })
    .slice(0, 5);

  // Calculate overall statistics
  const totalCriticalCases = severelyUnderweightCount + stuntingCount;
  const criticalCasePercentage =
    allChildren.length > 0
      ? ((totalCriticalCases / allChildren.length) * 100).toFixed(1)
      : "0";

  // Show loading or login prompt if no user
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Silakan login terlebih dahulu
          </h2>
          <p className="text-gray-600 mt-2">
            Anda perlu login untuk mengakses dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`Selamat Datang, ${displayName}`}
        description="Dashboard Sistem Informasi Gizi Balita Kota Surabaya"
        actions={
          <div className="flex space-x-3">
            <ButtonLink to={"/dashboard/children"} variant="primary">
              Data Balita
            </ButtonLink>
            <ButtonLink to={"/dashboard/map-analysis"} variant="outline">
              Peta & Analisis
            </ButtonLink>
          </div>
        }
      />

      {/* User Info Card */}
      <div className="mt-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Informasi Pengguna
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>User ID: {user.id}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Pengguna Sistem
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balita"
          value={allChildren.length}
          icon={<Users size={24} />}
          colorScheme="default"
        />

        <StatCard
          title="Kasus Gizi Kurang"
          value={underweightCount}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "5.2% dibanding bulan lalu",
          }}
          colorScheme="yellow"
        />

        <StatCard
          title="Kasus Gizi Buruk"
          value={severelyUnderweightCount}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "3.1% dibanding bulan lalu",
          }}
          colorScheme="red"
        />

        <StatCard
          title="Kasus Stunting"
          value={stuntingCount}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "2.8% dibanding bulan lalu",
          }}
          colorScheme="orange"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Fasilitas Kesehatan
                </h3>
                <p className="text-sm text-gray-500">
                  Total fasilitas kesehatan di Kota Surabaya
                </p>
              </div>

              <div className="border-t border-gray-200">
                <dl className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <Building2 className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Puskesmas
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-teal-600">
                      {puskesmasCount}
                    </dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <Building2 className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Pustu
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">
                      {pustuCount}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <ButtonLink
                  to="/dashboard/facilities"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Lihat Detail Fasilitas
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sm:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Cakupan Wilayah
                </h3>
                <p className="text-sm text-gray-500">
                  Statistik kecamatan di Kota Surabaya
                </p>
              </div>

              <div className="border-t border-gray-200">
                <dl className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <MapPin className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Kecamatan
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-teal-600">
                      {allDistricts.length}
                    </dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      Persentase Kasus Kritis
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">
                      {criticalCasePercentage}%
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <ButtonLink
                  to="/dashboard/statistics"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Lihat Detail Statistik
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sm:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Status Gizi
                </h3>
                <p className="text-sm text-gray-500">
                  Distribusi status gizi balita
                </p>
              </div>

              <div className="border-t border-gray-200">
                <dl className="space-y-3 p-6">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Normal</dt>
                    <dd className="text-sm font-medium text-green-600">
                      {normalCount}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Gizi Kurang</dt>
                    <dd className="text-sm font-medium text-yellow-600">
                      {underweightCount}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Gizi Buruk</dt>
                    <dd className="text-sm font-medium text-red-600">
                      {severelyUnderweightCount}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Stunting</dt>
                    <dd className="text-sm font-medium text-orange-600">
                      {stuntingCount}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <ButtonLink
                  to="/dashboard/nutrition-analysis"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Analisis Gizi
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Districts Overview Table */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Ringkasan Kecamatan
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Kecamatan dengan kasus gizi yang memerlukan perhatian
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Total: {allDistricts.length} Kecamatan
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kecamatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Balita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Normal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gizi Kurang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gizi Buruk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stunting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {districtsWithIssues.map((district) => {
                    const normalCount = district.nutritionCases.normal;
                    const underweightCount =
                      district.nutritionCases.underweight;
                    const severeCount =
                      district.nutritionCases.severely_underweight;
                    const stuntingCount = district.nutritionCases.stunting;
                    const totalIssues = severeCount + stuntingCount;
                    const percentage =
                      district.totalChildren > 0
                        ? (totalIssues / district.totalChildren) * 100
                        : 0;

                    const getStatusColor = (percentage: number) => {
                      if (percentage > 15) return "bg-red-100 text-red-800";
                      if (percentage > 10)
                        return "bg-orange-100 text-orange-800";
                      if (percentage > 5)
                        return "bg-yellow-100 text-yellow-800";
                      return "bg-green-100 text-green-800";
                    };

                    const getStatusText = (percentage: number) => {
                      if (percentage > 15) return "Perlu Perhatian Khusus";
                      if (percentage > 10) return "Perlu Perhatian";
                      if (percentage > 5) return "Waspada";
                      return "Baik";
                    };

                    return (
                      <tr key={district.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {district.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {district.totalChildren}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {normalCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                          {underweightCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          {severeCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                          {stuntingCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              percentage
                            )}`}
                          >
                            {getStatusText(percentage)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {allDistricts.length > 5 && (
              <div className="mt-4 text-center">
                <ButtonLink
                  to="/dashboard/districts"
                  variant="outline"
                  size="sm"
                >
                  Lihat Semua Kecamatan ({allDistricts.length})
                </ButtonLink>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Aksi Cepat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ButtonLink
                to="/dashboard/children/add"
                variant="primary"
                className="text-center"
              >
                Tambah Data Balita
              </ButtonLink>
              <ButtonLink
                to="/dashboard/reports"
                variant="outline"
                className="text-center"
              >
                Laporan Bulanan
              </ButtonLink>
              <ButtonLink
                to="/dashboard/export"
                variant="outline"
                className="text-center"
              >
                Export Data
              </ButtonLink>
              <ButtonLink
                to="/dashboard/settings"
                variant="outline"
                className="text-center"
              >
                Pengaturan
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
