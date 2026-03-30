import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const getPreview = (content) => {
    // Strip HTML tags for preview
    const strippedContent = content.replace(/<[^>]*>/g, '');
    const lines = strippedContent.split('\n').slice(0, 4);
    return lines.join('\n');
  };

  const handleReadMore = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  // Get image from base64 data
  const getImageUrl = () => {
    if (post.image_base64) {
      let mimeType = 'image/jpeg';
      if (post.image_filename) {
        const ext = post.image_filename.split('.').pop().toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
        else if (ext === 'webp') mimeType = 'image/webp';
      }
      return `data:${mimeType};base64,${post.image_base64}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <>
      {/* Login/Signup Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal-overlay">
          <div className="modal-auth-content">
            <h3>🔐 Authentication Required</h3>
            <p>Please sign in or create an account to read full posts and interact with the community.</p>
            <div className="modal-auth-buttons">
              <button onClick={handleLogin} className="login-btn">
                Login
              </button>
              <button onClick={handleSignup} className="signup-btn">
                Sign Up
              </button>
              <button onClick={handleClosePrompt} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="post-author">By {post.author_name}</div>
        <h2 className="post-title">{post.title}</h2>
        <div className="post-category">{post.category}</div>
        {imageUrl && (
          <div className="post-image-container">
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="post-image"
              onError={(e) => {
                console.error('Image failed to load for post:', post._id);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="post-preview">{getPreview(post.content)}</div>
        <button 
          onClick={handleReadMore} 
          className="read-more"
          style={{
            background: 'none',
            color: '#4299e1',
            padding: '0.5rem 0',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}
        >
          Read More →
        </button>
      </div>
    </>
  );
}

export default PostCard;
