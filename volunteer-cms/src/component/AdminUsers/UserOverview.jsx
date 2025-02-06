import React, { useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../store/userSlice';

function UserOverview() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">จำนวนผู้ใช้ทั้งหมด</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`${
              stats.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
            } mr-2`}>
              {stats.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(stats.percentageChange)}%
            </span>
            <span className="text-gray-500">จากเดือนที่แล้ว</span>
          </div>
        </div>

        {/* New Users Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">ผู้ใช้ใหม่เดือนนี้</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.newUsersThisMonth}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            เพิ่มขึ้น {stats.newUsersThisMonth} คนในเดือนนี้
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOverview;