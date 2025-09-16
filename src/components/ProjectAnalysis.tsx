interface AnalysisData {
  score: number
  pillars: Array<{
    name: string
    score: number
    feedback: string
  }>
  advantages: string[]
  disadvantages: string[]
  features: string[]
  recommendations: string[]
}

interface ProjectAnalysisProps {
  data: AnalysisData
  onGenerateKanban: () => void
  onGenerateWorkflow: () => void
  loading: boolean
}

export function ProjectAnalysis({ data, onGenerateKanban, onGenerateWorkflow, loading }: ProjectAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="project-analysis">
      <div className="analysis-header">
        <h2>Project Analysis Results</h2>
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: getScoreColor(data.score) }}>
            <span className="score-number">{data.score}</span>
            <span className="score-label">Overall Score</span>
          </div>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>Pillar Analysis</h3>
          <div className="pillars">
            {data.pillars.map((pillar, index) => (
              <div key={index} className="pillar">
                <div className="pillar-header">
                  <span className="pillar-name">{pillar.name}</span>
                  <span className="pillar-score" style={{ color: getScoreColor(pillar.score) }}>
                    {pillar.score}%
                  </span>
                </div>
                <div className="pillar-bar">
                  <div 
                    className="pillar-fill" 
                    style={{ 
                      width: `${pillar.score}%`, 
                      backgroundColor: getScoreColor(pillar.score) 
                    }}
                  />
                </div>
                <p className="pillar-feedback">{pillar.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3>Advantages</h3>
          <ul className="pros-cons">
            {data.advantages.map((advantage, index) => (
              <li key={index} className="pro">✓ {advantage}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Challenges</h3>
          <ul className="pros-cons">
            {data.disadvantages.map((disadvantage, index) => (
              <li key={index} className="con">⚠ {disadvantage}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Suggested Features</h3>
          <div className="features">
            {data.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3>Recommendations</h3>
          <ul className="recommendations">
            {data.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="analysis-actions">
        <button 
          onClick={onGenerateKanban} 
          disabled={loading}
          className="action-button primary"
        >
          {loading ? 'Generating...' : 'Generate Kanban Board'}
        </button>
        <button 
          onClick={onGenerateWorkflow} 
          disabled={loading}
          className="action-button secondary"
        >
          {loading ? 'Generating...' : 'Generate Workflow'}
        </button>
      </div>
    </div>
  )
}

