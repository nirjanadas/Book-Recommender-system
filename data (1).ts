import { Customer, TripData } from '../types';

// Generate random coordinates within a reasonable area (e.g., city limits)
const generateRandomCoordinate = (base: number, range: number): number => {
  return base + (Math.random() - 0.5) * range;
};

// Generate synthetic customer data
export const generateCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    home: {
      lat: generateRandomCoordinate(12.9716, 0.2), // Bangalore coordinates as example
      lng: generateRandomCoordinate(77.5946, 0.2),
      name: 'Home'
    },
    office: {
      lat: generateRandomCoordinate(12.9716, 0.2),
      lng: generateRandomCoordinate(77.5946, 0.2),
      name: 'Office'
    }
  }));
};

// Generate historical trip data
export const generateHistoricalData = (customers: Customer[]): TripData[] => {
  const timeSlots = ['morning_rush', 'midday', 'evening_rush', 'night'];
  const data: TripData[] = [];
  
  // Generate 90 days of data
  for (let day = 0; day < 90; day++) {
    customers.forEach(customer => {
      // Morning trip (to office)
      const morningHour = 7 + Math.floor(Math.random() * 3); // 7-9 AM
      data.push({
        customerId: customer.id,
        startTime: `2024-01-${String(day + 1).padStart(2, '0')}T${String(morningHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        duration: 30 + Math.floor(Math.random() * 20), // 30-50 minutes
        dayOfWeek: day % 7,
        timeSlot: 'morning_rush'
      });

      // Evening trip (to home)
      const eveningHour = 17 + Math.floor(Math.random() * 3); // 5-7 PM
      data.push({
        customerId: customer.id,
        startTime: `2024-01-${String(day + 1).padStart(2, '0')}T${String(eveningHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        duration: 35 + Math.floor(Math.random() * 25), // 35-60 minutes
        dayOfWeek: day % 7,
        timeSlot: 'evening_rush'
      });
    });
  }

  return data;
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Predict travel time based on historical data
export const predictTravelTime = (
  customer: Customer,
  startTime: Date,
  historicalData: TripData[]
): PredictionResult => {
  const hour = startTime.getHours();
  const dayOfWeek = startTime.getDay();
  
  let timeSlot = 'midday';
  if (hour >= 7 && hour <= 10) timeSlot = 'morning_rush';
  else if (hour >= 16 && hour <= 19) timeSlot = 'evening_rush';
  else if (hour >= 22 || hour <= 5) timeSlot = 'night';

  // Filter relevant historical data
  const relevantTrips = historicalData.filter(trip => 
    trip.customerId === customer.id &&
    trip.timeSlot === timeSlot &&
    trip.dayOfWeek === dayOfWeek
  );

  if (relevantTrips.length === 0) {
    return {
      estimatedDuration: 45, // Default duration
      confidence: 0.8,
      timeSlot
    };
  }

  // Calculate average duration
  const totalDuration = relevantTrips.reduce((sum, trip) => sum + trip.duration, 0);
  const avgDuration = totalDuration / relevantTrips.length;

  // Calculate confidence based on sample size
  const confidence = Math.min(0.95, 0.8 + (relevantTrips.length / 100));

  return {
    estimatedDuration: Math.round(avgDuration),
    confidence,
    timeSlot
  };
};