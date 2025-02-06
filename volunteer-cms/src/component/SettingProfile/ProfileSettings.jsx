import React, { useState, useEffect } from "react";
import { UserCircle, Mail, Phone, Users, GraduationCap, Edit, CheckCircle2, XCircle, X } from "lucide-react";
import api from '../../utils/axios';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            {type === 'success' ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
            )}
            
            <h3 className={`text-lg font-medium mb-2 ${
              type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {title}
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              {message}
            </p>

            <button
              onClick={onClose}
              className={`
                w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium text-white
                ${type === 'success' 
                  ? 'bg-[#3BB77E] hover:bg-[#2ea86d]' 
                  : 'bg-red-500 hover:bg-red-600'
                }
                transition-colors duration-200
              `}
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = React.memo(({ 
  label, 
  id, 
  type = "text", 
  icon: Icon, 
  options, 
  placeholder,
  value,
  onChange,
  isEditing
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 flex items-center">
      {Icon && <Icon className="w-5 h-5 text-gray-400 mr-2" />}
      {options ? (
        <select
          id={id}
          value={value || ""}
          onChange={onChange}
          disabled={!isEditing}
          className={`block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 
            ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-[#3BB77E]' : 'cursor-not-allowed opacity-50'}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={isEditing ? (value === "-" ? "" : value) : (value || "-")}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 
            ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-[#3BB77E]' : 'cursor-not-allowed opacity-50'}`}
        />
      )}
    </div>
  </div>
));

const ProfileSettings = () => {
  const initialUserData = {
    username: "-",
    firstName: "-",
    lastName: "-", 
    gender: "",
    email: "-",
    phoneNumber: "-",
    faculty: "",
    major: "",
    studentID: "-"
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchUserProfile();
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      fetchUserProfile();
    }
  }, [isEditing]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/user/profile');
      const data = response.data.data;
      
      if (data.faculty_id) {
        const majorsResponse = await api.get(`/faculty/${data.faculty_id}/majors`);
        setMajors(majorsResponse.data);
      }

      setUserData({
        username: data.username || "-",
        firstName: data.firstName || "-",
        lastName: data.lastName || "-",
        gender: data.gender || "",
        email: data.email || "-",
        phoneNumber: data.phoneNumber || "-",
        faculty: data.faculty_id || "",
        major: data.major_id || "",
        studentID: data.studentID || "-"
      });

    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
      setUserData(initialUserData);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await api.get('/faculty');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchMajors = async (facultyId) => {
    try {
      const response = await api.get(`/faculty/${facultyId}/majors`);
      setMajors(response.data);
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: value === "-" ? "" : value,
    }));
  };

  const handleFacultyChange = async (e) => {
    const { value } = e.target;
    handleChange(e);
    if (value) {
      await fetchMajors(value);
      setUserData(prev => ({
        ...prev,
        major: ""
      }));
    } else {
      setMajors([]);
    }
  };

  const handleEdit = () => {
    setOriginalData({...userData});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...userData,
        username: userData.username?.trim() === "-" ? "" : userData.username?.trim(),
        email: userData.email?.trim() === "-" ? "" : userData.email?.trim(),
        firstName: userData.firstName?.trim() === "-" ? "" : userData.firstName?.trim(),
        lastName: userData.lastName?.trim() === "-" ? "" : userData.lastName?.trim(),
        phoneNumber: userData.phoneNumber?.trim() === "-" ? "" : userData.phoneNumber?.trim(),
        studentID: userData.studentID?.trim() === "-" ? "" : userData.studentID?.trim(),
        faculty_id: userData.faculty || null,
        major_id: userData.major || null
      };

      const response = await api.put('/user/profile', submitData);
      if (response.data.success) {
        setModalConfig({
          title: 'บันทึกสำเร็จ',
          message: response.data.message || 'บันทึกข้อมูลเรียบร้อยแล้ว',
          type: 'success'
        });
        setShowModal(true);
        setIsEditing(false);
      }
    } catch (error) {
      setModalConfig({
        title: 'เกิดข้อผิดพลาด',
        message: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        type: 'error'
      });
      setShowModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3BB77E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8 flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
          <img
            src="/setting.svg"
            alt="ตั้งค่าโปรไฟล์"
            className="h-full max-h-[300px] md:max-h-[400px] w-auto object-contain"
          />
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ตั้งค่าโปรไฟล์</h1>
            {!isEditing && (
              <button 
                onClick={handleEdit} 
                className="text-[#3BB77E] hover:text-[#2ea86d] transition duration-200"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="ชื่อผู้ใช้" 
                id="username" 
                icon={UserCircle} 
                placeholder="ชื่อผู้ใช้"
                value={userData.username}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField 
                label="อีเมล" 
                id="email" 
                type="email" 
                icon={Mail} 
                placeholder="อีเมล"
                value={userData.email}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="ชื่อ" 
                id="firstName" 
                placeholder="ชื่อ"
                value={userData.firstName}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField 
                label="นามสกุล" 
                id="lastName" 
                placeholder="นามสกุล"
                value={userData.lastName}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="เพศ" 
                id="gender" 
                icon={Users} 
                options={[
                  { value: "", label: "เลือกเพศ" },
                  { value: "male", label: "ชาย" },
                  { value: "female", label: "หญิง" },
                  { value: "other", label: "อื่นๆ" }
                ]}
                value={userData.gender}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField 
                label="เบอร์โทรศัพท์" 
                id="phoneNumber" 
                icon={Phone} 
                placeholder="เบอร์โทรศัพท์"
                value={userData.phoneNumber}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="คณะ" 
                id="faculty" 
                options={[
                  { value: "", label: "เลือกคณะ" },
                  ...faculties.map(f => ({
                    value: f.id,
                    label: f.name
                  }))
                ]}
                value={userData.faculty}
                onChange={handleFacultyChange}
                isEditing={isEditing}
              />
              <InputField 
                label="สาขา" 
                id="major" 
                options={[
                  { value: "", label: "เลือกสาขา" },
                  ...majors.map(m => ({
                    value: m.id,
                    label: m.name
                  }))
                ]}
                value={userData.major}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            <div>
              <InputField 
                label="รหัสนักศึกษา" 
                id="studentID" 
                icon={GraduationCap} 
                placeholder="รหัสนักศึกษา"
                value={userData.studentID}
                onChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#3BB77E] py-2 text-sm font-medium text-white hover:bg-[#2ea86d] transition duration-200"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full rounded-md bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 transition duration-200"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <NotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default ProfileSettings;