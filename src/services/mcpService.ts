interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface MCPProject {
  id: string;
  title: string;
  description: string;
  hasAnalysis: boolean;
  hasKanban: boolean;
  hasWorkflow: boolean;
  createdAt: string;
}

interface MCPTask {
  id: string;
  title: string;
  description: string;
  pipeline: string;
  priority: string;
  estimatedHours: number;
  userStory: string;
  status?: string;
  notes?: string;
}

class MCPService {
  private baseUrl = 'http://localhost:3001'; // MCP server port

  async getAvailableTools(): Promise<MCPTool[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`);
      if (!response.ok) {
        throw new Error('Failed to fetch MCP tools');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching MCP tools:', error);
      return [];
    }
  }

  async getProjects(): Promise<MCPProject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/get_projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const result = await response.json();
      return this.parseProjectsFromResponse(result);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getProjectDetails(projectId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/get_project_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  }

  async moveKanbanTask(projectId: string, taskId: string, newPipeline: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/move_kanban_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, taskId, newPipeline })
      });
      if (!response.ok) {
        throw new Error('Failed to move task');
      }
      const result = await response.json();
      return this.extractTextFromResponse(result);
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  }

  async createCodeFile(projectId: string, taskId: string, fileName: string, fileContent: string, fileType: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/create_code_file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, taskId, fileName, fileContent, fileType })
      });
      if (!response.ok) {
        throw new Error('Failed to create code file');
      }
      const result = await response.json();
      return this.extractTextFromResponse(result);
    } catch (error) {
      console.error('Error creating code file:', error);
      throw error;
    }
  }

  async updateTaskStatus(projectId: string, taskId: string, status: string, notes?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/update_task_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, taskId, status, notes })
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      const result = await response.json();
      return this.extractTextFromResponse(result);
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async analyzeCodebase(projectId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/analyze_codebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      if (!response.ok) {
        throw new Error('Failed to analyze codebase');
      }
      const result = await response.json();
      return this.extractTextFromResponse(result);
    } catch (error) {
      console.error('Error analyzing codebase:', error);
      throw error;
    }
  }

  async generateImplementationPlan(projectId: string, taskId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/generate_implementation_plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, taskId })
      });
      if (!response.ok) {
        throw new Error('Failed to generate implementation plan');
      }
      const result = await response.json();
      return this.extractTextFromResponse(result);
    } catch (error) {
      console.error('Error generating implementation plan:', error);
      throw error;
    }
  }

  async checkMCPServerStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private parseProjectsFromResponse(response: any): MCPProject[] {
    if (!response.content || !response.content[0] || !response.content[0].text) {
      return [];
    }

    const text = response.content[0].text;
    const lines = text.split('\n');
    const projects: MCPProject[] = [];

    for (const line of lines) {
      if (line.includes('•') && line.includes('(ID:')) {
        const match = line.match(/• (.+?) \(ID: (.+?)\)/);
        if (match) {
          const title = match[1];
          const id = match[2];
          
          // Find the description in the next line
          const descIndex = lines.indexOf(line) + 1;
          const description = descIndex < lines.length ? lines[descIndex].trim() : '';
          
          // Parse status indicators
          const hasAnalysis = line.includes('Analysis: ✅');
          const hasKanban = line.includes('Kanban: ✅');
          const hasWorkflow = line.includes('Workflow: ✅');

          projects.push({
            id,
            title,
            description,
            hasAnalysis,
            hasKanban,
            hasWorkflow,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    return projects;
  }

  private extractTextFromResponse(response: any): string {
    if (response.content && response.content[0] && response.content[0].text) {
      return response.content[0].text;
    }
    return 'No response text available';
  }
}

export const mcpService = new MCPService();
export type { MCPProject, MCPTask, MCPTool };
