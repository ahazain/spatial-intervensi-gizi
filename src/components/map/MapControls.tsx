import React from "react";
import { Filter, MapPin, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

interface MapControlsProps {
  onFilterChange?: (filters: MapFilters) => void;
  onReset?: () => void;
  onCenterMap?: () => void;
  kecamatanList?: Array<{ id: string; nama: string }>;
}

export interface MapFilters {
  kecamatanList: string;
  showAreaKritis: boolean;
  showAreaRentan: boolean;
  showAreaTerkelola: boolean;
  showPuskesmas: boolean;
  showPustu: boolean;
  showPenyakitMenular: boolean;
}

const defaultFilters: MapFilters = {
  kecamatanList: "all",
  showAreaKritis: true,
  showAreaRentan: true,
  showAreaTerkelola: true,
  showPuskesmas: true,
  showPustu: true,
  showPenyakitMenular: false,
};

const MapControls: React.FC<MapControlsProps> = ({
  onFilterChange,
  onReset,
  onCenterMap,
  kecamatanList = [],
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<MapFilters>(defaultFilters);

  const handleFilterChange = (
    key: keyof MapFilters,
    value: boolean | string
  ) => {
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
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-72">
          <h3 className="text-sm font-semibold mb-3">Filter Data</h3>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kecamatan
            </label>
            <select
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
              value={filters.kecamatanList}
              onChange={(e) =>
                handleFilterChange("kecamatanList", e.target.value)
              }
            >
              <option value="all">Semua Kecamatan</option>
              {kecamatanList.map((kecamatan) => (
                <option key={kecamatan.id} value={kecamatan.id}>
                  {kecamatan.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <p className="block text-xs font-medium text-gray-700 mb-1">
              Area Risiko Gizi
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  checked={filters.showAreaKritis}
                  onChange={(e) =>
                    handleFilterChange("showAreaKritis", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Area Kritis
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
                  checked={filters.showAreaRentan}
                  onChange={(e) =>
                    handleFilterChange("showAreaRentan", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Area Rentan
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  checked={filters.showAreaTerkelola}
                  onChange={(e) =>
                    handleFilterChange("showAreaTerkelola", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Area Terkelola
                </span>
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
                  onChange={(e) =>
                    handleFilterChange("showPuskesmas", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-gray-700">Puskesmas</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  checked={filters.showPustu}
                  onChange={(e) =>
                    handleFilterChange("showPustu", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-gray-700">Pustu</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                checked={filters.showPenyakitMenular}
                onChange={(e) =>
                  handleFilterChange("showPenyakitMenular", e.target.checked)
                }
              />
              <span className="ml-2 text-xs text-gray-700">
                Data Penyakit Menular
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
