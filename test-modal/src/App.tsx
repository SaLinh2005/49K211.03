import { useState } from 'react'
import MentorEvaluationModal from './MentorEvaluationModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Test Giao Diện Unimentor</h2>
      
      {/* Cái nút màu cam để mở Form */}
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ padding: '12px 24px', background: '#FF6B00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
      >
        ★ Đánh giá Mentor
      </button>

      {/* Gọi file code của ông ra đây */}
      <MentorEvaluationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default App