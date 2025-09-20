import { useState, useEffect } from 'react';
import './UIDesignGenerator.css';

interface UIDesignGeneratorProps {
  projectTitle: string;
  projectDescription: string;
  loading: boolean;
  onGenerateDesign: () => void;
  designData?: {
    figmaLink?: string;
    previewImages?: string[];
    designDescription?: string;
    designElements?: {
      name: string;
      description: string;
      color?: string;
    }[];
  };
}

export function UIDesignGenerator({
  projectTitle,
  projectDescription,
  loading,
  onGenerateDesign,
  designData
}: UIDesignGeneratorProps) {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (designData?.previewImages && designData.previewImages.length > 0) {
      setSelectedPreview(designData.previewImages[0]);
    }
  }, [designData]);

  return (
    <div className="ui-design-container">
      <div className="ui-design-header">
        <h2>AI-Generated UI Design</h2>
        <p>Visualize your project with AI-generated Figma designs based on your project description</p>
        <div className="ui-design-subheader">
          <span>Project: {projectTitle}</span>
          <span>|</span>
          <span>Status: <span className="connection-highlight">Active</span></span>
        </div>
      </div>

      {!designData ? (
        <div className="ui-design-generator">
          <div className="design-info">
            <h3>Generate UI Design</h3>
            <p>Let AI create a Figma design for your project based on:</p>
            <div className="project-requirements">
              <div className="requirement-item">
                <span className="requirement-icon">🎯</span>
                <div className="requirement-content">
                  <span className="requirement-title">Project Title</span>
                  <p className="requirement-value">{projectTitle}</p>
                </div>
              </div>
              <div className="requirement-item">
                <span className="requirement-icon">📝</span>
                <div className="requirement-content">
                  <span className="requirement-title">Project Description</span>
                  <p className="requirement-value">{projectDescription}</p>
                </div>
              </div>
            </div>
            <button 
              className="generate-design-btn" 
              onClick={onGenerateDesign}
              disabled={loading}
            >
              {loading ? 'Generating Design...' : 'Generate UI Design'}
            </button>
          </div>
          <div className="design-placeholder">
            <div className="placeholder-content">
              {loading ? (
                <>
                  <div className="loading-animation">
                    <div className="loading-spinner"></div>
                  </div>
                  <h3>Generating Your Design</h3>
                  <p>Our AI is creating a beautiful design tailored to your project...</p>
                </>
              ) : (
                <>
                  <span className="placeholder-icon">🎨</span>
                  <h3>Your Design Will Appear Here</h3>
                  <p>AI will generate a professional UI design based on your project details</p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="ui-design-content">
          <div className="design-preview">
            <div className="design-preview-header">
              <h3>Design Preview</h3>
              {designData.figmaLink && (
                <a href={designData.figmaLink} target="_blank" rel="noopener noreferrer" className="figma-link">
                  Open in Figma <span className="external-link-icon">↗</span>
                </a>
              )}
            </div>
            <div className="preview-image-container">
              {selectedPreview ? (
                <img src={selectedPreview} alt="UI Design Preview" className="preview-image" />
              ) : (
                <div className="preview-placeholder">
                  <span>Preview not available</span>
                </div>
              )}
            </div>
            {designData.previewImages && designData.previewImages.length > 1 && (
              <div className="preview-thumbnails">
                {designData.previewImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`preview-thumbnail ${selectedPreview === image ? 'active' : ''}`}
                    onClick={() => setSelectedPreview(image)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="design-details">
            <div className="details-section">
              <h3>Design Concept</h3>
              <p className="design-description">{designData.designDescription}</p>
            </div>
            {designData.designElements && designData.designElements.length > 0 && (
              <div className="details-section">
                <h3>Design Elements</h3>
                <div className="design-elements">
                  {designData.designElements.map((element, index) => (
                    <div key={index} className="design-element">
                      <div className="element-header">
                        <span className="element-name">{element.name}</span>
                        {element.color && (
                          <span 
                            className="element-color" 
                            style={{ backgroundColor: element.color }}
                            title={element.color}
                          ></span>
                        )}
                      </div>
                      <p className="element-description">{element.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
