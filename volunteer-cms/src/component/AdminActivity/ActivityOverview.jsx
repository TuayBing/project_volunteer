import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { 
  fetchActivities, 
  selectActivities, 
  selectActivityStatus, 
  selectActivityError 
} from '../../store/activitySlice';
import { 
  fetchCategories, 
  selectCategories, 
  selectCategoryStatus 
} from '../../store/categorySlice';

const ActivityOverview = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const activities = useSelector(selectActivities);
  const categories = useSelector(selectCategories);
  const activityStatus = useSelector(selectActivityStatus);
  const categoryStatus = useSelector(selectCategoryStatus);
  const error = useSelector(selectActivityError);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchActivities()).unwrap(),
          dispatch(fetchCategories()).unwrap()
        ]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    
    if (activityStatus === 'idle' || categoryStatus === 'idle') {
      loadData();
    }
  }, [dispatch, activityStatus, categoryStatus]);

  const getMostPopularActivity = () => {
    if (!activities.length) return null;
    return activities.reduce((max, activity) =>
      (activity.interested_count > (max?.interested_count || 0)) ? activity : max
    , null);
  };

  const getLeastPopularActivity = () => {
    if (!activities.length) return null;
    return activities.reduce((min, activity) =>
      (activity.interested_count < (min?.interested_count || Infinity)) ? activity : min
    , null);
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (activityStatus === 'loading' || categoryStatus === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
        <p className="font-medium">เกิดข้อผิดพลาด</p>
        <p>{error}</p>
      </div>
    );
  }

  const mostPopular = getMostPopularActivity();
  const leastPopular = getLeastPopularActivity();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">กิจกรรมทั้งหมด</p>
            <h3 className="text-2xl font-bold text-gray-800">{activities.length}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">กิจกรรมที่ได้รับความนิยม</p>
            <h3 className="text-2xl font-bold text-gray-800 line-clamp-1" title={mostPopular?.name}>
              {truncateText(mostPopular?.name)}
            </h3>
            {mostPopular && (
              <span className="text-sm text-green-500">
                {mostPopular.interested_count} คนเข้าร่วม
              </span>
            )}
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">กิจกรรมที่มีผู้เข้าร่วมน้อย</p>
            <h3 className="text-2xl font-bold text-gray-800 line-clamp-1" title={leastPopular?.name}>
              {truncateText(leastPopular?.name)}
            </h3>
            {leastPopular && (
              <span className="text-sm text-red-500">
                {leastPopular.interested_count} คนเข้าร่วม
              </span>
            )}
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">หมวดหมู่ทั้งหมด</p>
            <h3 className="text-2xl font-bold text-gray-800" title={categories.map(c => c.name).join(', ')}>
              {categories.length}
            </h3>
            {categories.length > 0 && (
              <span className="text-sm text-orange-500">
                {categories.length} หมวดหมู่
              </span>
            )}
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;