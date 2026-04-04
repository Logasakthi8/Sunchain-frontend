import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(formData);
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side - Illustration with Motivational Content */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">📚</div>
            <h2>Welcome Back</h2>
            <h3>Continue Your Journey</h3>
            <p>Every story you share creates ripples of change</p>

            <div className="motivation-quote">
              <div className="quote-mark">"</div>
              <p>The stories you share today could change someone's tomorrow. Keep writing, keep inspiring.</p>
            </div>

            <div className="illustration-features">
              <div className="feature">
                <span>📖</span>
                <span>Read Stories</span>
              </div>
              <div className="feature">
                <span>✍️</span>
                <span>Write Articles</span>
              </div>
              <div className="feature">
                <span>💬</span>
                <span>Engage Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form">
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Welcome back to Mindful Blog</p>
          </div>

          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="input-group">
              <label>
                <span className="input-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <label>
                <span className="input-icon">🔒</span>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="auth-input"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
            </p>
          </div>
          
          <div className="auth-motivation-message">
            <p>✨ Your story matters. Share it with the world.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
