export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  home: Location;
  office: Location;
}

export interface TripData {
  customerId: number;
  startTime: string;
  duration: number; // in minutes
  dayOfWeek: number;
  timeSlot: string;
}

export interface PredictionResult {
  estimatedDuration: number;
  confidence: number;
  timeSlot: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  steps: RouteStep[];
}