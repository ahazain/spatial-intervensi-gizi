import React, { useState, useMemo } from 'react';
import { useChildrenStore } from '../../stores/childrenStore';
import { useFacilitiesStore } from '../../stores/facilitiesStore';
import { useAuthStore } from '../../stores/authStore';
import BaseMap from '../../components/map/BaseMap';
import ChildMarker from '../../components/map/ChildMarker';
import FacilityMarker from '../../components/map/FacilityMarker';
import MapLegend from '../../components/map/MapLegend';
import MapControls, { MapFilters } from '../../components/map/MapControls';
import PageHeader from '../../components/ui/PageHeader';
import { Child, HealthFacility } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, Layers } from 'lucide-react';

// Surabaya's approximate center coordinates
const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

const MapAnalysisPage: React.FC = () => {
  const { children } = useChildrenStore();
  const { facilities } = useFacilitiesStore();
  const { user } = useAuthStore();
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(SURABAYA_CENTER);
  const [filters, setFilters] = useState<MapFilters>({
    district: user?.district || 'all',
    showNormal: true,
    showUnderweight: true,
    showSeverelyUnderweight: true,
    showStunting: true,
    showPuskesmas: true,
    showPustu: true,
    showBuffers: true,
  });
  
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);

  const filteredChildren = useMemo(() => {
    return children.filter((child: Child) => {
      // Filter by district (for officers, always filter by their district)
      if (user?.role === 'officer' && user.district) {
        if (child.district !== user.district) return false;
      } else if (filters.district !== 'all' && child.district !== filters.district) {
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
  }, [children, filters, user]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility: HealthFacility) => {
      // Filter by district (for officers, always filter by their district)
      if (user?.role === 'officer' && user.district) {
        if (facility.district !== user.district) return false;
      } else if (filters.district !== 'all' && facility.district !== filters.district) {
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
  }, [facilities, filters, user]);

  const handleChildClick = (child: Child) => {
    setSelectedChild(child);
    setSelectedFacility(null);
    setMapCenter(child.coordinates);
  };

  const handleFacilityClick = (facility: HealthFacility) => {
    setSelectedFacility(facility);
    setSelectedChild(null);
    setMapCenter(facility.coordinates);
  };

  const handleFilterChange = (newFilters: MapFilters) => {
    setFilters(newFilters);
  };

  const resetMap = () => {
    setSelectedChild(null);
    setSelectedFacility(null);
    setMapCenter(SURABAYA_CENTER);
  };

  const centerMap = () => {
    setMapCenter(SURABAYA_CENTER);
  };

  // Calculate statistics
  const analysisStats = useMemo(() => {
    if (!filteredChildren.length || !filteredFacilities.length) {
      return { total: 0, within: 0, outside: 0, percentage: 0 };
    }
    
    // Count children within 1km of any health facility
    let childrenWithinBuffer = 0;
    
    // Function to calculate distance between two coordinates (haversine formula)
    const calculateDistance = (
      lat1: number, lon1: number, 
      lat2: number, lon2: number
    ): number => {
      const R = 6371; // Earth radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in km
    };
    
    // Check each child's distance to nearest facility
    filteredChildren.forEach(child => {
      let isWithinBuffer = false;
      
      for (const facility of filteredFacilities) {
        const distance = calculateDistance(
          child.coordinates[0], child.coordinates[1],
          facility.coordinates[0], facility.coordinates[1]
        );
        
        if (distance <= 1) { // Within 1km
          isWithinBuffer = true;
          break;
        }
      }
      
      if (isWithinBuffer) {
        childrenWithinBuffer++;
      }
    });
    
    const childrenOutsideBuffer = filteredChildren.length - childrenWithinBuffer;
    const coveragePercentage = (childrenWithinBuffer / filteredChildren.length) * 100;
    
    return {
      total: filteredChildren.length,
      within: childrenWithinBuffer,
      outside: childrenOutsideBuffer,
      percentage: coveragePercentage
    };
  }, [filteredChildren, filteredFacilities]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Peta & Analisis Spasial" 
        description="Analisis spasial sebaran kasus gizi dan fasilitas kesehatan"
        actions={
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export Peta
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-[calc(100vh-280px)] w-full">
              <BaseMap center={mapCenter} flyTo={mapCenter} className="h-full w-full">
                {filteredChildren.map((child) => (
                  <ChildMarker 
                    key={child.id} 
                    child={child} 
                    detailed={true}
                    onClick={handleChildClick}
                  />
                ))}
                
                {filteredFacilities.map((facility) => (
                  <FacilityMarker 
                    key={facility.id} 
                    facility={facility}
                    showBuffer={filters.showBuffers}
                    onClick={handleFacilityClick}
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
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analisis Jangkauan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Balita:</span>
                  <span className="font-medium">{analysisStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Dalam Radius 1km:</span>
                  <span className="font-medium text-green-600">{analysisStats.within}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Luar Radius 1km:</span>
                  <span className="font-medium text-red-600">{analysisStats.outside}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Persentase Cakupan:</span>
                    <span className="font-medium">{analysisStats.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-teal-600" 
                      style={{ width: `${analysisStats.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Buffer</h4>
                <p className="text-xs text-gray-500">
                  Buffer 1km menunjukkan jangkauan layanan optimal dari fasilitas kesehatan. 
                  Balita yang berada dalam jangkauan buffer memiliki akses yang lebih baik ke layanan kesehatan.
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  leftIcon={<Layers size={14} />} 
                  className="mt-3 w-full"
                  onClick={() => setFilters(prev => ({ ...prev, showBuffers: !prev.showBuffers }))}
                >
                  {filters.showBuffers ? 'Sembunyikan Buffer' : 'Tampilkan Buffer'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {selectedChild && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Balita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Nama:</span>
                    <span className="text-sm font-medium">{selectedChild.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Usia:</span>
                    <span className="text-sm font-medium">{selectedChild.age} bulan</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Status Gizi:</span>
                    <span className="text-sm font-medium">
                      <StatusBadge status={selectedChild.nutritionStatus} size="sm" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Kecamatan:</span>
                    <span className="text-sm font-medium">{selectedChild.district}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Koordinat:</span>
                    <span className="text-sm font-medium">
                      {selectedChild.coordinates[0].toFixed(6)}, {selectedChild.coordinates[1].toFixed(6)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {selectedFacility && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Fasilitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Nama:</span>
                    <span className="text-sm font-medium">{selectedFacility.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Tipe:</span>
                    <span className="text-sm font-medium">
                      {selectedFacility.type === 'puskesmas' ? 'Puskesmas' : 'Pustu'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Kecamatan:</span>
                    <span className="text-sm font-medium">{selectedFacility.district}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Kapasitas:</span>
                    <span className="text-sm font-medium">{selectedFacility.capacity} pasien</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">Koordinat:</span>
                    <span className="text-sm font-medium">
                      {selectedFacility.coordinates[0].toFixed(6)}, {selectedFacility.coordinates[1].toFixed(6)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

import StatusBadge from '../../components/ui/StatusBadge';
export default MapAnalysisPage;