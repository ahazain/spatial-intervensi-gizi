import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Child } from '../../types';
import StatusBadge from '../ui/StatusBadge';

// Custom icons for different nutrition statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};

// Icons for each nutrition status
const icons = {
  normal: createCustomIcon('#22c55e'), // Green
  underweight: createCustomIcon('#eab308'), // Yellow
  severely_underweight: createCustomIcon('#ef4444'), // Red
  stunting: createCustomIcon('#f97316'), // Orange
};

interface ChildMarkerProps {
  child: Child;
  detailed?: boolean; // Whether to show detailed information (for admin/officer)
  onClick?: (child: Child) => void;
}

const ChildMarker: React.FC<ChildMarkerProps> = ({ child, detailed = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(child);
    }
  };

  return (
    <Marker 
      position={child.coordinates} 
      icon={icons[child.nutritionStatus]}
      eventHandlers={{ click: handleClick }}
    >
      <Popup className="custom-popup">
        <div className="p-1">
          <div className="text-sm font-semibold mb-1">
            {detailed ? child.name : `Anak ${child.id.split('-')[1]}`}
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Usia: {child.age} bulan
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Kecamatan: {child.district}
          </div>
          <div className="mt-1">
            <StatusBadge status={child.nutritionStatus} size="sm" />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default ChildMarker;