import { useState } from 'react'
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react'

interface ProjectFormProps {
  onSubmit: (data: { title: string; description: string }) => void
  loading: boolean
}

export function ProjectForm({ onSubmit, loading }: ProjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() })
    }
  }

  const exampleProjects = [
    {
      title: "AI-Powered Task Management App",
      description: "A smart productivity app that uses AI to prioritize tasks, predict deadlines, and optimize workflows for remote teams."
    },
    {
      title: "E-commerce Platform for Local Artisans",
      description: "A marketplace connecting local artisans with customers, featuring AR try-on, custom ordering, and sustainable shipping options."
    },
    {
      title: "Mental Health & Wellness Tracker",
      description: "A comprehensive app for tracking mood, meditation, sleep patterns, and connecting users with mental health resources."
    }
  ]

  const fillExample = (example: typeof exampleProjects[0]) => {
    setTitle(example.title)
    setDescription(example.description)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb className="w-8 h-8 text-accent-orange" />
          <h1 className="text-3xl font-bold text-dark-text-primary">Create New Project</h1>
          <Sparkles className="w-8 h-8 text-accent-blue" />
        </div>
        <p className="text-dark-text-secondary text-lg">
          Transform your project idea into actionable plans with AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-dark-text-primary">
                Project Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-Powered Task Management App"
                className="search-input w-full"
                required
                disabled={loading}
              />
              <p className="text-xs text-dark-text-muted">
                Give your project a clear, descriptive name
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-dark-text-primary">
                Project Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project idea, target audience, key features, and goals..."
                rows={8}
                className="search-input w-full resize-none"
                required
                disabled={loading}
              />
              <p className="text-xs text-dark-text-muted">
                Include details about your target audience, main features, and business goals
              </p>
            </div>

            {/* Character Count */}
            <div className="text-right text-xs text-dark-text-muted">
              {description.length} characters
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !title.trim() || !description.trim()}
              className="modern-button w-full flex items-center justify-center gap-2 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing Project...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Project
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Examples & Tips */}
        <div className="space-y-6">
          {/* Example Projects */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-yellow" />
              Example Projects
            </h3>
            <div className="space-y-3">
              {exampleProjects.map((example, index) => (
                <button
                  key={index}
                  onClick={() => fillExample(example)}
                  className="w-full text-left p-3 hover:bg-dark-hover rounded-lg transition-colors group"
                  disabled={loading}
                >
                  <h4 className="font-medium text-dark-text-primary text-sm group-hover:text-accent-orange transition-colors">
                    {example.title}
                  </h4>
                  <p className="text-xs text-dark-text-muted mt-1 line-clamp-2">
                    {example.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-dark-text-primary mb-4">💡 Tips for Better Analysis</h3>
            <ul className="space-y-2 text-sm text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-green">•</span>
                Be specific about your target audience
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">•</span>
                Mention key features and functionality
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">•</span>
                Include business goals and success metrics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">•</span>
                Describe any technical requirements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">•</span>
                Mention timeline and budget constraints
              </li>
            </ul>
          </div>

          {/* Process Steps */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-dark-text-primary mb-4">🚀 What Happens Next</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent-orange text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <h4 className="text-sm font-medium text-dark-text-primary">AI Analysis</h4>
                  <p className="text-xs text-dark-text-muted">Get detailed project evaluation and scoring</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent-blue text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <h4 className="text-sm font-medium text-dark-text-primary">Kanban Generation</h4>
                  <p className="text-xs text-dark-text-muted">Automated task breakdown and planning</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent-green text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <h4 className="text-sm font-medium text-dark-text-primary">Workflow Design</h4>
                  <p className="text-xs text-dark-text-muted">Technical and user workflow visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

