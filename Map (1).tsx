import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Customer, Location, RouteInfo } from '../types';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  source: Location | null;
  destination: Location | null;
  onRouteUpdate: (route: RouteInfo) => void;
}

function RouteManager({ source, destination, onRouteUpdate }: MapProps) {
  const map = useMap();

  useEffect(() => {
    let routingControl: L.Routing.Control | null = null;

    if (source && destination) {
      const waypoints = [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng)
      ];

      routingControl = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#6366f1', weight: 6 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        }
      }).addTo(map);

      routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const steps = route.instructions.map(step => ({
          instruction: step.text,
          distance: step.distance,
          duration: step.time / 60 // Convert to minutes
        }));

        onRouteUpdate({
          distance: route.summary.totalDistance / 1000, // Convert to km
          duration: route.summary.totalTime / 60, // Convert to minutes
          steps
        });
      });

      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [source, destination, map, onRouteUpdate]);

  return null;
}

export default function Map({ source, destination, onRouteUpdate }: MapProps) {
  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bangalore center

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {source && (
          <Marker position={[source.lat, source.lng]}>
            <Popup>Source Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination Location</Popup>
          </Marker>
        )}
        <RouteManager 
          source={source}
          destination={destination}
          onRouteUpdate={onRouteUpdate}
        />
      </MapContainer>
    </div>
  );
}