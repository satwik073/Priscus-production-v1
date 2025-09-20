import { TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target, Sparkles, ArrowRight } from 'lucide-react'

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

interface ProjectAnalysisProps {
  data: AnalysisData
  onGenerateKanban: () => void
  onGenerateWorkflow: () => void
  onGenerateUIDesign: () => void
  loading: boolean
}

export function ProjectAnalysis({ 
  data, 
  onGenerateKanban, 
  onGenerateWorkflow, 
  onGenerateUIDesign,
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
            {data.pillars.map((pillar, index) => (
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
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent-green" />
            Advantages
          </h3>
          <ul className="space-y-2">
            {data.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                <CheckCircle className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-yellow" />
            Challenges
          </h3>
          <ul className="space-y-2">
            {data.disadvantages.map((disadvantage, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                <AlertTriangle className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
                <span>{disadvantage}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Features */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent-orange" />
            Suggested Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.features.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-sm rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-purple" />
          Recommendations
        </h3>
        <ul className="space-y-3">
          {data.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3 text-dark-text-secondary">
              <div className="w-6 h-6 bg-accent-purple/20 text-accent-purple rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generation Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-6 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-accent-blue" />
          Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  )
}

