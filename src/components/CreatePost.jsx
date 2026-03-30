import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import Confetti from 'react-confetti';

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '🧘 Self Growth',
    content: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Updated categories with emojis
  const categories = [
    '🧠 Philosophy',
    '💻 Technology',
    '🚀 Startups',
    '🧘 Self Growth',
    '🏥 Health'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setUploadStatus(`Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (image) {
      data.append('image', image);
      console.log('Appending image to form data:', image.name);
    }
    
    try {
      const response = await createPost(data);
      console.log('Post created successfully:', response.data);
      setPointsEarned(response.data.points_earned);
      setShowCelebration(true);
      
      // Update user points in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.points += response.data.points_earned;
        user.total_blogs += 1;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setTimeout(() => {
        setShowCelebration(false);
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    return { __html: formData.content };
  };

  return (
    <div>
      {showCelebration && (
        <>
          <Confetti />
          <div className="modal-overlay">
            <div className="modal">
              <h2>🎉 Successfully Published!</h2>
              <div className="points">+{pointsEarned} Points Earned</div>
              <div className="total-points">
                Total Points: {JSON.parse(localStorage.getItem('user'))?.points || 0}
              </div>
              <p>Share your achievement with your community 🚀</p>
              <button onClick={() => setShowCelebration(false)}>Continue</button>
            </div>
          </div>
        </>
      )}
      
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setPreviewMode(false)}
            style={{ 
              background: !previewMode ? '#4299e1' : '#e2e8f0',
              color: !previewMode ? 'white' : '#4a5568'
            }}
          >
            Write
          </button>
          <button 
            onClick={() => setPreviewMode(true)}
            style={{ 
              background: previewMode ? '#4299e1' : '#e2e8f0',
              color: previewMode ? 'white' : '#4a5568'
            }}
          >
            Preview
          </button>
        </div>
        
        {!previewMode ? (
          <form onSubmit={handleSubmit}>
            <h2>Write Your Story</h2>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Give your post a compelling title..."
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Image</label>
              <input 
                type="file" 
                onChange={handleImageChange} 
                accept="image/*"
                style={{ padding: '0.5rem' }}
              />
              {uploadStatus && (
                <p style={{ fontSize: '0.875rem', color: '#48bb78', marginTop: '0.5rem' }}>
                  ✓ {uploadStatus}
                </p>
              )}
              {imagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>
                    Preview:
                  </p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Content (HTML Supported)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="15"
                placeholder="Write your content here. You can use HTML tags for formatting."
                style={{ fontFamily: 'monospace' }}
              />
              <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
                💡 Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
              </small>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post ✨'}
            </button>
          </form>
        ) : (
          <div>
            <h2>Preview: {formData.title || 'Untitled'}</h2>
            {formData.category && (
              <div className="post-category" style={{ marginBottom: '1rem' }}>{formData.category}</div>
            )}
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  objectFit: 'cover'
                }} 
              />
            )}
            {formData.content ? (
              <div className="preview-box">
                <div 
                  className="preview-content"
                  dangerouslySetInnerHTML={renderPreview()}
                />
              </div>
            ) : (
              <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                Start writing to see preview...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
