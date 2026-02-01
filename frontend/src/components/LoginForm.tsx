import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Log demo credentials to console for developers
  useEffect(() => {
    console.log('%c🔧 Demo Accounts Available', 'font-size: 16px; color: #0ea5e9; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #0ea5e9;');
    console.log('%cAdmin Account:', 'font-size: 13px; color: #10b981; font-weight: bold;');
    console.log('%c  Username: admin', 'font-size: 12px; color: #6b7280;');
    console.log('%c  Password: admin123', 'font-size: 12px; color: #6b7280;');
    console.log('%c', ''); // Empty line
    console.log('%cUser Account:', 'font-size: 13px; color: #10b981; font-weight: bold;');
    console.log('%c  Username: user', 'font-size: 12px; color: #6b7280;');
    console.log('%c  Password: user123', 'font-size: 12px; color: #6b7280;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #0ea5e9;');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.access_token,
      }));

      showToast('Login successful!', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
          autoComplete="username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}