import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { PopUpFailitasKesehatan } from "../../types";

// Create custom icon
const createFacilityIcon = (type: string) => {
  const color = type === "puskesmas" ? "#0369a1" : "#0891b2"; 
  const size = type === "puskesmas" ? 16 : 14;

  return L.divIcon({
    className: "custom-facility-icon",
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 3px;
      transform: rotate(45deg);
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Interface sudah include koordinat dari query yang diperbaiki
interface FacilityMarkerProps {
  facility: PopUpFailitasKesehatan;
  onClick?: (facility: PopUpFailitasKesehatan) => void;
}

const FacilityMarker: React.FC<FacilityMarkerProps> = ({
  facility,
  onClick,
}) => {
  // Validasi koordinat dari facility.lokasi (format GeoJSON)
  if (
    !facility.lokasi?.coordinates ||
    !Array.isArray(facility.lokasi.coordinates) ||
    facility.lokasi.coordinates.length < 2
  ) {
    console.warn(
      `Missing coordinates for facility: ${facility.fasilitas_nama}`,
      facility.lokasi
    );
    return null;
  }

  // GeoJSON format: [longitude, latitude] -> convert to [latitude, longitude] untuk Leaflet
  const [lng, lat] = facility.lokasi.coordinates;

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    isNaN(lat) ||
    isNaN(lng)
  ) {
    console.error(
      "Invalid coordinates for facility:",
      facility.fasilitas_nama,
      { lat, lng }
    );
    return null;
  }

  const coordinates: [number, number] = [lat, lng]; // [latitude, longitude] untuk Leaflet

  const handleClick = () => {
    if (onClick) onClick(facility);
  };

  const icon = createFacilityIcon(facility.type);

  // Calculate percentage for better display
  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <Marker
      position={coordinates}
      icon={icon}
      eventHandlers={{ click: handleClick }}
      riseOnHover={true}
      zIndexOffset={1000}
    >
      <Popup maxWidth={300} className="facility-popup">
        <div className="p-3">
          {/* Header Fasilitas */}
          <div className="mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {facility.fasilitas_nama}
            </h3>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  facility.type === "puskesmas"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {facility.type.toUpperCase()}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                Kapasitas: {facility.capacity}
              </span>
            </div>
          </div>

          {/* Statistik Balita */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Data Balita Terdaftar
              </h4>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {facility.total_balita} balita
              </span>
            </div>

            {facility.total_balita > 0 ? (
              <div className="space-y-2">
                {/* Progress Bar Total */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (facility.total_balita / facility.capacity) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Detail Status Nutrisi */}
                <div className="space-y-1">
                  {[
                    {
                      label: "Normal",
                      value: facility.jumlah_normal,
                      color: "green",
                    },
                    {
                      label: "Kurang",
                      value: facility.jumlah_kurang,
                      color: "yellow",
                    },
                    {
                      label: "Buruk",
                      value: facility.jumlah_buruk,
                      color: "red",
                    },
                    {
                      label: "Stunting",
                      value: facility.jumlah_stunting,
                      color: "orange",
                    },
                  ]
                    .filter((item) => item.value > 0) // Hanya tampilkan yang ada datanya
                    .map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full bg-${item.color}-500 mr-2`}
                          />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span
                            className={`font-semibold text-${item.color}-700`}
                          >
                            {item.value}
                          </span>
                          <span className="text-gray-500">
                            ({getPercentage(item.value, facility.total_balita)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Summary Status */}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Kapasitas:</span>
                    <span
                      className={`font-medium ${
                        facility.total_balita > facility.capacity
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {facility.total_balita}/{facility.capacity}
                      {facility.total_balita > facility.capacity &&
                        " (Overload)"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-1">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Belum ada data balita terdaftar
                </p>
              </div>
            )}
          </div>

          {/* Footer - Koordinat */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default FacilityMarker;
