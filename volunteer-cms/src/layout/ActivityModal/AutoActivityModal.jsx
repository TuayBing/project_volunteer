import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Calendar, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../component/AuthContext';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';

const AutoActivityModal = ({ isOpen, onClose }) => {
  const [allActivities, setAllActivities] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [hours, setHours] = useState('');
  const [locationType, setLocationType] = useState('');
  const [month, setMonth] = useState('');
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen]);

  const fetchActivities = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      const response = await api.get(`/activities/available/${user.id}`);
      if (response.data.success) {
        setAllActivities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม');
    }
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setHours('');
    setLocationType('');
    setMonth('');
    setSuggestedActivities([]);
    setSaved(false);
    setError(null);
    onClose();
  };

  const handleSaveAllActivities = async () => {
    try {
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อนบันทึกกิจกรรม');
        return;
      }

      setSaved(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user'));
      const activitiesToSave = suggestedActivities.map(activity => ({
        user_id: Number(user.id),
        activity_id: activity.id,
        name: activity.name,
        description: activity.description || '',
        hours: Number(activity.hours),
        image_url: activity.image_url || '',
        category: activity.category || '',
        status: 'กำลังดำเนินการ'
      }));

      const response = await api.post('/profile/activities/register', {
        activities: activitiesToSave,
        userid: Number(user.id)
      });

      if (response.data.success) {
        dispatch(clearCart());
        toast.success('บันทึกกิจกรรมทั้งหมดสำเร็จ');
        setTimeout(() => {
          resetAndClose();
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'ไม่สามารถบันทึกกิจกรรมได้');
      setSaved(false);
      toast.error('เกิดข้อผิดพลาดในการบันทึกกิจกรรม');
    }
  };

  const generateActivities = async () => {
    setIsLoading(true);
    try {
      // 1. กรองตามเงื่อนไขที่เลือก
      const filtered = allActivities.filter(activity => {
        const matchFormat = activity.format === (locationType === 'online' ? 'ออนไลน์' : 'ออนไซต์');
        
        let matchMonth = false;
        switch(month) {
          case 'Q1':
            matchMonth = ['1', '2', '3', '13'].includes(activity.month);
            break;
          case 'Q2':
            matchMonth = ['4', '5', '6', '13'].includes(activity.month);
            break;
          case 'Q3':
            matchMonth = ['7', '8', '9', '13'].includes(activity.month);
            break;
          case 'Q4':
            matchMonth = ['10', '11', '12', '13'].includes(activity.month);
            break;
          default:
            matchMonth = false;
        }

        return matchFormat && matchMonth;
      });

      // 2. เรียงตามจำนวนชั่วโมง
      const sortedActivities = filtered.sort((a, b) => 
        parseInt(a.hours) - parseInt(b.hours)
      );

      const targetHours = parseInt(hours);
      let currentHours = 0;
      const selectedActivities = [];
      // 3. เลือกกิจกรรมจนกว่าจะครบชั่วโมง
      for (const activity of sortedActivities) {
        if (currentHours < targetHours) {
          selectedActivities.push(activity);
          currentHours += parseInt(activity.hours);
        }
        if (currentHours >= targetHours) break;
      }

      // 4. แสดงผลลัพธ์
      if (selectedActivities.length === 0) {
        toast.warn('ไม่พบกิจกรรมที่ยังไม่ได้ทำในช่วงเวลาที่เลือก');
      } else if (currentHours < targetHours) {
        toast.warn(
          `พบกิจกรรมที่ยังไม่ได้ทำรวม ${currentHours} ชั่วโมง จากที่ต้องการ ${targetHours} ชั่วโมง`
        );
      } else {
        toast.success(`พบกิจกรรมที่เหมาะสม ${selectedActivities.length} กิจกรรม รวม ${currentHours} ชั่วโมง`);
      }

      setTimeout(() => {
        setSuggestedActivities(selectedActivities);
        setIsLoading(false);
        setCurrentStep(4);
      }, 800);

    } catch (error) {
      console.error('Error generating activities:', error);
      setIsLoading(false);
      toast.error('เกิดข้อผิดพลาดในการค้นหากิจกรรม');
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return hours !== '' && parseInt(hours) > 0;
      case 2:
        return locationType !== '';
      case 3:
        return month !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="relative bg-white p-6 rounded-2xl">
            <div className="text-center mb-8">
              <span className="inline-block p-3 bg-[#3BB77E]/10 rounded-xl mb-4">
                <Clock className="w-6 h-6 text-[#3BB77E]" />
              </span>
              <h3 className="text-xl font-semibold text-gray-900">
                ระบุจำนวนชั่วโมง
              </h3>
              <p className="text-gray-500 mt-2">
                กรุณาระบุจำนวนชั่วโมงที่ต้องการทำกิจกรรม
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <input
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                className="w-full text-center text-3xl font-semibold py-4 px-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#3BB77E]/20 focus:border-[#3BB77E] outline-none transition-all"
              />
              <div className="text-center mt-2 text-gray-500">ชั่วโมง</div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="relative bg-white p-6 rounded-2xl">
            <div className="text-center mb-8">
              <span className="inline-block p-3 bg-[#3BB77E]/10 rounded-xl mb-4">
                <MapPin className="w-6 h-6 text-[#3BB77E]" />
              </span>
              <h3 className="text-xl font-semibold text-gray-900">
                เลือกรูปแบบกิจกรรม
              </h3>
              <p className="text-gray-500 mt-2">
                เลือกรูปแบบการทำกิจกรรมที่คุณสะดวก
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { id: 'online', label: 'ออนไลน์', desc: 'ทำกิจกรรมผ่านระบบออนไลน์' },
                { id: 'onsite', label: 'ออนไซต์', desc: 'ทำกิจกรรม ณ สถานที่จริง' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setLocationType(type.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 group
                    ${locationType === type.id 
                      ? 'border-[#3BB77E] bg-[#3BB77E]/5 text-[#3BB77E]' 
                      : 'border-gray-200 hover:border-[#3BB77E]/30 text-gray-600'}`}
                >
                  <div className="text-lg font-semibold mb-2">{type.label}</div>
                  <p className="text-sm opacity-75">{type.desc}</p>
                </button>
              ))}
            </div>
          </div> 
        );

      case 3:
        return (
          <div className="relative bg-white p-6 rounded-2xl">
            <div className="text-center mb-8">
              <span className="inline-block p-3 bg-[#3BB77E]/10 rounded-xl mb-4">
                <Calendar className="w-6 h-6 text-[#3BB77E]" />
              </span>
              <h3 className="text-xl font-semibold text-gray-900">
                เลือกช่วงเวลา
              </h3>
              <p className="text-gray-500 mt-2">
                เลือกช่วงเวลาที่ต้องการทำกิจกรรม
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { id: 'Q1', label: 'ม.ค. - มี.ค.' },
                { id: 'Q2', label: 'เม.ย. - มิ.ย.' },
                { id: 'Q3', label: 'ก.ค. - ก.ย.' },
                { id: 'Q4', label: 'ต.ค. - ธ.ค.' }
              ].map((quarter) => (
                <button
                  key={quarter.id}
                  onClick={() => setMonth(quarter.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200
                    ${month === quarter.id 
                      ? 'border-[#3BB77E] bg-[#3BB77E]/5 text-[#3BB77E]' 
                      : 'border-gray-200 hover:border-[#3BB77E]/30 text-gray-600'}`}
                >
                  <div className="text-lg font-semibold">{quarter.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">กิจกรรมที่แนะนำ</h3>
              <div className="mt-1 text-sm text-gray-500">
                ต้องการ {hours} ชั่วโมง • {locationType === 'online' ? 'ออนไลน์' : 'ออนไซต์'}
              </div>
              {suggestedActivities.length > 0 && (
                <div className="text-sm text-[#3BB77E] font-medium">
                  พบกิจกรรมรวม {suggestedActivities.reduce((sum, act) => sum + parseInt(act.hours), 0)} ชั่วโมง
                </div>
              )}
            </div>

            {error && (
              <div className="text-center text-red-500 py-4">{error}</div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-[#3BB77E]/30 border-t-[#3BB77E] rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-3">กำลังค้นหากิจกรรม...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto px-1">
                {suggestedActivities.length > 0 ? (
                  suggestedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-lg border border-gray-100 hover:border-[#3BB77E]/30 transition-all duration-200 overflow-hidden group"
                    >
                      <div className="flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          {activity.image_url ? (
                            <img 
                              src={activity.image_url} 
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <Clock className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-3 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {activity.name}
                          </h4>
                          <div className="mt-2 flex items-center gap-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              activity.format === 'ออนไลน์'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-orange-50 text-orange-600'
                            }`}>
                              {activity.format}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1.5 text-[#3BB77E]" />
                              {activity.hours} ชั่วโมง
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">ไม่พบกิจกรรมที่ยังไม่ได้ทำตามเงื่อนไข</p>
                    <p className="text-sm text-gray-400 mt-1">
                      ลองเปลี่ยนช่วงเวลาหรือรูปแบบกิจกรรม
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-[#3BB77E]">จัดกิจกรรมอัตโนมัติ</h2>
            <p className="text-sm text-gray-500 mt-1">ขั้นตอนที่ {currentStep} จาก 4</p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {renderStep()}

          <div className="flex justify-between mt-6 pt-4 border-t">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(current => current - 1)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(current => current + 1)}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-6 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#2ea86d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                ถัดไป
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={generateActivities}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-6 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#2ea86d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                ค้นหากิจกรรม
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 4 && suggestedActivities.length > 0 && (
              <button
                onClick={handleSaveAllActivities}
                disabled={saved || !token}
                className="flex items-center gap-2 px-6 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#2ea86d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {saved ? (
                  <>
                    <span>บันทึกแล้ว</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    บันทึกทั้งหมด
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoActivityModal;