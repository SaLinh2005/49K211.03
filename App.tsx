import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MentorList from './pages/MentorList';
import Messages from './pages/Messages';
import MentorRegistration from './pages/MentorRegistration';
import UserProfileCreation from './pages/UserProfileCreation';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />

        {/* Main App Routes (With Layout) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/mentor" element={<MentorList />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/mentor-registration" element={<MentorRegistration />} />
          <Route path="/profile" element={<UserProfileCreation />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
