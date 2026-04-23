import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getMyChannel } from '../api';
import Confetti from 'react-confetti';

function CreatePost() {
  const navigate = useNavigate();
  const [step, setStep] = useState('template');
  const [hasChannel, setHasChannel] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    hypothesis: '',
    actionTaken: '',
    result: '',
    whatWorked: '',
    keyInsight: '',
    context: '',
    whatWentWrong: '',
    rootCause: '',
    whatWouldDoDifferently: '',
    lesson: '',
    activities: '',
    wins: '',
    challenges: '',
    metrics: '',
    nextSteps: '',
    ask: '',
    situation: '',
    insight: '',
    whyItMatters: '',
    example: '',
    howToApply: '',
    stage: '',
    recentEvents: '',
    decisionsMade: '',
    struggles: '',
    currentFocus: '',
    reflection: ''
  });
  const [sectionImages, setSectionImages] = useState({});

  const templates = {
    growth: {
      name: 'Growth Experiment',
      icon: '🚀',
      color: '#2c5f2d',
      description: 'Share what you tried to grow (users, revenue, reach)',
      fields: ['goal', 'hypothesis', 'actionTaken', 'result', 'whatWorked', 'keyInsight'],
      fieldLabels: {
        goal: '🎯 Goal',
        hypothesis: '🔬 Hypothesis',
        actionTaken: '⚙️ Action Taken',
        result: '📊 Result',
        whatWorked: '✅ What Worked / Didn\'t',
        keyInsight: '💡 Key Insight'
      },
      placeholders: {
        goal: 'What were you trying to achieve?',
        hypothesis: 'What did you believe would work?',
        actionTaken: 'What exactly did you do?',
        result: 'What happened? (numbers if possible)',
        whatWorked: 'Honest breakdown of what worked and what didn\'t',
        keyInsight: 'What should others learn from this experiment?'
      }
    },
    failure: {
      name: 'Failure Story',
      icon: '❌',
      color: '#c97e5a',
      description: 'Turn mistakes into learning',
      fields: ['context', 'whatWentWrong', 'rootCause', 'whatWouldDoDifferently', 'lesson'],
      fieldLabels: {
        context: '📍 Context',
        whatWentWrong: '💥 What Went Wrong?',
        rootCause: '🔍 Root Cause',
        whatWouldDoDifferently: '🔄 What I\'d Do Differently',
        lesson: '⭐ Lesson Learned'
      },
      placeholders: {
        context: 'What were you building or trying to achieve?',
        whatWentWrong: 'What actually happened?',
        rootCause: 'Why did it fail?',
        whatWouldDoDifferently: 'Clear improvement for next time',
        lesson: 'Final takeaway for others'
      }
    },
    startup: {
      name: 'Startup Update',
      icon: '📈',
      color: '#e8a04c',
      description: 'Regular progress updates (build in public)',
      fields: ['activities', 'wins', 'challenges', 'metrics', 'nextSteps', 'ask'],
      fieldLabels: {
        activities: '🛠️ What I Worked On',
        wins: '✅ Progress / Wins',
        challenges: '⚠️ Challenges',
        metrics: '📈 Metrics',
        nextSteps: '🎯 Next Steps',
        ask: '⭐ Ask'
      },
      placeholders: {
        activities: 'Key activities and tasks completed',
        wins: 'What improved or got better?',
        challenges: 'What\'s blocking your progress?',
        metrics: 'Users, revenue, engagement numbers (optional)',
        nextSteps: 'What\'s coming next?',
        ask: 'Help, feedback, or connections you need'
      }
    },
    lesson: {
      name: 'Lesson Learned',
      icon: '🧠',
      color: '#6b8c5c',
      description: 'Share a single insight clearly',
      fields: ['situation', 'insight', 'whyItMatters', 'example', 'howToApply'],
      fieldLabels: {
        situation: '📍 Situation',
        insight: '⭐ Insight',
        whyItMatters: '💡 Why It Matters',
        example: '📝 Example',
        howToApply: '🛠️ How to Apply'
      },
      placeholders: {
        situation: 'Where did this lesson come from?',
        insight: 'The main learning (1–2 lines)',
        whyItMatters: 'Why should others care about this?',
        example: 'A real scenario illustrating this lesson',
        howToApply: 'Actionable advice for others'
      }
    },
    journey: {
      name: 'Journey Update',
      icon: '🛤️',
      color: '#b87a9c',
      description: 'Document your long-term journey',
      fields: ['stage', 'recentEvents', 'decisionsMade', 'wins', 'struggles', 'currentFocus', 'reflection'],
      fieldLabels: {
        stage: '📍 Stage',
        recentEvents: '📅 What Happened Recently',
        decisionsMade: '🤔 Decisions Made',
        wins: '🏆 Wins',
        struggles: '💪 Struggles',
        currentFocus: '🎯 Current Focus',
        reflection: '⭐ Reflection'
      },
      placeholders: {
        stage: 'Idea / MVP / Growth / Scale / etc.',
        recentEvents: 'Key events that occurred recently',
        decisionsMade: 'Important choices you made',
        wins: 'Positive outcomes and successes',
        struggles: 'Real difficulties you faced',
        currentFocus: 'What you\'re prioritizing now',
        reflection: 'What you\'re learning overall'
      }
    }
  };

  useEffect(() => {
    checkChannel();
  }, []);

  const checkChannel = async () => {
    try {
      const response = await getMyChannel();
      if (!response.data.hasChannel) {
        setHasChannel(false);
        alert('Please create a channel in your profile before sharing insights.');
        navigate('/profile');
      }
    } catch (err) {
      setHasChannel(false);
      navigate('/profile');
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setStep('editor');
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCoverImage(file);
      setCoverImagePreview(previewUrl);
    }
  };

  const handleSectionImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSectionImages({
        ...sectionImages,
        [field]: { file: file, preview: previewUrl }
      });
    }
  };

  const removeSectionImage = (field) => {
    const newImages = { ...sectionImages };
    delete newImages[field];
    setSectionImages(newImages);
  };

  // Validate key insight for templates that require it
  const validateKeyInsight = () => {
    if (selectedTemplate === 'growth' && !formData.keyInsight?.trim()) {
      alert('Key Insight is required for Growth Experiment');
      return false;
    }
    if (selectedTemplate === 'lesson' && !formData.insight?.trim()) {
      alert('Key Insight is required for Lesson Learned');
      return false;
    }
    if (selectedTemplate === 'failure' && !formData.lesson?.trim()) {
      alert('Key Insight is required for Failure Story');
      return false;
    }
    return true;
  };

  const generatePreviewHTML = () => {
    const template = templates[selectedTemplate];
    if (!template) return '';
    
    let content = '';

    // Cover image
    if (coverImagePreview) {
      content += `<div style="margin-bottom: 2rem;">`;
      content += `<img src="${coverImagePreview}" alt="Cover image" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 16px;" />`;
      content += `</div>`;
    }

    // Template Badge at top
    content += `<div style="margin-bottom: 16px; font-size: 14px; color: ${template.color}; background: ${template.color}15; display: inline-block; padding: 4px 12px; border-radius: 20px;">${template.icon} ${template.name}</div>`;

    // Title
    content += `<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; font-family: Georgia, serif;">${formData.title || 'Untitled Insight'}</h1>`;

    // Key Insight - ALWAYS TOP (after title)
    let keyInsightText = '';
    if (template.fields.includes('keyInsight') && formData.keyInsight) {
      keyInsightText = formData.keyInsight;
    } else if (template.fields.includes('lesson') && formData.lesson) {
      keyInsightText = formData.lesson;
    } else if (template.fields.includes('insight') && formData.insight) {
      keyInsightText = formData.insight;
    } else if (template.fields.includes('ask') && formData.ask) {
      keyInsightText = formData.ask;
    } else if (template.fields.includes('reflection') && formData.reflection) {
      keyInsightText = formData.reflection;
    }

    if (keyInsightText) {
      content += `<div style="background: #fef5e8; padding: 24px; border-left: 4px solid #d4a373; border-radius: 12px; margin: 24px 0;">`;
      content += `<h3 style="margin-bottom: 8px;">💡 Key Insight</h3>`;
      content += `<p style="margin: 0; line-height: 1.5;">${keyInsightText}</p>`;
      content += `</div>`;
    }

    // All fields
    for (const field of template.fields) {
      const isSpecialField = field === 'keyInsight' || field === 'lesson' || field === 'insight' || field === 'ask' || field === 'reflection';
      if (!isSpecialField) {
        const value = formData[field];
        if (value) {
          content += `<h2 style="font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.5rem;">${template.fieldLabels[field]}</h2>`;
          content += `<p style="line-height: 1.6; margin-bottom: 1rem;">${value.replace(/\n/g, '<br>')}</p>`;
          
          if (sectionImages[field] && sectionImages[field].preview) {
            content += `<div style="margin: 1rem 0;">`;
            content += `<img src="${sectionImages[field].preview}" alt="Section image" style="max-width: 100%; border-radius: 12px;" />`;
            content += `</div>`;
          }
        }
      }
    }

    return content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate title
    if (!formData.title.trim()) {
      alert('Please add a title for your insight');
      return;
    }
    
    // Validate key insight for templates that require it
    if (!validateKeyInsight()) {
      return;
    }
    
    setLoading(true);

    const content = generatePreviewHTML();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', 'Insight'); // Changed from 'Story' to 'Insight'
    submitData.append('content', content);
    submitData.append('postType', selectedTemplate);
    
    if (coverImage) {
      submitData.append('cover_image', coverImage);
    }
    
    // Upload section images
    for (const [field, imageData] of Object.entries(sectionImages)) {
      if (imageData.file) {
        submitData.append(`section_image_${field}`, imageData.file);
      }
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
      alert('Failed to share insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('template');
    setSelectedTemplate(null);
    setCoverImage(null);
    setCoverImagePreview(null);
    setSectionImages({});
    setFormData({
      title: '',
      goal: '',
      hypothesis: '',
      actionTaken: '',
      result: '',
      whatWorked: '',
      keyInsight: '',
      context: '',
      whatWentWrong: '',
      rootCause: '',
      whatWouldDoDifferently: '',
      lesson: '',
      activities: '',
      wins: '',
      challenges: '',
      metrics: '',
      nextSteps: '',
      ask: '',
      situation: '',
      insight: '',
      whyItMatters: '',
      example: '',
      howToApply: '',
      stage: '',
      recentEvents: '',
      decisionsMade: '',
      struggles: '',
      currentFocus: '',
      reflection: ''
    });
  };

  if (!hasChannel) return null;

  // Template Selection Screen
  if (step === 'template') {
    return (
      <div className="template-selection-screen">
        <div className="template-selection-container">
          <div className="template-header">
            <h1>What are you sharing?</h1>
            <p>Turn your experience into reusable knowledge</p>
          </div>
          <div className="templates-grid">
            {Object.entries(templates).map(([id, template]) => (
              <button
                key={id}
                onClick={() => handleTemplateSelect(id)}
                className="template-option-card"
                style={{ '--template-color': template.color }}
              >
                <div className="template-option-icon">{template.icon}</div>
                <div className="template-option-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const template = templates[selectedTemplate];
  const previewHTML = generatePreviewHTML();
  
  return (
    <div className="structured-editor-screen">
      <div className="structured-editor-container">
        <div className="editor-header-bar">
          <button onClick={handleBack} className="back-btn">
            ← Back to Templates
          </button>
          <div className="template-badge" style={{ background: template.color + '20', color: template.color }}>
            {template.icon} {template.name}
          </div>
        </div>

        <div className="editor-with-preview">
          {/* Editor Section */}
          <div className="editor-section">
            <form onSubmit={handleSubmit} className="structured-form">
              {/* Cover Image Section */}
              <div className="cover-image-section-editor">
                <label className="section-label">📸 Cover Image</label>
                {coverImagePreview ? (
                  <div className="cover-preview-editor">
                    <img src={coverImagePreview} alt="Cover" />
                    <button type="button" onClick={() => { setCoverImage(null); setCoverImagePreview(null); }} className="remove-image-btn">
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label className="cover-upload-editor">
                    <span className="upload-icon">🖼️</span>
                    <span>Upload Cover Image</span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} hidden />
                  </label>
                )}
              </div>

              {/* Title Section - Updated placeholder */}
              <div className="form-title-section">
                <input
                  type="text"
                  className="form-title-input"
                  placeholder="What is this insight about?"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Fields with Image Upload */}
              {template.fields.map((field) => (
                <div key={field} className="form-section-with-image">
                  <label className="section-label">
                    {template.fieldLabels[field]}
                  </label>
                  <textarea
                    className="section-textarea"
                    placeholder={template.placeholders[field]}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    rows={field === 'metrics' || field === 'keyInsight' || field === 'lesson' || field === 'insight' ? 3 : 4}
                  />
                  
                  {sectionImages[field] ? (
                    <div className="section-image-preview">
                      <img src={sectionImages[field].preview} alt="Section" />
                      <button type="button" onClick={() => removeSectionImage(field)} className="remove-section-image">
                        ✕ Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="add-image-btn">
                      <span>+ Add Image</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSectionImageUpload(field, e)} hidden />
                    </label>
                  )}
                </div>
              ))}

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="secondary-btn">
                  Cancel
                </button>
                <button type="submit" className="publish-structured-btn" disabled={loading}>
                  {loading ? 'Sharing...' : '✨ Share Insight'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section - Updated header */}
          <div className="preview-section">
            <div className="preview-header">
              <h3>📘 Insight Preview</h3>
              <p>See how your learning will be structured</p>
            </div>
            <div className="preview-content-area">
              {previewHTML ? (
                <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
              ) : (
                <div className="preview-placeholder">
                  <span>✍️</span>
                  <p>Start writing to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal - Updated messaging */}
      {showCelebration && (
        <>
          <Confetti />
          <div className="modal-overlay">
            <div className="modal celebration-modal">
              <div className="celebration-icon">🎉</div>
              <h2>Insight Published 🎉</h2>
              <div className="points-earned">+{pointsEarned} Points Earned</div>
              <p>Your learning is now helping others</p>
              <button onClick={() => { setShowCelebration(false); navigate('/'); }} className="celebration-continue-btn">
                Continue to Feed →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreatePost;
