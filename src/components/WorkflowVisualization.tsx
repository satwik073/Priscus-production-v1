import React, { useCallback, useState } from 'react'
import { Workflow, User, Database, Settings, Play, CheckCircle, Clock, AlertCircle, Code, Users, Zap, Key, Star, Circle, CircleDot, Table, Link } from 'lucide-react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  MarkerType,
} from 'reactflow'
import type { Connection } from 'reactflow'
import 'reactflow/dist/style.css'

// Custom Node Components
const TechnicalNode = ({ data }: { data: any }) => {
  const getNodeIcon = () => {
    switch (data.type) {
      case 'frontend': return <Code className="w-5 h-5 text-accent-blue" />
      case 'backend': return <Database className="w-5 h-5 text-accent-green" />
      case 'database': return <Database className="w-5 h-5 text-accent-purple" />
      case 'api': return <Zap className="w-5 h-5 text-accent-orange" />
      default: return <Settings className="w-5 h-5 text-dark-text-muted" />
    }
  }

  const getNodeColor = () => {
    switch (data.type) {
      case 'frontend': return 'border-accent-blue bg-accent-blue/10'
      case 'backend': return 'border-accent-green bg-accent-green/10'
      case 'database': return 'border-accent-purple bg-accent-purple/10'
      case 'api': return 'border-accent-orange bg-accent-orange/10'
      default: return 'border-dark-border bg-dark-card'
    }
  }
    
    return (
    <div className={`glass-card p-4 min-w-64 max-w-80 border-2 ${getNodeColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getNodeIcon()}
        <div>
          <h3 className="font-semibold text-dark-text-primary">{data.label}</h3>
          <p className="text-xs text-dark-text-muted capitalize">{data.type} Component</p>
        </div>
      </div>
      
      <p className="text-sm text-dark-text-secondary mb-3">{data.description}</p>
      
      {data.technologies && (
        <div className="flex flex-wrap gap-1 mb-3">
          {data.technologies.slice(0, 3).map((tech: string, idx: number) => (
            <span key={idx} className="px-2 py-1 bg-dark-hover text-xs rounded-full text-dark-text-primary">
              {tech}
            </span>
          ))}
          {data.technologies.length > 3 && (
            <span className="px-2 py-1 bg-dark-hover text-xs rounded-full text-dark-text-muted">
              +{data.technologies.length - 3}
            </span>
          )}
        </div>
      )}
      
      {data.estimatedTime && (
        <div className="flex items-center gap-2 text-xs text-dark-text-muted">
          <Clock className="w-3 h-3" />
          <span>{data.estimatedTime}</span>
        </div>
      )}
    </div>
  )
}

const UserFlowNode = ({ data }: { data: any }) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'start': return <Play className="w-5 h-5 text-accent-green" />
      case 'process': return <Clock className="w-5 h-5 text-accent-blue" />
      case 'decision': return <AlertCircle className="w-5 h-5 text-accent-yellow" />
      case 'end': return <CheckCircle className="w-5 h-5 text-accent-green" />
      default: return <User className="w-5 h-5 text-dark-text-muted" />
    }
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'start': return 'border-accent-green bg-accent-green/10'
      case 'process': return 'border-accent-blue bg-accent-blue/10'
      case 'decision': return 'border-accent-yellow bg-accent-yellow/10'
      case 'end': return 'border-accent-green bg-accent-green/10'
      default: return 'border-dark-border bg-dark-card'
    }
  }

  return (
    <div className={`glass-card p-4 min-w-64 max-w-80 border-2 ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getStatusIcon()}
        <div>
          <h3 className="font-semibold text-dark-text-primary">{data.label}</h3>
          <p className="text-xs text-dark-text-muted capitalize">{data.status} Step</p>
        </div>
      </div>
      
      <p className="text-sm text-dark-text-secondary mb-3">{data.description}</p>
      
      {data.userActions && data.userActions.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-dark-text-muted mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" />
            User Actions
          </h4>
          <ul className="space-y-1">
            {data.userActions.slice(0, 2).map((action: string, idx: number) => (
              <li key={idx} className="text-xs text-dark-text-secondary">• {action}</li>
            ))}
            {data.userActions.length > 2 && (
              <li className="text-xs text-dark-text-muted">+{data.userActions.length - 2} more</li>
            )}
          </ul>
        </div>
      )}
      
      {data.painPoints && data.painPoints.length > 0 && (
        <div className="text-xs">
          <span className="text-red-400">⚠</span>
          <span className="text-dark-text-muted ml-1">{data.painPoints.length} potential issue{data.painPoints.length !== 1 ? 's' : ''}</span>
        </div>
      )}
            </div>
  )
}

const DatabaseEntityNode = ({ data }: { data: any }) => {
  const getFieldIcon = (field: any) => {
    if (field.isPrimaryKey) return <Key className="w-3 h-3 text-yellow-400" />
    if (field.constraints?.includes('UNIQUE')) return <Star className="w-3 h-3 text-blue-400" />
    if (field.required) return <CircleDot className="w-3 h-3 text-gray-400" />
    return <Circle className="w-3 h-3 text-gray-400" />
  }

  const getFieldTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'text':
      case 'varchar':
        return 'text-green-400'
      case 'int4':
      case 'integer':
      case 'uuid':
        return 'text-blue-400'
      case 'bool':
      case 'boolean':
        return 'text-purple-400'
      case 'timestamp':
      case 'date':
        return 'text-orange-400'
      case 'decimal':
        return 'text-cyan-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg min-w-64 max-w-80">
      {/* Table Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-gray-300" />
          <span className="font-medium text-white text-sm">{data.label}</span>
        </div>
        <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
          <Link className="w-3 h-3" />
        </button>
      </div>

      {/* Fields List */}
      <div className="p-0">
        {data.fields?.map((field: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getFieldIcon(field)}
              <span className="text-white text-sm font-mono truncate">{field.name}</span>
            </div>
            <span className={`text-xs font-mono ml-2 ${getFieldTypeColor(field.type)}`}>
              {field.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const nodeTypes = {
  technical: TechnicalNode,
  userFlow: UserFlowNode,
  databaseEntity: DatabaseEntityNode,
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
        type?: string
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
        status?: string
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
        isPrimaryKey?: boolean
        isForeignKey?: boolean
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

interface WorkflowVisualizationProps {
  data: WorkflowData
  projectTitle?: string
  projectDescription?: string
  analysis?: any
}

export function WorkflowVisualization({ data, projectTitle, projectDescription, analysis }: WorkflowVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'technical' | 'user' | 'schema'>('technical')
  const [schemaData, setSchemaData] = useState<any>(null)

  // Generate database schema if not present in workflow data
  const generateDatabaseSchema = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'current',
          analysis: analysis || {},
          title: projectTitle || 'Project',
          description: projectDescription || ''
        })
      })
      const result = await response.json()
      
      if (result.success && result.workflow.schemaDiagram) {
        setSchemaData(result.workflow.schemaDiagram)
      }
    } catch (error) {
      console.error('Error generating database schema:', error)
    }
  }

  // Load schema data from workflow data when switching to schema tab
  React.useEffect(() => {
    if (activeTab === 'schema') {
      if (data.schemaDiagram) {
        setSchemaData(data.schemaDiagram)
      } else {
        // If no schema in workflow data, try to generate it
        generateDatabaseSchema()
      }
    }
  }, [activeTab, data.schemaDiagram])
  
  // Convert nodes for ReactFlow
  const getReactFlowNodes = () => {
    try {
      if (activeTab === 'schema') {
        if (!schemaData || !schemaData.entities) {
          return []
        }
        return schemaData.entities.map((entity: any) => ({
          id: entity.name,
          type: 'databaseEntity',
          position: entity.position,
          data: {
            label: entity.name,
            fields: entity.fields,
            relationships: entity.relationships
          }
        }))
      } else if (activeTab === 'technical') {
        if (!data.technicalWorkflow || !data.technicalWorkflow.nodes) {
          return []
        }
        return data.technicalWorkflow.nodes.map((node: any) => ({
          id: node.id,
          type: 'technical',
          position: node.position,
          data: {
            ...node.data,
            type: node.data.type || 'default'
          }
        }))
      } else if (activeTab === 'user') {
        if (!data.userWorkflow || !data.userWorkflow.nodes) {
          return []
        }
        return data.userWorkflow.nodes.map((node: any) => ({
          id: node.id,
          type: 'userFlow',
          position: node.position,
          data: {
            ...node.data,
            status: node.data.status || 'process'
          }
        }))
      }
    } catch (error) {
      console.error('Error getting ReactFlow nodes:', error)
    }
    return []
  }

  const getReactFlowEdges = () => {
    try {
      if (activeTab === 'schema') {
        if (!schemaData || !schemaData.relationships) {
          return []
        }
        return schemaData.relationships.map((rel: any) => ({
          id: rel.id,
          source: rel.source,
          target: rel.target,
          label: rel.label,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: '#6b7280',
            strokeWidth: 1,
            strokeDasharray: '3,3',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 8,
            height: 8,
            color: '#6b7280'
          }
        }))
      } else if (activeTab === 'technical') {
        if (!data.technicalWorkflow || !data.technicalWorkflow.edges) {
          return []
        }
        return data.technicalWorkflow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#60a5fa',
            strokeWidth: 3
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#60a5fa'
          }
        }))
      } else if (activeTab === 'user') {
        if (!data.userWorkflow || !data.userWorkflow.edges) {
          return []
        }
        return data.userWorkflow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.condition ? 'step' : 'smoothstep',
          animated: true,
          style: {
            stroke: edge.condition ? '#f59e0b' : '#10b981',
            strokeWidth: 3
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: edge.condition ? '#f59e0b' : '#10b981'
          }
        }))
      }
    } catch (error) {
      console.error('Error getting ReactFlow edges:', error)
    }
    return []
  }
  

  const [nodes, setNodes, onNodesChange] = useNodesState(getReactFlowNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState(getReactFlowEdges())

  // Update nodes and edges when tab changes
  React.useEffect(() => {
    setNodes(getReactFlowNodes())
    setEdges(getReactFlowEdges())
  }, [activeTab, data])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'technical': return <Workflow className="w-4 h-4" />
      case 'user': return <User className="w-4 h-4" />
      case 'schema': return <Database className="w-4 h-4" />
      default: return null
    }
  }

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'technical': return 'System architecture and technical implementation flow'
      case 'user': return 'User journey and interaction patterns'
      case 'schema': return 'Database structure and entity relationships'
      default: return ''
    }
  }

  const getWorkflowStats = () => {
    if (activeTab === 'technical') {
      const currentData = data.technicalWorkflow
      if (!currentData) return { nodes: 0, connections: 0, components: 0 }
      return {
        nodes: currentData.nodes?.length || 0,
        connections: currentData.edges?.length || 0,
        components: currentData.nodes?.filter((n: any) => n.data.technologies).length || 0
      }
    } else if (activeTab === 'user') {
      const currentData = data.userWorkflow
      if (!currentData) return { nodes: 0, connections: 0, components: 0 }
      return {
        nodes: currentData.nodes?.length || 0,
        connections: currentData.edges?.length || 0,
        components: currentData.nodes?.filter((n: any) => n.data.userActions).length || 0
      }
    } else {
      if (!schemaData) return { nodes: 0, connections: 0, components: 0 }
      return {
        nodes: schemaData.entities?.length || 0,
        connections: schemaData.relationships?.length || 0,
        components: schemaData.entities?.filter((e: any) => e.fields).length || 0
      }
    }
  }

  const stats = getWorkflowStats()

      return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Workflow className="w-8 h-8 text-accent-orange" />
            <div>
              <h2 className="text-2xl font-bold text-dark-text-primary">Project Workflows</h2>
              <p className="text-dark-text-secondary">Interactive diagrams showing technical flow, user journey, and database schema</p>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {['technical', 'user', 'schema'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`filter-button ${activeTab === tab ? 'active' : ''} flex items-center gap-2 capitalize`}
            >
              {getTabIcon(tab)}
              {tab === 'technical' ? 'Technical Workflow' :
               tab === 'user' ? 'User Workflow' : 'Database Schema'}
            </button>
          ))}
          </div>

        {/* Current Tab Description */}
        <div className="flex items-center gap-4 p-4 bg-dark-card/50 rounded-lg">
          <div className="flex items-center gap-2 text-accent-orange">
            {getTabIcon(activeTab)}
            <span className="font-medium">
              {activeTab === 'technical' ? 'Technical Workflow' :
               activeTab === 'user' ? 'User Workflow' : 'Database Schema'}
            </span>
          </div>
          <span className="text-dark-text-secondary">•</span>
          <p className="text-dark-text-secondary">{getTabDescription(activeTab)}</p>
          </div>
          
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-accent-blue">{stats.nodes}</div>
            <div className="text-xs text-dark-text-muted">
              {activeTab === 'schema' ? 'Tables' : 'Nodes'}
                    </div>
                  </div>
          <div className="text-center p-3 bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-accent-green">{stats.connections}</div>
            <div className="text-xs text-dark-text-muted">
              {activeTab === 'schema' ? 'Relationships' : 'Connections'}
                    </div>
                </div>
          <div className="text-center p-3 bg-dark-card rounded-lg">
            <div className="text-2xl font-bold text-accent-orange">{stats.components}</div>
            <div className="text-xs text-dark-text-muted">
              {activeTab === 'technical' ? 'Technologies' :
               activeTab === 'user' ? 'Interactions' : 'Fields'}
            </div>
          </div>
                    </div>
                      </div>

      {/* Workflow Diagram */}
      <div className={`p-6 ${activeTab === 'schema' ? 'bg-white' : 'glass-card'}`}>
        <div className="h-96 lg:h-[600px]">
          {activeTab === 'schema' && !schemaData ? (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No database schema available</p>
        <button 
                  onClick={generateDatabaseSchema}
                  className="modern-button"
                >
                  Generate Database Schema
        </button>
      </div>
            </div>
          ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
                style: { strokeWidth: 3 },
                type: 'smoothstep',
                animated: true,
              markerEnd: {
                  type: MarkerType.ArrowClosed,
                width: 20,
                height: 20
              }
            }}
              className={activeTab === 'schema' ? 'bg-white' : ''}
            >
              <Controls position="top-right" />
            <MiniMap 
                nodeStrokeWidth={2}
                nodeColor={activeTab === 'schema' ? "#374151" : "#2a2a2a"}
                className={activeTab === 'schema' ? "bg-gray-100 border border-gray-300" : "bg-dark-card/80"}
            />
            <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1}
                color={activeTab === 'schema' ? "#e5e7eb" : "#3a3a3a"}
            />
          </ReactFlow>
          )}
        </div>
        </div>

      {/* Workflow Details */}
      {activeTab !== 'schema' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            {getTabIcon(activeTab)}
            {activeTab === 'technical' && 'Technical Implementation Details'}
            {activeTab === 'user' && 'User Journey Breakdown'}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {nodes.map((node) => (
            <div key={node.id} className="glass-card p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-3">
                {activeTab === 'technical' && <Code className="w-4 h-4 text-accent-blue" />}
                {activeTab === 'user' && <User className="w-4 h-4 text-accent-green" />}
                <h4 className="font-medium text-dark-text-primary">{node.data.label}</h4>
              </div>
              
              <p className="text-sm text-dark-text-secondary mb-3">{node.data.description}</p>
              
              {/* Technical Details */}
              {activeTab === 'technical' && (
                <div className="space-y-2">
                  {node.data.technologies && (
                    <div>
                      <h5 className="text-xs font-medium text-dark-text-muted mb-1">Technologies:</h5>
                      <div className="flex flex-wrap gap-1">
                        {node.data.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-dark-hover text-xs rounded text-dark-text-primary">
                            {tech}
                          </span>
            ))}
          </div>
                    </div>
                  )}
                  {node.data.estimatedTime && (
                    <div className="flex items-center gap-1 text-xs text-dark-text-muted">
                      <Clock className="w-3 h-3" />
                      <span>{node.data.estimatedTime}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* User Flow Details */}
              {activeTab === 'user' && (
                <div className="space-y-2">
                  {node.data.userActions && node.data.userActions.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-dark-text-muted mb-1">User Actions:</h5>
                      <ul className="space-y-1">
                        {node.data.userActions.slice(0, 3).map((action: string, idx: number) => (
                          <li key={idx} className="text-xs text-dark-text-secondary">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {node.data.painPoints && node.data.painPoints.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>{node.data.painPoints.length} potential issues</span>
                    </div>
                  )}
                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Legend */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-dark-text-primary mb-4">Workflow Legend</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'technical' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Component Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent-blue rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Frontend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent-green rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Backend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent-purple rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent-orange rounded"></div>
                    <span className="text-sm text-dark-text-secondary">API</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Connections</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-blue rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Data Flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-green rounded"></div>
                    <span className="text-sm text-dark-text-secondary">API Call</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'user' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Flow Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-dark-text-secondary">Start Point</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-blue" />
                    <span className="text-sm text-dark-text-secondary">Process Step</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-yellow" />
                    <span className="text-sm text-dark-text-secondary">Decision Point</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-dark-text-secondary">End Point</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Flow Paths</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-green rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Success Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-yellow rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Conditional Path</span>
                  </div>
              </div>
              </div>
            </>
          )}
          
          {activeTab === 'schema' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Field Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent-yellow rounded-full"></div>
                    <span className="text-sm text-dark-text-secondary">Primary Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent-blue rounded-full"></div>
                    <span className="text-sm text-dark-text-secondary">Foreign Key</span>
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-dark-text-muted rounded-full"></div>
                    <span className="text-sm text-dark-text-secondary">Regular Field</span>
              </div>
              </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-dark-text-muted mb-3">Relationships</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-blue rounded"></div>
                    <span className="text-sm text-dark-text-secondary">One-to-Many</span>
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-green rounded"></div>
                    <span className="text-sm text-dark-text-secondary">One-to-One</span>
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-accent-purple rounded"></div>
                    <span className="text-sm text-dark-text-secondary">Many-to-Many</span>
              </div>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}