import React, { useState } from 'react';
import BaseMap from '../../components/map/BaseMap';
import ChildMarker from '../../components/map/ChildMarker';
import FacilityMarker from '../../components/map/FacilityMarker';
import MapLegend from '../../components/map/MapLegend';
import MapControls, { MapFilters } from '../../components/map/MapControls';
import { useChildrenStore } from '../../stores/childrenStore';
import { useFacilitiesStore } from '../../stores/facilitiesStore';
import { Child, HealthFacility } from '../../types';
import PageHeader from '../../components/ui/PageHeader';

// Surabaya's approximate center coordinates
const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

const PublicMapPage: React.FC = () => {
  const { children } = useChildrenStore();
  const { facilities } = useFacilitiesStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>(SURABAYA_CENTER);
  const [filters, setFilters] = useState<MapFilters>({
    district: 'all',
    showNormal: true,
    showUnderweight: true,
    showSeverelyUnderweight: true,
    showStunting: true,
    showPuskesmas: true,
    showPustu: true,
    showBuffers: false,
  });

  const filteredChildren = children.filter((child: Child) => {
    // Filter by district
    if (filters.district !== 'all' && child.district !== filters.district) {
      return false;
    }
    
    // Filter by nutrition status
    if (child.nutritionStatus === 'normal' && !filters.showNormal) {
      return false;
    }
    if (child.nutritionStatus === 'underweight' && !filters.showUnderweight) {
      return false;
    }
    if (child.nutritionStatus === 'severely_underweight' && !filters.showSeverelyUnderweight) {
      return false;
    }
    if (child.nutritionStatus === 'stunting' && !filters.showStunting) {
      return false;
    }
    
    return true;
  });

  const filteredFacilities = facilities.filter((facility: HealthFacility) => {
    // Filter by district
    if (filters.district !== 'all' && facility.district !== filters.district) {
      return false;
    }
    
    // Filter by facility type
    if (facility.type === 'puskesmas' && !filters.showPuskesmas) {
      return false;
    }
    if (facility.type === 'pustu' && !filters.showPustu) {
      return false;
    }
    
    return true;
  });

  const handleFilterChange = (newFilters: MapFilters) => {
    setFilters(newFilters);
  };

  const resetMap = () => {
    setMapCenter(SURABAYA_CENTER);
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
          <BaseMap center={mapCenter} flyTo={mapCenter} className="h-full w-full">
            {filteredChildren.map((child) => (
              <ChildMarker 
                key={child.id} 
                child={child} 
                detailed={false}
              />
            ))}
            
            {filteredFacilities.map((facility) => (
              <FacilityMarker 
                key={facility.id} 
                facility={facility}
                showBuffer={filters.showBuffers}
              />
            ))}
            
            <MapLegend 
              showChildren={true} 
              showFacilities={true} 
              showBuffers={filters.showBuffers}
            />
            
            <MapControls 
              onFilterChange={handleFilterChange}
              onReset={resetMap}
              onCenterMap={centerMap}
            />
          </BaseMap>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900">Tentang Peta Gizi Surabaya</h2>
        <p className="mt-2 text-sm text-gray-500">
          Peta ini menampilkan sebaran kasus gizi anak di Kota Surabaya berdasarkan kategori status gizi: normal, gizi kurang, gizi buruk, dan stunting.
          Peta juga menampilkan lokasi fasilitas kesehatan berupa puskesmas dan pustu yang dapat diakses oleh masyarakat.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Anda dapat memfilter tampilan peta berdasarkan kecamatan, jenis status gizi, dan jenis fasilitas kesehatan.
          Untuk melihat cakupan layanan fasilitas kesehatan, aktifkan fitur Buffer 1km pada panel filter.
        </p>
      </div>
    </div>
  );
};

export default PublicMapPage;