import React, { useCallback, useState } from 'react'
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
import './WorkflowVisualization.css'
import './connection-improvements.css'
import './connection-enhancements.css'

// DatabaseEntityNode component - modern schema visualization inspired by Mavexa
const DatabaseEntityNode = ({ data }: { data: any }) => {
  const getFieldIcon = (field: any) => {
    if (field.isPrimaryKey) return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="primary-key-icon">
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
      </svg>
    );
    
    if (field.isForeignKey) return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="foreign-key-icon">
        <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
      </svg>
    );
    
    if (field.constraints?.includes('UNIQUE')) return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="unique-icon">
        <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
        <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
        <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
      </svg>
    );
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="field-default-icon">
        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
      </svg>
    );
  };

  const getFieldTypeLabel = (type: string) => {
    const typeMap: {[key: string]: string} = {
      'text': 'text',
      'varchar': 'text',
      'varchar(255)': 'text',
      'int4': 'int4',
      'integer': 'int4',
      'bool': 'bool',
      'boolean': 'bool',
      'timestamp': 'timestamp',
      'uuid': 'uuid',
      'date': 'date',
    };
    return typeMap[type.toLowerCase()] || type;
  };

  return (
    <div className="modern-database-entity-node">
      <div className="modern-entity-header">
        <span className="entity-name">{data.label}</span>
      </div>
      <div className="modern-entity-fields">
        {data.fields.map((field: any, index: number) => (
          <div 
            key={index} 
            className={`modern-field-row ${field.isPrimaryKey ? 'primary-key-row' : ''} ${field.isForeignKey ? 'foreign-key-row' : ''}`}
          >
            <div className="field-indicator">
              {field.isPrimaryKey && <span className="primary-key-indicator"></span>}
              {field.isForeignKey && <span className="foreign-key-indicator"></span>}
              {!field.isPrimaryKey && !field.isForeignKey && field.constraints?.includes('UNIQUE') && <span className="unique-indicator"></span>}
            </div>
            <div className="field-icon-container">
              {getFieldIcon(field)}
            </div>
            <div className="field-name-container">
              <span className="modern-field-name">{field.name}</span>
            </div>
            <div className="field-type-container">
              <span className="modern-field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            {field.required && <div className="non-nullable-indicator"></div>}
            {!field.required && <div className="nullable-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = {
  databaseEntity: DatabaseEntityNode,
};

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

interface WorkflowVisualizationProps {
  data: WorkflowData
}

export function WorkflowVisualization({ data }: WorkflowVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'technical' | 'user' | 'schema'>('technical')
  
  // Debug: Log the data structure
  console.log('WorkflowVisualization data:', data)

  
  // Convert nodes for ReactFlow
  const getReactFlowNodes = () => {
    try {
      if (activeTab === 'schema') {
        if (!data.schemaDiagram || !data.schemaDiagram.entities) {
          console.error('Schema diagram data missing:', data.schemaDiagram)
          return []
        }
        return data.schemaDiagram.entities.map(entity => ({
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
          console.error('Technical workflow data missing:', data.technicalWorkflow)
          return []
        }
        return data.technicalWorkflow.nodes.map((node: any) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            description: node.data.description,
            ...node.data
          }
        }))
      } else if (activeTab === 'user') {
        if (!data.userWorkflow || !data.userWorkflow.nodes) {
          console.error('User workflow data missing:', data.userWorkflow)
          return []
        }
        return data.userWorkflow.nodes.map((node: any) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            description: node.data.description,
            ...node.data
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
        if (!data.schemaDiagram || !data.schemaDiagram.relationships) {
          console.error('Schema relationships data missing:', data.schemaDiagram)
          return []
        }
        return data.schemaDiagram.relationships.map(rel => ({
          id: rel.id,
          source: rel.source,
          target: rel.target,
          label: rel.label,
          type: 'straight', // Use straight line type for clear visibility
          animated: true, // Add animation to all edges
          className: rel.type.toLowerCase().replace('_', '-'), // Add class based on relationship type
          style: {
            stroke: getRelationshipColor(rel.type),
            strokeWidth: 6, // Increased width
            strokeOpacity: 1 // Full opacity for better visibility
          },
          labelStyle: {
            fill: '#ffffff',
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 700
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20, // Larger arrow
            height: 20, // Larger arrow
            color: getRelationshipColor(rel.type)
          }
        }))
      } else if (activeTab === 'technical') {
        if (!data.technicalWorkflow || !data.technicalWorkflow.edges) {
          console.error('Technical workflow edges missing:', data.technicalWorkflow)
          return []
        }
        return data.technicalWorkflow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type === 'success' ? 'smoothstep' : 'straight',
          animated: edge.type === 'success',
          style: {
            stroke: edge.type === 'success' ? '#34d399' : '#60a5fa', // Brighter colors
            strokeWidth: 3
          },
          labelStyle: {
            fill: '#e5e7eb',
            fontSize: 12,
            fontWeight: 600
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 15,
            height: 15,
            color: edge.type === 'success' ? '#34d399' : '#60a5fa'
          }
        }))
      } else if (activeTab === 'user') {
        if (!data.userWorkflow || !data.userWorkflow.edges) {
          console.error('User workflow edges missing:', data.userWorkflow)
          return []
        }
        return data.userWorkflow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.condition ? 'step' : 'default',
          animated: edge.condition ? true : false,
          style: {
            stroke: edge.condition ? '#fbbf24' : '#a78bfa', // Brighter colors
            strokeWidth: 3
          },
          labelStyle: {
            fill: '#e5e7eb',
            fontSize: 12,
            fontWeight: 600
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 15, 
            height: 15,
            color: edge.condition ? '#fbbf24' : '#a78bfa'
          }
        }))
      }
    } catch (error) {
      console.error('Error getting ReactFlow edges:', error)
    }
    return []
  }
  
  // Helper function to get relationship colors
  const getRelationshipColor = (relType: string): string => {
    const typeColors: {[key: string]: string} = {
      'ONE_TO_MANY': '#93c5fd', // very bright blue
      'MANY_TO_ONE': '#fb7185', // bright pink
      'ONE_TO_ONE': '#6ee7b7', // bright mint green
      'MANY_TO_MANY': '#fcd34d', // bright yellow
    };
    return typeColors[relType] || '#d1d5db'; // default very light gray
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

  const renderNodeDetails = (nodeData: any) => {
    if (activeTab === 'technical') {
      return (
        <div className="node-details">
          <h4>{nodeData.label}</h4>
          <p>{nodeData.description}</p>
          <div className="details-section">
            <h5>Details:</h5>
            <ul>
              {nodeData.details?.map((detail: string, index: number) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          <div className="technologies-section">
            <h5>Technologies:</h5>
            <div className="tech-tags">
              {nodeData.technologies?.map((tech: string, index: number) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
          <div className="time-section">
            <strong>Estimated Time: {nodeData.estimatedTime}</strong>
          </div>
        </div>
      )
    } else if (activeTab === 'user') {
      return (
        <div className="node-details">
          <h4>{nodeData.label}</h4>
          <p>{nodeData.description}</p>
          <div className="user-actions">
            <h5>User Actions:</h5>
            <ul>
              {nodeData.userActions?.map((action: string, index: number) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
          <div className="system-responses">
            <h5>System Responses:</h5>
            <ul>
              {nodeData.systemResponses?.map((response: string, index: number) => (
                <li key={index}>{response}</li>
              ))}
            </ul>
          </div>
          <div className="pain-points">
            <h5>Potential Pain Points:</h5>
            <ul>
              {nodeData.painPoints?.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="success-metrics">
            <h5>Success Metrics:</h5>
            <ul>
              {nodeData.successMetrics?.map((metric: string, index: number) => (
                <li key={index}>{metric}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    } else if (activeTab === 'schema') {
      return (
        <div className="node-details modern-details">
          <h4 className="modern-entity-title">{nodeData.label}</h4>
          <div className="modern-details-header">
            <div className="modern-detail-badge">Database Entity</div>
            <div className="modern-detail-badge schema-badge">Schema: public</div>
          </div>
          
          <div className="fields-section">
            <h5>Fields</h5>
            <div className="modern-fields-list">
              {nodeData.fields?.map((field: any, index: number) => (
                <div key={index} className="modern-detail-field">
                  <div className="modern-field-header">
                    <div className="field-name-section">
                      {field.isPrimaryKey && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" className="modern-field-icon primary">
                          <path fill="currentColor" d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      )}
                      {field.isForeignKey && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" className="modern-field-icon foreign">
                          <path fill="currentColor" d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5z"/>
                        </svg>
                      )}
                      {!field.isPrimaryKey && !field.isForeignKey && field.constraints?.includes('UNIQUE') && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" className="modern-field-icon unique">
                          <path fill="currentColor" d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                        </svg>
                      )}
                      <span className="modern-field-detail-name">{field.name}</span>
                    </div>
                    <div className="field-type-badges">
                      <span className="modern-type-badge">{field.type.toLowerCase()}</span>
                      {field.required && <span className="modern-required-badge">required</span>}
                      {field.isPrimaryKey && <span className="modern-constraint-badge primary">PRIMARY KEY</span>}
                      {field.isForeignKey && <span className="modern-constraint-badge foreign">FOREIGN KEY</span>}
                    </div>
                  </div>
                  {(field.description || field.references) && (
                    <div className="modern-field-description">
                      {field.description && <div>{field.description}</div>}
                      {field.references && (
                        <div className="modern-field-reference">References: {field.references}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {nodeData.relationships && nodeData.relationships.length > 0 && (
            <div className="relationships-section">
              <h5>Relationships</h5>
              <div className="modern-relationships-list">
                {nodeData.relationships?.map((rel: any, index: number) => (
                  <div key={index} className="modern-relationship-item">
                    <div className="modern-relationship-header">
                      <span className={`modern-relationship-type ${rel.type.toLowerCase().replace('_', '-')}`}>
                        {rel.type.replace('_', '-')}
                      </span>
                      <span className="modern-relationship-target">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" className="target-icon">
                          <path fill="currentColor" d="M6 13a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6zM4.25 7.25A.75.75 0 0 1 5 8h.5a.75.75 0 0 1 0 1.5H5a2.25 2.25 0 0 1 0-4.5h.5a.75.75 0 0 1 0 1.5H5a.75.75 0 0 0-.75.75zm5.5 1.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 1 0-1.5h.5a2.25 2.25 0 0 1 0 4.5h-.5z"/>
                        </svg>
                        {rel.target}
                      </span>
                    </div>
                    {rel.description && (
                      <div className="modern-relationship-description">
                        {rel.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="workflow-visualization">
      <div className="workflow-header">
        <h2>Comprehensive Project Workflows</h2>
        <p>Interactive diagrams showing technical flow, user journey, and database schema</p>
      </div>

      <div className="workflow-tabs">
        <button 
          className={activeTab === 'technical' ? 'active' : ''}
          onClick={() => setActiveTab('technical')}
        >
          🔧 Technical Workflow
        </button>
        <button 
          className={activeTab === 'user' ? 'active' : ''}
          onClick={() => setActiveTab('user')}
        >
          👤 User Workflow
        </button>
        <button 
          className={activeTab === 'schema' ? 'active' : ''}
          onClick={() => setActiveTab('schema')}
        >
          🗄️ Database Schema
        </button>
      </div>

      <div className="workflow-content">
        <div className="workflow-diagram">
          {activeTab === 'schema' && (
            <div className="schema-header">
              <span className="schema-title">schema public</span>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className={activeTab === 'schema' ? 'react-flow schema-flow' : 'react-flow'}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              style: { strokeWidth: 5, stroke: '#d1d5db' },
              type: 'default',
              markerEnd: {
                type: MarkerType.Arrow,
                width: 20,
                height: 20
              }
            }}
          >
            <Controls 
              position="top-right"
              style={{
                backgroundColor: 'transparent'
              }}
            />
            <MiniMap 
              nodeStrokeWidth={3}
              nodeColor="#2d3748"
              style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
            />
            <Background 
              variant={activeTab === 'schema' ? BackgroundVariant.Dots : BackgroundVariant.Dots} 
              gap={activeTab === 'schema' ? 20 : 12} 
              size={0.5}
              color={activeTab === 'schema' ? '#374151' : undefined}
            />
          </ReactFlow>
        </div>

        <div className="workflow-details">
          <h3>
            {activeTab === 'technical' && 'Technical Workflow Details'}
            {activeTab === 'user' && 'User Journey Details'}
            {activeTab === 'schema' && 'Database Schema Details'}
          </h3>
          <div className="details-container">
            {nodes.map((node) => (
              <div key={node.id} className="detail-card">
                {renderNodeDetails(node.data)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="workflow-legend">
        <h4>
          {activeTab === 'technical' && 'Workflow Legend'}
          {activeTab === 'user' && 'User Journey Legend'}
          {activeTab === 'schema' && 'Database Schema Legend'}
        </h4>
        <div className="legend-items">
          {(activeTab === 'technical' || activeTab === 'user') && (
            <>
              <div className="legend-item">
                <div className="legend-node input"></div>
                <span>Start/Input Node</span>
              </div>
              <div className="legend-item">
                <div className="legend-node default"></div>
                <span>Process Node</span>
              </div>
              <div className="legend-item">
                <div className="legend-node output"></div>
                <span>End/Output Node</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge smoothstep"></div>
                <span>Success Flow</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge straight"></div>
                <span>Standard Flow</span>
              </div>
            </>
          )}
          
          {activeTab === 'schema' && (
            <>
              <div className="legend-item">
                <span className="field-icon">🔑</span>
                <span>Primary Key</span>
              </div>
              <div className="legend-item">
                <span className="field-icon">🔗</span>
                <span>Foreign Key</span>
              </div>
              <div className="legend-item">
                <span className="field-icon">⭐</span>
                <span>Unique Constraint</span>
              </div>
              <div className="legend-item">
                <span className="field-icon">📄</span>
                <span>Regular Field</span>
              </div>
              <div className="legend-item">
                <span className="required-indicator">*</span>
                <span>Required Field</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge" style={{ background: '#93c5fd', height: '5px' }}></div>
                <span>One-to-Many</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge" style={{ background: '#fb7185', height: '5px' }}></div>
                <span>Many-to-One</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge" style={{ background: '#6ee7b7', height: '5px' }}></div>
                <span>One-to-One</span>
              </div>
              <div className="legend-item">
                <div className="legend-edge" style={{ background: '#fcd34d', height: '5px' }}></div>
                <span>Many-to-Many</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
