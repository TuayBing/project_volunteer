import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/axios';

const FacultyStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/faculty/majors/loan-stats');
        
        // แปลงข้อมูลให้เข้ากับรูปแบบที่ต้องการ
        const transformedData = response.data.data.map(item => ({
          name: item.name,
          count: item.eligible // จำนวนคนที่มีสิทธิ์กู้
        }));
        
        setStats(transformedData);
        // คำนวณผลรวมของผู้มีสิทธิ์กู้ทั้งหมด
        const totalEligible = response.data.data.reduce((sum, item) => sum + item.eligible, 0);
        setTotal(totalEligible);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loan stats:', error);
        setError('ไม่สามารถโหลดข้อมูลสถิติได้');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-purple-600">
            จำนวนผู้มีสิทธิ์กู้: {payload[0].value} คน
          </p>
          <p className="text-sm text-gray-500 mt-1">
            คิดเป็น {((payload[0].value / total) * 100).toFixed(1)}% ของทั้งหมด
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          สถิติการกู้ยืมตามสาขา (คณะวิทยาศาสตร์)
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          แสดงจำนวนผู้มีสิทธิ์กู้แยกตามสาขาวิชาในคณะวิทยาศาสตร์
        </p>
        <div className="flex items-center mt-2">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <span className="ml-2 text-sm text-gray-500">ผู้มีสิทธิ์กู้ทั้งหมด</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 40
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 'auto']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              name="จำนวนผู้มีสิทธิ์กู้"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FacultyStats;