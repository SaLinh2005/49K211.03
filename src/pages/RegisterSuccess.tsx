import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-[#1A44AD] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl flex flex-col items-center text-center">
        
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img src="/image 2203.png" alt="DUE Logo" className="w-16 h-16 mb-2 object-contain" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[#1A44AD]">UNI</span>
            <span className="text-[#FF6B00]">MENTOR</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Kết nối sinh viên với mentor để hỗ trợ học tập
          </p>
        </div>

        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-8">
          <Check size={48} className="text-[#10B981]" strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Đăng ký thành công!
        </h2>
        
        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
          Chào mừng bạn gia nhập cộng đồng UNIMENTOR. Tài khoản của bạn đã sẵn sàng.
        </p>

        <div className="w-full space-y-4">
          <Link
            to="/profile"
            className="block w-full bg-[#FF7A31] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF7A31]/30 hover:bg-[#E66922] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Tạo hồ sơ ngay
          </Link>
          
          <Link
            to="/login"
            className="block w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-lg border-2 border-gray-100 hover:bg-gray-50 transition-all"
          >
            Quay về
          </Link>
        </div>

        {/* ❌ ĐÃ XOÁ SUPPORT */}

      </div>
    </div>
  );
}