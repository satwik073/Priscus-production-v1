import { useEffect, useState } from 'react'
import { Database, Table, ExternalLink, Key, Hash, Star, Circle, CircleDot } from 'lucide-react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  getBezierPath,
  EdgeLabelRenderer,
  MarkerType
} from 'reactflow'
import type { Node, Edge, EdgeProps } from 'reactflow'
import 'reactflow/dist/style.css'

type SchemaField = {
  name: string
  type: string
  required?: boolean
  description?: string
  constraints?: string[]
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  references?: string
}

type SchemaEntity = {
  name: string
  fields: SchemaField[]
  relationships: Array<{ target: string; type: string; description?: string; field?: string }>
  position: { x: number; y: number }
}

type SchemaGraph = {
  entities: SchemaEntity[]
  relationships: Array<{
    id: string
    source: string
    target: string
    type: string
    label: string
    sourceField?: string
    targetField?: string
  }>
}

// Supabase-style Table Node Component
const SupabaseTableNode = ({ data }: { data: any }) => {
  const getFieldIcon = (field: SchemaField) => {
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
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Fields List */}
      <div className="p-0">
        {data.fields?.map((field: SchemaField, index: number) => (
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

// Supabase-style Relationship Edge Component
const SupabaseRelationshipEdge = ({
  id,
  source: _source,
  target: _target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  label
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.2,
  })

  return (
    <>
      {/* Main connection line */}
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
          stroke: '#6b7280',
          strokeDasharray: '3,3',
        }}
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Edge Label */}
      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '11px',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}
          >
            {label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

const nodeTypes = {
  supabaseTable: SupabaseTableNode,
}

const edgeTypes = {
  supabaseRelationship: SupabaseRelationshipEdge,
}

const DatabaseSchemaVisualizer = () => {
  const [schema, setSchema] = useState<SchemaGraph | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<SchemaEntity | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/database-schema`)
        const result = await response.json()
        
        if (result.success) {
          setSchema(result.data)
        } else {
          setError('Failed to load schema')
        }
      } catch (e) {
        setError('Failed to load schema')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading database schema...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Database className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!schema) return null

  const nodes: Node[] = schema.entities.map((e) => ({
    id: e.name,
    type: 'supabaseTable',
    position: e.position,
    data: {
      label: e.name,
      fields: e.fields,
      relationships: e.relationships
    }
  }))

  const edges: Edge[] = schema.relationships.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    label: r.label,
    type: 'supabaseRelationship',
    animated: false,
    style: {
      strokeWidth: 1,
      stroke: '#6b7280',
      strokeDasharray: '3,3',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 8,
      height: 8,
      color: '#6b7280',
    }
  }))

  return (
    <div className="h-full bg-gray-950">
      {/* Schema Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-300" />
          <span className="text-white text-sm font-medium">schema</span>
          <span className="text-blue-400 text-sm">public</span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="h-[calc(100vh-200px)] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: 'supabaseRelationship',
            animated: false,
            style: { 
              strokeWidth: 1,
              stroke: '#6b7280',
              strokeDasharray: '3,3'
            },
          }}
          onNodeClick={(_, node) => {
            const entity = schema.entities.find(e => e.name === node.id)
            setSelectedEntity(entity || null)
          }}
          className="bg-gray-950"
        >
          <Controls 
            position="top-right"
            style={{
              backgroundColor: 'transparent'
            }}
          />
          <MiniMap 
            nodeStrokeWidth={2}
            nodeColor="#374151"
            className="bg-gray-900 border border-gray-700"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#374151"
          />
        </ReactFlow>
      </div>

      {/* Legend - Bottom of screen */}
      <div className="absolute bottom-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-3">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <Key className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-300">Primary key</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300"># Identity</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300">Unique</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Nullable</span>
          </div>
          <div className="flex items-center gap-1">
            <CircleDot className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Non-Nullable</span>
          </div>
        </div>
      </div>

      {/* Entity Details Sidebar */}
      {selectedEntity && (
        <div className="absolute top-4 right-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{selectedEntity.name}</h3>
              <button 
                onClick={() => setSelectedEntity(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Fields ({selectedEntity.fields.length})</h4>
                <div className="space-y-2">
                  {selectedEntity.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getFieldIcon(field)}
                        <span className="text-white font-mono">{field.name}</span>
                      </div>
                      <span className="text-gray-400 font-mono">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedEntity.relationships.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Relationships</h4>
                  <div className="space-y-1">
                    {selectedEntity.relationships.map((rel, idx) => (
                      <div key={idx} className="text-xs text-gray-400">
                        <span className="text-blue-400">{rel.type.replace('_', '-')}</span> → {rel.target}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getFieldIcon(field: SchemaField) {
  if (field.isPrimaryKey) return <Key className="w-3 h-3 text-yellow-400" />
  if (field.constraints?.includes('UNIQUE')) return <Star className="w-3 h-3 text-blue-400" />
  if (field.required) return <CircleDot className="w-3 h-3 text-gray-400" />
  return <Circle className="w-3 h-3 text-gray-400" />
}

export default DatabaseSchemaVisualizer
