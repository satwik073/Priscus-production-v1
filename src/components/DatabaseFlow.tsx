import { useEffect, useState } from 'react';
import './DatabaseFlow.css';
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

type SchemaField = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  constraints?: string[];
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
};

type SchemaEntity = {
  name: string;
  fields: SchemaField[];
  relationships: Array<{ target: string; type: string; description?: string; field?: string }>;
  position: { x: number; y: number };
};

type SchemaGraph = {
  entities: SchemaEntity[];
  relationships: Array<{ 
    id: string; 
    source: string; 
    target: string; 
    type: string; 
    label: string;
    sourceField?: string;
    targetField?: string;
  }>;
};

// Custom node component for database entities with ALL field details
const DatabaseEntityNode = ({ data }: { data: any }) => {
  const getFieldIcon = (field: SchemaField) => {
    if (field.isPrimaryKey) return '🔑';
    if (field.isForeignKey) return '🔗';
    if (field.constraints?.includes('UNIQUE')) return '⭐';
    return '📄';
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'text': return '#4ade80';
      case 'varchar(255)': return '#4ade80';
      case 'varchar': return '#4ade80';
      case 'int4': return '#60a5fa';
      case 'integer': return '#60a5fa';
      case 'bool': return '#f59e0b';
      case 'boolean': return '#f59e0b';
      case 'timestamp': return '#a78bfa';
      case 'uuid': return '#f472b6';
      case 'date': return '#22d3ee';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="database-entity-node">
      <div className="entity-header">
        <div className="entity-icon">🗄️</div>
        <div className="entity-name">{data.label}</div>
      </div>
      <div className="entity-fields">
        {data.fields.map((field: SchemaField, index: number) => (
          <div key={index} className="field-row">
            <div className="field-info">
              <span className="field-icon">{getFieldIcon(field)}</span>
              <span className="field-name">{field.name}</span>
              <span 
                className="field-type" 
                style={{ color: getTypeColor(field.type) }}
              >
                {field.type}
              </span>
              {field.required && <span className="required-indicator">*</span>}
            </div>
            {field.constraints && field.constraints.length > 0 && (
              <div className="field-constraints">
                {field.constraints.map((constraint, idx) => (
                  <span key={idx} className="constraint-tag">{constraint}</span>
                ))}
              </div>
            )}
            {field.description && (
              <div className="field-description">{field.description}</div>
            )}
            {field.references && (
              <div className="field-reference">→ {field.references}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = {
  databaseEntity: DatabaseEntityNode,
};

const DatabaseFlow = () => {
  const [schema, setSchema] = useState<SchemaGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<SchemaEntity | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Try to get schema from workflow first, fallback to static schema
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/database-schema`);
        const json = await res.json();
        if (json.success) {
          setSchema(json.data);
        } else {
          setError('Failed to load schema');
        }
      } catch (e) {
        setError('Failed to load schema');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="db-flow-container">Loading database schema...</div>;
  if (error) return <div className="db-flow-container">{error}</div>;
  if (!schema) return null;

  const nodes: Node[] = schema.entities.map((e) => ({
    id: e.name,
    type: 'databaseEntity',
    position: e.position,
    data: {
      label: e.name,
      fields: e.fields,
      relationships: e.relationships
    }
  }));

  const edges: Edge[] = schema.relationships.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    label: r.label,
    type: r.type === 'ONE_TO_MANY' ? 'smoothstep' : 'straight',
    style: {
      stroke: r.type === 'ONE_TO_MANY' ? '#3b82f6' : '#10b981',
      strokeWidth: 2
    },
    labelStyle: {
      fill: '#ffffff',
      fontWeight: 600
    }
  }));

  return (
    <div className="db-flow-container">
      <div className="database-header">
        <h2>AI-Generated Database Schema</h2>
        <p>Comprehensive database entities with all field details, constraints, and relationships</p>
      </div>
      
      <div className="database-content">
        <div className="flow-container" style={{ height: 600 }}>
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={(_, node) => {
              const entity = schema.entities.find(e => e.name === node.id);
              setSelectedEntity(entity || null);
            }}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
        
        {selectedEntity && (
          <div className="entity-details">
            <h3>Entity Details: {selectedEntity.name}</h3>
            <div className="details-content">
              <div className="relationships-section">
                <h4>Relationships</h4>
                {selectedEntity.relationships.map((rel, idx) => (
                  <div key={idx} className="relationship-item">
                    <span className="relationship-type">{rel.type}</span>
                    <span className="relationship-target">{rel.target}</span>
                    <p className="relationship-description">{rel.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="database-legend">
        <h4>Field Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">🔑</span>
            <span>Primary Key</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🔗</span>
            <span>Foreign Key</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⭐</span>
            <span>Unique Constraint</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📄</span>
            <span>Regular Field</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol">*</span>
            <span>Required Field</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseFlow;

