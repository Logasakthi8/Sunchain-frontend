import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      const response = await signup(formData);
      console.log('Signup response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
            <div className="illustration-icon">✍️</div>
            <h2>Share Your Story</h2>
            <h3>Create Impact</h3>
            <p>Join thousands of writers making a difference</p>

            <div className="motivation-quote">
              <div className="quote-mark">"</div>
              <p>Your voice matters. Every story you share has the power to inspire, heal, and transform lives.</p>
            </div>

            <div className="illustration-features">
              <div className="feature">
                <span>📝</span>
                <span>Write & Share</span>
              </div>
              <div className="feature">
                <span>⭐</span>
                <span>Earn Points</span>
              </div>
              <div className="feature">
                <span>🌍</span>
                <span>Build Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Start your writing journey today</p>
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
                <span className="input-icon">👤</span>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className="auth-input"
              />
            </div>

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
                placeholder="Create a password"
                className="auth-input"
              />
              <p className="password-hint">Must be at least 6 characters</p>
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>

          <div className="auth-terms">
            <p>By signing up, you agree to share your story and make an impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
