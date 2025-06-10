import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FasilitasKesehatan } from "../../types";
import { balitaList } from "../../lib/mockData";

// Create custom icon
const createFacilityIcon = (type: "puskesmas" | "pustu") => {
  const color = type === "puskesmas" ? "#0369a1" : "#0891b2"; // Blue / Teal
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

interface FacilityMarkerProps {
  facility: FasilitasKesehatan;
  onClick?: (facility: FasilitasKesehatan) => void;
}

const FacilityMarker: React.FC<FacilityMarkerProps> = ({
  facility,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick(facility);
  };

  const facilityChildren = balitaList.filter(
    (child) => child.fasilitasKesehatan_id === facility.id
  );

  const nutritionStats = facilityChildren.reduce(
    (acc, child) => {
      acc[child.statusNutrisi] = (acc[child.statusNutrisi] || 0) + 1;
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

  const position: [number, number] = [
    facility.lokasi.coordinates[1],
    facility.lokasi.coordinates[0],
  ];

  const icon = createFacilityIcon(facility.type);

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{ click: handleClick }}
      riseOnHover={true}
      zIndexOffset={1000}
    >
      <Popup maxWidth={300} className="facility-popup">
        <div className="p-3">
          <div className="mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {facility.nama}
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
                {nutritionStats.total} balita
              </span>
            </div>

            {nutritionStats.total > 0 ? (
              <div className="space-y-1">
                {[
                  {
                    label: "Normal",
                    value: nutritionStats.normal,
                    color: "green",
                  },
                  {
                    label: "Kurang",
                    value: nutritionStats.kurang,
                    color: "yellow",
                  },
                  { label: "Buruk", value: nutritionStats.buruk, color: "red" },
                  {
                    label: "Stunting",
                    value: nutritionStats.stunting,
                    color: "orange",
                  },
                ].map((item) => (
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
                    <span className={`font-semibold text-${item.color}-700`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Belum ada data balita terdaftar
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Koordinat: {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default FacilityMarker;
