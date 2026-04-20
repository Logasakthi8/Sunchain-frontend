import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getMyChannel } from '../api';
import Confetti from 'react-confetti';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Story', // Added category field
    content: '',
    coverImage: null,
    coverImagePreview: null
  });
  const [hasChannel, setHasChannel] = useState(true);
  const [channelId, setChannelId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const quillRef = useRef(null);

  // Category options with icons
  const categories = [
    { value: 'Story', label: '📖 Story', icon: '📖', color: '#d4a373' },
    { value: 'Philosophy', label: '🧠 Philosophy', icon: '🧠', color: '#6b8c5c' },
    { value: 'Technology', label: '💻 Technology', icon: '💻', color: '#4a7c8c' },
    { value: 'Startups', label: '🚀 Startups', icon: '🚀', color: '#e8a04c' },
    { value: 'Self Growth', label: '🌱 Self Growth', icon: '🌱', color: '#6a9c6e' },
    { value: 'Health', label: '🏥 Health', icon: '🏥', color: '#c97e5a' },
    { value: 'Poetry', label: '✍️ Poetry', icon: '✍️', color: '#b87a9c' },
    { value: 'Memoir', label: '📔 Memoir', icon: '📔', color: '#a0886a' }
  ];

  useEffect(() => {
    checkChannel();
  }, []);

  useEffect(() => {
    const text = formData.content.replace(/<[^>]*>/g, '');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [formData.content]);

  const checkChannel = async () => {
    try {
      const response = await getMyChannel();
      if (!response.data.hasChannel) {
        setHasChannel(false);
        alert('Please create a channel in your profile before publishing stories.');
        navigate('/profile');
      } else {
        setChannelId(response.data._id);
      }
    } catch (err) {
      setHasChannel(false);
      navigate('/profile');
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: { matchVisual: false }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block', 'list', 'bullet', 'indent',
    'color', 'background', 'align', 'link', 'image', 'video'
  ];

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, coverImage: file, coverImagePreview: previewUrl });
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({ ...formData, title });
    if (title.length < 3 && title.length > 0) {
      setTitleError('Title should be at least 3 characters');
    } else {
      setTitleError('');
    }
  };

  const handleCategoryChange = (category) => {
    setFormData({ ...formData, category });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.length < 3) {
      setTitleError('Title must be at least 3 characters');
      return;
    }
    
    setLoading(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('content', formData.content);
    if (formData.coverImage) {
      submitData.append('cover_image', formData.coverImage);
    }
    
    try {
      const response = await createPost(submitData);
      setPointsEarned(response.data.points_earned);
      setShowCelebration(true);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.points = (user.points || 0) + response.data.points_earned;
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

  const handleContinue = () => {
    setShowCelebration(false);
    navigate('/');
  };

  const renderPreview = () => ({ __html: formData.content });

  if (!hasChannel) return null;

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="story-editor">
      {showCelebration && (
        <>
          <Confetti />
          <div className="modal-overlay">
            <div className="modal celebration-modal">
              <div className="celebration-icon">🎉</div>
              <h2>Successfully Published!</h2>
              <div className="points-earned">+{pointsEarned} Points Earned</div>
              <div className="total-points-display">
                Total Points: {JSON.parse(localStorage.getItem('user'))?.points || 0}
              </div>
              <p>Your story is now live! Share it with the world 🌍</p>
              <button onClick={handleContinue} className="celebration-continue-btn">
                <span>Continue to Feed</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </>
      )}
      
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-stats">
            <span className="stat-badge">📝 {wordCount} words</span>
            <span className="stat-badge">⏱️ {readingTime} min read</span>
            {formData.coverImagePreview && <span className="stat-badge">🖼️ Cover added</span>}
            {formData.category && (
              <span className="stat-badge" style={{ background: selectedCategory?.color + '20', color: selectedCategory?.color }}>
                {selectedCategory?.icon} {formData.category}
              </span>
            )}
          </div>
          <div className="editor-tabs">
            <button 
              className={`editor-tab ${!previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(false)}
            >
              ✍️ Write
            </button>
            <button 
              className={`editor-tab ${previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(true)}
            >
              👁️ Preview
            </button>
          </div>
        </div>
        
        {!previewMode ? (
          <form onSubmit={handleSubmit} className="editor-form">
            {/* Cover Image Section */}
            <div className="cover-image-section">
              {formData.coverImagePreview ? (
                <div className="cover-image-preview">
                  <img src={formData.coverImagePreview} alt="Cover" />
                  <button 
                    type="button"
                    className="remove-cover-btn"
                    onClick={() => setFormData({ ...formData, coverImage: null, coverImagePreview: null })}
                  >
                    ✕ Remove Cover
                  </button>
                </div>
              ) : (
                <div className="cover-image-upload">
                  <label className="upload-label">
                    <span className="upload-icon">🖼️</span>
                    <span>Add a stunning cover image</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className="cover-hint">Recommended: 1200x630px • This image will appear in the feed</p>
                </div>
              )}
            </div>
            
            {/* Title Section */}
            <div className="title-section">
              <input
                type="text"
                className="story-title-input"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Write a compelling title..."
                required
              />
              {titleError && <div className="title-error">{titleError}</div>}
            </div>
            
            {/* Category Selection - Beautiful Grid */}
            <div className="category-selection-section">
              <label className="category-label">
                <span className="label-icon">🏷️</span>
                Choose Category
              </label>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`category-card ${formData.category === cat.value ? 'active' : ''}`}
                    style={{
                      '--category-color': cat.color
                    }}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-name">{cat.label}</span>
                    {formData.category === cat.value && (
                      <span className="category-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Rich Text Editor */}
            <div className="editor-content-section">
              <label className="editor-label">
                <span className="label-icon">✍️</span>
                Write Your Story
              </label>
              <div className="rich-text-editor">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your story here... Use the toolbar to format text, add images, links, and more!"
                />
              </div>
            </div>
            
            {/* Publish Button */}
            <div className="publish-section">
              <button type="submit" className="publish-btn" disabled={loading}>
                {loading ? 'Publishing...' : '✨ Publish Story'}
              </button>
              <p className="publish-hint">Share your thoughts with the world • You'll earn 200 points for publishing</p>
            </div>
          </form>
        ) : (
          <div className="preview-container">
            <div className="story-preview">
              {formData.coverImagePreview && (
                <div className="preview-cover">
                  <img src={formData.coverImagePreview} alt="Cover" />
                </div>
              )}
              <div className="preview-category-tag" style={{ background: selectedCategory?.color + '20', color: selectedCategory?.color }}>
                {selectedCategory?.icon} {formData.category}
              </div>
              <h1 className="preview-title">{formData.title || 'Untitled Story'}</h1>
              <div className="preview-meta">
                <span className="preview-reading-time">{readingTime} min read</span>
                <span className="preview-word-count">{wordCount} words</span>
              </div>
              {formData.content ? (
                <div 
                  className="preview-content"
                  dangerouslySetInnerHTML={renderPreview()}
                />
              ) : (
                <p className="empty-preview">Start writing to see preview...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
