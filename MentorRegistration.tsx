import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, FileText, Plus, Check, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export default function MentorRegistration() {
  const currentUser = getCurrentUser();
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Kinh doanh quốc tế', checked: true },
    { id: 2, name: 'Kinh tế vĩ mô', checked: true },
    { id: 3, name: 'Kế toán tài chính', checked: false },
    { id: 4, name: 'Chiến lược Marketing', checked: false },
  ]);

  const [showMore, setShowMore] = useState(false);
  const [experienceText, setExperienceText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [moreSubjects] = useState([
    'Kinh tế phát triển',
    'Tài chính doanh nghiệp',
    'Phân tích đầu tư',
    'Quản trị rủi ro tài chính',
    'Kinh tế lượng',
    'Thị trường chứng khoán',
    'Ngân hàng thương mại',
    'Kế toán quản trị',
    'Thuế và hệ thống thuế',
    'Kiểm toán căn bản'
  ]);

  const toggleSubject = (id: number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const addNewSubject = (name: string) => {
    if (subjects.find(s => s.name === name)) return;
    setSubjects([...subjects, { id: Date.now(), name, checked: true }]);
  };

  const handleRegisterMentor = async () => {
    if (!currentUser) {
      setSubmitError('Bạn cần đăng nhập trước khi đăng ký mentor.');
      return;
    }

    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const selectedSubjects = subjects.filter((s) => s.checked).map((s) => s.name);
      const { error } = await supabase.from('mentors').upsert({
        id: currentUser.id,
        title: 'Mentor DUE',
        experience_years: 0,
        subjects: selectedSubjects,
        availability: { notes: experienceText.trim() },
      });

      if (error) throw error;
      setSuccessMessage('Đăng ký mentor thành công và đã lưu vào Supabase.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đăng ký mentor thất bại';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký làm Mentor</h2>
        <p className="text-gray-500 text-sm">Tham gia cộng đồng chuyên gia của chúng tôi và giúp định hình tương lai của sinh viên DUE.</p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Môn học hỗ trợ */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">Môn học hỗ trợ</h3>
          </div>
          <p className="text-gray-400 text-xs mb-6">Chọn các môn học hoặc lĩnh vực chuyên sâu mà bạn có thể hướng dẫn.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(subject => (
              <div
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  subject.checked ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                  subject.checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                }`}>
                  {subject.checked && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm font-medium ${subject.checked ? 'text-blue-600' : 'text-gray-600'}`}>
                  {subject.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button 
              onClick={() => setShowMore(!showMore)}
              className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              <Plus size={16} /> {showMore ? 'Thu gọn' : 'Thêm môn học khác'}
            </button>

            {showMore && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                {moreSubjects.map(name => (
                  <button
                    key={name}
                    onClick={() => addNewSubject(name)}
                    className="text-left px-3 py-2 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    + {name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Section 2: Mô tả kinh nghiệm */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">Mô tả kinh nghiệm</h3>
          </div>
          <p className="text-gray-400 text-xs mb-4 font-bold uppercase tracking-wider">Chi tiết hồ sơ & Nền tảng chuyên môn</p>
          <div className="relative">
            <textarea
              placeholder="Mô tả hành trình nghề nghiệp, những thành tựu chính và lý do bạn muốn hướng dẫn sinh viên..."
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              className="w-full h-40 p-5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none text-sm resize-none placeholder:text-gray-300"
            />
            <span className="absolute bottom-4 right-4 text-xs text-gray-400">{experienceText.length} / 2000 ký tự</span>
          </div>
        </section>

        {/* Section 3: CV & Minh chứng */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">CV & Minh chứng</h3>
          </div>
          
          <div className="border-2 border-dashed border-blue-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-blue-50/10 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <Upload size={24} />
            </div>
            <p className="text-gray-900 font-bold mb-1">Kéo & Thả CV của bạn vào đây</p>
            <p className="text-sm text-gray-500 mb-4">hoặc <span className="text-blue-500 font-bold cursor-pointer hover:underline">chọn tệp</span> từ máy tính của bạn</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Định dạng hỗ trợ: PDF, DOCX, JPG, PNG (Tối đa: 10MB)</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">Nguyen_Van_A_Academic_CV.pdf</p>
                <p className="text-[10px] text-gray-400 uppercase">2.4 MB</p>
              </div>
            </div>
            <button className="p-2 text-gray-300 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
        </section>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
          <div className="text-xs">
            {submitError && <p className="text-red-500 font-semibold">{submitError}</p>}
            {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}
          </div>
          <button className="text-gray-600 font-bold text-sm hover:text-gray-900">Quay lại bước 1</button>
          <button
            onClick={handleRegisterMentor}
            disabled={isSubmitting}
            className="bg-[#FF6B00] text-white px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF6B00]/30 hover:bg-[#E65F00] transition-all"
          >
            {isSubmitting ? 'Đang gửi...' : 'Đăng ký mentor'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
