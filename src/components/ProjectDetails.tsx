import { useState } from 'react'
import { ArrowLeft, FileText, MessageSquare, CheckSquare, Calendar, User, Clock, Star, Plus, ExternalLink, Trash2, Edit3 } from 'lucide-react'
import { ProjectAnalysis } from './ProjectAnalysis'
import { KanbanBoard } from './KanbanBoard'
import { WorkflowVisualization } from './WorkflowVisualization'

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

// Mock data for demonstration - in real app this would come from API
const mockFiles = [
  {
    id: '1',
    name: 'Project Analysis.pdf',
    type: 'pdf',
    size: '2.4 MB',
    lastModified: '2 days ago',
    sharedWith: 'Marketing team',
    isStarred: false
  },
  {
    id: '2', 
    name: 'UI Wireframes.fig',
    type: 'figma',
    size: '1.8 MB',
    lastModified: '3 days ago',
    sharedWith: 'Design team',
    isStarred: true
  },
  {
    id: '3',
    name: 'Technical Specs.doc',
    type: 'doc',
    size: '856 KB', 
    lastModified: '1 week ago',
    sharedWith: 'Dev team',
    isStarred: false
  }
]

const mockNotes = [
  {
    id: '1',
    title: 'Design exploration ideas',
    content: 'Thinking of going bolder this time — mix of card orange & teal? Might tone down the gradients. Flat hues felt more timeless in past tests...',
    author: 'Elvor Varinsdottir',
    date: 'Apr 15',
    tags: ['design', 'ui']
  },
  {
    id: '2',
    title: 'Feedback: UX test (Design Round...)',
    content: 'Users hesitated at the "Start Free Trial" wording — consider "Try it Free" instead. Scroll performance on mobile felt choppy during onboarding – test after asset optimization...',
    author: 'Project team',
    date: 'Apr 12',
    tags: ['feedback', 'ux']
  }
]

const mockTasks = [
  {
    id: '1',
    title: 'Review design tokens with frontend team',
    dueDate: 'May 21',
    assignee: 'Sasha Green',
    status: 'In Progress',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Finalize design specs for dev handoff',
    dueDate: 'May 23',
    assignee: 'Alex Chen',
    status: 'Todo',
    priority: 'medium'
  }
]

export function ProjectDetails({ project, onBack, onProjectUpdate }: ProjectDetailsProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'analysis' | 'kanban' | 'workflow' | 'database'>('overview')
  const [loading, setLoading] = useState(false)
  const [currentProject, setCurrentProject] = useState(project)
  const [searchQuery, setSearchQuery] = useState('')

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-green'
    if (score >= 60) return 'text-accent-yellow'
    return 'text-red-400'
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'figma': return '🎨'
      case 'doc': return '📝'
      default: return '📁'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'status-badge in-progress'
      case 'completed': return 'status-badge completed'
      case 'todo': return 'status-badge pending'
      default: return 'status-badge'
    }
  }

  const handleGenerateKanban = async () => {
    if (!currentProject.analysis) return
    
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-kanban`, {
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
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-workflow`, {
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
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="glass-card p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search files, notes, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full text-lg py-3"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="flex items-center gap-2 mt-4">
          <button className="filter-button active">
            <FileText className="w-4 h-4 mr-2" />
            All
          </button>
          <button className="filter-button">
            <Calendar className="w-4 h-4 mr-2" />
            Recent
          </button>
          <button className="filter-button">
            <User className="w-4 h-4 mr-2" />
            Shared
          </button>
          <button className="filter-button">
            <Star className="w-4 h-4 mr-2" />
            Starred
          </button>
        </div>
      </div>

      {/* Files Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Files
          </h3>
          <button className="secondary-button flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add File
          </button>
        </div>
        
        <div className="space-y-3">
          {mockFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 hover:bg-dark-hover rounded-lg transition-colors group">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-dark-text-primary">{file.name}</h4>
                    {file.isStarred && <Star className="w-4 h-4 text-accent-yellow fill-current" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-dark-text-muted">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Last modified: {file.lastModified}</span>
                    {file.sharedWith && (
                      <>
                        <span>•</span>
                        <span>Shared with: {file.sharedWith}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-dark-card rounded-lg text-dark-text-muted hover:text-accent-blue">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-dark-card rounded-lg text-dark-text-muted hover:text-accent-orange">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-dark-card rounded-lg text-dark-text-muted hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes
          </h3>
          <button className="secondary-button flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockNotes.map((note) => (
            <div key={note.id} className="glass-card p-4 hover:bg-dark-hover transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-dark-text-primary line-clamp-1">{note.title}</h4>
                <button className="text-dark-text-muted hover:text-accent-orange">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-dark-text-secondary text-sm mb-4 line-clamp-3">
                {note.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-dark-text-muted">
                  <User className="w-3 h-3" />
                  <span>{note.author}</span>
                  <span>•</span>
                  <span>{note.date}</span>
                </div>
                
                <div className="flex gap-1">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-accent-orange/20 text-accent-orange text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Tasks
          </h3>
          <button className="secondary-button flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
        
        <div className="space-y-3">
          {mockTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 hover:bg-dark-hover rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded border-2 border-dark-border hover:border-accent-orange cursor-pointer"></div>
                <div>
                  <h4 className="font-medium text-dark-text-primary">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-dark-text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {task.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.assignee}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={getStatusColor(task.status)}>
                  {task.status}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-400' :
                  task.priority === 'medium' ? 'bg-accent-yellow' :
                  'bg-accent-green'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Analysis Summary */}
      {currentProject.analysis && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-card rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(currentProject.analysis.score)}`}>
                {currentProject.analysis.score}
              </div>
              <div className="text-dark-text-muted text-sm">Overall Score</div>
            </div>
            <div className="text-center p-4 bg-dark-card rounded-lg">
              <div className="text-2xl font-bold text-dark-text-primary">
                {currentProject.analysis.pillars?.length || 0}
              </div>
              <div className="text-dark-text-muted text-sm">Pillars</div>
            </div>
            <div className="text-center p-4 bg-dark-card rounded-lg">
              <div className="text-2xl font-bold text-dark-text-primary">
                {currentProject.analysis.features?.length || 0}
              </div>
              <div className="text-dark-text-muted text-sm">Features</div>
            </div>
            <div className="text-center p-4 bg-dark-card rounded-lg">
              <div className="text-2xl font-bold text-dark-text-primary">
                {currentProject.analysis.recommendations?.length || 0}
              </div>
              <div className="text-dark-text-muted text-sm">Recommendations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="secondary-button flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          
          {/* View Tabs */}
          <div className="flex items-center gap-2">
            <button 
              className={`filter-button ${currentView === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentView('overview')}
            >
              Overview
            </button>
            <button 
              className={`filter-button ${currentView === 'analysis' ? 'active' : ''}`}
              onClick={() => setCurrentView('analysis')}
              disabled={!currentProject.analysis}
            >
              Analysis
            </button>
            <button 
              className={`filter-button ${currentView === 'kanban' ? 'active' : ''}`}
              onClick={() => setCurrentView('kanban')}
              disabled={!currentProject.kanban}
            >
              Kanban
            </button>
            <button 
              className={`filter-button ${currentView === 'workflow' ? 'active' : ''}`}
              onClick={() => setCurrentView('workflow')}
              disabled={!currentProject.workflow}
            >
              Workflow
            </button>
          </div>
        </div>
        
        {/* Project Info */}
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">{currentProject.title}</h1>
          <p className="text-dark-text-secondary text-lg">{currentProject.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-dark-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created: {new Date(currentProject.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Updated: {new Date(currentProject.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'analysis' && currentProject.analysis && (
          <ProjectAnalysis 
            data={currentProject.analysis} 
            onGenerateKanban={handleGenerateKanban}
            onGenerateWorkflow={handleGenerateWorkflow}
            onGenerateUIDesign={() => {}}
            loading={loading}
          />
        )}
        {currentView === 'kanban' && currentProject.kanban && (
          <KanbanBoard data={currentProject.kanban} />
        )}
        {currentView === 'workflow' && currentProject.workflow && (
          <WorkflowVisualization 
            data={currentProject.workflow} 
            projectTitle={currentProject.title}
            projectDescription={currentProject.description}
            analysis={currentProject.analysis}
          />
        )}
      </div>
    </div>
  )
}