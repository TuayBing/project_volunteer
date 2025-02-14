import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle, Clock, XCircle, ChevronDown, Users, 
  Calendar, BookOpen, Trash2, AlertCircle
} from 'lucide-react';
import DashboardCard from './DashboardCard';
import StatusCard from './StatusCard';
import StatusModal from '../../layout/ProfileModal/StatusModal';
import api from '../../utils/axios';
import { 
  updateActivityStatusThunk, 
  fetchActivityDashboardStats,
  setYearRange,
  selectActivities,
  selectYearRange,
  selectLoading,
  selectError 
} from '../../store/activityDashboardSlice';

const ActivityLog = () => {
  const dispatch = useDispatch();
  
  // Redux states
  const activities = useSelector(selectActivities);
  const yearRange = useSelector(selectYearRange);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Local states
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const calculateYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() + 543;
    const startYear = currentMonth > 4 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    dispatch(setYearRange(`สิงหาคม ${startYear} - พฤษภาคม ${endYear}`));
  };

  const handleDeleteActivity = async () => {
    try {
      setIsDeleting(true);
      // เปลี่ยนเส้นทาง API ให้ตรงกับ backend
      await api.delete(`/profile/activities/${deletingActivity.id}`);
      await dispatch(fetchActivityDashboardStats());
      setShowDeleteConfirm(false);
      setDeletingActivity(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateActivityStatus = async (activityId, newStatus) => {
    try {
      await dispatch(updateActivityStatusThunk({ activityId, newStatus }));
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    calculateYear();
    dispatch(fetchActivityDashboardStats());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'สำเร็จ': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'กำลังดำเนินการ': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'ยกเลิก': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'สำเร็จ': return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'กำลังดำเนินการ': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'ยกเลิก': return 'bg-red-50 text-red-700 ring-red-600/20';
      default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const renderActivityCard = (registration) => (
    <div 
      key={registration.id} 
      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      <div className="p-5">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-4 mb-4">
        <h4 className="text-lg font-medium text-gray-900 whitespace-nowrap">
            {registration?.activity?.name?.length > 40 
              ? `${registration.activity.name.substring(0, 40)}...` 
              : registration?.activity?.name}
          </h4>
          <div className="flex items-center gap-2">
          
           {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              ${registration?.status === 'สำเร็จ' || registration?.status === 'ยกเลิก'
                ? 'opacity-80'
                : 'cursor-pointer hover:opacity-90 hover:bg-opacity-80'
              } ${getStatusStyle(registration?.status)}`}
            onClick={() => {
              if (registration?.status !== 'สำเร็จ' && registration?.status !== 'ยกเลิก') {
                setSelectedActivity(registration);
                setIsStatusDialogOpen(true);
              }
            }}
          >
            {getStatusIcon(registration?.status)}
            <span>{registration?.status}</span>
            {registration?.status !== 'สำเร็จ' && registration?.status !== 'ยกเลิก' && (
              <ChevronDown className="w-4 h-4 transition-transform" />
            )}
          </div>

            {/* Delete Button */}
            <button
              onClick={() => {
                setDeletingActivity(registration.activity);
                setShowDeleteConfirm(true);
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="ลบกิจกรรม"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          {/* Activity Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={registration?.activity?.image_url || "/api/placeholder/420/126"}
              alt={registration?.activity?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Activity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                ${registration?.activity?.format === 'ออนไลน์'
                  ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
                  : 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20'
                }`}>
                {registration?.activity?.format}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {registration?.activity?.hours} ชั่วโมง
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                {registration?.activity?.interested_count} คนสนใจ
              </span>
            </div>

            {/* Toggle Details Button */}
            <button 
              onClick={() => toggleDetails(registration.activity.id)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1.5"
            >
              {showDetails[registration.activity.id] ? (
                <>
                  <span>ซ่อนรายละเอียด</span>
                  <ChevronDown className="w-4 h-4 transform rotate-180 transition-transform" />
                </>
              ) : (
                <>
                  <span>ดูรายละเอียด</span>
                  <ChevronDown className="w-4 h-4 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails[registration.activity.id] && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-4">
              {registration?.activity?.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              บันทึกเมื่อ: {new Date(registration.registered_at).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderActivityList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchActivityDashboardStats())} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      );
    }

    if (!Array.isArray(activities) || activities.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="mb-4">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-500">
            ยังไม่มีกิจกรรมที่บันทึก
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
        {activities.map(renderActivityCard)}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6 p-6 bg-gray-50 h-400">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 h-[560px] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h3 className="text-xl font-semibold text-gray-900">รายชื่อกิจกรรม</h3>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                (ระยะเวลาที่เก็บกิจกรรม {yearRange})
              </span>
            </div>
            {renderActivityList()}
          </div>

          <div className="space-y-6">
            <DashboardCard />
            <StatusCard />
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        activity={selectedActivity?.activity}
        currentStatus={selectedActivity?.status}
        onUpdateStatus={(newStatus) => updateActivityStatus(selectedActivity?.activity?.id, newStatus)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบกิจกรรม</h3>
              </div>
              <p className="text-sm text-gray-500 ml-10">
                กิจกรรมนี้จะถูกลบออกจากระบบอย่างถาวร
              </p>
            </div>
            
            {/* Activity Info */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={deletingActivity?.image_url || "/api/placeholder/420/126"}
                    alt={deletingActivity?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">{deletingActivity?.name}</p>
                  <p className="text-sm text-gray-500">
                    {deletingActivity?.format} • {deletingActivity?.hours} ชั่วโมง
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingActivity(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteActivity}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600/30 border-t-red-600"></div>
                    <span>กำลังลบ...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>ลบกิจกรรม</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityLog;