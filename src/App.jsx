import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MentorListPage from './MentorListPage'
import MentorDetail from './MentorDetail'
import MentorReview from './MentorReview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MentorListPage />} />
        <Route path="/mentor/:id" element={<MentorDetail />} />
        <Route path="/mentor/:id/reviews" element={<MentorReview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
