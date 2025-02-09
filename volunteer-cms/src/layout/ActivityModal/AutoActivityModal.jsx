import React, { useState } from 'react';
import { X, Clock, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

const AutoActivityModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hours, setHours] = useState('');
  const [locationType, setLocationType] = useState('');
  const [month, setMonth] = useState('');
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetAndClose = () => {
    setCurrentStep(1);
    setHours('');
    setLocationType('');
    setMonth('');
    setSuggestedActivities([]);
    onClose();
  };

  const generateActivities = () => {
    setIsLoading(true);
    
    const monthlyActivities = {
      'Q1': {
        online: ['สอนการบ้านออนไลน์ช่วงปิดเทอม', 'จัดอบรมทักษะดิจิทัลฤดูร้อน'],
        onsite: ['จัดค่ายอาสาพัฒนาชุมชน', 'ทำฝายชะลอน้ำเตรียมรับหน้าฝน']
      },
      'Q2': {
        online: ['สอนภาษาออนไลน์', 'จัดเวิร์คช็อปงานฝีมือ'],
        onsite: ['ปลูกป่าชายเลน', 'ซ่อมแซมโรงเรียนช่วงปิดเทอม']
      },
      'Q3': {
        online: ['สอนการเกษตรออนไลน์', 'แปลเอกสารเพื่อการกุศล'],
        onsite: ['ทำแนวกันไฟป่า', 'สร้างฝายชะลอน้ำ']
      },
      'Q4': {
        online: ['สอนทำอาหารออนไลน์', 'จัดกิจกรรมนันทนาการออนไลน์'],
        onsite: ['แจกผ้าห่มผู้ประสบภัยหนาว', 'ทำความสะอาดวัดช่วงเทศกาล']
      }
    };

    let activities = [];
    if (monthlyActivities[month]?.[locationType]) {
      activities = monthlyActivities[month][locationType];
      if (parseInt(hours) <= 2) {
        activities = activities.slice(0, 1);
      }
    }

    setTimeout(() => {
      setSuggestedActivities(activities);
      setIsLoading(false);
      setCurrentStep(4);
    }, 800);
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">ขั้นตอนที่ 1: ระบุจำนวนชั่วโมง</h3>
              <p className="text-sm text-gray-500 mt-1">กรุณาระบุจำนวนชั่วโมงที่ต้องการทำกิจกรรม</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                จำนวนชั่วโมง
              </label>
              <input
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="ระบุจำนวนชั่วโมง"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BB77E]/30 focus:border-[#3BB77E] outline-none transition-colors text-center text-lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">ขั้นตอนที่ 2: เลือกรูปแบบกิจกรรม</h3>
              <p className="text-sm text-gray-500 mt-1">เลือกรูปแบบการทำกิจกรรมที่คุณสะดวก</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 justify-center mb-4">
                <MapPin className="w-4 h-4" />
                รูปแบบกิจกรรม
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLocationType('online')}
                  className={`p-6 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-3 ${
                    locationType === 'online'
                      ? 'border-[#3BB77E] bg-[#3BB77E]/10 text-[#3BB77E]'
                      : 'border-gray-200 hover:border-[#3BB77E]/30 text-gray-600'
                  }`}
                >
                  <span className="text-lg font-medium">ออนไลน์</span>
                  <p className="text-sm opacity-75">ทำกิจกรรมผ่านระบบออนไลน์</p>
                </button>
                <button
                  onClick={() => setLocationType('onsite')}
                  className={`p-6 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-3 ${
                    locationType === 'onsite'
                      ? 'border-[#3BB77E] bg-[#3BB77E]/10 text-[#3BB77E]'
                      : 'border-gray-200 hover:border-[#3BB77E]/30 text-gray-600'
                  }`}
                >
                  <span className="text-lg font-medium">ออนไซต์</span>
                  <p className="text-sm opacity-75">ทำกิจกรรม ณ สถานที่จริง</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">ขั้นตอนที่ 3: เลือกช่วงเวลา</h3>
              <p className="text-sm text-gray-500 mt-1">เลือกช่วงเวลาที่ต้องการทำกิจกรรม</p>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 justify-center mb-4">
                <Calendar className="w-4 h-4" />
                ช่วงเวลาที่ต้องการ
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Q1', label: 'ม.ค. - มี.ค.', season: 'ฤดูร้อน' },
                  { id: 'Q2', label: 'เม.ย. - มิ.ย.', season: 'ต้นฤดูฝน' },
                  { id: 'Q3', label: 'ก.ค. - ก.ย.', season: 'กลางฤดูฝน' },
                  { id: 'Q4', label: 'ต.ค. - ธ.ค.', season: 'ฤดูหนาว' }
                ].map((quarter) => (
                  <button
                    key={quarter.id}
                    onClick={() => setMonth(quarter.id)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      month === quarter.id
                        ? 'border-[#3BB77E] bg-[#3BB77E]/10 text-[#3BB77E]'
                        : 'border-gray-200 hover:border-[#3BB77E]/30 text-gray-600'
                    }`}
                  >
                    <div className="font-medium">{quarter.label}</div>
                    <div className="text-sm opacity-75 mt-1">{quarter.season}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">กิจกรรมที่แนะนำ</h3>
              <p className="text-sm text-gray-500 mt-1">
                {hours} ชั่วโมง • {locationType === 'online' ? 'ออนไลน์' : 'ออนไซต์'}
              </p>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-[#3BB77E]/30 border-t-[#3BB77E] rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">กำลังค้นหากิจกรรมที่เหมาะสม...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#3BB77E]/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#3BB77E]/10 flex items-center justify-center text-[#3BB77E] group-hover:bg-[#3BB77E] group-hover:text-white transition-colors text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                        {activity}
                      </p>
                    </div>
                  </div>
                ))}
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
      <div className="bg-white rounded-xl w-full max-w-md relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-[#3BB77E]">จัดกิจกรรมอัตโนมัติ</h2>
            <p className="text-sm text-gray-500 mt-1">ขั้นตอนที่ {currentStep} จาก 4</p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(current => current - 1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(current => current + 1)}
                disabled={!canGoNext()}
                className="flex items-center gap-2 text-[#3BB77E] hover:text-[#2D8E62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                ถัดไป
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={generateActivities}
                disabled={!canGoNext()}
                className="flex items-center gap-2 text-[#3BB77E] hover:text-[#2D8E62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                ค้นหากิจกรรม
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 4 && (
              <button
                onClick={resetAndClose}
                className="flex items-center gap-2 text-[#3BB77E] hover:text-[#2D8E62] transition-colors ml-auto"
              >
                เสร็จสิ้น
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoActivityModal;