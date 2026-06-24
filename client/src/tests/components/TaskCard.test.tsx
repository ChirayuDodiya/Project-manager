import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/ProjectDetail/TaskCard';
import type { ProjectTask } from '../../types';

const mockNavigate = vi.fn();

// Mock dnd-kit hooks
vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({
    ref: vi.fn(),
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/abstract', () => ({
  CollisionPriority: {
    High: 'high',
  },
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ slug: 'project-slug-1' }),
}));

describe('TaskCard Component Rendering & Interaction Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseTask: ProjectTask = {
    id: 123,
    title: 'Test Task Card Rendering',
    due_date: '2026-06-30T00:00:00.000Z',
    priority: 'high',
    status: 'in_progress',
    estimated_hours: 4.5,
    actual_hours: null,
    project_owner_id: 1,
    assigned_to: {
      id: 99,
      name: 'Jane Developer',
      email: 'jane@example.com',
      role: 'developer',
      avatar_url: null,
    },
  };

  it('renders title, assignee, formatted due date, and priority badge', () => {
    render(<TaskCard task={baseTask} index={0} />);

    // Check title
    expect(screen.getByText('Test Task Card Rendering')).toBeInTheDocument();

    // Check assignee name
    expect(screen.getByText('Jane Developer')).toBeInTheDocument();

    // Check due date format (2026-06-30)
    expect(screen.getByText('2026-06-30')).toBeInTheDocument();

    // Check priority badge text
    const badge = screen.getByText('high');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-[#4c1c1c]/30');
  });

  it('displays default text if no assignee is set', () => {
    const unassignedTask = { ...baseTask, assigned_to: null };
    render(<TaskCard task={unassignedTask} index={0} />);

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('navigates to task details route on card click', () => {
    render(<TaskCard task={baseTask} index={0} />);

    const card = document.getElementById('task-card-123');
    expect(card).not.toBeNull();

    fireEvent.click(card!);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/project-slug-1/tasks/123');
  });

  it('adds overdue visual border styling if task is in_progress and due date has passed', () => {
    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const overdueTask = {
      ...baseTask,
      due_date: yesterday.toISOString(),
      status: 'in_progress' as const,
    };

    render(<TaskCard task={overdueTask} index={0} />);

    const cardElement = document.getElementById('task-card-123');
    expect(cardElement).toHaveClass('border-red-500/80');
    expect(screen.getByText(yesterday.toISOString().split('T')[0])).toHaveClass('text-red-400');
  });

  it('does not add overdue styling if task is completed even if due date has passed', () => {
    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const completedOverdueTask = {
      ...baseTask,
      due_date: yesterday.toISOString(),
      status: 'done' as const,
    };

    render(<TaskCard task={completedOverdueTask} index={0} />);

    const cardElement = document.getElementById('task-card-123');
    expect(cardElement).not.toHaveClass('border-red-500/80');
    expect(screen.getByText(yesterday.toISOString().split('T')[0])).not.toHaveClass('text-red-400');
  });
});
