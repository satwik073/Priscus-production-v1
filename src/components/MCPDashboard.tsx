import { useState, useEffect } from 'react';
import { mcpService, type MCPProject, type MCPTool } from '../services/mcpService';

interface MCPDashboardProps {
  onBack: () => void;
}

export function MCPDashboard({ onBack }: MCPDashboardProps) {
  const [projects, setProjects] = useState<MCPProject[]>([]);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [selectedProject, setSelectedProject] = useState<MCPProject | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mcpStatus, setMcpStatus] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'tools' | 'actions'>('projects');
  const [actionResult, setActionResult] = useState<string>('');

  useEffect(() => {
    checkMCPServerStatus();
    loadProjects();
    loadTools();
  }, []);

  const checkMCPServerStatus = async () => {
    const status = await mcpService.checkMCPServerStatus();
    setMcpStatus(status);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectList = await mcpService.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTools = async () => {
    try {
      const toolList = await mcpService.getAvailableTools();
      setTools(toolList);
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  const handleProjectSelect = async (project: MCPProject) => {
    setSelectedProject(project);
    setLoading(true);
    try {
      const details = await mcpService.getProjectDetails(project.id);
      setProjectDetails(details);
    } catch (error) {
      console.error('Error loading project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTask = async (taskId: string, newPipeline: string) => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const result = await mcpService.moveKanbanTask(selectedProject.id, taskId, newPipeline);
      setActionResult(result);
      // Reload project details
      await handleProjectSelect(selectedProject);
    } catch (error) {
      setActionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async (taskId: string, fileName: string, fileContent: string, fileType: string) => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const result = await mcpService.createCodeFile(selectedProject.id, taskId, fileName, fileContent, fileType);
      setActionResult(result);
    } catch (error) {
      setActionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCodebase = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const result = await mcpService.analyzeCodebase(selectedProject.id);
      setActionResult(result);
    } catch (error) {
      setActionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderProjects = () => (
    <div className="mcp-projects">
      <div className="mcp-header">
        <h2>MCP Projects</h2>
        <div className={`mcp-status ${mcpStatus ? 'connected' : 'disconnected'}`}>
          {mcpStatus ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      <div className="project-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
            onClick={() => handleProjectSelect(project)}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-status">
              <span className={`status ${project.hasAnalysis ? 'active' : 'inactive'}`}>
                📊 Analysis
              </span>
              <span className={`status ${project.hasKanban ? 'active' : 'inactive'}`}>
                📋 Kanban
              </span>
              <span className={`status ${project.hasWorkflow ? 'active' : 'inactive'}`}>
                🔄 Workflow
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectDetails = () => {
    if (!selectedProject || !projectDetails) return null;

    const detailsText = projectDetails.content?.[0]?.text || '';
    const lines = detailsText.split('\n');
    
    // Extract task IDs and details for the actions section
    // const taskLines = lines.filter((line: string) => line.includes('•') && line.includes('('));
    // const availableTasks = taskLines.map((line: string) => {
    //   const match = line.match(/• (.+?) \((.+?)\)/);
    //   if (match) {
    //     const title = match[1];
    //     const pipeline = match[2];
    //     // Extract task ID from the line (assuming it's in the format "• Task Name (pipeline)")
    //     const taskIdMatch = line.match(/• (.+?) \((.+?)\)/);
    //     return {
    //       id: taskIdMatch ? taskIdMatch[1].toLowerCase().replace(/\s+/g, '-').substring(0, 10) : 'unknown',
    //       title,
    //       pipeline
    //     };
    //   }
    //   return null;
    // }).filter(Boolean);
    
    return (
      <div className="project-details">
        <h3>{selectedProject.title}</h3>
        <div className="details-content">
          {lines.map((line: string, index: number) => (
            <div key={index} className={`detail-line ${line.includes('•') ? 'task-item' : ''}`}>
              {line}
            </div>
          ))}
        </div>
        
        {projectDetails.content?.[0]?.text.includes('Task Details:') && (
          <div className="task-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button 
                onClick={() => handleAnalyzeCodebase()}
                className="action-btn"
              >
                🔍 Analyze Codebase
              </button>
            </div>
            
            <div className="available-tasks">
              <h5>Available Task IDs:</h5>
              <div className="task-list">
                {['1', '2', '3', '4', '5', '6', '7', '8'].map(id => (
                  <span key={id} className="task-id-badge">ID: {id}</span>
                ))}
              </div>
              <p className="task-help">Use these IDs in the Actions tab to move tasks or create files</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTools = () => (
    <div className="mcp-tools">
      <h2>Available MCP Tools</h2>
      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.name} className="tool-card">
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
            <div className="tool-schema">
              <strong>Parameters:</strong>
              <pre>{JSON.stringify(tool.inputSchema, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="mcp-actions">
      <h2>MCP Actions</h2>
      
      {selectedProject && (
        <div className="selected-project-info">
          <h3>Selected Project: {selectedProject.title}</h3>
          <p>{selectedProject.description}</p>
        </div>
      )}

      <div className="action-sections">
        <div className="action-section">
          <h4>Task Management</h4>
          <div className="action-form">
            <input 
              type="text" 
              placeholder="Task ID" 
              id="taskId"
              className="form-input"
            />
            <select id="pipeline" className="form-select">
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <button 
              onClick={() => {
                const taskId = (document.getElementById('taskId') as HTMLInputElement)?.value;
                const pipeline = (document.getElementById('pipeline') as HTMLSelectElement)?.value;
                if (taskId && selectedProject) {
                  handleMoveTask(taskId, pipeline);
                }
              }}
              className="action-btn"
            >
              Move Task
            </button>
          </div>
        </div>

        <div className="action-section">
          <h4>Code Generation</h4>
          <div className="action-form">
            <input 
              type="text" 
              placeholder="Task ID" 
              id="createTaskId"
              className="form-input"
            />
            <input 
              type="text" 
              placeholder="File Name" 
              id="fileName"
              className="form-input"
            />
            <select id="fileType" className="form-select">
              <option value="component">Component</option>
              <option value="service">Service</option>
              <option value="utility">Utility</option>
              <option value="type">Type Definition</option>
            </select>
            <textarea 
              placeholder="File Content" 
              id="fileContent"
              className="form-textarea"
              rows={4}
            />
            <button 
              onClick={() => {
                const taskId = (document.getElementById('createTaskId') as HTMLInputElement)?.value;
                const fileName = (document.getElementById('fileName') as HTMLInputElement)?.value;
                const fileType = (document.getElementById('fileType') as HTMLSelectElement)?.value;
                const fileContent = (document.getElementById('fileContent') as HTMLTextAreaElement)?.value;
                if (taskId && fileName && fileContent && selectedProject) {
                  handleCreateFile(taskId, fileName, fileContent, fileType);
                }
              }}
              className="action-btn"
            >
              Create File
            </button>
          </div>
        </div>
      </div>

      {actionResult && (
        <div className="action-result">
          <h4>Action Result:</h4>
          <pre>{actionResult}</pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="mcp-dashboard">
      <div className="mcp-nav">
        <button className="back-btn" onClick={onBack}>
          ← Back to Main App
        </button>
        
        <div className="mcp-tabs">
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            📁 Projects
          </button>
          <button 
            className={activeTab === 'tools' ? 'active' : ''}
            onClick={() => setActiveTab('tools')}
          >
            🔧 Tools
          </button>
          <button 
            className={activeTab === 'actions' ? 'active' : ''}
            onClick={() => setActiveTab('actions')}
          >
            ⚡ Actions
          </button>
        </div>
      </div>

      <div className="mcp-content">
        {loading && <div className="loading">Loading...</div>}
        
        {activeTab === 'projects' && (
          <div className="mcp-tab-content">
            {renderProjects()}
            {selectedProject && renderProjectDetails()}
          </div>
        )}
        
        {activeTab === 'tools' && renderTools()}
        {activeTab === 'actions' && renderActions()}
      </div>
    </div>
  );
}
