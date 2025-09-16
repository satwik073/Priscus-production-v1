import { useState, useEffect } from 'react'

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

interface ProjectManagementProps {
  onSelectProject: (project: Project) => void
  selectedProject: Project | null
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export function ProjectManagement({ onSelectProject, selectedProject, projects, setProjects }: ProjectManagementProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:4000/api/projects')
      const result = await response.json()
      
      if (result.success) {
        setProjects(result.data)
      } else {
        setError('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId))
        if (selectedProject?._id === projectId) {
          onSelectProject(null as any)
        }
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="project-management">
        <div className="loading">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="project-management">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="project-management">
      <div className="projects-header">
        <h2>Your Projects</h2>
        <p>Click on a project to view its details, kanban board, and workflow</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <div className="no-projects-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started with AI-powered analysis and planning</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className={`project-card ${selectedProject?._id === project._id ? 'selected' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <div className="project-card-header">
                <h3 className="project-title">{project.title}</h3>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project._id)
                  }}
                >
                  🗑️
                </button>
              </div>
              
              <p className="project-description">
                {project.description.length > 100 
                  ? `${project.description.substring(0, 100)}...` 
                  : project.description
                }
              </p>
              
              <div className="project-meta">
                <div className="project-status">
                  <span className="status-indicator">
                    {project.analysis ? '✅' : '⏳'} Analysis
                  </span>
                  <span className="status-indicator">
                    {project.kanban ? '✅' : '⏳'} Kanban
                  </span>
                  <span className="status-indicator">
                    {project.workflow ? '✅' : '⏳'} Workflow
                  </span>
                </div>
                
                <div className="project-dates">
                  <small>Created: {formatDate(project.createdAt)}</small>
                  <small>Updated: {formatDate(project.updatedAt)}</small>
                </div>
              </div>
              
              {project.analysis && (
                <div className="project-score">
                  <div className="score-circle">
                    <span className="score-number">{project.analysis.score}</span>
                    <span className="score-label">Score</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
