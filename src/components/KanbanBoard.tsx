import { useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: string
  title: string
  description: string
  pipeline: string
  priority: string
  estimatedHours: number
  userStory: string
}

interface Pipeline {
  id: string
  name: string
  color: string
}

interface KanbanData {
  pipelines: Pipeline[]
  tasks: Task[]
}

interface KanbanBoardProps {
  data: KanbanData
}

interface TaskCardProps {
  task: Task
}

function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span 
          className="priority-badge" 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <span className="estimated-hours">{task.estimatedHours}h</span>
        <div className="user-story">
          <strong>User Story:</strong> {task.userStory}
        </div>
      </div>
    </div>
  )
}

interface PipelineColumnProps {
  pipeline: Pipeline
  tasks: Task[]
}

function PipelineColumn({ pipeline, tasks }: PipelineColumnProps) {
  const pipelineTasks = tasks.filter(task => task.pipeline === pipeline.id)

  return (
    <div className="pipeline-column">
      <div className="pipeline-header" style={{ backgroundColor: pipeline.color }}>
        <h3>{pipeline.name}</h3>
        <span className="task-count">{pipelineTasks.length}</span>
      </div>
      <SortableContext items={pipelineTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="pipeline-tasks">
          {pipelineTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export function KanbanBoard({ data }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(data.tasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newPipeline = over.id as string

    setTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, pipeline: newPipeline } : task
      )
    )
  }

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Project Kanban Board</h2>
        <p>Drag and drop tasks between pipelines to track progress</p>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-pipelines">
          {data.pipelines.map(pipeline => (
            <PipelineColumn 
              key={pipeline.id} 
              pipeline={pipeline} 
              tasks={tasks} 
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
