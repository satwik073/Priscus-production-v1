import { useState } from 'react'

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

  return (
    <div className="project-form">
      <h2>Describe Your Project Idea</h2>
      <p>Enter your project title and description to get AI-powered analysis and planning</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., AI-Powered Task Management App"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project idea, target audience, key features, and goals..."
            rows={6}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading || !title.trim() || !description.trim()}>
          {loading ? 'Analyzing...' : 'Analyze Project'}
        </button>
      </form>
    </div>
  )
}

