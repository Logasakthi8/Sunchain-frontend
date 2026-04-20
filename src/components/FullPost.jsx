import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, likePost, addComment, subscribeToChannel } from '../api';
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
  const [isSubscribed, setIsSubscribed] = useState(false);
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
  }, [likeEnabled, authError]);

  const loadPost = async () => {
    try {
      const response = await getPost(id);
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
      alert('Please scroll to 60% to unlock the like button');
      return;
    }
    if (liked || likeLoading) return;
    
    setLikeLoading(true);
    try {
      await likePost(id);
      setLiked(true);
      setPost({ ...post, likes: (post.likes || 0) + 1 });
    } catch (err) {
      console.error('Failed to like post:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const confirmLogin = window.confirm('Please sign in to subscribe');
      if (confirmLogin) navigate('/login');
      return;
    }
    
    try {
      await subscribeToChannel(post.channel_id);
      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe:', err);
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
    }
  };

  const handleChannelClick = () => {
    navigate(`/channel/${post.channel_id}`);
  };

  const renderContent = (content) => ({ __html: content });

  const getImageUrl = () => {
    if (post?.cover_image_base64) {
      return `data:image/jpeg;base64,${post.cover_image_base64}`;
    }
    return null;
  };

  if (authError) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-card">
          <div className="auth-error-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to read full stories</p>
          <button onClick={() => navigate('/login')} className="auth-signin-btn">Sign In</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if (!post) return <div className="error-container">Story not found</div>;

  const imageUrl = getImageUrl();

  return (
    <article className="full-post-sunchain">
      {imageUrl && (
        <div className="post-hero-image">
          <img src={imageUrl} alt={post.title} />
          <div className="hero-overlay"></div>
        </div>
      )}
      
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta-row">
          <button onClick={handleChannelClick} className="channel-link-large">
            <span className="channel-icon">🌿</span>
            <span>{post.channel_name}</span>
          </button>
          <span className="post-date">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <button onClick={handleSubscribe} className={`subscribe-btn-story ${isSubscribed ? 'subscribed' : ''}`}>
          {isSubscribed ? '✓ Subscribed' : '+ Subscribe to channel'}
        </button>
      </div>

      <div className="post-content" ref={contentRef} dangerouslySetInnerHTML={renderContent(post.content)} />

      <div className="reading-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${scrollPercentage}%` }} />
        </div>
        <p className="progress-text">{Math.round(scrollPercentage)}% read</p>
      </div>

      {showUnlock && <div className="unlock-message">🎉 You've unlocked interactions! You can now like this story.</div>}

      <div className="like-section">
        <button onClick={handleLike} className={`like-btn ${liked ? 'liked' : ''} ${likeEnabled ? 'enabled' : 'disabled'}`} disabled={!likeEnabled || liked}>
          <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
          <span>{post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}</span>
        </button>
      </div>

      <div className="comments-section">
        <h3>💬 Comments ({post.comments?.length || 0})</h3>
        <form onSubmit={handleComment} className="comment-form">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." rows="3" />
          <button type="submit" disabled={!comment.trim()}>Post Comment</button>
        </form>
        
        <div className="comments-list">
          {post.comments?.length === 0 ? (
            <div className="no-comments">Be the first to comment</div>
          ) : (
            post.comments.map((comment, idx) => (
              <div key={idx} className="comment-card">
                <div className="comment-avatar">{comment.username?.charAt(0).toUpperCase()}</div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.username}</span>
                    <span className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  );
}

export default FullPost;
