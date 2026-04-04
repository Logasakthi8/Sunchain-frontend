import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, likePost, addComment } from '../api';
import { useInView } from 'react-intersection-observer';

function FullPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeEnabled, setLikeEnabled] = useState(false);
  const [comment, setComment] = useState('');
  const [showUnlock, setShowUnlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.6 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }
    loadPost();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrollPosition = scrollTop - elementTop;
      const scrollableHeight = elementHeight - windowHeight;
      
      if (scrollableHeight > 0) {
        const percentage = (scrollPosition / scrollableHeight) * 100;
        setScrollPercentage(Math.min(100, Math.max(0, percentage)));
        
        if (percentage >= 60 && !likeEnabled && !authError) {
          setLikeEnabled(true);
          setShowUnlock(true);
          setTimeout(() => setShowUnlock(false), 3000);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [likeEnabled, authError, contentRef.current]);

  useEffect(() => {
    if (inView && !likeEnabled && !authError && post) {
      setLikeEnabled(true);
      setShowUnlock(true);
      setTimeout(() => setShowUnlock(false), 3000);
    }
  }, [inView, authError, post]);

  const loadPost = async () => {
    try {
      const response = await getPost(id);
      console.log('Post loaded:', response.data);
      setPost(response.data);
    } catch (err) {
      console.error('Failed to load post:', err);
      if (err.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!likeEnabled) {
      alert('Please scroll to 60% of the post to unlock the like button!');
      return;
    }
    
    if (liked || likeLoading) return;
    
    setLikeLoading(true);
    try {
      const response = await likePost(id);
      if (response.data.success !== false) {
        setLiked(true);
        setPost({ ...post, likes: (post.likes || 0) + 1 });
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      alert('Failed to like post. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(id, comment);
      const user = JSON.parse(localStorage.getItem('user'));
      setPost({
        ...post,
        comments: [...(post.comments || []), {
          username: user?.username || 'Anonymous',
          text: comment,
          created_at: new Date().toISOString()
        }]
      });
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const renderContent = (content) => {
    return { __html: content };
  };

  const getImageUrl = () => {
    if (post && post.image_base64) {
      const ext = post.image_filename ? post.image_filename.split('.').pop().toLowerCase() : 'jpg';
      const mimeType = ext === 'png' ? 'image/png' : 
                      ext === 'gif' ? 'image/gif' : 
                      ext === 'webp' ? 'image/webp' : 'image/jpeg';
      return `data:${mimeType};base64,${post.image_base64}`;
    }
    return null;
  };

  if (authError) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-card">
          <div className="auth-error-icon">🔒</div>
          <h2>Authentication Required</h2>
          <p>Please sign in to read full posts and interact with the community.</p>
          <button onClick={handleLoginRedirect} className="auth-signin-btn">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="post-loading">
        <div className="loading-spinner"></div>
        <p>Loading story...</p>
      </div>
    );
  }
  
  if (!post) return <div className="error-container">Post not found</div>;

  const imageUrl = getImageUrl();

  return (
    <article className="full-post-modern">
      {/* Hero Section with Cover Image */}
      <div className="post-hero">
        {imageUrl && (
          <div className="post-cover-image">
            <img src={imageUrl} alt={post.title} />
            <div className="cover-overlay"></div>
          </div>
        )}
        <div className="post-header-content">
          <div className="post-category-badge">{post.category}</div>
          <h1 className="post-title-modern">{post.title}</h1>
          <div className="post-author-info">
            <div className="author-avatar-large">
              {post.author_name?.charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <span className="author-name-large">{post.author_name}</span>
              <span className="post-date-large">
                {new Date(post.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="post-content-wrapper">
        <div 
          ref={contentRef}
          className="post-content-modern" 
          dangerouslySetInnerHTML={renderContent(post.content)}
        />

        {/* Reading Progress Bar */}
        <div className="reading-progress-container">
          <div className="progress-info">
            <span className="progress-label">Reading progress</span>
            <span className="progress-percentage">{Math.round(scrollPercentage)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${scrollPercentage}%` }}
            />
          </div>
        </div>

        {/* Like Section */}
        <div className="like-section">
          {showUnlock && (
            <div className="unlock-notification">
              <span className="unlock-icon">🎉</span>
              <span>You've unlocked interaction! You can now like this post.</span>
            </div>
          )}
          
          <div className="like-container">
            <button 
              onClick={handleLike} 
              className={`like-btn-modern ${liked ? 'liked' : ''} ${likeEnabled && !liked ? 'enabled' : ''}`}
              disabled={!likeEnabled || liked || likeLoading}
            >
              <div className="like-icon">
                {liked ? '❤️' : (likeEnabled ? '🤍' : '🔒')}
              </div>
              <span className="like-count">
                {post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}
              </span>
              {!likeEnabled && !liked && (
                <span className="like-hint">Scroll to unlock</span>
              )}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section-modern">
          <div className="comments-header">
            <h3>
              <span className="comments-icon">💬</span>
              Comments ({post.comments?.length || 0})
            </h3>
          </div>
          
          <form onSubmit={handleComment} className="comment-form-modern">
            <div className="comment-input-wrapper">
              <div className="comment-avatar-small">
                {JSON.parse(localStorage.getItem('user'))?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                className="comment-input"
              />
            </div>
            <button type="submit" className="submit-comment-btn" disabled={!comment.trim()}>
              Post Comment
            </button>
          </form>
          
          <div className="comments-list-modern">
            {post.comments?.length === 0 ? (
              <div className="no-comments">
                <span>💭</span>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              post.comments.map((comment, idx) => (
                <div key={idx} className="comment-card">
                  <div className="comment-avatar">
                    {comment.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author-name">{comment.username}</span>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default FullPost;
