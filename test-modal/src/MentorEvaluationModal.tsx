import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './MentorEvaluationModal.css';

// KẾT NỐI SUPABASE
const supabaseUrl = 'https://amaqvdpfwplrezzevodh.supabase.co';
const supabaseKey = 'sb_publishable_VEJHAFPUd2VdVzLMhoKssg_p2Wboo5n'; 
const supabase = createClient(supabaseUrl, supabaseKey);

interface MentorEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorId?: string; 
    mentorName?: string; 
    mentorDept?: string;
}

const MentorEvaluationModal: React.FC<MentorEvaluationModalProps> = ({ 
    isOpen, 
    onClose,
    mentorId = '681beeb0-91ef-4c2c-8be7-0b5d5339d9af', 
    mentorName = "TS. Nguyễn Văn A",
    mentorDept = "Khoa Marketing - DUE"
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setRating(0);
        setHoverRating(0);
        setFeedback('');
        setShowError(false);
        setIsSuccess(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            setShowError(true);
            return;
        }
        setShowError(false);
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('reviews')
                .insert([
                    {
                        mentor_id: mentorId, 
                        student_id: 'd59c27e8-e323-4a58-8e30-fd9a92437bfa', 
                        rating: rating,
                        comment: feedback 
                    }
                ]);

            if (error) throw error;
            setIsSuccess(true);
        } catch (error: any) {
            console.error("Lỗi Supabase:", error.message);
            alert("Lỗi RLS hoặc Database: " + error.message); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            {isSuccess ? (
                <div className="modal-content success-content">
                    <div className="success-icon-container">
                        <div className="success-check-mark">✔</div>
                    </div>
                    <h2>Đánh giá thành công!</h2>
                    <p>Cảm ơn bạn đã đóng góp ý kiến cho cộng đồng <span className="highlight-blue">UNIMENTOR</span>. Nhận xét của bạn đã được ghi nhận.</p>
                    <button className="btn-submit btn-done" onClick={handleClose}>ĐÓNG</button>
                </div>
            ) : (
                <div className="modal-content">
                    <div className="modal-header">
                        <div>
                            <h3>Đánh giá & Nhận xét Mentor</h3>
                            <p>Trường Đại học Kinh tế - ĐHĐN (DUE)</p>
                        </div>
                        <button className="close-btn" onClick={handleClose}>&times;</button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="mentor-card">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="mentor-avatar" />
                            <div className="mentor-details">
                                <div className="mentor-name">{mentorName}</div>
                                <div className="mentor-dept">{mentorDept}</div>
                            </div>
                        </div>

                        <div className="rating-area">
                            <div className="section-title">Đánh giá chung</div>
                            <div className="rating-row">
                                <div className="stars-wrapper">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                            key={star}
                                            className={`star-icon ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => {
                                                setRating(star);
                                                setShowError(false);
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    {showError && <span className="error-badge">⚠️ Vui lòng chọn mức đánh giá sao</span>}
                                </div>
                                <div className="rating-hint">Chạm vào sao để đánh giá</div>
                            </div>
                        </div>

                        <div className="comment-area">
                            <div className="section-title">Phản hồi chi tiết <span className="optional-text">(Không bắt buộc)</span></div>
                            <textarea 
                                placeholder="Hãy chia sẻ trải nghiệm của bạn với mentor này. Điều gì làm bạn hài lòng? Mentor có thể cải thiện điều gì?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                maxLength={500}
                            ></textarea>
                            <div className="char-count">{feedback.length}/500</div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                            </button>
                            <button className="btn-cancel" onClick={handleClose} disabled={isSubmitting}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorEvaluationModal;