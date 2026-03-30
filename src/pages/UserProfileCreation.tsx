import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Edit2, ChevronDown, X, Plus, Link as LinkIcon, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export default function UserProfileCreation() {
  const currentUser = getCurrentUser();
  const [fullName, setFullName] = useState(currentUser?.full_name ?? '');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tags, setTags] = useState(['Cơ sở dữ liệu', 'Toán ứng dụng']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedSubjects] = useState([
    'Kinh doanh quốc tế',
    'Kinh tế vĩ mô',
    'Kế toán tài chính',
    'Chiến lược Marketing',
    'Tài chính doanh nghiệp',
    'Phân tích đầu tư'
  ]);

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) {
      setSubmitError('Bạn cần đăng nhập để cập nhật hồ sơ.');
      return;
    }

    setSubmitError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const { error: userError } = await supabase
        .from('users')
        .update({ full_name: fullName.trim() || currentUser.full_name })
        .eq('id', currentUser.id);

      if (userError) throw userError;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: currentUser.id,
        bio: bio.trim(),
        major: major.trim(),
        student_id: studentId.trim(),
        interests: tags,
        social_links: linkedin.trim() ? { linkedin: linkedin.trim() } : {},
      });

      if (profileError) throw profileError;

      setSuccessMessage('Đã cập nhật hồ sơ vào Supabase.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại';
      setSubmitError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
    >
      <div className="text-center mb-12">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#FF6B00] p-1.5 rounded-lg flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-xl leading-none">
              <span className="text-black">UNI</span>
              <span className="text-[#FF6B00]">MENTOR</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-400 font-medium tracking-tight">TRƯỜNG ĐH KINH TẾ - ĐH ĐÀ NẴNG</p>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo hồ sơ cá nhân</h2>
        <p className="text-gray-500 text-sm">Hoàn thiện thông tin để kết nối phù hợp</p>
      </div>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
            <User size={48} className="text-gray-300" />
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-[#FF6B00] text-white rounded-full border-2 border-white shadow-sm hover:bg-[#E65F00] transition-all">
            <Edit2 size={14} />
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400 font-medium">Ảnh đại diện</p>
      </div>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Họ và tên</label>
            <input
              type="text"
              placeholder="|"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mã sinh viên</label>
            <input
              type="text"
              placeholder="|"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Giới tính</label>
            <div className="flex gap-2">
              <button className="flex-1 py-3 px-4 rounded-xl border-2 border-[#FF6B00] text-[#FF6B00] font-bold text-sm bg-white">Nam</button>
              <button className="flex-1 py-3 px-4 rounded-xl border border-gray-100 text-gray-500 font-medium text-sm hover:border-gray-200">Nữ</button>
              <button className="flex-1 py-3 px-4 rounded-xl border border-gray-100 text-gray-500 font-medium text-sm hover:border-gray-200">Khác</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Số điện thoại</label>
            <input
              type="text"
              placeholder="|"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Năm học</label>
            <div className="relative">
              <select className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm appearance-none bg-white">
                <option>Năm 1</option>
                <option>Năm 2</option>
                <option>Năm 3</option>
                <option>Năm 4</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Chuyên ngành</label>
            <input
              type="text"
              placeholder="|"
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm"
            />
          </div>
        </div>

        {/* Môn học muốn hỗ trợ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Môn học muốn hỗ trợ</label>
          <div className="w-full p-3 rounded-xl border border-gray-200 flex flex-wrap items-center gap-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 bg-[#FF6B00]/5 text-[#FF6B00] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#FF6B00]/10">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
            <button 
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-1 text-gray-400 text-xs font-medium hover:text-gray-600 pl-2"
            >
              <Plus size={14} /> {showSuggestions ? 'Thu gọn' : 'Thêm môn học'}
            </button>
          </div>
          {showSuggestions && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap gap-2"
            >
              {suggestedSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => addTag(subject)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tags.includes(subject) 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-600 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] border border-gray-100'
                  }`}
                  disabled={tags.includes(subject)}
                >
                  + {subject}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Giới thiệu bản thân */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Giới thiệu bản thân</label>
          <textarea
            placeholder="Chia sẻ một chút về kinh nghiệm, sở thích và những gì bạn đang tìm kiếm ở một người mentor..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Link mạng xã hội */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link mạng xã hội</label>
          <div className="relative">
            <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm"
            />
          </div>
        </div>

        {submitError && <p className="text-red-500 text-sm text-center font-semibold">{submitError}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center font-semibold">{successMessage}</p>}

        {/* Footer Buttons */}
        <div className="flex items-center justify-center gap-4 pt-10">
          <Link 
            to="/mentor-registration"
            className="flex-1 max-w-[180px] bg-gray-100 text-gray-600 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all text-center"
          >
            Quay về
          </Link>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex-1 max-w-[240px] bg-[#FF6B00] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF6B00]/30 hover:bg-[#E65F00] transition-all"
          >
            {isSaving ? 'Đang lưu...' : 'Hoàn tất hồ sơ'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
