import './App.css'
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const AppWrapper = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppWrapper />
  </AuthProvider>
);

export default App;

