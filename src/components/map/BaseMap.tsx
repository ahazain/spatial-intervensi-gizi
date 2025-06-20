import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Titik tengah peta default
const CENTER_POSITION: [number, number] = [-7.2575, 112.7521];
const DEFAULT_ZOOM = 12;

interface MapFlyToProps {
  position: [number, number];
  zoom?: number;
}

interface BaseMapProps {
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
  flyTo?: [number, number];
  className?: string;
  style?: React.CSSProperties;
}

const MapFlyTo: React.FC<MapFlyToProps> = ({
  position,
  zoom = DEFAULT_ZOOM,
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom, { duration: 1.5 });
    }
  }, [map, position, zoom]);

  return null;
};

const BaseMap: React.FC<BaseMapProps> = ({
  children,
  center = CENTER_POSITION,
  zoom = DEFAULT_ZOOM,
  flyTo,
  className = "h-[600px] w-full",
  style,
}) => {
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className={className} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {mapReady && children}

        {flyTo && mapReady && <MapFlyTo position={flyTo} zoom={zoom} />}
      </MapContainer>
    </div>
  );
};

export default BaseMap;