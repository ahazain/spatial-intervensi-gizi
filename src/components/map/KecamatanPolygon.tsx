import React from "react";
import { Polygon, Popup } from "react-leaflet";
import { KecamatanRingkasan } from "../../types";

interface KecamatanPolygonProps {
  kecamatan: KecamatanRingkasan;
  onClick?: (kecamatan: KecamatanRingkasan) => void;
  showPenyakitMenular: boolean;
}

const KecamatanPolygon: React.FC<KecamatanPolygonProps> = ({
  kecamatan,
  onClick,
  showPenyakitMenular,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(kecamatan);
    }
  };

  // Risk level colors berdasarkan area_kategori
  const getRiskColor = (kategori: "Kritis" | "Rentan" | "Terkelola") => {
    switch (kategori) {
      case "Kritis":
        return {
          color: "#dc2626",
          fillColor: "#fef2f2",
          borderColor: "#b91c1c",
        };
      case "Rentan":
        return {
          color: "#f59e0b",
          fillColor: "#fffbeb",
          borderColor: "#d97706",
        };
      case "Terkelola":
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

  // Hitung persentase nutrisi buruk dari total balita
  const persentaseBuruk =
    kecamatan.total_balita > 0
      ? Math.round((kecamatan.jumlah_buruk / kecamatan.total_balita) * 100)
      : 0;

  const persentaseStunting =
    kecamatan.total_balita > 0
      ? Math.round((kecamatan.jumlah_stunting / kecamatan.total_balita) * 100)
      : 0;

  // Hitung jumlah balita normal (asumsi: total - buruk - stunting)
  const balitaNormal = Math.max(
    0,
    kecamatan.total_balita - kecamatan.jumlah_buruk - kecamatan.jumlah_stunting
  );

  const riskColors = getRiskColor(kecamatan.area_kategori);

  // Function untuk mendapatkan label kategori dalam bahasa Indonesia
  const getKategoriLabel = (kategori: "Kritis" | "Rentan" | "Terkelola") => {
    switch (kategori) {
      case "Kritis":
        return "Kritis";
      case "Rentan":
        return "Rentan";
      case "Terkelola":
        return "Terkelola";
      default:
        return kategori;
    }
  };

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
      <Popup maxWidth={400} className="kecamatan-popup">
        <div className="p-4 min-w-[350px]">
          {/* Header */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Kecamatan {kecamatan.nama}
            </h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Status Area:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  kecamatan.area_kategori === "Kritis"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : kecamatan.area_kategori === "Rentan"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {getKategoriLabel(kecamatan.area_kategori)}
              </span>
            </div>
          </div>

          {/* Ringkasan Statistik */}
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Ringkasan Data
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Balita:</span>
                <span className="font-bold text-blue-700">
                  {kecamatan.total_balita}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fasilitas Kesehatan:</span>
                <span className="font-bold text-blue-700">
                  {kecamatan.jumlah_faskes}
                </span>
              </div>
              {/* Conditionally show penyakit menular based on showPenyakitMenular prop */}
              {showPenyakitMenular && (
                <div className="flex items-center justify-between col-span-2">
                  <span className="text-gray-600">Total Penyakit Menular:</span>
                  <span className="font-bold text-red-600">
                    {kecamatan.total_penyakit} kasus
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fasilitas Kesehatan */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Fasilitas Kesehatan
              </h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {kecamatan.jumlah_faskes} unit
              </span>
            </div>

            {kecamatan.nama_faskes && kecamatan.nama_faskes.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {kecamatan.nama_faskes.map((namaFaskes, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs bg-gray-50 p-2 rounded"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                    <span className="font-medium text-gray-700">
                      {namaFaskes}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Tidak ada fasilitas kesehatan tercatat
              </p>
            )}
          </div>

          {/* Status Nutrisi Balita */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Status Nutrisi Balita
              </h4>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {kecamatan.total_balita} balita
              </span>
            </div>

            {kecamatan.total_balita > 0 ? (
              <div className="space-y-2">
                {/* Normal */}
                <div className="flex items-center justify-between text-xs bg-green-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <span>Normal</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-700">
                      {balitaNormal}
                    </span>
                    <span className="text-green-600 ml-1">
                      (
                      {Math.round(
                        (balitaNormal / kecamatan.total_balita) * 100
                      )}
                      %)
                    </span>
                  </div>
                </div>

                {/* Gizi Buruk */}
                <div className="flex items-center justify-between text-xs bg-red-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <span>Gizi Buruk</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-red-700">
                      {kecamatan.jumlah_buruk}
                    </span>
                    <span className="text-red-600 ml-1">
                      ({persentaseBuruk}%)
                    </span>
                  </div>
                </div>

                {/* Stunting */}
                <div className="flex items-center justify-between text-xs bg-orange-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                    <span>Stunting</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-orange-700">
                      {kecamatan.jumlah_stunting}
                    </span>
                    <span className="text-orange-600 ml-1">
                      ({persentaseStunting}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Tidak ada data balita tercatat
              </p>
            )}
          </div>

          {/* Alert untuk kondisi kritis */}
          {kecamatan.area_kategori === "Kritis" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">
                    Area Memerlukan Perhatian Khusus
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Tingkat malnutrisi dan penyakit menular tinggi di area ini
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Polygon>
  );
};

export default KecamatanPolygon;
