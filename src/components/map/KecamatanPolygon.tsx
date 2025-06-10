import React from "react";
import { Polygon, Popup } from "react-leaflet";
import { Kecamatan } from "../../types";
import {
  balitaList,
  fasilitasKesehatanList,
  penyakitMenularList,
} from "../../lib/mockData";

interface KecamatanPolygonProps {
  kecamatan: Kecamatan;
  onClick?: (kecamatan: Kecamatan) => void;
}

const KecamatanPolygon: React.FC<KecamatanPolygonProps> = ({
  kecamatan,
  onClick,
}) => {
  // Enhanced debugging
  console.log("=== DEBUG KECAMATAN ===");
  console.log("Kecamatan:", kecamatan.nama);
  console.log("Full kecamatan object:", kecamatan);
  console.log("Area exists:", !!kecamatan.area);
  console.log("Area object:", kecamatan.area);
  console.log("Area type:", kecamatan.area?.type);
  console.log("Coordinates exists:", !!kecamatan.area?.coordinates);
  console.log("Coordinates length:", kecamatan.area?.coordinates?.length);
  console.log("Coordinates:", kecamatan.area?.coordinates);
  console.log("========================");

  // Pastikan data area tersedia dengan debugging yang lebih detail
  if (!kecamatan.area) {
    console.warn(`❌ Kecamatan ${kecamatan.nama}: area field is missing`);
    return null;
  }

  if (!kecamatan.area.coordinates) {
    console.warn(
      `❌ Kecamatan ${kecamatan.nama}: coordinates field is missing`
    );
    console.log("Available area properties:", Object.keys(kecamatan.area));
    return null;
  }

  if (!Array.isArray(kecamatan.area.coordinates)) {
    console.warn(`❌ Kecamatan ${kecamatan.nama}: coordinates is not an array`);
    console.log("Coordinates type:", typeof kecamatan.area.coordinates);
    console.log("Coordinates value:", kecamatan.area.coordinates);
    return null;
  }

  if (kecamatan.area.coordinates.length === 0) {
    console.warn(`❌ Kecamatan ${kecamatan.nama}: coordinates array is empty`);
    return null;
  }

  if (!Array.isArray(kecamatan.area.coordinates[0])) {
    console.warn(
      `❌ Kecamatan ${kecamatan.nama}: first coordinate ring is not an array`
    );
    console.log("First element:", kecamatan.area.coordinates[0]);
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(kecamatan);
    }
  };

  // Risk level colors
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "rawan":
        return {
          color: "#dc2626",
          fillColor: "#fef2f2",
          borderColor: "#b91c1c",
        };
      case "perlu-diperhatikan":
        return {
          color: "#f59e0b",
          fillColor: "#fffbeb",
          borderColor: "#d97706",
        };
      case "aman":
        return {
          color: "#059669",
          fillColor: "#ecfdf5",
          borderColor: "#047857",
        };
      default:
        return {
          color: "#6b7280",
          fillColor: "#f9fafb",
          borderColor: "#4b5563",
        };
    }
  };

  // Enhanced coordinate conversion with better error handling
  const convertCoordinates = () => {
    try {
      const coords = kecamatan.area.coordinates[0];
      console.log(`Converting coordinates for ${kecamatan.nama}:`, {
        originalLength: coords.length,
        firstCoord: coords[0],
        lastCoord: coords[coords.length - 1],
      });

      const converted = coords.map((coord, index) => {
        if (!Array.isArray(coord) || coord.length < 2) {
          console.error(`Invalid coordinate at index ${index}:`, coord);
          return [0, 0] as [number, number];
        }
        return [coord[1], coord[0]] as [number, number];
      });

      console.log(
        `✅ Successfully converted ${converted.length} coordinates for ${kecamatan.nama}`
      );
      return converted;
    } catch (error) {
      console.error(
        `❌ Error converting coordinates for ${kecamatan.nama}:`,
        error
      );
      console.log("Coordinates structure:", kecamatan.area.coordinates);
      return [];
    }
  };

  const positions = convertCoordinates();

  // Jika tidak ada posisi yang valid, jangan render polygon
  if (positions.length === 0) {
    console.warn(`❌ No valid positions for ${kecamatan.nama}`);
    return null;
  }

  console.log(
    `✅ Rendering polygon for ${kecamatan.nama} with ${positions.length} points`
  );

  // Filter fasilitas kesehatan berdasarkan kecamatan
  const fasilitasKecamatan = fasilitasKesehatanList.filter(
    (facility) => facility.Kecamatan_id === kecamatan.id
  );

  // Filter balita berdasarkan fasilitas kesehatan di kecamatan ini
  const balitaKecamatan = balitaList.filter((balita) =>
    fasilitasKecamatan.some(
      (facility) => facility.id === balita.fasilitasKesehatan_id
    )
  );

  // Hitung statistik nutrisi
  const nutritionStats = balitaKecamatan.reduce(
    (acc, balita) => {
      acc[balita.statusNutrisi] = (acc[balita.statusNutrisi] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    },
    {
      normal: 0,
      kurang: 0,
      buruk: 0,
      stunting: 0,
      total: 0,
    }
  );

  // Filter penyakit menular berdasarkan kecamatan
  const penyakitKecamatan = penyakitMenularList.filter(
    (penyakit) => penyakit.kecamatan_id === kecamatan.id
  );

  const riskColors = getRiskColor(kecamatan.riskLevel);

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: riskColors.borderColor,
        fillColor: riskColors.fillColor,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4,
      }}
      eventHandlers={{
        click: handleClick,
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.6,
            color: riskColors.color,
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            fillOpacity: 0.4,
            color: riskColors.borderColor,
          });
        },
      }}
    >
      <Popup maxWidth={380} className="kecamatan-popup">
        <div className="p-4 min-w-[320px]">
          {/* Header */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Kecamatan {kecamatan.nama}
            </h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Status Risiko:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  kecamatan.riskLevel === "rawan"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : kecamatan.riskLevel === "perlu-diperhatikan"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {kecamatan.riskLevel === "rawan"
                  ? "Rawan"
                  : kecamatan.riskLevel === "perlu-diperhatikan"
                  ? "Perlu Diperhatikan"
                  : "Aman"}
              </span>
            </div>
          </div>

          {/* Fasilitas Kesehatan */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Fasilitas Kesehatan
              </h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {fasilitasKecamatan.length} unit
              </span>
            </div>

            {fasilitasKecamatan.length > 0 ? (
              <div className="space-y-2">
                {fasilitasKecamatan.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          facility.type === "puskesmas"
                            ? "bg-blue-500"
                            : "bg-cyan-500"
                        }`}
                      />
                      <span className="font-medium">{facility.nama}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 capitalize">
                        {facility.type}
                      </div>
                      <div className="text-gray-500">
                        Kapasitas: {facility.capacity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Tidak ada fasilitas kesehatan tercatat
              </p>
            )}
          </div>

          {/* Statistik Nutrisi Balita */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Status Nutrisi Balita
              </h4>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {nutritionStats.total} balita
              </span>
            </div>

            {nutritionStats.total > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between text-xs bg-green-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <span>Normal</span>
                  </div>
                  <span className="font-semibold text-green-700">
                    {nutritionStats.normal}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-yellow-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <span>Kurang</span>
                  </div>
                  <span className="font-semibold text-yellow-700">
                    {nutritionStats.kurang}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-red-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <span>Buruk</span>
                  </div>
                  <span className="font-semibold text-red-700">
                    {nutritionStats.buruk}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-orange-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                    <span>Stunting</span>
                  </div>
                  <span className="font-semibold text-orange-700">
                    {nutritionStats.stunting}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Tidak ada data balita tercatat
              </p>
            )}
          </div>

          {/* Penyakit Menular */}
          {penyakitKecamatan.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800">
                  Penyakit Menular
                </h4>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {penyakitKecamatan.reduce((sum, p) => sum + p.jumlah, 0)}{" "}
                  kasus
                </span>
              </div>

              <div className="space-y-2">
                {penyakitKecamatan.map((penyakit) => (
                  <div
                    key={penyakit.id}
                    className="flex items-center justify-between text-xs bg-red-50 p-2 rounded border border-red-100"
                  >
                    <span className="capitalize font-medium text-gray-700">
                      {penyakit.nama}
                    </span>
                    <span className="font-bold text-red-600">
                      {penyakit.jumlah} kasus
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Polygon>
  );
};

export default KecamatanPolygon;
