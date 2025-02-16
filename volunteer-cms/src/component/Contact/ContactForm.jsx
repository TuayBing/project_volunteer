import React, { useState } from "react";
import { useAuth } from '../AuthContext';
import axios from '../../utils/axios';

const ContactForm = () => {
  const { token, isValidToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
    
  if (!token || !isValidToken(token)) {
    setError('กรุณาเข้าสู่ระบบใหม่');
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const { data } = await axios.post('/contact', formData, {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    // ถ้าส่งสำเร็จ
    setSuccess('ส่งข้อความเรียบร้อยแล้ว');
    setFormData({
      name: '',
      email: '',
      message: ''
    });

  } catch (err) {
    setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side */}
          <div className="w-full md:w-1/2 bg-emerald-50 p-8 flex flex-col justify-center items-center">
            <img
              src="/contact.svg"
              alt="Contact Illustration"
              className="w-full max-w-md h-auto mb-6"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-emerald-800 mb-3">
                ยินดีต้อนรับ
              </h2>
              <p className="text-emerald-600">
                เรายินดีให้คำปรึกษาและช่วยเหลือคุณ
                ติดต่อเราได้ตลอดเวลาผ่านแบบฟอร์มด้านขวา
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                สนใจติดต่อ
              </h1>
              <p className="text-gray-600 mb-8">
                เราอยู่ที่นี่เพื่อคุณ! เราสามารถช่วยได้อย่างไร?
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกชื่อของคุณ"
                      disabled={!token || loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกอีเมล"
                      disabled={!token || loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ข้อความ
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกข้อความของคุณ"
                      disabled={!token || loading}
                      required
                    />
                  </div>
                </div>

                {!token && (
                  <div className="text-center mb-4">
                    <p className="text-red-600 font-medium text-sm">
                      กรุณาเข้าสู่ระบบก่อนส่งข้อความ
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!token || loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transform hover:-translate-y-0.5 transition duration-200 
                    ${
                      token && !loading
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:transform-none'
                    }`}
                >
                  {loading ? 'กำลังส่ง...' : token ? 'ส่งข้อความ' : 'กรุณาเข้าสู่ระบบ'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;