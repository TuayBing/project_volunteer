import React from "react";
import { useAuth } from '../AuthContext';

const ContactForm = () => {
  const { token } = useAuth();

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Illustration and Text */}
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

          {/* Right side - Contact Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                สนใจติดต่อ
              </h1>
              <p className="text-gray-600 mb-8">
                เราอยู่ที่นี่เพื่อคุณ! เราสามารถช่วยได้อย่างไร?
              </p>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกชื่อของคุณ"
                      disabled={!token}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกอีเมล"
                      disabled={!token}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ข้อความ
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกข้อความของคุณ"
                      disabled={!token}
                    ></textarea>
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
                  disabled={!token}
                  className={`w-full py-3 px-6 rounded-lg font-medium transform hover:-translate-y-0.5 transition duration-200 
                    ${
                      token 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:transform-none'
                    }`}
                >
                  {token ? 'ส่งข้อความ' : 'กรุณาเข้าสู่ระบบ'}
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