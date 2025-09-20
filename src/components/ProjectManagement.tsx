import { useState, useEffect } from 'react'
import { Search, Filter, X, Plus, Trash2, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/projects`)
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

  const handleDeleteProject = async (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/projects/${projectId}`, {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)}w ago`
    return `${Math.floor(diffInHours / 720)}mo ago`
  }

  const getProjectIcon = (project: Project) => {
    if (project.analysis && project.kanban && project.workflow) return '📊'
    if (project.analysis) return '📋'
    return '📁'
  }

  const getProjectStatus = (project: Project) => {
    if (project.analysis && project.kanban && project.workflow) return 'completed'
    if (project.analysis) return 'in-progress'
    return 'pending'
  }

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (filterType === 'all') return matchesSearch
      if (filterType === 'completed') return matchesSearch && project.analysis && project.kanban && project.workflow
      if (filterType === 'in-progress') return matchesSearch && project.analysis && (!project.kanban || !project.workflow)
      if (filterType === 'pending') return matchesSearch && !project.analysis
      
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark-text-primary">Projects</h2>
            <p className="text-dark-text-secondary">Manage and organize your AI-powered projects</p>
          </div>
          <button 
            onClick={() => window.location.href = '#new'}
            className="modern-button flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-button ${showFilters ? 'active' : ''} flex items-center gap-2`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              {['all', 'completed', 'in-progress', 'pending'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`filter-button ${filterType === filter ? 'active' : ''} capitalize`}
                >
                  {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-button"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-dark-text-primary mb-2">
            {searchQuery ? 'No matching projects' : 'No projects yet'}
          </h3>
          <p className="text-dark-text-secondary mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or filters' 
              : 'Create your first project to get started with AI-powered analysis and planning'
            }
          </p>
          {!searchQuery && (
            <button 
              onClick={() => window.location.href = '#new'}
              className="modern-button flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <div 
              key={project._id} 
              className="project-card group relative overflow-hidden"
              onClick={() => onSelectProject(project)}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getProjectIcon(project)}</div>
                  <div>
                    <h3 className="font-semibold text-dark-text-primary line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(project.updatedAt)}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectProject(project)
                    }}
                    className="p-1 hover:bg-dark-hover rounded text-dark-text-muted hover:text-accent-blue"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProject(project._id, e)}
                    className="p-1 hover:bg-dark-hover rounded text-dark-text-muted hover:text-red-400"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Project Description */}
              <p className="text-dark-text-secondary text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Status Indicators */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`status-badge ${getProjectStatus(project)}`}>
                  {getProjectStatus(project) === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {getProjectStatus(project) === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                  {getProjectStatus(project) === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {getProjectStatus(project).replace('-', ' ')}
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 ${project.analysis ? 'text-accent-green' : 'text-dark-text-muted'}`}>
                    {project.analysis ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-dark-border" />}
                    Analysis
                  </span>
                  <span className={`flex items-center gap-1 ${project.kanban ? 'text-accent-green' : 'text-dark-text-muted'}`}>
                    {project.kanban ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-dark-border" />}
                    Kanban
                  </span>
                  <span className={`flex items-center gap-1 ${project.workflow ? 'text-accent-green' : 'text-dark-text-muted'}`}>
                    {project.workflow ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-dark-border" />}
                    Workflow
                  </span>
                </div>
                
                <div className="text-dark-text-muted">
                  {formatDate(project.createdAt)}
                </div>
              </div>

              {/* Score Badge */}
              {project.analysis && (
                <div className="absolute top-4 right-4 bg-accent-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                  {project.analysis.score}
                </div>
              )}

              {/* Selected Indicator */}
              {selectedProject?._id === project._id && (
                <div className="absolute inset-0 border-2 border-accent-orange rounded-xl pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {projects.length > 0 && (
        <div className="text-center text-dark-text-muted text-sm">
          Showing {filteredAndSortedProjects.length} of {projects.length} projects
        </div>
      )}
    </div>
  )
}