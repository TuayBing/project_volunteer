import React from 'react'

function BorrowerDetails() {
  return (
    <div className="w-full flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center items-center mt-6 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Image Container */}
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-5/12 mb-8 md:mb-0 md:mr-12 lg:mr-16 xl:mr-20 flex justify-center items-center">
        <img
          src="/main3.svg"
          alt="กิจกรรมจิตอาสา"
          className="w-full max-w-md h-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* Text Container */}
      <div className="text-left w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-7/12 max-w-4xl">
        {/* แก้ไขขนาดหัวข้อให้เท่ากับ PlanActivity */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-8">
          ประเภทของผู้กู้ยืมเงิน
        </h1>
        
        {/* เพิ่ม mb-8 สำหรับหน้าจอโทรศัพท์ */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 text-[#4A4A4A] mb-8">
          <p className="text-sm md:text-base lg:text-lg leading-relaxed">
            <span className="font-semibold text-green-700">ผู้กู้ยืมเงินรายใหม่</span> หมายความว่า
            นักเรียนหรือนักศึกษาผู้ที่ไม่เคยกู้ยืมเงินกองทุนมาก่อน
          </p>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed">
            <span className="font-semibold text-green-700">ผู้กู้ยืมเงินรายเก่า</span> หมายความว่า
            นักเรียนหรือนักศึกษาผู้ที่อยู่ระหว่างการศึกษาและเคยกู้ยืมเงินกองทุนมาก่อน
            ไม่ว่าจะเคยกู้ยืมเงินจากสถานศึกษาอื่นหรือสถานศึกษาปัจจุบันก็ตาม
            หรือเป็นผู้ที่เคยกู้ยืมเงินกองทุนมาก่อนและได้ชำระหนี้คืนครบถ้วนแล้ว
          </p>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed">
            และให้หมายความรวมถึงนักเรียนหรือนักศึกษาที่อยู่ระหว่างการศึกษาและเคยกู้ยืมเงิน
            กองทุนเงินให้กู้ยืมเพื่อการศึกษาตามพระราชบัญญัติกองทุนเงินให้กู้ยืมเพื่อการศึกษา
            พ.ศ. 2541 และกองทุนเงินกู้ยืมเพื่อการศึกษาที่ผูกกับรายได้ในอนาคตตามระเบียบกระทรวงการคลัง
          </p>
        </div>
      </div>
    </div>
  )
}

export default BorrowerDetails