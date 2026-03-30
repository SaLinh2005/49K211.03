import React from 'react';
import { Bell, User, LogOut, GraduationCap } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { clearCurrentUser } from '../lib/auth';

export default function Layout() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {isProfilePage ? (
            <div className="w-full flex justify-center">
              <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-[#FF6B00] p-1.5 rounded-lg flex items-center justify-center">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-none">
                    <span className="text-black">UNI</span>
                    <span className="text-[#FF6B00]">MENTOR</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-tight">TRƯỜNG ĐH KINH TẾ - ĐH ĐÀ NẴNG</p>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-[#FF6B00] p-1.5 rounded-lg flex items-center justify-center">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-none">
                    <span className="text-black">UNI</span>
                    <span className="text-[#FF6B00]">MENTOR</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-tight">TRƯỜNG ĐH KINH TẾ - ĐH ĐÀ NẴNG</p>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  to="/home" 
                  className={`${location.pathname === '/home' ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1' : 'text-gray-600 hover:text-[#FF6B00]'} text-sm font-medium transition-all`}
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/mentor" 
                  className={`${location.pathname === '/mentor' ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1' : 'text-gray-600 hover:text-[#FF6B00]'} text-sm font-medium transition-all`}
                >
                  Mentor
                </Link>
                <Link 
                  to="/mentor-registration" 
                  className={`${location.pathname === '/mentor-registration' ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1' : 'text-gray-600 hover:text-[#FF6B00]'} text-sm font-medium transition-all`}
                >
                  Hồ sơ
                </Link>
                <Link 
                  to="/messages" 
                  className={`${location.pathname === '/messages' ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1' : 'text-gray-600 hover:text-[#FF6B00]'} flex items-center gap-1 text-sm font-medium transition-all`}
                >
                  Nhắn tin <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                  <Link to="/profile" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden hover:bg-gray-300 transition-colors">
                    <User size={20} className="text-gray-400" />
                  </Link>
                  <Link
                    to="/login"
                    onClick={clearCurrentUser}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    Đăng xuất
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-xs mt-auto">
        <p className="mb-2">© 2024 UNIMENTOR. Mọi quyền được bảo lưu.</p>
        {location.pathname === '/mentor-registration' && (
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-600 underline">Chính sách bảo mật</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 underline">Điều khoản dịch vụ</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 underline">Trung tâm hỗ trợ</a>
          </div>
        )}
      </footer>
    </div>
  );
}
