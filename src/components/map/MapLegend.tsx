import React from "react";

interface MapLegendProps {
  showChildren?: boolean;
  showFacilities?: boolean;
  showBuffers?: boolean;
  showAreaKritis: boolean;
  showAreaRentan: boolean;
  showAreaTerkelola: boolean;
  showPenyakitMenular: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({
  showChildren = true,
  showFacilities = true,
  showBuffers = false,
  showAreaKritis,
  showAreaRentan,
  showAreaTerkelola,
  showPenyakitMenular,
}) => {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
      <h3 className="text-lg font-bold mb-3 text-gray-800">Keterangan Peta</h3>

      {/* Area Status Legend */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">
          Status Area
        </h4>
        <div className="space-y-1">
          {showAreaKritis && (
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 border-2 border-red-600 bg-red-100 mr-2"></div>
              <span>Area Kritis</span>
            </div>
          )}
          {showAreaRentan && (
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 border-2 border-amber-600 bg-amber-100 mr-2"></div>
              <span>Area Rentan</span>
            </div>
          )}
          {showAreaTerkelola && (
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 border-2 border-green-600 bg-green-100 mr-2"></div>
              <span>Area Terkelola</span>
            </div>
          )}
        </div>
      </div>

      {showChildren && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            Status Gizi Anak
          </h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Gizi Kurang</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Gizi Buruk</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>Stunting</span>
            </div>
          </div>
        </div>
      )}

      {showFacilities && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            Fasilitas Kesehatan
          </h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Puskesmas</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              <span>Pustu</span>
            </div>
          </div>
        </div>
      )}

      {showPenyakitMenular && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            Penyakit Menular
          </h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
              <span>Kasus Terkonfirmasi</span>
            </div>
          </div>
        </div>
      )}

      {showBuffers && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            Analisis Jangkauan
          </h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 border border-blue-400 bg-blue-100 opacity-50 mr-2"></div>
              <span>Buffer 1 km</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
