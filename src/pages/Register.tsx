import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hashPassword } from '../lib/auth';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // VALIDATE
  const validate = () => {
    const newErrors = {};

    if (!fullName) newErrors.fullName = 'Vui lòng nhập họ tên';

   if (!email) {
  newErrors.email = 'Vui lòng nhập email sinh viên';
} else if (
  !email.endsWith('@gmail.com') &&
  !email.endsWith('@due.udn.vn')
) {
  newErrors.email = 'Email phải là @gmail.com hoặc @due.udn.vn';
}

    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (!regex.test(password)) {
      newErrors.password =
        'Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 số';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const passwordHash = await hashPassword(password);
      const userId = crypto.randomUUID();

      const { error } = await supabase.from('users').insert({
        id: userId,
        full_name: fullName.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'student',
      });

      if (error) throw error;

      navigate('/register-success');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('duplicate')) {
        setSubmitError('Email đã tồn tại');
      } else {
        setSubmitError('Đăng ký thất bại');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A44AD] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-xl">

        {/* LOGO */}
        <div className="text-center mb-5">
          <img src="/image 2203.png" alt="logo" className="w-14 mx-auto mb-2" />
          <h1 className="text-xl font-extrabold">
            <span className="text-[#1A44AD]">UNI</span>
            <span className="text-[#FF7A31]">MENTOR</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Kết nối sinh viên với mentor để hỗ trợ học tập
          </p>
        </div>

        <h2 className="text-lg font-bold text-center mb-4">
          Tạo tài khoản mới 👋
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* NAME */}
          <div>
            <div className={`flex items-center bg-[#F5F6F8] rounded-xl px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-transparent'}`}>
              <User size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Họ tên"
                className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {errors.fullName && (
              <div className="flex items-center gap-1 mt-1 ml-1 text-red-500 text-xs">
                <AlertCircle size={14} />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <div className={`flex items-center bg-[#F5F6F8] rounded-xl px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-transparent'}`}>
              <Mail size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Email sinh viên"
                className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {errors.email && (
              <div className="flex items-center gap-1 mt-1 ml-1 text-red-500 text-xs">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className={`flex items-center bg-[#F5F6F8] rounded-xl px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
              <Lock size={18} className="text-gray-400 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <div className="flex items-center gap-1 mt-1 ml-1 text-red-500 text-xs">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className={`flex items-center bg-[#F5F6F8] rounded-xl px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}>
              <Lock size={18} className="text-gray-400 mr-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1 ml-1 text-red-500 text-xs">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button className="w-full bg-[#FF7A31] text-white py-3 rounded-xl font-semibold">
            {isSubmitting ? 'Đang tạo...' : 'Đăng ký ngay'}
          </button>

          {submitError && (
            <p className="text-red-500 text-center text-sm">{submitError}</p>
          )}
        </form>

        {/* FOOTER */}
        <div className="mt-6 w-full">

          <p className="text-[10px] text-gray-400 text-center mb-4">
            Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của UNIMENTOR.
          </p>

          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute w-full border-t border-gray-200"></div>
            <span className="relative bg-white px-3 text-xs text-gray-400 font-semibold">
              ĐÃ CÓ TÀI KHOẢN?
            </span>
          </div>

          <Link
            to="/login"
            className="block text-center text-[#FF7A31] font-bold text-sm"
          >
            Đăng nhập ngay
          </Link>
        </div>

      </div>
    </div>
  );
}