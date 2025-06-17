import React, { useState, useEffect } from "react";
import BaseMap from "../../components/map/BaseMap";
import FacilityMarker from "../../components/map/FacilityMarker";
import MapLegend from "../../components/map/MapLegend";
import MapControls from "../../components/map/MapControls";
import KecamatanPolygon from "../../components/map/KecamatanPolygon";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useKecamatanStore } from "../../stores/kecamatanStore";
import {
  Balita,
  PopUpFailitasKesehatan,
  KecamatanRingkasan,
  MapFilters,
} from "../../types";
import PageHeader from "../../components/ui/PageHeader";

// Surabaya's center coordinates
const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

const PublicMapPage: React.FC = () => {
  const { children, initializeFromSupabase } = useChildrenStore();
  const { facilities, initializeFromSupabase: initFacilities } =
    useFacilitiesStore();
  const { kecamatanList, initializeFromSupabase: initKecamatan } =
    useKecamatanStore();

  const [mapCenter, setMapCenter] = useState<[number, number]>(SURABAYA_CENTER);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MapFilters>({
    kecamatanList: "all",
    showAreaKritis: true,
    showAreaRentan: true,
    showAreaTerkelola: true,
    showPuskesmas: true,
    showPustu: true,
    showPenyakitMenular: false,
  });

  useEffect(() => {
    const initializeAllData = async () => {
      console.log("🔄 Mulai inisialisasi semua data...");
      setIsLoading(true);

      try {
        await Promise.all([
          initializeFromSupabase(),
          initFacilities(),
          initKecamatan(),
        ]);
        console.log("✅ Semua data berhasil dimuat");
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug effect untuk monitor data changes
  useEffect(() => {
    console.log(
      "🔄 Data updated - Children:",
      children.length,
      "Facilities:",
      facilities.length,
      "Kecamatan:",
      kecamatanList.length
    );
  }, [children, facilities, kecamatanList]);

  // Debug filter changes
  useEffect(() => {
    console.log("🔄 Filters updated:", filters);
  }, [filters]);

  // Filter children based on filters
  const filteredChildren = React.useMemo(() => {
    console.log("🔍 Filtering children...");
    return children.filter((balita: Balita) => {
      // Filter by kecamatan if specific kecamatan is selected
      if (filters.kecamatanList !== "all") {
        const facility = facilities.find(
          (f) => f.fasilitas_id === balita.fasilitas_kesehatan_id
        );
        if (!facility || facility.id !== filters.kecamatanList) {
          return false;
        }
      }
      return true;
    });
  }, [children, facilities, filters.kecamatanList]);

  const filteredFacilities = React.useMemo(() => {
    console.log("🔍 Filtering facilities...");
    console.log("Available facilities:", facilities.length);
    console.log("Current filters:", filters);

    const filtered = facilities.filter((facility: PopUpFailitasKesehatan) => {
      // Filter by kecamatan
      if (filters.kecamatanList !== "all") {
        // Check both possible ID fields
        const matchesKecamatan =
          facility.id === filters.kecamatanList ||
          facility.id === filters.kecamatanList;

        console.log(`Facility ${facility.fasilitas_nama}: kecamatan check`, {
          facilityId: facility.id,
          facilityKecamatanId: facility.id || "undefined",
          filterKecamatan: filters.kecamatanList,
          matches: matchesKecamatan,
        });

        if (!matchesKecamatan) {
          return false;
        }
      }

      // Filter by facility type
      if (facility.type === "puskesmas" && !filters.showPuskesmas) {
        console.log(`Hiding puskesmas: ${facility.fasilitas_nama}`);
        return false;
      }
      if (facility.type === "pustu" && !filters.showPustu) {
        console.log(`Hiding pustu: ${facility.fasilitas_nama}`);
        return false;
      }

      return true;
    });

    console.log("Filtered facilities result:", filtered.length);
    return filtered;
  }, [facilities, filters]);

  // Also improve the filteredKecamatan useMemo:
  const filteredKecamatan = React.useMemo(() => {
    console.log("🔍 Filtering kecamatan...");
    console.log("Available kecamatan:", kecamatanList.length);
    console.log("Current filters:", filters);

    const filtered = kecamatanList.filter((kec: KecamatanRingkasan) => {
      // Filter by specific kecamatan selection
      if (filters.kecamatanList !== "all") {
        const matchesKecamatan =
          kec.kecamatan_id === filters.kecamatanList ||
          kec.id === filters.kecamatanList;

        console.log(`Kecamatan ${kec.nama}: ID check`, {
          kecamatanId: kec.kecamatan_id,
          kecamatanIdAlias: kec.id,
          filterKecamatan: filters.kecamatanList,
          matches: matchesKecamatan,
        });

        if (!matchesKecamatan) {
          return false;
        }
      }

      // Filter by area category visibility
      if (kec.area_kategori === "Kritis" && !filters.showAreaKritis) {
        console.log(`Hiding Kritis area: ${kec.nama}`);
        return false;
      }
      if (kec.area_kategori === "Rentan" && !filters.showAreaRentan) {
        console.log(`Hiding Rentan area: ${kec.nama}`);
        return false;
      }
      if (kec.area_kategori === "Terkelola" && !filters.showAreaTerkelola) {
        console.log(`Hiding Terkelola area: ${kec.nama}`);
        return false;
      }

      return true;
    });

    console.log("Filtered kecamatan result:", filtered.length);
    return filtered;
  }, [kecamatanList, filters]);

  // Filter untuk penyakit menular (jika ada data penyakit menular)
  const shouldShowPenyakitMenular = filters.showPenyakitMenular;

  const handleFilterChange = (newFilters: MapFilters) => {
    console.log("🔄 Filter changed:", newFilters);
    setFilters(newFilters);
  };

  const resetMap = () => {
    const defaultFilters: MapFilters = {
      kecamatanList: "all",
      showAreaKritis: true,
      showAreaRentan: true,
      showAreaTerkelola: true,
      showPuskesmas: true,
      showPustu: true,
      showPenyakitMenular: false,
    };

    setMapCenter(SURABAYA_CENTER);
    setFilters(defaultFilters);
    console.log("🔄 Map reset to default state");
  };

  const centerMap = () => {
    setMapCenter(SURABAYA_CENTER);
    console.log("🎯 Map centered to Surabaya");
  };

  const handleKecamatanClick = (kecamatan: KecamatanRingkasan) => {
    console.log("📍 Kecamatan clicked:", kecamatan.nama);
    // Bisa ditambahkan logic untuk zoom ke kecamatan atau show detail
    // Misalnya: setMapCenter ke koordinat kecamatan atau show modal detail
  };

  // Calculate statistics from filtered data
  const totalBalita = filteredKecamatan.reduce(
    (sum, kec) => sum + kec.total_balita,
    0
  );
  const totalFaskes = filteredFacilities.length;
  const totalGiziBurukStunting = filteredKecamatan.reduce(
    (sum, kec) => sum + kec.jumlah_buruk + kec.jumlah_stunting,
    0
  );
  const totalPenyakitMenular = filteredKecamatan.reduce(
    (sum, kec) => sum + kec.total_penyakit,
    0
  );

  // Prepare kecamatan list for MapControls
  const kecamatanOptionsForFilter = kecamatanList.map((kec) => ({
    id: kec.kecamatan_id,
    nama: kec.nama,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Peta Sebaran Kasus Gizi"
          description="Peta interaktif menunjukkan sebaran kasus gizi di Kota Surabaya"
        />
        <div className="mt-6 bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data peta...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔄 Rendering with filtered data:", {
    kecamatan: filteredKecamatan.length,
    facilities: filteredFacilities.length,
    children: filteredChildren.length,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Peta Sebaran Kasus Gizi"
        description="Peta interaktif menunjukkan sebaran kasus gizi di Kota Surabaya"
      />

      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="relative h-[calc(100vh-220px)] w-full">
          <BaseMap
            center={mapCenter}
            flyTo={mapCenter}
            className="h-full w-full"
          >
            {/* Render Kecamatan Polygons dengan filter yang sudah diterapkan */}
            {filteredKecamatan.map((kec) => (
              <KecamatanPolygon
                key={`filtered-kec-${kec.kecamatan_id}`}
                kecamatan={kec}
                onClick={handleKecamatanClick}
                showPenyakitMenular={shouldShowPenyakitMenular}
              />
            ))}

            {/* Render Health Facilities dengan filter yang sudah diterapkan */}
            {filteredFacilities.map((facility) => (
              <FacilityMarker
                key={`filtered-facility-${facility.fasilitas_id}`}
                facility={facility}
              />
            ))}

            {/* Map Legend - update berdasarkan apa yang ditampilkan */}
            <MapLegend
              showChildren={filteredChildren.length > 0}
              showFacilities={filteredFacilities.length > 0}
              showAreaKritis={
                filters.showAreaKritis &&
                filteredKecamatan.some((k) => k.area_kategori === "Kritis")
              }
              showAreaRentan={
                filters.showAreaRentan &&
                filteredKecamatan.some((k) => k.area_kategori === "Rentan")
              }
              showAreaTerkelola={
                filters.showAreaTerkelola &&
                filteredKecamatan.some((k) => k.area_kategori === "Terkelola")
              }
              showPenyakitMenular={shouldShowPenyakitMenular}
            />

            {/* Map Controls dengan kecamatan list */}
            <MapControls
              onFilterChange={handleFilterChange}
              onReset={resetMap}
              onCenterMap={centerMap}
              kecamatanList={kecamatanOptionsForFilter}
            />
          </BaseMap>
        </div>
      </div>

      {/* Information Section - Update dengan data yang sudah difilter */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900">
          Tentang Peta Gizi Surabaya
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Peta ini menampilkan sebaran kasus gizi anak di Kota Surabaya
          berdasarkan kategori status gizi: normal, gizi kurang, gizi buruk, dan
          stunting. Peta juga menampilkan lokasi fasilitas kesehatan berupa
          puskesmas dan pustu yang dapat diakses oleh masyarakat.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Anda dapat memfilter tampilan peta berdasarkan kecamatan, kategori
          area (Kritis, Rentan, Terkelola), dan jenis fasilitas kesehatan untuk
          melihat informasi yang lebih spesifik.
        </p>

        {/* Show active filter info */}
        {filters.kecamatanList !== "all" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

        {/* Statistics berdasarkan data yang difilter */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            Statistik{" "}
            {filters.kecamatanList !== "all"
              ? "Kecamatan Terpilih"
              : "Keseluruhan"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {filteredKecamatan.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">Kecamatan</div>
              <div className="text-xs text-blue-600 mt-1">
                {filters.kecamatanList !== "all"
                  ? "Terpilih"
                  : `Total: ${kecamatanList.length}`}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {totalFaskes}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Fasilitas Kesehatan
              </div>
              <div className="text-xs text-green-600 mt-1">Ditampilkan</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {totalBalita}
              </div>
              <div className="text-sm text-purple-700 font-medium">
                Total Balita
              </div>
              <div className="text-xs text-purple-600 mt-1">Terpantau</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {totalGiziBurukStunting}
              </div>
              <div className="text-sm text-red-700 font-medium">
                Gizi Buruk/Stunting
              </div>
              <div className="text-xs text-red-600 mt-1">
                {totalBalita > 0
                  ? Math.round((totalGiziBurukStunting / totalBalita) * 100)
                  : 0}
                % dari total
              </div>
            </div>
          </div>
        </div>

        {/* Area Category Breakdown berdasarkan data yang difilter */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            Kategori Area Kecamatan{" "}
            {filters.kecamatanList !== "all" ? "Terpilih" : ""}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">
                {
                  filteredKecamatan.filter((k) => k.area_kategori === "Kritis")
                    .length
                }
              </div>
              <div className="text-sm text-red-700 font-medium">
                Area Kritis
              </div>
              <div className="text-xs text-red-600 mt-1">
                {filters.showAreaKritis ? "Ditampilkan" : "Disembunyikan"}
              </div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xl font-bold text-amber-600">
                {
                  filteredKecamatan.filter((k) => k.area_kategori === "Rentan")
                    .length
                }
              </div>
              <div className="text-sm text-amber-700 font-medium">
                Area Rentan
              </div>
              <div className="text-xs text-amber-600 mt-1">
                {filters.showAreaRentan ? "Ditampilkan" : "Disembunyikan"}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">
                {
                  filteredKecamatan.filter(
                    (k) => k.area_kategori === "Terkelola"
                  ).length
                }
              </div>
              <div className="text-sm text-green-700 font-medium">
                Area Terkelola
              </div>
              <div className="text-xs text-green-600 mt-1">
                {filters.showAreaTerkelola ? "Ditampilkan" : "Disembunyikan"}
              </div>
            </div>
          </div>
        </div>

        {/* Penyakit Menular Warning jika filter aktif */}
        {shouldShowPenyakitMenular && totalPenyakitMenular > 0 && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-800">
              ⚠️ Data Penyakit Menular
            </h4>
            <p className="text-xs text-orange-700 mt-1">
              Terdapat {totalPenyakitMenular} kasus penyakit menular di area
              yang ditampilkan
            </p>
          </div>
        )}

        {/* Filter Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Status Filter
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div
              className={`p-2 rounded ${
                filters.showPuskesmas
                  ? "bg-teal-100 text-teal-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Puskesmas: {filters.showPuskesmas ? "Aktif" : "Nonaktif"}
            </div>
            <div
              className={`p-2 rounded ${
                filters.showPustu
                  ? "bg-teal-100 text-teal-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Pustu: {filters.showPustu ? "Aktif" : "Nonaktif"}
            </div>
            <div
              className={`p-2 rounded ${
                filters.showPenyakitMenular
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Penyakit Menular:{" "}
              {filters.showPenyakitMenular ? "Aktif" : "Nonaktif"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMapPage;
