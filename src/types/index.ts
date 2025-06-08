export interface User {
  id_user: string;
  username: string;
  password_hash: string;
  email: string;
}

// Nutrition status types
export type NutritionStatus =
  | "normal"
  | "underweight"
  | "severely_underweight"
  | "stunting";

// Children data
export interface Child {
  id: string;
  name: string;
  age: number; // Age in months
  nutritionStatus: NutritionStatus;
  district: string;
  coordinates: [number, number]; // [latitude, longitude]
  createdAt: string;
  updatedAt: string;
}

// Health facility
export interface HealthFacility {
  id: string;
  name: string;
  type: "puskesmas" | "pustu"; // Health center or sub-health center
  district: string;
  coordinates: [number, number]; // [latitude, longitude]
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

// District data
export interface District {
  id: string;
  name: string;
  totalChildren: number;
  nutritionCases: {
    normal: number;
    underweight: number;
    severely_underweight: number;
    stunting: number;
  };
}

// Spatial analysis result
export interface SpatialAnalysis {
  district: string;
  facilityCoverage: number; // Percentage of district covered by health facilities
  childrenWithinBuffer: number; // Number of children within 1km of health facilities
  childrenOutsideBuffer: number; // Number of children outside 1km of health facilities
}
