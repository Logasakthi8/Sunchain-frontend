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

  // Track scroll percentage
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
        
        // Enable like at 60% scroll
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
    console.log('Like button clicked - Enabled:', likeEnabled, 'Liked:', liked, 'Loading:', likeLoading);
    
    if (!likeEnabled) {
      console.log('Like not enabled yet - need to scroll more');
      alert('Please scroll to 60% of the post to unlock the like button!');
      return;
    }
    
    if (liked) {
      console.log('Already liked this post');
      return;
    }
    
    if (likeLoading) {
      console.log('Like request in progress');
      return;
    }
    
    setLikeLoading(true);
    try {
      console.log('Sending like request for post:', id);
      const response = await likePost(id);
      console.log('Like response:', response.data);
      
      if (response.data.success !== false) {
        setLiked(true);
        setPost({ ...post, likes: (post.likes || 0) + 1 });
        console.log('Post liked successfully! New likes count:', post.likes + 1);
      } else {
        console.error('Like failed:', response.data.message);
        alert('Failed to like post: ' + response.data.message);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      alert('Failed to like post. Please try again. Error: ' + (err.response?.data?.message || err.message));
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
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>🔒 Authentication Required</h2>
        <p style={{ margin: '1rem 0', color: '#718096' }}>
          Please sign in to read full posts and interact with the community.
        </p>
        <button onClick={handleLoginRedirect} style={{ marginTop: '1rem' }}>
          Sign In
        </button>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading thoughtful content...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const imageUrl = getImageUrl();

  return (
    <article className="full-post">
      <h1>{post.title}</h1>
      <div className="post-category" style={{ marginBottom: '0.5rem' }}>{post.category}</div>
      <div className="meta">
        By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
        {post.likes > 0 && ` • ❤️ ${post.likes} likes`}
      </div>
      
      {imageUrl && (
        <div className="post-image-container">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="post-image"
            onError={(e) => {
              console.error('Image failed to load');
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div 
        ref={contentRef}
        className="content" 
        dangerouslySetInnerHTML={renderContent(post.content)}
      />
      
      {/* Scroll progress indicator */}
      <div style={{ 
        height: '3px', 
        background: '#e2e8f0', 
        margin: '1rem 0',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${scrollPercentage}%`, 
          height: '100%', 
          background: '#4299e1',
          transition: 'width 0.3s'
        }} />
      </div>
      <p style={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center' }}>
        Scroll progress: {Math.round(scrollPercentage)}% {scrollPercentage >= 60 ? '✓ Like unlocked!' : '(60% to unlock like)'}
      </p>
      
      {showUnlock && (
        <div className="unlock-message">
          🎉 You've unlocked interaction! You can now like this post.
        </div>
      )}
      
      <button 
        onClick={handleLike} 
        className={`like-button ${likeEnabled && !liked ? 'active' : ''}`}
        disabled={!likeEnabled || liked || likeLoading}
        style={{
          background: liked ? '#f56565' : (likeEnabled ? '#f56565' : '#e2e8f0'),
          color: (liked || likeEnabled) ? 'white' : '#a0aec0',
          cursor: (!likeEnabled || liked || likeLoading) ? 'not-allowed' : 'pointer',
          opacity: likeLoading ? 0.7 : 1
        }}
      >
        {likeLoading ? '⏳ Processing...' : (liked ? '❤️ Liked!' : (likeEnabled ? '❤️ Like' : '🔒 Scroll to Like'))}
      </button>
      
      <div className="comments-section">
        <h3>Comments ({post.comments?.length || 0})</h3>
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows="3"
          />
          <button type="submit">Add Comment</button>
        </form>
        
        <div className="comments-list">
          {post.comments?.map((comment, idx) => (
            <div key={idx} className="comment">
              <div className="comment-author">{comment.username}</div>
              <div className="comment-text">{comment.text}</div>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default FullPost;