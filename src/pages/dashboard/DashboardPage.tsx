import React, { useEffect, useState } from "react";
import { Users, Building2, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useKecamatanStore } from "../../stores/kecamatanStore";
import { useAuthStore } from "../../stores/authStore";
import PageHeader from "../../components/ui/PageHeader";
import { ButtonLink } from "../../components/ui/Button";

const DashboardPage: React.FC = () => {
  const { children, initializeFromSupabase: initializeChildren } =
    useChildrenStore();
  const { facilities, initializeFromSupabase: initializeFacilities } =
    useFacilitiesStore();
  const { kecamatanList, initializeFromSupabase: initializeKecamatan } =
    useKecamatanStore();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  // Initialize all data using the same pattern as PublicMapPage
  useEffect(() => {
    const initializeAllData = async () => {
      console.log("🔄 Mulai inisialisasi data dashboard...");
      setIsLoading(true);

      try {
        await Promise.all([
          initializeChildren(),
          initializeFacilities(),
          initializeKecamatan(),
        ]);
        console.log("✅ Semua data dashboard berhasil dimuat");
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug effect untuk monitor data changes
  useEffect(() => {
    console.log(
      "🔄 Dashboard data updated - Children:",
      children.length,
      "Facilities:",
      facilities.length,
      "Kecamatan:",
      kecamatanList.length
    );
  }, [children, facilities, kecamatanList]);

  // Get display name from available user data
  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  // Calculate nutrition status counts from actual data
  const nutritionStats = React.useMemo(() => {
    console.log("🔍 Calculating nutrition stats...");

    const normal = children.filter(
      (child) => child.status_nutrisi === "normal"
    ).length;
    const underweight = children.filter(
      (child) => child.status_nutrisi === "kurang"
    ).length;
    const severelyUnderweight = children.filter(
      (child) => child.status_nutrisi === "buruk"
    ).length;
    const stunting = children.filter(
      (child) => child.status_nutrisi === "stunting"
    ).length;

    return {
      normal,
      underweight,
      severelyUnderweight,
      stunting,
      total: children.length,
      critical: severelyUnderweight + stunting,
    };
  }, [children]);

  // Calculate health facility counts
  const facilityStats = React.useMemo(() => {
    console.log("🔍 Calculating facility stats...");

    const puskesmas = facilities.filter(
      (facility) => facility.type?.toLowerCase() === "puskesmas"
    ).length;

    const rumahSakit = facilities.filter(
      (facility) => facility.type?.toLowerCase() === "rumah sakit"
    ).length;

    return {
      puskesmas,
      rumahSakit,
      total: facilities.length,
    };
  }, [facilities]);

  // Calculate kecamatan statistics
  const kecamatanStats = React.useMemo(() => {
    console.log("🔍 Calculating kecamatan stats...");

    const totalBalita = kecamatanList.reduce(
      (sum, kec) => sum + (kec.total_balita || 0),
      0
    );
    const totalCritical = kecamatanList.reduce(
      (sum, kec) => sum + (kec.jumlah_buruk || 0) + (kec.jumlah_stunting || 0),
      0
    );

    const criticalPercentage =
      totalBalita > 0 ? ((totalCritical / totalBalita) * 100).toFixed(1) : "0";

    // Get top 5 kecamatan with most issues
    const topKecamatan = [...kecamatanList]
      .sort((a, b) => {
        const aIssues = (a.jumlah_buruk || 0) + (a.jumlah_stunting || 0);
        const bIssues = (b.jumlah_buruk || 0) + (b.jumlah_stunting || 0);
        return bIssues - aIssues;
      })
      .slice(0, 5);

    return {
      total: kecamatanList.length,
      totalBalita,
      totalCritical,
      criticalPercentage,
      topKecamatan,
    };
  }, [kecamatanList]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Dashboard"
          description="Sistem Informasi Gizi Balita Kota Surabaya"
        />
        <div className="mt-6 bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Dashboard"
          description="Sistem Informasi Gizi Balita Kota Surabaya"
        />
        <div className="mt-6 bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Silakan login terlebih dahulu
            </h2>
            <p className="text-gray-600 mt-2">
              Anda perlu login untuk mengakses dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔄 Rendering dashboard with data:", {
    children: children.length,
    facilities: facilities.length,
    kecamatan: kecamatanList.length,
    user: !!user,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                    <p>User ID: {user.id_user}</p>
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
          value={nutritionStats.total}
          icon={<Users size={24} />}
          colorScheme="default"
        />

        <StatCard
          title="Kasus Gizi Kurang"
          value={nutritionStats.underweight}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "Data real-time",
          }}
        />

        <StatCard
          title="Kasus Gizi Buruk"
          value={nutritionStats.severelyUnderweight}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "Data real-time",
          }}
          colorScheme="red"
        />

        <StatCard
          title="Kasus Stunting"
          value={nutritionStats.stunting}
          icon={<AlertTriangle size={24} />}
          trend={{
            direction: "down",
            value: "Data real-time",
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
                      {facilityStats.puskesmas}
                    </dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <Building2 className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Rumah Sakit
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">
                      {facilityStats.rumahSakit}
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
                      {kecamatanStats.total}
                    </dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      Persentase Kasus Kritis
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">
                      {kecamatanStats.criticalPercentage}%
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
                      {nutritionStats.normal}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Gizi Kurang</dt>
                    <dd className="text-sm font-medium text-yellow-600">
                      {nutritionStats.underweight}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Gizi Buruk</dt>
                    <dd className="text-sm font-medium text-red-600">
                      {nutritionStats.severelyUnderweight}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Stunting</dt>
                    <dd className="text-sm font-medium text-orange-600">
                      {nutritionStats.stunting}
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

      {/* Kecamatan Overview Table */}
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
                Total: {kecamatanStats.total} Kecamatan
              </div>
            </div>

            {kecamatanStats.topKecamatan.length > 0 ? (
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
                    {kecamatanStats.topKecamatan.map((kecamatan) => {
                      const normalCount =
                        kecamatan.total_balita -
                        kecamatan.jumlah_buruk -
                        kecamatan.jumlah_stunting;
                      const severeCount = kecamatan.jumlah_buruk || 0;
                      const stuntingCount = kecamatan.jumlah_stunting || 0;
                      const totalChildren = kecamatan.total_balita || 0;
                      const totalIssues = severeCount + stuntingCount;
                      const percentage =
                        totalChildren > 0
                          ? (totalIssues / totalChildren) * 100
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
                        <tr
                          key={kecamatan.kecamatan_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {kecamatan.nama || kecamatan.kecamatan_nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {totalChildren}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {normalCount > 0 ? normalCount : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                            -
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada data kecamatan tersedia</p>
              </div>
            )}

            {kecamatanStats.total > 5 && (
              <div className="mt-4 text-center">
                <ButtonLink
                  to="/dashboard/districts"
                  variant="outline"
                  size="sm"
                >
                  Lihat Semua Kecamatan ({kecamatanStats.total})
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
