import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false, password: false });

  const validateForm = () => {
    // Username validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (formData.username.length > 30) {
      setError('Username must be less than 30 characters');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password.length > 50) {
      setError('Password must be less than 50 characters');
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    if (field === 'username' && formData.username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        return 'Enter a valid email address';
      }
    }
    if (field === 'password' && formData.password && formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ username: true, email: true, password: true });
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await signup(formData);
      console.log('Signup response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/create-channel');
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message;
      if (errorMessage?.includes('email')) {
        setError('This email is already registered. Please login instead.');
      } else if (errorMessage?.includes('username')) {
        setError('Username already taken. Please choose another one.');
      } else {
        setError(errorMessage || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container-simple">
      <div className="auth-card-simple">
        <div className="auth-tagline">
          <h1>Share experiences that actually help people</h1>
          <p className="tagline-sub">Structured insights. Real learning. No fluff.</p>
        </div>
        
        <div className="auth-form-simple">
          <h2>Create Account</h2>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username} 
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                disabled={loading}
                className={getFieldError('username') ? 'error' : ''}
                required 
              />
              {getFieldError('username') && (
                <div className="field-error">{getFieldError('username')}</div>
              )}
            </div>
            
            <div className="input-wrapper">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                className={getFieldError('email') ? 'error' : ''}
                required 
              />
              {getFieldError('email') && (
                <div className="field-error">{getFieldError('email')}</div>
              )}
            </div>
            
            <div className="input-wrapper">
              <input 
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)" 
                value={formData.password} 
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                className={getFieldError('password') ? 'error' : ''}
                required 
              />
              {getFieldError('password') && (
                <div className="field-error">{getFieldError('password')}</div>
              )}
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
          
          <div className="auth-trust">
            <p>🔒 No spam. No noise. Just real learning.</p>
          </div>
          
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
