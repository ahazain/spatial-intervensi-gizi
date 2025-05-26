import React from 'react';

interface MapLegendProps {
  showChildren?: boolean;
  showFacilities?: boolean;
  showBuffers?: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ 
  showChildren = true, 
  showFacilities = true,
  showBuffers = false
}) => {
  return (
    <div className="bg-white bg-opacity-90 p-3 rounded-lg shadow-md absolute bottom-4 left-4 z-[1000] max-w-xs">
      <h4 className="text-sm font-semibold mb-2">Keterangan Peta</h4>
      
      {showChildren && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-1">Status Gizi Anak</p>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-gray-700">Normal</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-xs text-gray-700">Gizi Kurang</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs text-gray-700">Gizi Buruk</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-xs text-gray-700">Stunting</span>
            </div>
          </div>
        </div>
      )}
      
      {showFacilities && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-1">Fasilitas Kesehatan</p>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 transform rotate-45 mr-2"></div>
              <span className="text-xs text-gray-700">Puskesmas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-600 transform rotate-45 mr-2"></div>
              <span className="text-xs text-gray-700">Pustu</span>
            </div>
          </div>
        </div>
      )}
      
      {showBuffers && (
        <div>
          <p className="text-xs font-medium mb-1">Analisis Jangkauan</p>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border border-blue-600 bg-blue-100 bg-opacity-30 mr-2"></div>
            <span className="text-xs text-gray-700">Buffer 1 km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;