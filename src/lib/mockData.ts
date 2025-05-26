import { Child, District, HealthFacility, User } from '../types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@surabaya.go.id',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Petugas Gizi Sukomanunggal',
    email: 'petugas@surabaya.go.id',
    role: 'officer',
    district: 'Sukomanunggal',
  },
];

// Surabaya's approximate center coordinates
const surabayaCenter: [number, number] = [-7.2575, 112.7521];

// Helper to generate random coordinates around Surabaya
const getRandomCoordinate = (centerLat: number, centerLng: number, radiusKm = 10): [number, number] => {
  // Convert radius from km to degrees
  const radiusLat = radiusKm / 111;
  const radiusLng = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
  
  const randomLat = centerLat + (Math.random() * 2 - 1) * radiusLat;
  const randomLng = centerLng + (Math.random() * 2 - 1) * radiusLng;
  
  return [randomLat, randomLng];
};

// Surabaya districts
export const districts = [
  'Sukomanunggal', 'Tandes', 'Asemrowo', 'Benowo', 'Pakal', 
  'Lakarsantri', 'Sambikerep', 'Genteng', 'Tegalsari', 'Bubutan',
  'Simokerto', 'Pabean Cantian', 'Semampir', 'Krembangan', 'Bulak',
  'Kenjeran', 'Tambaksari', 'Gubeng', 'Rungkut', 'Tenggilis Mejoyo',
  'Gunung Anyar', 'Sukolilo', 'Mulyorejo', 'Sawahan', 'Wonokromo',
  'Karangpilang', 'Dukuh Pakis', 'Wiyung', 'Gayungan', 'Wonocolo', 'Jambangan'
];

// Generate mock children data
export const mockChildren: Child[] = Array.from({ length: 200 }, (_, i) => {
  const nutritionStatuses: NutritionStatus[] = ['normal', 'underweight', 'severely_underweight', 'stunting'];
  const randomStatus = nutritionStatuses[Math.floor(Math.random() * nutritionStatuses.length)];
  const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
  
  return {
    id: `child-${i + 1}`,
    name: `Anak ${i + 1}`,
    age: Math.floor(Math.random() * 60), // 0-60 months
    nutritionStatus: randomStatus,
    district: randomDistrict,
    coordinates: getRandomCoordinate(surabayaCenter[0], surabayaCenter[1]),
    createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date in the last year
    updatedAt: new Date().toISOString(),
  };
});

// Generate mock health facilities data
export const mockHealthFacilities: HealthFacility[] = Array.from({ length: 40 }, (_, i) => {
  const types: ('puskesmas' | 'pustu')[] = ['puskesmas', 'pustu'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
  
  return {
    id: `facility-${i + 1}`,
    name: `${randomType === 'puskesmas' ? 'Puskesmas' : 'Pustu'} ${randomDistrict} ${i + 1}`,
    type: randomType,
    district: randomDistrict,
    coordinates: getRandomCoordinate(surabayaCenter[0], surabayaCenter[1]),
    capacity: Math.floor(Math.random() * 100) + 50, // 50-150 capacity
    createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

// Generate district statistics based on mock children
export const mockDistrictStats: District[] = districts.map(districtName => {
  const childrenInDistrict = mockChildren.filter(child => child.district === districtName);
  
  const normal = childrenInDistrict.filter(c => c.nutritionStatus === 'normal').length;
  const underweight = childrenInDistrict.filter(c => c.nutritionStatus === 'underweight').length;
  const severely_underweight = childrenInDistrict.filter(c => c.nutritionStatus === 'severely_underweight').length;
  const stunting = childrenInDistrict.filter(c => c.nutritionStatus === 'stunting').length;
  
  return {
    id: districtName.toLowerCase().replace(/\s/g, '-'),
    name: districtName,
    totalChildren: childrenInDistrict.length,
    nutritionCases: {
      normal,
      underweight,
      severely_underweight,
      stunting,
    }
  };
});