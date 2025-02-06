import React from 'react';
import { motion } from 'framer-motion';
 
function Volunteernetwork() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };
 
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };
 
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
 
  return (
    <div className="py-16 px-4 mt-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-left justify-between mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-4 text-center md:text-left">
            เครือข่ายจิตอาสา
          </h2>
        </motion.div>
 
        {/* Card Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="bg-white p-4 rounded-lg shadow-md w-full max-w-[320px] h-[350px] flex flex-col mx-auto cursor-pointer"
            onClick={() => handleCardClick('https://www.studentloan.or.th/th/news/1624346166')}
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-[200px] h-[200px] mb-4 self-center"
            >
              <img
                src="A1.svg"
                alt="การออมเงิน"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
            <div className="px-4">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 text-[#1E1E1E]">
                การออมเงิน
              </h3>
              <p className="text-[#4A4A4A] text-sm md:text-base lg:text-base">
                ออมเงินผ่านกองทุนรวมนับเป็นชั่วโมงจิตสาธารณะได้ 1 ชั่วโมง
              </p>
            </div>
          </motion.div>
 
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="bg-white p-4 rounded-lg shadow-md w-full max-w-[320px] h-[350px] flex flex-col mx-auto cursor-pointer"
            onClick={() => handleCardClick('https://www.radio.rmutt.ac.th/?p=16690')}
          >
            <motion.div
              initial={{ rotate: 10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-[200px] h-[200px] mb-4 self-center"
            >
              <img
                src="A2.svg"
                alt="แลกเปลี่ยนขวดน้ำ"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
            <div className="px-4">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 text-[#1E1E1E]">
                แลกเปลี่ยนขวดน้ำ
              </h3>
              <p className="text-[#4A4A4A] text-sm md:text-base lg:text-base">
                แลกเปลี่ยนขวดน้ำ 4 กิโลกรัม นับเป็นชั่วโมงจิตสาธารณะได้ 1 ชั่วโมง
              </p>
            </div>
          </motion.div>
 
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="bg-white p-4 rounded-lg shadow-md w-full max-w-[320px] h-[350px] flex flex-col mx-auto cursor-pointer"
            onClick={() => handleCardClick('https://www.studentloan.or.th/th/highlight/1549870047')}
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-[200px] h-[200px] mb-4 self-center"
            >
              <img
                src="A3.svg"
                alt="บริจาคโลหิต"
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
            <div className="px-4">
              <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 text-[#1E1E1E]">
                บริจาคโลหิต
              </h3>
              <p className="text-[#4A4A4A] text-sm md:text-base lg:text-base">
                การบริจาคโลหิต 1 ครั้ง นับเป็นชั่วโมงจิตสาธารณะได้ 6 ชั่วโมง
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
 
export default Volunteernetwork; 