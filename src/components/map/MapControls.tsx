import React from 'react';
import { Filter, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useChildrenStore } from '../../stores/childrenStore';
import { useFacilitiesStore } from '../../stores/facilitiesStore';
import { districts } from '../../lib/mockData';

interface MapControlsProps {
  onFilterChange?: (filters: MapFilters) => void;
  onReset?: () => void;
  onCenterMap?: () => void;
}

export interface MapFilters {
  district: string;
  showNormal: boolean;
  showUnderweight: boolean;
  showSeverelyUnderweight: boolean;
  showStunting: boolean;
  showPuskesmas: boolean;
  showPustu: boolean;
  showBuffers: boolean;
}

const defaultFilters: MapFilters = {
  district: 'all',
  showNormal: true,
  showUnderweight: true,
  showSeverelyUnderweight: true,
  showStunting: true,
  showPuskesmas: true,
  showPustu: true,
  showBuffers: false,
};

const MapControls: React.FC<MapControlsProps> = ({ 
  onFilterChange, 
  onReset,
  onCenterMap
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<MapFilters>(defaultFilters);
  
  const handleFilterChange = (key: keyof MapFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };
  
  const handleReset = () => {
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
    if (onReset) {
      onReset();
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="flex space-x-2">
        <Button 
          variant="primary" 
          size="sm" 
          className="bg-white text-gray-600 border border-gray-300 shadow-sm hover:bg-gray-50"
          leftIcon={<Filter size={16} />}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filter
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white shadow-sm"
          leftIcon={<MapPin size={16} />}
          onClick={onCenterMap}
        >
          Center
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white shadow-sm"
          leftIcon={<RefreshCw size={16} />}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
      
      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
          <h3 className="text-sm font-semibold mb-3">Filter Data</h3>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kecamatan
            </label>
            <select
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="all">Semua Kecamatan</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <p className="block text-xs font-medium text-gray-700 mb-1">
              Status Gizi
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showNormal}
                  onChange={(e) => handleFilterChange('showNormal', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showUnderweight}
                  onChange={(e) => handleFilterChange('showUnderweight', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Gizi Kurang</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showSeverelyUnderweight}
                  onChange={(e) => handleFilterChange('showSeverelyUnderweight', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Gizi Buruk</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showStunting}
                  onChange={(e) => handleFilterChange('showStunting', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Stunting</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="block text-xs font-medium text-gray-700 mb-1">
              Fasilitas Kesehatan
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showPuskesmas}
                  onChange={(e) => handleFilterChange('showPuskesmas', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Puskesmas</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showPustu}
                  onChange={(e) => handleFilterChange('showPustu', e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">Pustu</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                checked={filters.showBuffers}
                onChange={(e) => handleFilterChange('showBuffers', e.target.checked)}
              />
              <span className="ml-2 text-xs text-gray-700">Tampilkan Buffer 1km</span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;