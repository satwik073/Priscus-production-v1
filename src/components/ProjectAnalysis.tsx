import { TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target, Sparkles, ArrowRight } from 'lucide-react'

interface AnalysisData {
  score: number
  summary?: string
  pillars: Array<{
    name: string
    score: number
    feedback: string
    strengths?: string[]
    challenges?: string[]
    architectureRecommendations?: string[]
    riskAssessment?: {
      level: string
      factors: string[]
      mitigations: string[]
    }
    targetAudience?: string[]
    marketSize?: string
    competitiveLandscape?: string[]
    differentiators?: string[]
    goToMarketStrategy?: string[]
    userJourneyHighlights?: string[]
    painPointsAddressed?: string[]
    accessibilityConsiderations?: string[]
    userRetentionStrategies?: string[]
    userResearchRecommendations?: string[]
    technicalScalability?: string[]
    businessScalability?: string[]
    resourceRequirements?: string[]
    growthLimitations?: string[]
    internationalExpansion?: string[]
    revenueModels?: string[]
    pricingStrategies?: string[]
    customerAcquisitionCost?: string
    lifetimeValue?: string
    breakEvenAnalysis?: string
    securityConsiderations?: string[]
    complianceRequirements?: string[]
    dataPrivacyApproach?: string[]
    securityTestingRecommendations?: string[]
    disruptionFactor?: string
    patentPotential?: string[]
    futureTrendAlignment?: string[]
    evolutionPotential?: string[]
  }>
  advantages: Array<{ title: string; description: string }>
  disadvantages: Array<{ title: string; description: string }>
  features: Array<{
    title: string
    description: string
    priority: string
    complexity: string
    userImpact: string
  }>
  recommendations: Array<{
    title: string
    description: string
    implementationSteps: string[]
    expectedOutcome: string
    timeframe: string
  }>
  technicalAnalysis?: any
  marketAnalysis?: any
  financialAnalysis?: any
}

interface ProjectAnalysisProps {
  data: AnalysisData
  onGenerateKanban: () => void
  onGenerateWorkflow: () => void
  onGenerateUIDesign: () => void
  onGenerateDetailedDesign: () => void
  loading: boolean
}

export function ProjectAnalysis({ 
  data, 
  onGenerateKanban, 
  onGenerateWorkflow, 
  onGenerateUIDesign,
  onGenerateDetailedDesign,
  loading 
}: ProjectAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-green'
    if (score >= 60) return 'text-accent-yellow'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-accent-green/10 border-accent-green'
    if (score >= 60) return 'bg-accent-yellow/10 border-accent-yellow'
    return 'bg-red-400/10 border-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent-orange" />
            <div>
              <h2 className="text-2xl font-bold text-dark-text-primary">Project Analysis</h2>
              <p className="text-dark-text-secondary">AI-powered analysis of your project requirements</p>
            </div>
          </div>
          
          {/* Overall Score */}
          <div className={`p-6 rounded-full border-2 ${getScoreBgColor(data.score)}`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}
              </div>
              <div className="text-sm text-dark-text-muted">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pillar Analysis */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-blue" />
            Pillar Analysis
          </h3>
          <div className="space-y-4">
            {data.pillars && data.pillars.length > 0 ? (
              data.pillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-dark-text-primary">{pillar.name}</span>
                    <span className={`font-bold ${getScoreColor(pillar.score)}`}>
                      {pillar.score}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-card rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        pillar.score >= 80 ? 'bg-accent-green' :
                        pillar.score >= 60 ? 'bg-accent-yellow' : 'bg-red-400'
                      }`}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-dark-text-secondary">{pillar.feedback}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-dark-text-muted">No pillar analysis available</div>
            )}
          </div>
        </div>

        {/* Advantages */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent-green" />
            Advantages
          </h3>
          <ul className="space-y-3">
            {data.advantages && data.advantages.length > 0 ? (
              data.advantages.map((advantage, index) => (
                <li key={index} className="space-y-1">
                  <div className="flex items-start gap-2 text-sm text-dark-text-primary font-medium">
                    <CheckCircle className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
                    <span>{advantage.title}</span>
                  </div>
                  <p className="text-sm text-dark-text-secondary ml-6">{advantage.description}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-dark-text-muted">No advantages identified</li>
            )}
          </ul>
        </div>

        {/* Challenges */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-yellow" />
            Challenges
          </h3>
          <ul className="space-y-3">
            {data.disadvantages && data.disadvantages.length > 0 ? (
              data.disadvantages.map((disadvantage, index) => (
                <li key={index} className="space-y-1">
                  <div className="flex items-start gap-2 text-sm text-dark-text-primary font-medium">
                    <AlertTriangle className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
                    <span>{disadvantage.title}</span>
                  </div>
                  <p className="text-sm text-dark-text-secondary ml-6">{disadvantage.description}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-dark-text-muted">No challenges identified</li>
            )}
          </ul>
        </div>

        {/* Suggested Features */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent-orange" />
            Suggested Features
          </h3>
          <div className="space-y-3">
            {data.features && data.features.length > 0 ? (
              data.features.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-sm rounded-full font-medium">
                      {feature.title}
                    </span>
                    {feature.priority && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        feature.priority === 'High' ? 'bg-red-100 text-red-800' :
                        feature.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {feature.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-text-secondary">{feature.description}</p>
                  <div className="flex gap-4 text-xs text-dark-text-muted">
                    {feature.complexity && <span>Complexity: {feature.complexity}</span>}
                    {feature.userImpact && <span>Impact: {feature.userImpact}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-dark-text-muted">No features suggested</div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-purple" />
          Recommendations
        </h3>
        <div className="space-y-4">
          {data.recommendations && data.recommendations.length > 0 ? (
            data.recommendations.map((recommendation, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent-purple/20 text-accent-purple rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-dark-text-primary">{recommendation.title}</h4>
                  <p className="text-sm text-dark-text-secondary">{recommendation.description}</p>
                  <div className="space-y-2">
                    {recommendation.expectedOutcome && (
                      <div className="text-xs text-dark-text-muted">
                        <strong>Expected Outcome:</strong> {recommendation.expectedOutcome}
                      </div>
                    )}
                    {recommendation.timeframe && (
                      <div className="text-xs text-dark-text-muted">
                        <strong>Timeframe:</strong> {recommendation.timeframe}
                      </div>
                    )}
                    {recommendation.implementationSteps && recommendation.implementationSteps.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-dark-text-muted font-medium">Implementation Steps:</div>
                        <ul className="text-xs text-dark-text-muted space-y-1 ml-4">
                          {recommendation.implementationSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <span className="text-accent-purple">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="text-sm text-dark-text-muted">No recommendations available</div>
          )}
        </div>
      </div>

      {/* Generation Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-accent-blue" />
          Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={onGenerateKanban} 
            disabled={loading}
            className="modern-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Generate Kanban Board
              </>
            )}
          </button>
          <button 
            onClick={onGenerateWorkflow} 
            disabled={loading}
            className="secondary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Generate Workflow
              </>
            )}
          </button>
          <button 
            onClick={onGenerateUIDesign} 
            disabled={loading}
            className="modern-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-accent-purple hover:bg-accent-purple/80"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate UI Design
              </>
            )}
          </button>
          <button 
            onClick={onGenerateDetailedDesign} 
            disabled={loading}
            className="modern-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-accent-green hover:bg-accent-green/80"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Detailed Design
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

