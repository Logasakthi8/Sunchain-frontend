import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel } from '../api';

function CreateChannel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Example channel names for inspiration
  const exampleChannels = [
    { name: "Startup Experiments", icon: "🚀" },
    { name: "Lessons from Building in Public", icon: "🏗️" },
    { name: "Daily Learnings in Tech", icon: "💻" },
    { name: "Growth Marketing Learnings", icon: "📈" },
    { name: "Product Management Insights", icon: "📦" }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Channel name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    if (profileImage) {
      submitData.append('profile_image', profileImage);
    }
    
    try {
      const response = await createChannel(submitData);
      const user = JSON.parse(localStorage.getItem('user'));
      user.hasChannel = true;
      user.channelId = response.data.channel_id;
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const fillExample = (exampleName) => {
    setFormData({ ...formData, name: exampleName });
  };

  return (
    <div className="create-channel-container">
      <div className="create-channel-card">
        <div className="card-header">
          <span className="header-icon">🌟</span>
          <h1>Start Sharing What You've Learned</h1>
          <p className="header-subtext">
            We help you turn your experiences into structured, actionable insights.
          </p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-channel-form">
          <div className="form-group">
            <label>Channel Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., The Growth Lab"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Share what you've learned, built, or experienced..."
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Profile Image</label>
            <div className="image-upload-area">
              {profileImagePreview ? (
                <div className="image-preview">
                  <img src={profileImagePreview} alt="Profile preview" />
                  <button type="button" onClick={() => {
                    setProfileImage(null);
                    setProfileImagePreview(null);
                  }} className="remove-image">✕</button>
                </div>
              ) : (
                <label className="upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Upload profile image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>
          
          <button type="submit" className="create-channel-btn" disabled={loading}>
            {loading ? 'Creating...' : '✨ Start Sharing Insights'}
          </button>
        </form>

        {/* Example Channels Section - Inspirational */}
        <div className="example-channels">
          <div className="example-header">
            <span className="example-icon">💡</span>
            <span>Channel name ideas</span>
          </div>
          <div className="example-list">
            {exampleChannels.map((example, idx) => (
              <button
                key={idx}
                type="button"
                className="example-chip"
                onClick={() => fillExample(example.name)}
              >
                <span>{example.icon}</span>
                <span>{example.name}</span>
              </button>
            ))}
          </div>
          <p className="example-hint">
            Click any example to use it as a starting point
          </p>
        </div>

        <div className="card-footer-note">
          <p>Your channel becomes your identity as a knowledge creator</p>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
