import React, { useState, useCallback } from 'react';
import { mockDistrictStats, districts } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#f97316'];
const STATUS_NAMES = {
  normal: 'Normal',
  underweight: 'Gizi Kurang',
  severely_underweight: 'Gizi Buruk',
  stunting: 'Stunting'
};

const PublicStatsPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  
  const getFilteredData = useCallback(() => {
    if (selectedDistrict === 'all') {
      return mockDistrictStats;
    }
    return mockDistrictStats.filter(district => district.name === selectedDistrict);
  }, [selectedDistrict]);

  const getAggregatedData = useCallback(() => {
    const filteredData = getFilteredData();
    
    // For overall summary
    const totalCases = filteredData.reduce((acc, district) => {
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
    
    const totalChildren = filteredData.reduce((acc, district) => acc + district.totalChildren, 0);
    
    // Prepare data for charts
    const pieChartData = [
      { name: 'Normal', value: totalCases.normal },
      { name: 'Gizi Kurang', value: totalCases.underweight },
      { name: 'Gizi Buruk', value: totalCases.severely_underweight },
      { name: 'Stunting', value: totalCases.stunting }
    ];
    
    const barChartData = filteredData.map(district => ({
      name: district.name,
      Normal: district.nutritionCases.normal,
      'Gizi Kurang': district.nutritionCases.underweight,
      'Gizi Buruk': district.nutritionCases.severely_underweight,
      Stunting: district.nutritionCases.stunting
    }));
    
    return { totalCases, totalChildren, pieChartData, barChartData };
  }, [getFilteredData]);
  
  const { totalCases, totalChildren, pieChartData, barChartData } = getAggregatedData();
  
  const CustomTooltip = ({ active, payload }: any) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader 
        title="Statistik Gizi"
        description="Visualisasi statistik kasus gizi di Kota Surabaya"
      />
      
      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <label htmlFor="district-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Kecamatan
          </label>
          <select
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="all">Semua Kecamatan</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap gap-3 sm:gap-2">
          <div className="px-3 py-1.5 rounded-full bg-green-100 text-xs font-medium text-green-800">
            Normal: {totalCases.normal}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-yellow-100 text-xs font-medium text-yellow-800">
            Gizi Kurang: {totalCases.underweight}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-red-100 text-xs font-medium text-red-800">
            Gizi Buruk: {totalCases.severely_underweight}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-orange-100 text-xs font-medium text-orange-800">
            Stunting: {totalCases.stunting}
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Total data: <span className="font-semibold text-gray-700">{totalChildren} anak</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Persentase Status Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(STATUS_NAMES).map(([key, name], index) => {
                const count = totalCases[key as keyof typeof totalCases];
                const percentage = totalChildren > 0 ? (count / totalChildren) * 100 : 0;
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                      <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full`} 
                        style={{ width: `${percentage}%`, backgroundColor: COLORS[index] }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right">{count} anak</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bar Chart for Districts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Status Gizi per Kecamatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={20}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0}
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
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
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900">Tentang Statistik Gizi Surabaya</h2>
        <p className="mt-2 text-sm text-gray-500">
          Statistik ini menampilkan sebaran kasus gizi anak di Kota Surabaya berdasarkan kategori status gizi: normal, gizi kurang, gizi buruk, dan stunting.
          Data ini diperbarui secara berkala oleh petugas gizi dan dapat disaring berdasarkan kecamatan.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Statistik ini bertujuan untuk memberikan gambaran umum mengenai kondisi gizi anak di Kota Surabaya
          dan membantu dalam perencanaan intervensi gizi yang lebih tepat sasaran.
        </p>
      </div>
    </div>
  );
};

export default PublicStatsPage;