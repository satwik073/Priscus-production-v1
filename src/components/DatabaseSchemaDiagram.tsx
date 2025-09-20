import { useState, useCallback } from 'react';
import './DatabaseSchemaDiagram.css';

type ColumnDefinition = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  constraints?: string[];
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
};

type TableDefinition = {
  name: string;
  columns: ColumnDefinition[];
  relationships: Array<{ 
    target: string; 
    type: string; 
    description?: string; 
    sourceColumn?: string;
    targetColumn?: string;
  }>;
};

type SchemaDefinition = {
  tables: TableDefinition[];
};

type DatabaseSchemaDiagramProps = {
  schema: SchemaDefinition;
};

const DatabaseSchemaDiagram = ({ schema }: DatabaseSchemaDiagramProps) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  const getTableDetails = useCallback(() => {
    if (!selectedTable) return null;
    return schema.tables.find(table => table.name === selectedTable);
  }, [selectedTable, schema]);

  const getColumnIcon = (column: ColumnDefinition) => {
    if (column.isPrimaryKey) return '🔑';
    if (column.isForeignKey) return '🔗';
    return '📊';
  };

  const tableDetails = getTableDetails();

  return (
    <div className="schema-diagram-container">
      <div className="schema-header">
        <h2>Database Schema Visualization</h2>
        <p>Interactive visualization of your database structure</p>
        <div className="schema-subheader">
          <span>Tables: {schema.tables.length}</span>
          <span>|</span>
          <span>Relationships: <span className="connection-highlight">Active</span></span>
        </div>
      </div>

      <div className="schema-content">
        <div className="schema-diagram">
          {schema.tables.map((table, index) => (
            <div 
              key={table.name}
              className="schema-table"
              style={{ 
                position: 'relative',
                left: `${(index % 3) * 310}px`,
                top: `${Math.floor(index / 3) * 250}px`,
              }}
              onClick={() => setSelectedTable(table.name)}
            >
              <div className="table-header">
                <span className="table-icon">📋</span>
                <span className="table-name">{table.name}</span>
              </div>
              <div className="table-columns">
                {table.columns.slice(0, 3).map(column => (
                  <div key={column.name} className="column-row">
                    <div className="column-info">
                      <span className="column-icon">{getColumnIcon(column)}</span>
                      <span className="column-name">{column.name}</span>
                      <span className="column-type">{column.type}</span>
                      {column.required && <span className="required-indicator">*</span>}
                    </div>
                    {column.constraints && column.constraints.length > 0 && (
                      <div className="column-constraints">
                        {column.constraints.map((constraint, i) => (
                          <span key={i} className="constraint-tag">{constraint}</span>
                        ))}
                      </div>
                    )}
                    {column.description && (
                      <div className="column-description">{column.description}</div>
                    )}
                    {column.references && (
                      <div className="column-reference">References: {column.references}</div>
                    )}
                  </div>
                ))}
                {table.columns.length > 3 && (
                  <div className="column-row" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    {table.columns.length - 3} more columns...
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Render relationship lines here with SVG paths */}
          {schema.tables.flatMap(table => 
            table.relationships.map((rel, idx) => {
              // This is a simplified example - in a real implementation, 
              // you'd calculate actual line coordinates based on table positions
              const isActive = selectedRelationship === `${table.name}-${rel.target}-${idx}`;
              return (
                <svg 
                  key={`${table.name}-${rel.target}-${idx}`}
                  className={`relationship-line ${isActive ? 'relationship-line-active' : ''}`}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 5
                  }}
                  onClick={() => setSelectedRelationship(`${table.name}-${rel.target}-${idx}`)}
                >
                  <path 
                    d="M100,100 C200,100 200,200 300,200" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="2"
                  />
                </svg>
              );
            })
          )}
        </div>

        <div className="schema-details">
          <h3>{selectedTable ? `${selectedTable} Details` : 'Select a Table'}</h3>
          
          {tableDetails && (
            <div className="relationships-section">
              <h4>Relationships</h4>
              {tableDetails.relationships.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No relationships defined</p>
              )}
              
              {tableDetails.relationships.map((rel, idx) => (
                <div 
                  key={idx} 
                  className="relationship-item"
                  onClick={() => setSelectedRelationship(`${tableDetails.name}-${rel.target}-${idx}`)}
                >
                  <span className="relationship-type">{rel.type}</span>
                  <span className="relationship-target">{rel.target}</span>
                  {rel.description && (
                    <p className="relationship-description">{rel.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="schema-legend">
        <h4>Schema Legend</h4>
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
            <span className="legend-icon">📊</span>
            <span>Regular Column</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol">*</span>
            <span>Required Field</span>
          </div>
        </div>

        <div className="relation-legend">
          <h4>Relationship Types</h4>
          <div className="relation-items">
            <div className="relation-item">
              <span>1:1</span>
              <span>One-to-One</span>
            </div>
            <div className="relation-item">
              <span>1:N</span>
              <span>One-to-Many</span>
            </div>
            <div className="relation-item">
              <span>N:M</span>
              <span>Many-to-Many</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchemaDiagram;
