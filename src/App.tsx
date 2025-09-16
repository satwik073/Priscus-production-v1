import { useState } from 'react'
import { ProjectForm } from './components/ProjectForm'
import { ProjectAnalysis } from './components/ProjectAnalysis'
import { KanbanBoard } from './components/KanbanBoard'
import { WorkflowVisualization } from './components/WorkflowVisualization'
import { ProjectManagement } from './components/ProjectManagement'
import { ProjectDetails } from './components/ProjectDetails'
import { MCPDashboard } from './components/MCPDashboard'
import './App.css'

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
  const [currentStep, setCurrentStep] = useState<'projects' | 'form' | 'analysis' | 'kanban' | 'workflow' | 'project-details' | 'mcp'>('projects')
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null)
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const handleProjectSubmit = async (data: ProjectData) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/analyze-project', {
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
      const response = await fetch('http://localhost:4000/api/generate-kanban', {
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
      const response = await fetch('http://localhost:4000/api/generate-workflow', {
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Project Analyzer</h1>
        <p>Transform your project ideas into actionable plans</p>
      </header>

      <nav className="step-navigation">
        <button 
          className={currentStep === 'projects' ? 'active' : ''}
          onClick={() => setCurrentStep('projects')}
        >
          📁 Projects
        </button>
        <button 
          className={currentStep === 'form' ? 'active' : ''}
          onClick={() => setCurrentStep('form')}
        >
          ➕ New Project
        </button>
        <button 
          className={currentStep === 'mcp' ? 'active' : ''}
          onClick={() => setCurrentStep('mcp')}
        >
          🤖 MCP Dashboard
        </button>
        {currentStep === 'project-details' && selectedProject && (
          <button 
            className="active"
            onClick={() => setCurrentStep('project-details')}
          >
            📊 {selectedProject.title}
          </button>
        )}
      </nav>

      <main className="app-main">
        {loading && <div className="loading">Loading...</div>}
        
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
            loading={loading}
          />
        )}
        
        {currentStep === 'kanban' && kanbanData && (
          <KanbanBoard data={kanbanData} />
        )}
        
        {currentStep === 'workflow' && workflowData && (
          <WorkflowVisualization data={workflowData} />
        )}
        
        {currentStep === 'project-details' && selectedProject && (
          <ProjectDetails 
            project={selectedProject}
            onBack={() => setCurrentStep('projects')}
            onProjectUpdate={(updatedProject) => {
              setSelectedProject(updatedProject)
              // Update the project in the projects list
              setProjects((prev: any) => prev.map((p: Project) => p._id === updatedProject._id ? updatedProject : p))
            }}
          />
        )}
        
        {currentStep === 'mcp' && (
          <MCPDashboard onBack={() => setCurrentStep('projects')} />
        )}
      </main>
    </div>
  )
}

export default App
