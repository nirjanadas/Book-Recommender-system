import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { Customer, Location, RouteInfo } from './types';
import Map from './components/Map';

function App() {
  const [source, setSource] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const handleLocationInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'source' | 'destination'
  ) => {
    const [lat, lng] = e.target.value.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      const location: Location = {
        lat,
        lng,
        name: type === 'source' ? 'Source' : 'Destination'
      };
      if (type === 'source') {
        setSource(location);
      } else {
        setDestination(location);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Real-Time Route Planner
          </h1>
          <p className="text-gray-600 mb-6">
            Get detailed directions and estimated travel time for your journey
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Location (latitude, longitude)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 12.9716, 77.5946"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => handleLocationInput(e, 'source')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Location (latitude, longitude)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 12.9516, 77.5991"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => handleLocationInput(e, 'destination')}
                />
              </div>

              {routeInfo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Route Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-white rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium">Total Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(routeInfo.duration)} minutes
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        <Navigation className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium">Total Distance</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {routeInfo.distance.toFixed(1)} km
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Turn-by-turn Directions</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {routeInfo.steps.map((step, index) => (
                        <div key={index} className="p-2 hover:bg-gray-50">
                          <p className="text-gray-700">{step.instruction}</p>
                          <p className="text-sm text-gray-500">
                            {(step.distance / 1000).toFixed(1)} km · {Math.round(step.duration)} min
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Map 
                source={source}
                destination={destination}
                onRouteUpdate={setRouteInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;