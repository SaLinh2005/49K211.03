import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hashPassword, saveCurrentUser } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ thêm logic mới
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Vui lòng nhập email sinh viên';
    } else if (!email.includes('@')) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ countdown realtime
  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      if (Date.now() >= lockUntil) {
        setLockUntil(null);
        setLoginAttempts(0);
        setSubmitError('');
      } else {
        const secondsLeft = Math.ceil((lockUntil - Date.now()) / 1000);
        setSubmitError(`Bạn đã nhập sai quá nhiều. Vui lòng thử lại sau ${secondsLeft} giây.`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⛔ nếu đang bị khóa
    if (lockUntil && Date.now() < lockUntil) {
      const secondsLeft = Math.ceil((lockUntil - Date.now()) / 1000);
      setSubmitError(`Bạn đã nhập sai quá nhiều. Vui lòng thử lại sau ${secondsLeft} giây.`);
      return;
    }

    if (!validate()) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .eq('email', email.trim())
        .eq('password_hash', passwordHash)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // ❌ quá 5 lần → khóa 30s
        if (newAttempts >= 5) {
          const lockTime = Date.now() + 30000;
          setLockUntil(lockTime);
          setSubmitError('Bạn đã nhập sai quá nhiều. Vui lòng thử lại sau 30 giây.');
        } else {
          setSubmitError(`Email hoặc mật khẩu không đúng. Bạn còn ${5 - newAttempts} lần thử.`);
        }

        return;
      }

      // ✅ login thành công → reset
      setLoginAttempts(0);
      setLockUntil(null);

      saveCurrentUser(data, false);
      localStorage.setItem("token", data.id);

      navigate('/home');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A44AD] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl flex flex-col items-center">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <img src="public/image 2203.png" alt="DUE Logo" className="w-16 h-16 mb-2 object-contain" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[#1A44AD]">UNI</span>
            <span className="text-[#FF6B00]">MENTOR</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Kết nối sinh viên với mentor để hỗ trợ học tập
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Chào mừng bạn quay trở lại 👋
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-5">

          {/* EMAIL */}
          <div>
            <div className={`flex items-center bg-[#F3F4F6] rounded-2xl border-2 ${errors.email ? 'border-red-500' : 'border-transparent'}`}>
              <div className="pl-4 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="text"
                placeholder="Email sinh viên"
                className="w-full bg-transparent py-4 px-3 outline-none text-gray-600"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className={`flex items-center bg-[#F3F4F6] rounded-2xl border-2 ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
              <div className="pl-4 text-gray-400">
                <Lock size={20} />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="w-full bg-transparent py-4 px-3 outline-none text-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF7A31] text-white py-4 rounded-2xl font-bold text-xl"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {submitError && (
            <p className="text-red-500 text-sm text-center">
              {submitError}
            </p>
          )}
        </form>

        {/* FOOTER */}
        <div className="mt-8 w-full">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-4 bg-white text-xs text-gray-400 font-bold uppercase">
              CHƯA CÓ TÀI KHOẢN?
            </span>
          </div>

          <Link
            to="/register"
            className="block text-center text-[#10B981] font-bold"
          >
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
}