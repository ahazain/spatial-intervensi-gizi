import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { HealthFacility } from '../../types';

// Custom icons for different facility types
const createFacilityIcon = (type: 'puskesmas' | 'pustu') => {
  const color = type === 'puskesmas' ? '#0369a1' : '#0891b2'; // Blue for Puskesmas, Teal for Pustu
  const size = type === 'puskesmas' ? 16 : 14; // Larger for Puskesmas
  
  return L.divIcon({
    className: 'custom-facility-icon',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 3px; transform: rotate(45deg); border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

interface FacilityMarkerProps {
  facility: HealthFacility;
  showBuffer?: boolean; // Whether to show 1km buffer zone
  onClick?: (facility: HealthFacility) => void;
}

const FacilityMarker: React.FC<FacilityMarkerProps> = ({ 
  facility, 
  showBuffer = false, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(facility);
    }
  };

  const icon = createFacilityIcon(facility.type);

  return (
    <>
      <Marker 
        position={facility.coordinates} 
        icon={icon}
        eventHandlers={{ click: handleClick }}
      >
        <Popup className="custom-popup">
          <div className="p-1">
            <div className="text-sm font-semibold mb-1">
              {facility.name}
            </div>
            <div className="text-xs text-gray-600 mb-1">
              Tipe: {facility.type === 'puskesmas' ? 'Puskesmas' : 'Pustu'}
            </div>
            <div className="text-xs text-gray-600 mb-1">
              Kecamatan: {facility.district}
            </div>
            <div className="text-xs text-gray-600">
              Kapasitas: {facility.capacity} orang
            </div>
          </div>
        </Popup>
      </Marker>
      
      {showBuffer && (
        <Circle 
          center={facility.coordinates}
          radius={1000} // 1km in meters
          pathOptions={{ 
            fillColor: facility.type === 'puskesmas' ? '#0369a140' : '#0891b240',
            fillOpacity: 0.2,
            weight: 1,
            color: facility.type === 'puskesmas' ? '#0369a1' : '#0891b2',
          }}
        />
      )}
    </>
  );
};

export default FacilityMarker;