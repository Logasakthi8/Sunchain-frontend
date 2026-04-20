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
      // Update user data to reflect channel creation
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

  return (
    <div className="create-channel-container">
      <div className="create-channel-card">
        <div className="card-header">
          <span className="header-icon">🌟</span>
          <h1>Create Your Channel</h1>
          <p>Start your storytelling journey by creating a channel</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-channel-form">
          <div className="form-group">
            <label>Channel Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., The Daily Philosopher"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell your audience what your channel is about..."
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
            {loading ? 'Creating...' : '✨ Create Channel'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;
