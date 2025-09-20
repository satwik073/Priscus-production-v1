import { useState } from 'react'
import { ProjectForm } from './components/ProjectForm'
import { ProjectAnalysis } from './components/ProjectAnalysis'
import { KanbanBoard } from './components/KanbanBoard'
import { WorkflowVisualization } from './components/WorkflowVisualization'
import { ProjectManagement } from './components/ProjectManagement'
import { ProjectDetails } from './components/ProjectDetails'
import { MCPDashboard } from './components/MCPDashboard'
import { UIDesignGenerator } from './components/UIDesignGenerator'
import { generateUIDesign, getMockUIDesign } from './services/uiDesignService'
import type { DesignData } from './services/uiDesignService'

interface ProjectData {
  title: string
  description: string
}

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

interface KanbanData {
  pipelines: Array<{
    id: string
    name: string
    color: string
  }>
  tasks: Array<{
    id: string
    title: string
    description: string
    pipeline: string
    priority: string
    estimatedHours: number
    userStory: string
  }>
}

interface WorkflowData {
  technicalWorkflow: {
    nodes: Array<{
      id: string
      type: string
      position: { x: number; y: number }
      data: { 
        label: string
        description: string
        details: string[]
        technologies: string[]
        estimatedTime: string
        dependencies: string[]
      }
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      label: string
      type: string
    }>
  }
  userWorkflow: {
    nodes: Array<{
      id: string
      type: string
      position: { x: number; y: number }
      data: {
        label: string
        description: string
        userActions: string[]
        systemResponses: string[]
        painPoints: string[]
        successMetrics: string[]
      }
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      label: string
      condition?: string
    }>
  }
  schemaDiagram: {
    entities: Array<{
      name: string
      fields: Array<{
        name: string
        type: string
        required: boolean
        description: string
        constraints?: string[]
      }>
      relationships: Array<{
        target: string
        type: string
        description: string
      }>
      position: { x: number; y: number }
    }>
    relationships: Array<{
      id: string
      source: string
      target: string
      type: string
      label: string
    }>
  }
}

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

function App() {
  const [currentStep, setCurrentStep] = useState<'projects' | 'form' | 'analysis' | 'kanban' | 'workflow' | 'ui-design' | 'project-details' | 'mcp'>('projects')
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null)
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null)
  const [uiDesignData, setUiDesignData] = useState<DesignData | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const handleProjectSubmit = async (data: ProjectData) => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/analyze-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (result.success) {
        setProjectData(data)
        setProjectId(result.projectId)
        setAnalysisData(result.data)
        setCurrentStep('analysis')
      }
    } catch (error) {
      console.error('Error analyzing project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateKanban = async () => {
    if (!analysisData || !projectId || !projectData) return
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-kanban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          analysis: analysisData, 
          projectId,
          title: projectData.title,
          description: projectData.description
        })
      })
      const result = await response.json()
      if (result.success) {
        setKanbanData(result.data)
        setCurrentStep('kanban')
      }
    } catch (error) {
      console.error('Error generating kanban:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateWorkflow = async () => {
    if (!analysisData || !projectId || !projectData) return
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          analysis: analysisData, 
          projectId,
          title: projectData.title,
          description: projectData.description
        })
      })
      const result = await response.json()
      if (result.success) {
        setWorkflowData(result.data)
        setCurrentStep('workflow')
      }
    } catch (error) {
      console.error('Error generating workflow:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGenerateUIDesign = async () => {
    if (!projectId || !projectData) return
    setLoading(true)
    try {
      const design = await generateUIDesign(
        projectData.title,
        projectData.description,
        projectId
      )
      setUiDesignData(design)
      setCurrentStep('ui-design')
    } catch (error) {
      console.error('Error generating UI design:', error)
      // Since our service now falls back to mock data, this catch block should rarely be reached
      // But if it does, we'll show a user-friendly message
      alert('Could not generate UI design. Using sample design instead.')
      
      // Get mock data as fallback if the service throws an error
      const mockDesign = getMockUIDesign()
      setUiDesignData(mockDesign)
      setCurrentStep('ui-design')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary">
      {/* Modern Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark-text-primary">Priscus</h1>
              <p className="text-dark-text-secondary text-sm">AI-Powered Project Management</p>
            </div>
            
            {/* Navigation Pills */}
            <nav className="flex items-center space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 'projects' 
                    ? 'bg-accent-orange text-white' 
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-hover'
                }`}
                onClick={() => setCurrentStep('projects')}
              >
                📁 Projects
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 'form' 
                    ? 'bg-accent-orange text-white' 
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-hover'
                }`}
                onClick={() => setCurrentStep('form')}
              >
                ➕ New Project
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 'mcp' 
                    ? 'bg-accent-orange text-white' 
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-hover'
                }`}
                onClick={() => setCurrentStep('mcp')}
              >
                🤖 MCP Dashboard
              </button>
              {currentStep === 'project-details' && selectedProject && (
                <button 
                  className="bg-accent-blue text-white px-4 py-2 rounded-lg font-medium"
                  onClick={() => setCurrentStep('project-details')}
                >
                  📊 {selectedProject.title}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange mx-auto mb-4"></div>
              <p className="text-dark-text-secondary">Loading...</p>
            </div>
          </div>
        )}
        
        <div className="animate-fade-in">
          {currentStep === 'projects' && (
            <ProjectManagement 
              onSelectProject={(project) => {
                setSelectedProject(project)
                setCurrentStep('project-details')
              }}
              selectedProject={selectedProject}
              projects={projects}
              setProjects={setProjects}
            />
          )}
          
          {currentStep === 'form' && (
            <ProjectForm onSubmit={handleProjectSubmit} loading={loading} />
          )}
          
          {currentStep === 'analysis' && analysisData && (
            <ProjectAnalysis 
              data={analysisData} 
              onGenerateKanban={handleGenerateKanban}
              onGenerateWorkflow={handleGenerateWorkflow}
              onGenerateUIDesign={handleGenerateUIDesign}
              loading={loading}
            />
          )}
          
          {currentStep === 'kanban' && kanbanData && (
            <KanbanBoard data={kanbanData} />
          )}
          
          {currentStep === 'workflow' && workflowData && (
            <WorkflowVisualization data={workflowData} />
          )}
          
          {currentStep === 'ui-design' && projectData && (
            <UIDesignGenerator 
              projectTitle={projectData.title}
              projectDescription={projectData.description}
              loading={loading}
              onGenerateDesign={handleGenerateUIDesign}
              designData={uiDesignData ? {
              ...uiDesignData,
              designElements: uiDesignData.designElements?.map(el => ({
                ...el,
                color: el.color || undefined
              }))
            } : undefined}
            />
          )}
          
          {currentStep === 'project-details' && selectedProject && (
            <ProjectDetails 
              project={selectedProject}
              onBack={() => setCurrentStep('projects')}
              onProjectUpdate={(updatedProject) => {
                setSelectedProject(updatedProject)
                setProjects((prev: any) => prev.map((p: Project) => p._id === updatedProject._id ? updatedProject : p))
              }}
            />
          )}
          
          {currentStep === 'mcp' && (
            <MCPDashboard onBack={() => setCurrentStep('projects')} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
