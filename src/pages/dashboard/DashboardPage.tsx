import React from 'react';
import { Users, Building2, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { useChildrenStore } from '../../stores/childrenStore';
import { useFacilitiesStore } from '../../stores/facilitiesStore';
import { useAuthStore } from '../../stores/authStore';
import { mockDistrictStats } from '../../lib/mockData';
import PageHeader from '../../components/ui/PageHeader';
import { ButtonLink } from '../../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { children } = useChildrenStore();
  const { facilities } = useFacilitiesStore();
  const { user } = useAuthStore();
  
  // Filter data based on user role and district
  const filteredChildren = user?.role === 'officer' && user.district 
    ? children.filter(child => child.district === user.district)
    : children;
  
  const filteredFacilities = user?.role === 'officer' && user.district
    ? facilities.filter(facility => facility.district === user.district)
    : facilities;
  
  const filteredDistricts = user?.role === 'officer' && user.district
    ? mockDistrictStats.filter(district => district.name === user.district)
    : mockDistrictStats;
  
  // Calculate nutrition status counts
  const normalCount = filteredChildren.filter(child => child.nutritionStatus === 'normal').length;
  const underweightCount = filteredChildren.filter(child => child.nutritionStatus === 'underweight').length;
  const severelyUnderweightCount = filteredChildren.filter(child => child.nutritionStatus === 'severely_underweight').length;
  const stuntingCount = filteredChildren.filter(child => child.nutritionStatus === 'stunting').length;
  
  // Calculate health facility counts
  const puskesmasCount = filteredFacilities.filter(facility => facility.type === 'puskesmas').length;
  const pustuCount = filteredFacilities.filter(facility => facility.type === 'pustu').length;
  
  // Get districts with highest issues
  const districtsWithIssues = [...mockDistrictStats]
    .sort((a, b) => {
      const aIssues = a.nutritionCases.severely_underweight + a.nutritionCases.stunting;
      const bIssues = b.nutritionCases.severely_underweight + b.nutritionCases.stunting;
      return bIssues - aIssues;
    })
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title={`Selamat Datang, ${user?.name}`} 
        description={`Dashboard ${user?.role === 'admin' ? 'Admin' : 'Petugas Gizi'}`}
        actions={
          <div className="flex space-x-3">
            <ButtonLink 
              to={'/dashboard/children'} 
              variant="primary"
            >
              Data Balita
            </ButtonLink>
            <ButtonLink 
              to={'/dashboard/map-analysis'} 
              variant="outline"
            >
              Peta & Analisis
            </ButtonLink>
          </div>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balita"
          value={filteredChildren.length}
          icon={<Users size={24} />}
          colorScheme="default"
        />
        
        <StatCard
          title="Kasus Gizi Kurang"
          value={underweightCount}
          icon={<AlertTriangle size={24} />}
          trend={{ 
            direction: 'down', 
            value: '5.2% dibanding bulan lalu' 
          }}
          colorScheme="yellow"
        />
        
        <StatCard
          title="Kasus Gizi Buruk"
          value={severelyUnderweightCount}
          icon={<AlertTriangle size={24} />}
          trend={{ 
            direction: 'down', 
            value: '3.1% dibanding bulan lalu' 
          }}
          colorScheme="red"
        />
        
        <StatCard
          title="Kasus Stunting"
          value={stuntingCount}
          icon={<AlertTriangle size={24} />}
          trend={{ 
            direction: 'down', 
            value: '2.8% dibanding bulan lalu' 
          }}
          colorScheme="orange"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Fasilitas Kesehatan
                </h3>
                <p className="text-sm text-gray-500">
                  Data fasilitas kesehatan di {user?.district || 'Kota Surabaya'}
                </p>
              </div>
              
              <div className="border-t border-gray-200">
                <dl className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <Building2 className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Puskesmas
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-teal-600">{puskesmasCount}</dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <Building2 className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Pustu
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">{pustuCount}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4">
                <ButtonLink 
                  to="/dashboard/facilities" 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Lihat Detail Fasilitas
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="sm:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Cakupan Wilayah
                </h3>
                <p className="text-sm text-gray-500">
                  Jumlah kecamatan dan status gizi
                </p>
              </div>
              
              <div className="border-t border-gray-200">
                <dl className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      <MapPin className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                      Kecamatan
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-teal-600">{filteredDistricts.length}</dd>
                  </div>
                  <div className="p-6 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      Persentase Kasus
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">
                      {filteredChildren.length > 0 
                        ? ((severelyUnderweightCount + stuntingCount) / filteredChildren.length * 100).toFixed(1)
                        : 0}%
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4">
                <ButtonLink 
                  to="/dashboard/statistics" 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Lihat Detail Statistik
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Kecamatan dengan Kasus Terbanyak
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kecamatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Balita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gizi Buruk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stunting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {districtsWithIssues.map((district) => {
                    const severeCount = district.nutritionCases.severely_underweight;
                    const stuntingCount = district.nutritionCases.stunting;
                    const totalIssues = severeCount + stuntingCount;
                    const percentage = district.totalChildren > 0 
                      ? (totalIssues / district.totalChildren * 100).toFixed(1)
                      : '0';
                    
                    return (
                      <tr key={district.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {district.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {district.totalChildren}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-medium text-red-600">{severeCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-medium text-orange-600">{stuntingCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">{percentage}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseFloat(percentage) > 15
                                    ? 'bg-red-500'
                                    : parseFloat(percentage) > 10
                                    ? 'bg-orange-500'
                                    : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(parseFloat(percentage) * 3, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;