import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getMyChannel, createChannel } from '../api';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelForm, setChannelForm] = useState({
    name: '',
    description: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [channelError, setChannelError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    await loadProfile();
    await loadChannel();
    setLoading(false);
  };

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadChannel = async () => {
    try {
      const response = await getMyChannel();
      if (response.data.hasChannel !== false) {
        setChannel(response.data);
        // Update localStorage to reflect channel existence
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.hasChannel = true;
          user.channelId = response.data._id;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } else {
        setChannel(null);
      }
    } catch (err) {
      console.error('Failed to load channel:', err);
      setChannel(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!channelForm.name.trim()) {
      setChannelError('Channel name is required');
      return;
    }
    
    setCreatingChannel(true);
    setChannelError('');
    
    const submitData = new FormData();
    submitData.append('name', channelForm.name);
    submitData.append('description', channelForm.description || '');
    if (profileImage) {
      submitData.append('profile_image', profileImage);
    }
    
    try {
      const response = await createChannel(submitData);
      
      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.hasChannel = true;
        user.channelId = response.data.channel_id;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setShowCreateChannel(false);
      // Reset form
      setChannelForm({ name: '', description: '' });
      setProfileImage(null);
      setProfileImagePreview(null);
      
      // Reload channel data
      await loadChannel();
    } catch (err) {
      console.error('Error creating channel:', err);
      setChannelError(err.response?.data?.message || 'Failed to create channel');
    } finally {
      setCreatingChannel(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container-sunchain">
      {/* Profile Header */}
      <div className="profile-header-sunchain">
        <div className="profile-avatar-large">
          {profile?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{profile?.username}</h1>
          <p className="profile-email">{profile?.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">⭐ {profile?.points || 0}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile?.total_posts || 0}</span>
              <span className="stat-label">Stories</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile?.subscribers || 0}</span>
              <span className="stat-label">Subscribers</span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn-sunchain">
          🚪 Logout
        </button>
      </div>

      {/* Channel Section */}
      <div className="channel-section">
        <div className="section-header">
          <h2> Your Channel</h2>
        </div>
        
        {channel ? (
          <div className="channel-card" onClick={() => navigate(`/channel/${channel._id}`)}>
            <div className="channel-avatar">
              {channel.profile_image_base64 ? (
                <img src={`data:image/jpeg;base64,${channel.profile_image_base64}`} alt={channel.name} />
              ) : (
                <div className="avatar-placeholder">{channel.name?.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className="channel-details">
              <h3>{channel.name}</h3>
              <p>{channel.description || 'No description yet.'}</p>
              <div className="channel-stats">
                <span>🌿 {channel.subscriber_count || 0} subscribers</span>
                <span>📝 {channel.posts?.length || 0} stories</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-channel-card">
            <div className="no-channel-icon"></div>
            <p>You haven't created a channel yet.</p>
            <p className="no-channel-subtext">Create a channel to start publishing stories</p>
            <button onClick={() => setShowCreateChannel(true)} className="create-channel-primary">
              ✨ Create Your Channel
            </button>
          </div>
        )}
      </div>

      {/* Recent Posts Section */}
      {channel && channel.posts && channel.posts.length > 0 && (
        <div className="recent-posts-section">
          <h2>📝 Your Recent Stories</h2>
          <div className="recent-posts-grid">
            {channel.posts.slice(0, 5).map((post) => (
              <div key={post._id} className="recent-post-card" onClick={() => navigate(`/post/${post._id}`)}>
                {post.cover_image_base64 && (
                  <div className="post-cover-small">
                    <img src={`data:image/jpeg;base64,${post.cover_image_base64}`} alt={post.title} />
                  </div>
                )}
                <div className="post-info">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {channel.posts.length > 5 && (
            <button onClick={() => navigate(`/channel/${channel._id}`)} className="view-all-btn">
              View All Stories →
            </button>
          )}
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="modal-overlay" onClick={() => setShowCreateChannel(false)}>
          <div className="create-channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✨ Create Your Channel</h2>
              <button className="modal-close" onClick={() => setShowCreateChannel(false)}>✕</button>
            </div>
            
            {channelError && <div className="error-message">{channelError}</div>}
            
            <form onSubmit={handleCreateChannel} className="create-channel-form">
              <div className="form-group">
                <label>Channel Name *</label>
                <input
                  type="text"
                  value={channelForm.name}
                  onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })}
                  placeholder="e.g., The Daily Philosopher"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  placeholder="Tell your audience what your channel is about..."
                  rows="3"
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
                      <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  )}
                </div>
              </div>
              
              <button type="submit" className="create-channel-submit" disabled={creatingChannel}>
                {creatingChannel ? 'Creating...' : '✨ Create Channel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
