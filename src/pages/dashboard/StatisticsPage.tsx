import React, { useState, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { mockDistrictStats, districts } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { Download, RefreshCw } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#f97316'];

const StatisticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(user?.district || 'all');
  const [showPercentage, setShowPercentage] = useState<boolean>(false);
  
  // Filter district stats based on user role and district
  const filteredDistrictStats = user?.role === 'officer' && user.district 
    ? mockDistrictStats.filter(district => district.name === user.district)
    : selectedDistrict === 'all'
      ? mockDistrictStats
      : mockDistrictStats.filter(district => district.name === selectedDistrict);
  
  const getAggregatedData = useCallback(() => {
    // For overall summary
    const totalCases = filteredDistrictStats.reduce((acc, district) => {
      return {
        normal: acc.normal + district.nutritionCases.normal,
        underweight: acc.underweight + district.nutritionCases.underweight,
        severely_underweight: acc.severely_underweight + district.nutritionCases.severely_underweight,
        stunting: acc.stunting + district.nutritionCases.stunting
      };
    }, {
      normal: 0,
      underweight: 0,
      severely_underweight: 0,
      stunting: 0
    });
    
    const totalChildren = filteredDistrictStats.reduce((acc, district) => acc + district.totalChildren, 0);
    
    // Prepare data for charts
    const pieChartData = [
      { name: 'Normal', value: totalCases.normal },
      { name: 'Gizi Kurang', value: totalCases.underweight },
      { name: 'Gizi Buruk', value: totalCases.severely_underweight },
      { name: 'Stunting', value: totalCases.stunting }
    ];
    
    // Bar chart data based on whether to show percentage or absolute numbers
    const barChartData = filteredDistrictStats.map(district => {
      const total = district.totalChildren;
      if (showPercentage) {
        return {
          name: district.name,
          Normal: total ? (district.nutritionCases.normal / total * 100) : 0,
          'Gizi Kurang': total ? (district.nutritionCases.underweight / total * 100) : 0,
          'Gizi Buruk': total ? (district.nutritionCases.severely_underweight / total * 100) : 0,
          Stunting: total ? (district.nutritionCases.stunting / total * 100) : 0
        };
      }
      return {
        name: district.name,
        Normal: district.nutritionCases.normal,
        'Gizi Kurang': district.nutritionCases.underweight,
        'Gizi Buruk': district.nutritionCases.severely_underweight,
        Stunting: district.nutritionCases.stunting
      };
    });
    
    // Generate mock trend data
    const trendData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i).toLocaleString('id-ID', { month: 'short' });
      const base = {
        month,
        Normal: Math.round(totalCases.normal / 12 * (0.9 + Math.random() * 0.2)),
        'Gizi Kurang': Math.round(totalCases.underweight / 12 * (0.9 + Math.random() * 0.2)),
        'Gizi Buruk': Math.round(totalCases.severely_underweight / 12 * (0.9 + Math.random() * 0.2)),
        Stunting: Math.round(totalCases.stunting / 12 * (0.9 + Math.random() * 0.2))
      };
      
      // Add a seasonal pattern
      if (i >= 5 && i <= 7) { // Jun-Aug: increase in cases
        base['Gizi Kurang'] = Math.round(base['Gizi Kurang'] * 1.2);
        base['Gizi Buruk'] = Math.round(base['Gizi Buruk'] * 1.15);
      }
      
      return base;
    });
    
    return { totalCases, totalChildren, pieChartData, barChartData, trendData };
  }, [filteredDistrictStats, showPercentage]);
  
  const { totalCases, totalChildren, pieChartData, barChartData, trendData } = getAggregatedData();
  
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-500">{`${(payload[0].value / totalChildren * 100).toFixed(1)}% dari total`}</p>
        </div>
      );
    }
    return null;
  };
  
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${showPercentage ? entry.value.toFixed(1) + '%' : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Statistik Gizi" 
        description="Analisis statistik dan tren kasus gizi"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
            >
              Refresh Data
            </Button>
          </div>
        }
      />
      
      <div className="mt-6 bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="w-full sm:w-64">
          <label htmlFor="district-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Kecamatan
          </label>
          <select
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            disabled={user?.role === 'officer' && user.district ? true : false}
          >
            {!user?.district && <option value="all">Semua Kecamatan</option>}
            {districts
              .filter(district => !user?.district || district === user.district)
              .map(district => (
                <option key={district} value={district}>{district}</option>
              ))
            }
          </select>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-3">Tampilkan sebagai:</span>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setShowPercentage(false)}
              className={`px-3 py-1 text-sm focus:outline-none ${
                !showPercentage ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Jumlah
            </button>
            <button
              onClick={() => setShowPercentage(true)}
              className={`px-3 py-1 text-sm focus:outline-none ${
                showPercentage ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Persentase
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balita"
          value={totalChildren}
          description="Jumlah balita dalam data"
          colorScheme="default"
        />
        
        <StatCard
          title="Gizi Kurang"
          value={showPercentage 
            ? `${(totalCases.underweight / totalChildren * 100).toFixed(1)}%` 
            : totalCases.underweight}
          description={`${totalCases.underweight} anak`}
          colorScheme="yellow"
        />
        
        <StatCard
          title="Gizi Buruk"
          value={showPercentage 
            ? `${(totalCases.severely_underweight / totalChildren * 100).toFixed(1)}%` 
            : totalCases.severely_underweight}
          description={`${totalCases.severely_underweight} anak`}
          colorScheme="red"
        />
        
        <StatCard
          title="Stunting"
          value={showPercentage 
            ? `${(totalCases.stunting / totalChildren * 100).toFixed(1)}%` 
            : totalCases.stunting}
          description={`${totalCases.stunting} anak`}
          colorScheme="orange"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {showPercentage ? 'Persentase Status Gizi per Kecamatan' : 'Jumlah Kasus per Kecamatan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={value => showPercentage ? `${value.toFixed(0)}%` : value.toString()}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="Normal" stackId="a" fill="#22c55e" />
                  <Bar dataKey="Gizi Kurang" stackId="a" fill="#eab308" />
                  <Bar dataKey="Gizi Buruk" stackId="a" fill="#ef4444" />
                  <Bar dataKey="Stunting" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Kasus Gizi (12 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Normal" stroke="#22c55e" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Gizi Kurang" stroke="#eab308" />
                  <Line type="monotone" dataKey="Gizi Buruk" stroke="#ef4444" />
                  <Line type="monotone" dataKey="Stunting" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 mb-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analisis Statistik</h2>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Data statistik menunjukkan bahwa dari total {totalChildren} balita yang tercatat di {
              selectedDistrict === 'all' ? 'Kota Surabaya' : `Kecamatan ${selectedDistrict}`
            }, terdapat {totalCases.underweight} kasus gizi kurang, 
            {totalCases.severely_underweight} kasus gizi buruk, dan {totalCases.stunting} kasus stunting.
          </p>
          
          <p>
            Persentase kasus gizi bermasalah adalah {
              ((totalCases.underweight + totalCases.severely_underweight + totalCases.stunting) / totalChildren * 100).toFixed(1)
            }% dari total balita. Angka ini {
              ((totalCases.underweight + totalCases.severely_underweight + totalCases.stunting) / totalChildren * 100) > 15
                ? 'memerlukan perhatian khusus dan intervensi segera'
                : 'berada dalam batas wajar namun tetap memerlukan pemantauan'
            }.
          </p>
          
          <p>
            Untuk intervensi yang efektif, perlu difokuskan pada kecamatan dengan persentase kasus gizi bermasalah tertinggi,
            terutama untuk kasus gizi buruk dan stunting yang memiliki dampak jangka panjang terhadap tumbuh kembang anak.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;