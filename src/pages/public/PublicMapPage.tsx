import React, { useState, useEffect } from "react";
import BaseMap from "../../components/map/BaseMap";
import FacilityMarker from "../../components/map/FacilityMarker";
import MapLegend from "../../components/map/MapLegend";
import MapControls from "../../components/map/MapControls";
import KecamatanPolygon from "../../components/map/KecamatanPolygon";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useKecamatanStore } from "../../stores/kecamatanStore";
import { Balita, FasilitasKesehatan, Kecamatan, MapFilters } from "../../types";
import PageHeader from "../../components/ui/PageHeader";

// Surabaya's center coordinates
const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

const PublicMapPage: React.FC = () => {
  const { children, initializeFromSupabase } = useChildrenStore();
  const { facilities, initializeFromSupabase: initFacilities } =
    useFacilitiesStore();

  const { kecamatanList, initializeMockData: initKecamatan } =
    useKecamatanStore();

  const [mapCenter, setMapCenter] = useState<[number, number]>(SURABAYA_CENTER);
  const [filters, setFilters] = useState<MapFilters>({
    kecamatanList: "all",
    showAreaRawan: true,
    showAreaPerluDiperhatikan: true,
    showAreaAman: true,
    showPuskesmas: true,
    showPustu: true,
    showPenyakitMenular: false,
  });

  // Initialize mock data on component mount
  useEffect(() => {
    initializeFromSupabase();
    initFacilities();
    initKecamatan();
  }, [initializeFromSupabase, initFacilities, initKecamatan]);

  // Filter children based on filters
  const filteredChildren = children.filter((balita: Balita) => {
    // Filter by kecamatan if specific kecamatan is selected
    if (filters.kecamatanList !== "all") {
      const facility = facilities.find(
        (f) => f.id === balita.fasilitasKesehatan_id
      );
      if (!facility || facility.Kecamatan_id !== filters.kecamatanList) {
        return false;
      }
    }
    return true;
  });

  // Filter facilities based on type and kecamatan
  const filteredFacilities = facilities.filter(
    (facility: FasilitasKesehatan) => {
      // Filter by kecamatan
      if (
        filters.kecamatanList !== "all" &&
        facility.Kecamatan_id !== filters.kecamatanList
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

  // Filter kecamatan based on risk level
  const filteredKecamatan = kecamatanList.filter((kec: Kecamatan) => {
    // Filter by specific kecamatan selection
    if (filters.kecamatanList !== "all" && kec.id !== filters.kecamatanList) {
      return false;
    }

    // Filter by risk level visibility
    if (kec.riskLevel === "rawan" && !filters.showAreaRawan) {
      return false;
    }
    if (
      kec.riskLevel === "perlu-diperhatikan" &&
      !filters.showAreaPerluDiperhatikan
    ) {
      return false;
    }
    if (kec.riskLevel === "aman" && !filters.showAreaAman) {
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
      showAreaRawan: true,
      showAreaPerluDiperhatikan: true,
      showAreaAman: true,
      showPuskesmas: true,
      showPustu: true,
      showPenyakitMenular: false,
    });
  };

  const centerMap = () => {
    setMapCenter(SURABAYA_CENTER);
  };

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
            {/* Render Kecamatan Polygons */}
            {filteredKecamatan.map((kec) => (
              <KecamatanPolygon key={kec.id} kecamatan={kec} />
            ))}

            {/* Render Health Facilities */}
            {filteredFacilities.map((facility) => (
              <FacilityMarker key={facility.id} facility={facility} />
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
          Anda dapat memfilter tampilan peta berdasarkan kecamatan, tingkat
          risiko area, dan jenis fasilitas kesehatan untuk melihat informasi
          yang lebih spesifik.
        </p>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredKecamatan.length}
            </div>
            <div className="text-xs text-gray-600">Kecamatan</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {filteredFacilities.length}
            </div>
            <div className="text-xs text-gray-600">Fasilitas Kesehatan</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {filteredChildren.length}
            </div>
            <div className="text-xs text-gray-600">Data Balita</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {
                filteredChildren.filter(
                  (child) =>
                    child.statusNutrisi === "buruk" ||
                    child.statusNutrisi === "stunting"
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">
              Kasus Gizi Buruk/Stunting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMapPage;
