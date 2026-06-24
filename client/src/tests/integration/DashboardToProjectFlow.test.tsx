import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import ProjectDetail from '../../pages/ProjectDetail';
import api from '../../services/api';

// Mock the API client
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock the socket service
vi.mock('../../services/socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock the useAuth hook to simulate a logged-in administrator
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Alice Manager', role: 'admin' },
    loading: false,
    logout: vi.fn(),
  }),
}));

// Mock drag and drop sortable library
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

describe('Integration Flow: Dashboard to Project Detail', () => {
  const mockStatsResponse = {
    data: {
      success: true,
      data: {
        total_projects: 1,
        active_tasks: 2,
        overdue_tasks: 0,
        completed_tasks_this_week: 0,
      },
    },
  };

  const mockProjectsResponse = {
    data: {
      success: true,
      data: [
        {
          id: 101,
          name: 'Integration Project Alpha',
          slug: 'integration-project-alpha',
          status: 'active',
          start_date: '2026-06-01T00:00:00.000Z',
          end_date: '2026-06-30T00:00:00.000Z',
          budget: '15000',
          owner: { id: 1, name: 'Alice Manager' },
          task_count: 5,
          completed_tasks: 2,
        },
      ],
      pagination: {
        page: 1,
        per_page: 20,
        total_pages: 1,
      },
    },
  };

  const mockProjectDetailResponse = {
    data: {
      success: true,
      data: {
        project: {
          id: 101,
          name: 'Integration Project Alpha',
          slug: 'integration-project-alpha',
          status: 'active',
          start_date: '2026-06-01T00:00:00.000Z',
          end_date: '2026-06-30T00:00:00.000Z',
          budget: '15000',
          owner: { id: 1, name: 'Alice Manager' },
          task_count: 5,
          completed_tasks: 2,
        },
      },
    },
  };

  const mockProjectStatsResponse = {
    data: {
      success: true,
      data: {
        total_logged_hours: 24.5,
        overdue_tasks: 1,
        task_status_breakdown: {
          todo: 2,
          in_progress: 1,
          in_review: 1,
          done: 1,
        },
      },
    },
  };

  const mockManagersResponse = {
    data: {
      success: true,
      data: [{ id: 1, name: 'Alice Manager', role: 'admin' }],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock API requests dynamically based on endpoint URLs
    vi.mocked(api.get).mockImplementation((url, config) => {
      if (url === '/dashboard/stats') {
        return Promise.resolve(mockStatsResponse);
      }
      if (url === '/projects') {
        return Promise.resolve(mockProjectsResponse);
      }
      if (url === '/projects/managers') {
        return Promise.resolve(mockManagersResponse);
      }
      if (url === '/projects/integration-project-alpha') {
        return Promise.resolve(mockProjectDetailResponse);
      }
      if (url === '/projects/integration-project-alpha/stats') {
        return Promise.resolve(mockProjectStatsResponse);
      }
      if (url === '/projects/integration-project-alpha/tasks') {
        const statusParam = config?.params?.status;
        const tasks = [
          {
            id: 501,
            title: 'Integrate User Auth',
            status: 'todo',
            priority: 'high',
            due_date: '2026-06-25T00:00:00.000Z',
            assigned_to: { id: 2, name: 'Bob Developer' },
          },
        ];
        const filteredTasks = tasks.filter((t) => t.status === statusParam);
        return Promise.resolve({
          data: {
            success: true,
            data: filteredTasks,
            pagination: { page: 1, per_page: 20, total_pages: 1 },
          },
        });
      }
      return Promise.reject(new Error(`Unhandled mock API request: ${url}`));
    });
  });

  it('navigates from dashboard projects list to project detail board on clicking card', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // 1. Dashboard displays stats and project card list
    await waitFor(() => {
      expect(screen.getByText('Integration Project Alpha')).toBeInTheDocument();
    });

    // Check project stats counters are visible on the dashboard
    expect(screen.getByText(/total projects/i)).toBeInTheDocument();

    // 2. Click the project card to navigate to detail board
    const projectCardLink = screen.getByText('Integration Project Alpha');
    fireEvent.click(projectCardLink);

    // 3. Project Detail page displays dynamic stats and the board
    // Wait for the project title to appear in the details card
    await waitFor(() => {
      expect(screen.getByText('Owner:')).toBeInTheDocument();
      expect(screen.getByText('Alice Manager')).toBeInTheDocument();
    });

    // Verify task board loads tasks from mock API inside waitFor block to handle async rendering
    await waitFor(() => {
      expect(screen.getByText('Integrate User Auth')).toBeInTheDocument();
      expect(screen.getByText('Bob Developer')).toBeInTheDocument();
    });

    // Verify status headings render
    expect(screen.getByText('todo')).toBeInTheDocument();
  });
});
