// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './components/Authcontext';
import MapDisplay from './components/MapDisplay';
import VideoRecorder from './components/VideoRecorder';
import Signup from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <App />
      </Router>
    </AuthProvider>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<GuestRoute element={<Signup />} />} />
        <Route path="/login" element={<GuestRoute element={<Login />} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>
                <VideoRecorder />
                <MapDisplay />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : element;
};

export default AppWrapper;