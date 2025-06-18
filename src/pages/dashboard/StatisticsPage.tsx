import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useKecamatanStore } from "../../stores/kecamatanStore";
import {
  Balita,
  PopUpFailitasKesehatan,
  KecamatanRingkasan,
} from "../../types";

// Define StatsFilters interface locally since it's not exported from types
interface StatsFilters {
  kecamatanList: string;
  showAreaKritis: boolean;
  showAreaRentan: boolean;
  showAreaTerkelola: boolean;
  dateRange: string;
}

const COLORS = ["#22c55e", "#eab308", "#ef4444", "#f97316"];
const STATUS_NAMES = {
  normal: "Normal",
  underweight: "Gizi Kurang",
  severely_underweight: "Gizi Buruk",
  stunting: "Stunting",
};

interface NutritionCases {
  normal: number;
  underweight: number;
  severely_underweight: number;
  stunting: number;
}

interface DistrictStats {
  name: string;
  totalChildren: number;
  nutritionCases: NutritionCases;
  kecamatan_id: string;
  area_kategori: string;
}

// Define tooltip props interface to replace 'any'
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

const PublicStatsPage: React.FC = () => {
  const { children, initializeFromSupabase } = useChildrenStore();
  const { facilities, initializeFromSupabase: initFacilities } =
    useFacilitiesStore();
  const { kecamatanList, initializeFromSupabase: initKecamatan } =
    useKecamatanStore();

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<StatsFilters>({
    kecamatanList: "all",
    showAreaKritis: true,
    showAreaRentan: true,
    showAreaTerkelola: true,
    dateRange: "all",
  });

  // Initialize all data
  useEffect(() => {
    const initializeAllData = async () => {
      console.log("🔄 Mulai inisialisasi data statistik...");
      setIsLoading(true);

      try {
        await Promise.all([
          initializeFromSupabase(),
          initFacilities(),
          initKecamatan(),
        ]);
        console.log("✅ Semua data statistik berhasil dimuat");
      } catch (error) {
        console.error("❌ Error loading stats data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug effect untuk monitor data changes
  useEffect(() => {
    console.log(
      "🔄 Stats data updated - Children:",
      children.length,
      "Facilities:",
      facilities.length,
      "Kecamatan:",
      kecamatanList.length
    );
  }, [children, facilities, kecamatanList]);

  // Debug filter changes
  useEffect(() => {
    console.log("🔄 Stats filters updated:", filters);
  }, [filters]);

  // Process raw data into district statistics
  const processDistrictStats = useCallback((): DistrictStats[] => {
    console.log("🔍 Processing district statistics...");

    if (!kecamatanList.length || !children.length || !facilities.length) {
      console.log("⚠️ Insufficient data for processing stats");
      return [];
    }

    return kecamatanList.map((kecamatan: KecamatanRingkasan) => {
      // Get facilities in this kecamatan - use 'id' since kecamatan_id doesn't exist
      const kecamatanFacilities = facilities.filter(
        (facility: PopUpFailitasKesehatan) =>
          facility.kecamatan_id  === kecamatan.kecamatan_id
      );

      // Get children in facilities of this kecamatan
      const kecamatanChildren = children.filter((child: Balita) =>
        kecamatanFacilities.some(
          (facility) => facility.fasilitas_id === child.fasilitas_kesehatan_id
        )
      );

      // Calculate nutrition cases
      const nutritionCases: NutritionCases = {
        normal: 0,
        underweight: 0,
        severely_underweight: 0,
        stunting: 0,
      };

      kecamatanChildren.forEach((child: Balita) => {
        // Map child status to our categories using status_nutrisi instead of status_gizi
        switch (child.status_nutrisi?.toLowerCase()) {
          case "normal":
            nutritionCases.normal++;
            break;
          case "kurang":
            nutritionCases.underweight++;
            break;
          case "buruk":
            nutritionCases.severely_underweight++;
            break;
          case "stunting":
            nutritionCases.stunting++;
            break;
          default:
            // Default to normal if status unclear
            nutritionCases.normal++;
        }
      });

      return {
        name: kecamatan.nama,
        totalChildren: kecamatanChildren.length,
        nutritionCases,
        kecamatan_id: kecamatan.kecamatan_id,
        area_kategori: kecamatan.area_kategori,
      };
    });
  }, [kecamatanList, children, facilities]);

  // Get processed district stats
  const districtStats = useMemo(() => {
    return processDistrictStats();
  }, [processDistrictStats]);

  // Filter district stats based on current filters
  const filteredDistrictStats = useMemo(() => {
    console.log("🔍 Filtering district stats...");

    return districtStats.filter((district: DistrictStats) => {
      // Filter by specific kecamatan
      if (filters.kecamatanList !== "all") {
        if (district.kecamatan_id !== filters.kecamatanList) {
          return false;
        }
      }

      // Filter by area category visibility
      if (district.area_kategori === "Kritis" && !filters.showAreaKritis) {
        return false;
      }
      if (district.area_kategori === "Rentan" && !filters.showAreaRentan) {
        return false;
      }
      if (
        district.area_kategori === "Terkelola" &&
        !filters.showAreaTerkelola
      ) {
        return false;
      }

      return true;
    });
  }, [districtStats, filters]);

  // Get aggregated data for charts and summary
  const getAggregatedData = useCallback(() => {
    console.log("🔍 Calculating aggregated stats data...");

    // For overall summary
    const totalCases = filteredDistrictStats.reduce(
      (acc, district) => {
        return {
          normal: acc.normal + district.nutritionCases.normal,
          underweight: acc.underweight + district.nutritionCases.underweight,
          severely_underweight:
            acc.severely_underweight +
            district.nutritionCases.severely_underweight,
          stunting: acc.stunting + district.nutritionCases.stunting,
        };
      },
      {
        normal: 0,
        underweight: 0,
        severely_underweight: 0,
        stunting: 0,
      }
    );

    const totalChildren = filteredDistrictStats.reduce(
      (acc, district) => acc + district.totalChildren,
      0
    );

    // Prepare data for charts
    const pieChartData = [
      { name: "Normal", value: totalCases.normal },
      { name: "Gizi Kurang", value: totalCases.underweight },
      { name: "Gizi Buruk", value: totalCases.severely_underweight },
      { name: "Stunting", value: totalCases.stunting },
    ];

    const barChartData = filteredDistrictStats.map((district) => ({
      name: district.name,
      Normal: district.nutritionCases.normal,
      "Gizi Kurang": district.nutritionCases.underweight,
      "Gizi Buruk": district.nutritionCases.severely_underweight,
      Stunting: district.nutritionCases.stunting,
    }));

    return { totalCases, totalChildren, pieChartData, barChartData };
  }, [filteredDistrictStats]);

  const { totalCases, totalChildren, pieChartData, barChartData } =
    getAggregatedData();

  // Handle filter changes - Fix implicit 'any' type
  const handleFilterChange = (newFilters: Partial<StatsFilters>) => {
    console.log("🔄 Stats filter changed:", newFilters);
    setFilters((prev: StatsFilters) => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: StatsFilters = {
      kecamatanList: "all",
      showAreaKritis: true,
      showAreaRentan: true,
      showAreaTerkelola: true,
      dateRange: "all",
    };
    setFilters(defaultFilters);
    console.log("🔄 Stats filters reset to default");
  };

  // Prepare kecamatan list for filter dropdown
  const kecamatanOptionsForFilter = kecamatanList.map((kec) => ({
    id: kec.kecamatan_id,
    nama: kec.nama,
  }));

  // Fix tooltip component with proper typing
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-500">
            {totalChildren > 0
              ? `${((payload[0].value / totalChildren) * 100).toFixed(
                  1
                )}% dari total`
              : "0% dari total"}
          </p>
        </div>
      );
    }
    return null;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Statistik Gizi"
          description="Visualisasi statistik kasus gizi di Kota Surabaya"
        />
        <div className="mt-6 bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data statistik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!districtStats.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Statistik Gizi"
          description="Visualisasi statistik kasus gizi di Kota Surabaya"
        />
        <div className="mt-6 bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Data Tidak Tersedia
            </h3>
            <p className="text-gray-500 mb-4">
              Belum ada data statistik yang dapat ditampilkan. Pastikan data
              balita dan kecamatan sudah tersedia.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔄 Rendering stats with filtered data:", {
    districts: filteredDistrictStats.length,
    totalChildren,
    totalCases,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Statistik Gizi"
        description="Visualisasi statistik kasus gizi di Kota Surabaya"
      />

      {/* Enhanced Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Kecamatan Filter */}
          <div className="flex-1">
            <label
              htmlFor="district-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih Kecamatan
            </label>
            <select
              id="district-filter"
              value={filters.kecamatanList}
              onChange={(e) =>
                handleFilterChange({ kecamatanList: e.target.value })
              }
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="all">Semua Kecamatan</option>
              {kecamatanOptionsForFilter.map((kecamatan) => (
                <option key={kecamatan.id} value={kecamatan.id}>
                  {kecamatan.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Area Category Filters */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Area
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showAreaKritis}
                  onChange={(e) =>
                    handleFilterChange({ showAreaKritis: e.target.checked })
                  }
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-red-700">Kritis</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showAreaRentan}
                  onChange={(e) =>
                    handleFilterChange({ showAreaRentan: e.target.checked })
                  }
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-amber-700">Rentan</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showAreaTerkelola}
                  onChange={(e) =>
                    handleFilterChange({ showAreaTerkelola: e.target.checked })
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-green-700">Terkelola</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="px-3 py-1.5 rounded-full bg-green-100 text-xs font-medium text-green-800">
            Normal: {totalCases.normal}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-yellow-100 text-xs font-medium text-yellow-800">
            Gizi Kurang: {totalCases.underweight}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-red-100 text-xs font-medium text-red-800">
            Gizi Buruk: {totalCases.severely_underweight}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-orange-100 text-xs font-medium text-orange-800">
            Stunting: {totalCases.stunting}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-blue-100 text-xs font-medium text-blue-800">
            Total: {totalChildren} anak
          </div>
        </div>
      </div>

      {/* Active Filter Info */}
      {filters.kecamatanList !== "all" && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800">
            🔍 Filter Aktif
          </h4>
          <p className="text-xs text-blue-700 mt-1">
            Menampilkan data untuk:{" "}
            {kecamatanOptionsForFilter.find(
              (k) => k.id === filters.kecamatanList
            )?.nama || "Kecamatan Terpilih"}
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) =>
                      value > 0 ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
                    }
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Total data:{" "}
                <span className="font-semibold text-gray-700">
                  {totalChildren} anak
                </span>
                {filters.kecamatanList !== "all" && (
                  <span className="text-xs text-blue-600 block">
                    dari kecamatan terpilih
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Persentase Status Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(STATUS_NAMES).map(([key, name], index) => {
                const count = totalCases[key as keyof typeof totalCases];
                const percentage =
                  totalChildren > 0 ? (count / totalChildren) * 100 : 0;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300`}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index],
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {count} anak
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart for Districts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Data Status Gizi per Kecamatan
            {filters.kecamatanList !== "all" && " (Filtered)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barChartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barSize={barChartData.length === 1 ? 60 : 20}
                >
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Normal" stackId="a" fill="#22c55e" />
                  <Bar dataKey="Gizi Kurang" stackId="a" fill="#eab308" />
                  <Bar dataKey="Gizi Buruk" stackId="a" fill="#ef4444" />
                  <Bar dataKey="Stunting" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Tidak ada data untuk ditampilkan dengan filter saat ini</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kecamatan Ditampilkan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredDistrictStats.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              dari {districtStats.length} total kecamatan
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tingkat Kasus Berisiko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalChildren > 0
                ? Math.round(
                    ((totalCases.severely_underweight + totalCases.stunting) /
                      totalChildren) *
                      100
                  )
                : 0}
              %
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Gizi Buruk + Stunting
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Area Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {
                filteredDistrictStats.filter(
                  (d) =>
                    d.area_kategori === "Kritis" || d.area_kategori === "Rentan"
                ).length
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Kecamatan Kritis & Rentan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900">
          Tentang Statistik Gizi Surabaya
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Statistik ini menampilkan sebaran kasus gizi anak di Kota Surabaya
          berdasarkan kategori status gizi: normal, gizi kurang, gizi buruk, dan
          stunting. Data ini diperbarui secara berkala berdasarkan input dari
          petugas gizi di fasilitas kesehatan dan dapat disaring berdasarkan
          kecamatan dan kategori area.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Statistik ini bertujuan untuk memberikan gambaran umum mengenai
          kondisi gizi anak di Kota Surabaya dan membantu dalam perencanaan
          intervensi gizi yang lebih tepat sasaran.
        </p>

        {/* Data Sources Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Sumber Data
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Balita:</span> {children.length}{" "}
              data
            </div>
            <div>
              <span className="font-medium">Faskes:</span> {facilities.length}{" "}
              fasilitas
            </div>
            <div>
              <span className="font-medium">Kecamatan:</span>{" "}
              {kecamatanList.length} wilayah
            </div>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p>
            Data statistik diperbarui otomatis berdasarkan input terbaru dari
            sistem. Untuk informasi lebih detail per wilayah, gunakan filter
            kecamatan di atas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicStatsPage;
