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
  PopUpFailitasKesehatan, // ✅ Menggunakan tipe yang benar
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

  // Filter children based on filters
  const filteredChildren = children.filter((balita: Balita) => {
    // Filter by kecamatan if specific kecamatan is selected
    if (filters.kecamatanList !== "all") {
      const facility = facilities.find(
        (f) => f.fasilitas_id === balita.fasilitas_kesehatan_id // ✅ Menggunakan fasilitas_id
      );
      if (!facility || facility.id !== filters.kecamatanList) {
        // ✅ Menggunakan id (alias kecamatan_id)
        return false;
      }
    }
    return true;
  });

  // Filter facilities based on type and kecamatan
  const filteredFacilities = facilities.filter(
    (facility: PopUpFailitasKesehatan) => {
      // ✅ Tipe yang benar
      // Filter by kecamatan
      if (
        filters.kecamatanList !== "all" &&
        facility.id !== filters.kecamatanList // ✅ Menggunakan id (alias kecamatan_id)
      ) {
        return false;
      }

      // Filter by facility type
      if (facility.type === "puskesmas" && !filters.showPuskesmas) {
        return false;
      }
      if (facility.type === "pustu" && !filters.showPustu) {
        return false;
      }

      return true;
    }
  );

  // Filter kecamatan based on area category (updated for KecamatanRingkasan)
  const filteredKecamatan = kecamatanList.filter((kec: KecamatanRingkasan) => {
    // Filter by specific kecamatan selection
    if (
      filters.kecamatanList !== "all" &&
      kec.kecamatan_id !== filters.kecamatanList
    ) {
      return false;
    }

    // Filter by area category visibility (updated mapping)
    if (kec.area_kategori === "Kritis" && !filters.showAreaKritis) {
      return false;
    }
    if (kec.area_kategori === "Rentan" && !filters.showAreaRentan) {
      return false;
    }
    if (kec.area_kategori === "Terkelola" && !filters.showAreaTerkelola) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters: MapFilters) => {
    setFilters(newFilters);
  };

  const resetMap = () => {
    setMapCenter(SURABAYA_CENTER);
    setFilters({
      kecamatanList: "all",
      showAreaKritis: true,
      showAreaRentan: true,
      showAreaTerkelola: true,
      showPuskesmas: true,
      showPustu: true,
      showPenyakitMenular: false,
    });
  };

  const centerMap = () => {
    setMapCenter(SURABAYA_CENTER);
  };

  const handleKecamatanClick = (kecamatan: KecamatanRingkasan) => {
    console.log("Kecamatan clicked:", kecamatan.nama);
    // Bisa ditambahkan logic untuk zoom ke kecamatan atau show detail
  };

  // Calculate statistics from KecamatanRingkasan data
  const totalBalita = kecamatanList.reduce(
    (sum, kec) => sum + kec.total_balita,
    0
  );
  const totalFaskes = kecamatanList.reduce(
    (sum, kec) => sum + kec.jumlah_faskes,
    0
  );
  const totalGiziBurukStunting = kecamatanList.reduce(
    (sum, kec) => sum + kec.jumlah_buruk + kec.jumlah_stunting,
    0
  );
  const totalPenyakitMenular = kecamatanList.reduce(
    (sum, kec) => sum + kec.total_penyakit,
    0
  );

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
            {/* Render Kecamatan Polygons with updated data */}
            {filteredKecamatan.map((kec) => (
              <KecamatanPolygon
                key={kec.kecamatan_id}
                kecamatan={kec}
                onClick={handleKecamatanClick}
              />
            ))}

            {/* Render Health Facilities */}
            {filteredFacilities.map((facility) => (
              <FacilityMarker key={facility.fasilitas_id} facility={facility} />
            ))}

            {/* Map Legend */}
            <MapLegend
              showChildren={filteredChildren.length > 0}
              showFacilities={filteredFacilities.length > 0}
            />

            {/* Map Controls */}
            <MapControls
              onFilterChange={handleFilterChange}
              onReset={resetMap}
              onCenterMap={centerMap}
            />
          </BaseMap>
        </div>
      </div>

      {/* Information Section */}
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

        {/* Enhanced Statistics from KecamatanRingkasan */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            Statistik Keseluruhan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {filteredKecamatan.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">Kecamatan</div>
              <div className="text-xs text-blue-600 mt-1">
                Total: {kecamatanList.length}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {totalFaskes}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Fasilitas Kesehatan
              </div>
              <div className="text-xs text-green-600 mt-1">
                Aktif: {filteredFacilities.length}
              </div>
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

        {/* Area Category Breakdown */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            Kategori Area Kecamatan
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">
                {
                  kecamatanList.filter((k) => k.area_kategori === "Kritis")
                    .length
                }
              </div>
              <div className="text-sm text-red-700 font-medium">
                Area Kritis
              </div>
              <div className="text-xs text-red-600 mt-1">
                Perlu perhatian khusus
              </div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xl font-bold text-amber-600">
                {
                  kecamatanList.filter((k) => k.area_kategori === "Rentan")
                    .length
                }
              </div>
              <div className="text-sm text-amber-700 font-medium">
                Area Rentan
              </div>
              <div className="text-xs text-amber-600 mt-1">Waspada</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">
                {
                  kecamatanList.filter((k) => k.area_kategori === "Terkelola")
                    .length
                }
              </div>
              <div className="text-sm text-green-700 font-medium">
                Area Terkelola
              </div>
              <div className="text-xs text-green-600 mt-1">Kondisi baik</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {totalPenyakitMenular > 0 && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-800">
              ⚠️ Peringatan Penyakit Menular
            </h4>
            <p className="text-xs text-orange-700 mt-1">
              Terdapat {totalPenyakitMenular} kasus penyakit menular yang perlu
              mendapat perhatian khusus
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMapPage;
