import { useState } from 'react'
import { ProjectAnalysis } from './ProjectAnalysis'
import { KanbanBoard } from './KanbanBoard'
import { WorkflowVisualization } from './WorkflowVisualization'
import DatabaseFlow from './DatabaseFlow'

interface Project {
  _id: string
  title: string
  description: string
  analysis?: any
  kanban?: any
  workflow?: any
  createdAt: string
  updatedAt: string
}

interface ProjectDetailsProps {
  project: Project
  onBack: () => void
  onProjectUpdate?: (updatedProject: Project) => void
}

export function ProjectDetails({ project, onBack, onProjectUpdate }: ProjectDetailsProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'analysis' | 'kanban' | 'workflow' | 'database'>('overview')
  const [loading, setLoading] = useState(false)
  const [currentProject, setCurrentProject] = useState(project)

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const handleGenerateKanban = async () => {
    if (!currentProject.analysis) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/generate-kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis: currentProject.analysis,
          projectId: currentProject._id,
          title: currentProject.title,
          description: currentProject.description
        })
      })
      const result = await response.json()
      if (result.success) {
        const updatedProject = { ...currentProject, kanban: result.data }
        setCurrentProject(updatedProject)
        onProjectUpdate?.(updatedProject)
        setCurrentView('kanban')
      }
    } catch (error) {
      console.error('Error generating kanban:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateWorkflow = async () => {
    if (!currentProject.analysis) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis: currentProject.analysis,
          projectId: currentProject._id,
          title: currentProject.title,
          description: currentProject.description
        })
      })
      const result = await response.json()
      if (result.success) {
        const updatedProject = { ...currentProject, workflow: result.data }
        setCurrentProject(updatedProject)
        onProjectUpdate?.(updatedProject)
        setCurrentView('workflow')
      }
    } catch (error) {
      console.error('Error generating workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = () => (
    <div className="project-overview">
      <div className="project-header">
        <h2>{currentProject.title}</h2>
        <p className="project-description">{currentProject.description}</p>
      </div>

      {currentProject.analysis && (
        <div className="analysis-summary">
          <h3>Analysis Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-title">Overall Score</div>
              <div className="summary-value" style={{ color: getScoreColor(currentProject.analysis.score) }}>
                {currentProject.analysis.score}/100
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-title">Pillars Analyzed</div>
              <div className="summary-value">{currentProject.analysis.pillars?.length || 0}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-title">Features Suggested</div>
              <div className="summary-value">{currentProject.analysis.features?.length || 0}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-title">Recommendations</div>
              <div className="summary-value">{currentProject.analysis.recommendations?.length || 0}</div>
            </div>
          </div>
        </div>
      )}

      <div className="project-status">
        <h3>Project Status</h3>
        <div className="status-grid">
          <div className={`status-item ${currentProject.analysis ? 'completed' : 'pending'}`}>
            <div className="status-icon">📊</div>
            <div className="status-text">
              <div className="status-title">Analysis</div>
              <div className="status-desc">Project evaluation and scoring</div>
            </div>
          </div>
          
          <div className={`status-item ${currentProject.kanban ? 'completed' : 'pending'}`}>
            <div className="status-icon">📋</div>
            <div className="status-text">
              <div className="status-title">Kanban Board</div>
              <div className="status-desc">Task management and planning</div>
            </div>
          </div>
          
          <div className={`status-item ${currentProject.workflow ? 'completed' : 'pending'}`}>
            <div className="status-icon">🔄</div>
            <div className="status-text">
              <div className="status-title">Workflow</div>
              <div className="status-desc">System architecture and flow</div>
            </div>
          </div>
        </div>
      </div>

      <div className="project-actions">
        <button 
          className="action-btn primary"
          onClick={() => setCurrentView('analysis')}
          disabled={!currentProject.analysis}
        >
          View Analysis
        </button>
        
        {currentProject.kanban ? (
          <button 
            className="action-btn secondary"
            onClick={() => setCurrentView('kanban')}
          >
            View Kanban
          </button>
        ) : (
          <button 
            className="action-btn generate"
            onClick={handleGenerateKanban}
            disabled={!currentProject.analysis || loading}
          >
            {loading ? 'Generating...' : 'Generate Kanban'}
          </button>
        )}
        
        {currentProject.workflow ? (
          <button 
            className="action-btn secondary"
            onClick={() => setCurrentView('workflow')}
          >
            View Workflow
          </button>
        ) : (
          <button 
            className="action-btn generate"
            onClick={handleGenerateWorkflow}
            disabled={!currentProject.analysis || loading}
          >
            {loading ? 'Generating...' : 'Generate Workflow'}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="project-details">
      <div className="project-nav">
        <button className="back-btn" onClick={onBack}>
          ← Back to Projects
        </button>
        
        <div className="view-tabs">
          <button 
            className={currentView === 'overview' ? 'active' : ''}
            onClick={() => setCurrentView('overview')}
          >
            Overview
          </button>
          <button 
            className={currentView === 'analysis' ? 'active' : ''}
            onClick={() => setCurrentView('analysis')}
            disabled={!currentProject.analysis}
          >
            Analysis
          </button>
          <button 
            className={currentView === 'kanban' ? 'active' : ''}
            onClick={() => setCurrentView('kanban')}
            disabled={!currentProject.kanban}
          >
            Kanban
          </button>
          <button 
            className={currentView === 'workflow' ? 'active' : ''}
            onClick={() => setCurrentView('workflow')}
            disabled={!currentProject.workflow}
          >
            Workflow
          </button>
          <button 
            className={currentView === 'database' ? 'active' : ''}
            onClick={() => setCurrentView('database')}
          >
            Database
          </button>
        </div>
      </div>

      <div className="project-content">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'analysis' && currentProject.analysis && (
          <ProjectAnalysis 
            data={currentProject.analysis} 
            onGenerateKanban={handleGenerateKanban}
            onGenerateWorkflow={handleGenerateWorkflow}
            loading={loading}
          />
        )}
        {currentView === 'kanban' && currentProject.kanban && (
          <KanbanBoard data={currentProject.kanban} />
        )}
        {currentView === 'workflow' && currentProject.workflow && (
          <WorkflowVisualization data={currentProject.workflow} />
        )}
        {currentView === 'database' && (
          <DatabaseFlow />
        )}
      </div>
    </div>
  )
}
