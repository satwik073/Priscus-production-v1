import React, { useState } from 'react'
import { Monitor, Smartphone, Tablet, Palette, Type, Layout, Users, Shield, Eye, ArrowRight, Play, Pause, Maximize2, Minimize2 } from 'lucide-react'

interface DetailedDesignData {
  wireframes: Array<{
    id: string;
    name: string;
    description: string;
    type: 'desktop' | 'mobile' | 'tablet';
    components: Array<{
      id: string;
      name: string;
      type: string;
      position: { x: number; y: number; width: number; height: number };
      properties: Record<string, any>;
      content?: string;
      interactions?: Array<{
        type: string;
        action: string;
        target?: string;
      }>;
    }>;
    layout: {
      width: number;
      height: number;
      gridColumns: number;
      gridGap: number;
      backgroundColor: string;
    };
  }>;
  userFlow: Array<{
    id: string;
    name: string;
    description: string;
    steps: Array<{
      id: string;
      name: string;
      description: string;
      wireframeId: string;
      userAction: string;
      systemResponse: string;
      nextStepId?: string;
      conditions?: Array<{
        condition: string;
        nextStepId: string;
      }>;
    }>;
  }>;
  designSystem: {
    colors: Array<{
      name: string;
      value: string;
      usage: string;
      description: string;
    }>;
    typography: Array<{
      name: string;
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      usage: string;
      description: string;
    }>;
    spacing: Array<{
      name: string;
      value: number;
      usage: string;
      description: string;
    }>;
    components: Array<{
      name: string;
      type: string;
      description: string;
      properties: Record<string, any>;
      variants: Array<{
        name: string;
        description: string;
        properties: Record<string, any>;
      }>;
    }>;
  };
  accessibility: {
    guidelines: Array<{
      guideline: string;
      description: string;
      implementation: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    testing: Array<{
      test: string;
      description: string;
      tools: string[];
    }>;
  };
  responsive: {
    breakpoints: Array<{
      name: string;
      minWidth: number;
      maxWidth?: number;
      description: string;
    }>;
    layouts: Array<{
      breakpoint: string;
      wireframeId: string;
      changes: Array<{
        componentId: string;
        changes: Record<string, any>;
      }>;
    }>;
  };
}

interface DetailedDesignVisualizerProps {
  data: DetailedDesignData
}

export function DetailedDesignVisualizer({ data }: DetailedDesignVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'wireframes' | 'userflow' | 'designsystem' | 'accessibility' | 'responsive'>('wireframes')
  const [selectedWireframe, setSelectedWireframe] = useState<string | null>(null)
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-4 h-4" />
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const renderWireframes = () => (
    <div className="space-y-6">
      {/* Wireframes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.wireframes.map((wireframe) => (
          <div 
            key={wireframe.id}
            className={`glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedWireframe === wireframe.id ? 'ring-2 ring-accent-blue' : ''
            }`}
            onClick={() => setSelectedWireframe(selectedWireframe === wireframe.id ? null : wireframe.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              {getDeviceIcon(wireframe.type)}
              <h3 className="font-semibold text-dark-text-primary">{wireframe.name}</h3>
            </div>
            <p className="text-sm text-dark-text-secondary mb-4">{wireframe.description}</p>
            
            {/* Wireframe Preview */}
            <div 
              className="border border-dark-border rounded-lg bg-white relative overflow-hidden"
              style={{ 
                width: '100%', 
                height: '200px',
                backgroundColor: wireframe.layout.backgroundColor,
                backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
                backgroundSize: `${wireframe.layout.gridGap}px ${wireframe.layout.gridGap}px`
              }}
            >
              {/* Render Components */}
              {wireframe.components.map((component) => (
                <div
                  key={component.id}
                  className="absolute border border-gray-300 bg-white/80 backdrop-blur-sm rounded-sm flex items-center justify-center text-xs text-gray-600"
                  style={{
                    left: `${(component.position.x / wireframe.layout.width) * 100}%`,
                    top: `${(component.position.y / wireframe.layout.height) * 100}%`,
                    width: `${(component.position.width / wireframe.layout.width) * 100}%`,
                    height: `${(component.position.height / wireframe.layout.height) * 100}%`,
                    backgroundColor: component.properties.backgroundColor || '#ffffff',
                    color: component.properties.textColor || '#374151',
                    padding: component.properties.padding || '8px',
                    borderRadius: component.properties.borderRadius || '4px'
                  }}
                >
                  {component.name}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex justify-between text-xs text-dark-text-muted">
              <span>{wireframe.components.length} components</span>
              <span>{wireframe.layout.width}×{wireframe.layout.height}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Wireframe Details */}
      {selectedWireframe && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Wireframe Details</h3>
          {(() => {
            const wireframe = data.wireframes.find(w => w.id === selectedWireframe)
            if (!wireframe) return null
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-dark-text-primary mb-2">Layout Information</h4>
                    <div className="space-y-2 text-sm text-dark-text-secondary">
                      <div>Grid: {wireframe.layout.gridColumns} columns</div>
                      <div>Gap: {wireframe.layout.gridGap}px</div>
                      <div>Background: {wireframe.layout.backgroundColor}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text-primary mb-2">Components</h4>
                    <div className="space-y-2">
                      {wireframe.components.map((component) => (
                        <div key={component.id} className="flex items-center justify-between text-sm">
                          <span className="text-dark-text-primary">{component.name}</span>
                          <span className="text-dark-text-muted">{component.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Component Details */}
                <div>
                  <h4 className="font-medium text-dark-text-primary mb-3">Component Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wireframe.components.map((component) => (
                      <div key={component.id} className="glass-card p-4">
                        <h5 className="font-medium text-dark-text-primary mb-2">{component.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-dark-text-muted">Type:</span> {component.type}</div>
                          <div><span className="text-dark-text-muted">Position:</span> {component.position.x}, {component.position.y}</div>
                          <div><span className="text-dark-text-muted">Size:</span> {component.position.width}×{component.position.height}</div>
                          {component.content && (
                            <div><span className="text-dark-text-muted">Content:</span> {component.content}</div>
                          )}
                          {component.interactions && component.interactions.length > 0 && (
                            <div>
                              <span className="text-dark-text-muted">Interactions:</span>
                              <ul className="ml-2 mt-1">
                                {component.interactions.map((interaction, idx) => (
                                  <li key={idx} className="text-xs">{interaction.type}: {interaction.action}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )

  const renderUserFlow = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.userFlow.map((flow) => (
          <div 
            key={flow.id}
            className={`glass-card p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedFlow === flow.id ? 'ring-2 ring-accent-blue' : ''
            }`}
            onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark-text-primary">{flow.name}</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 bg-accent-blue/20 text-accent-blue rounded-lg hover:bg-accent-blue/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPlaying(!isPlaying)
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-sm text-dark-text-secondary mb-4">{flow.description}</p>
            <div className="space-y-3">
              {flow.steps.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-dark-text-primary text-sm">{step.name}</div>
                    <div className="text-xs text-dark-text-muted">{step.userAction}</div>
                  </div>
                </div>
              ))}
              {flow.steps.length > 3 && (
                <div className="text-xs text-dark-text-muted text-center">
                  +{flow.steps.length - 3} more steps
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Flow Details */}
      {selectedFlow && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Flow Details</h3>
          {(() => {
            const flow = data.userFlow.find(f => f.id === selectedFlow)
            if (!flow) return null
            
            return (
              <div className="space-y-4">
                {flow.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < flow.steps.length - 1 && (
                        <div className="w-0.5 h-8 bg-dark-border mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 glass-card p-4">
                      <h4 className="font-medium text-dark-text-primary mb-2">{step.name}</h4>
                      <p className="text-sm text-dark-text-secondary mb-3">{step.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-dark-text-muted">User Action:</span>
                          <p className="text-dark-text-primary">{step.userAction}</p>
                        </div>
                        <div>
                          <span className="text-dark-text-muted">System Response:</span>
                          <p className="text-dark-text-primary">{step.systemResponse}</p>
                        </div>
                      </div>
                      {step.conditions && step.conditions.length > 0 && (
                        <div className="mt-3">
                          <span className="text-dark-text-muted text-sm">Conditions:</span>
                          <ul className="mt-1 space-y-1">
                            {step.conditions.map((condition, idx) => (
                              <li key={idx} className="text-xs text-dark-text-secondary">
                                • {condition.condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )

  const renderDesignSystem = () => (
    <div className="space-y-6">
      {/* Colors */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-accent-orange" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Color Palette</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.designSystem.colors.map((color, index) => (
            <div key={index} className="space-y-2">
              <div 
                className="w-full h-16 rounded-lg border border-dark-border"
                style={{ backgroundColor: color.value }}
              ></div>
              <div>
                <div className="font-medium text-dark-text-primary">{color.name}</div>
                <div className="text-sm text-dark-text-muted">{color.value}</div>
                <div className="text-xs text-dark-text-secondary">{color.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Typography</h3>
        </div>
        <div className="space-y-4">
          {data.designSystem.typography.map((typography, index) => (
            <div key={index} className="space-y-2">
              <div 
                className="text-dark-text-primary"
                style={{
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize,
                  fontWeight: typography.fontWeight,
                  lineHeight: typography.lineHeight
                }}
              >
                {typography.name} - The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-sm text-dark-text-muted">
                {typography.fontFamily} • {typography.fontSize}px • {typography.fontWeight} • {typography.lineHeight}
              </div>
              <div className="text-xs text-dark-text-secondary">{typography.usage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-accent-purple" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Spacing Scale</h3>
        </div>
        <div className="space-y-3">
          {data.designSystem.spacing.map((space, index) => (
            <div key={index} className="flex items-center gap-4">
              <div 
                className="bg-accent-blue rounded"
                style={{ width: space.value, height: 20 }}
              ></div>
              <div>
                <span className="font-medium text-dark-text-primary">{space.name}</span>
                <span className="text-sm text-dark-text-muted ml-2">{space.value}px</span>
              </div>
              <div className="text-sm text-dark-text-secondary">{space.usage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Components */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-accent-blue" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Component Library</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.designSystem.components.map((component, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-dark-text-primary">{component.name}</h4>
              <p className="text-sm text-dark-text-secondary">{component.description}</p>
              <div className="space-y-2">
                {component.variants.map((variant, idx) => (
                  <div key={idx} className="glass-card p-3">
                    <div className="font-medium text-dark-text-primary text-sm">{variant.name}</div>
                    <div className="text-xs text-dark-text-muted">{variant.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAccessibility = () => (
    <div className="space-y-6">
      {/* Guidelines */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Accessibility Guidelines</h3>
        </div>
        <div className="space-y-4">
          {data.accessibility.guidelines.map((guideline, index) => (
            <div key={index} className={`glass-card p-4 border-l-4 ${getPriorityColor(guideline.priority)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-dark-text-primary">{guideline.guideline}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(guideline.priority)}`}>
                  {guideline.priority}
                </span>
              </div>
              <p className="text-sm text-dark-text-secondary mb-2">{guideline.description}</p>
              <p className="text-xs text-dark-text-muted">{guideline.implementation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testing */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-accent-blue" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Testing Recommendations</h3>
        </div>
        <div className="space-y-4">
          {data.accessibility.testing.map((test, index) => (
            <div key={index} className="glass-card p-4">
              <h4 className="font-medium text-dark-text-primary mb-2">{test.test}</h4>
              <p className="text-sm text-dark-text-secondary mb-3">{test.description}</p>
              <div className="flex flex-wrap gap-2">
                {test.tools.map((tool, idx) => (
                  <span key={idx} className="px-3 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderResponsive = () => (
    <div className="space-y-6">
      {/* Breakpoints */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-accent-orange" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Responsive Breakpoints</h3>
        </div>
        <div className="space-y-4">
          {data.responsive.breakpoints.map((breakpoint, index) => (
            <div key={index} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-dark-text-primary">{breakpoint.name}</h4>
                <span className="text-sm text-dark-text-muted">
                  {breakpoint.minWidth}px - {breakpoint.maxWidth ? `${breakpoint.maxWidth}px` : '∞'}
                </span>
              </div>
              <p className="text-sm text-dark-text-secondary">{breakpoint.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Adaptations */}
      {data.responsive.layouts.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-accent-purple" />
            <h3 className="text-lg font-semibold text-dark-text-primary">Layout Adaptations</h3>
          </div>
          <div className="space-y-4">
            {data.responsive.layouts.map((layout, index) => (
              <div key={index} className="glass-card p-4">
                <h4 className="font-medium text-dark-text-primary mb-2">
                  {layout.breakpoint} Layout
                </h4>
                <p className="text-sm text-dark-text-secondary mb-3">
                  Based on wireframe: {layout.wireframeId}
                </p>
                <div className="space-y-2">
                  {layout.changes.map((change, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-dark-text-muted">Component {change.componentId}:</span>
                      <div className="ml-4 text-dark-text-secondary">
                        {Object.entries(change.changes).map(([key, value]) => (
                          <div key={key}>{key}: {String(value)}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-dark-text-primary mb-2">Detailed Design System</h2>
        <p className="text-dark-text-secondary">
          Comprehensive wireframes, user flows, design system, and accessibility guidelines
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-card p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'wireframes', label: 'Wireframes', icon: Monitor },
            { id: 'userflow', label: 'User Flow', icon: ArrowRight },
            { id: 'designsystem', label: 'Design System', icon: Palette },
            { id: 'accessibility', label: 'Accessibility', icon: Shield },
            { id: 'responsive', label: 'Responsive', icon: Layout }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-accent-blue text-white'
                  : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-hover'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'wireframes' && renderWireframes()}
        {activeTab === 'userflow' && renderUserFlow()}
        {activeTab === 'designsystem' && renderDesignSystem()}
        {activeTab === 'accessibility' && renderAccessibility()}
        {activeTab === 'responsive' && renderResponsive()}
      </div>
    </div>
  )
}
