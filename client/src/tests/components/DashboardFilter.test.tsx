import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { MemoryRouter } from 'react-router-dom';
import api from '../../services/api';

// Mock the API client
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock the AddProjectModal to isolate dashboard filters
vi.mock('../../components/Dashboard/AddProjectModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="mock-add-project-modal">Mock Add Project Modal</div> : null,
}));

describe('Dashboard Component Search & Status Filter Tests', () => {
  const mockStatsResponse = {
    data: {
      success: true,
      data: {
        total_projects: 2,
        active_tasks: 5,
        overdue_tasks: 0,
        completed_tasks_this_week: 1,
      },
    },
  };

  const mockProjectsResponse = {
    data: {
      success: true,
      data: [
        {
          id: 1,
          name: 'Project Alpha',
          slug: 'project-alpha',
          status: 'active',
          start_date: '2026-06-01T00:00:00.000Z',
          end_date: '2026-06-30T00:00:00.000Z',
          budget: '10000',
          owner: { id: 1, name: 'Alice Manager' },
        },
        {
          id: 2,
          name: 'Project Beta',
          slug: 'project-beta',
          status: 'planning',
          start_date: '2026-06-15T00:00:00.000Z',
          end_date: '2026-07-15T00:00:00.000Z',
          budget: '5000',
          owner: { id: 2, name: 'Bob Manager' },
        },
      ],
      pagination: {
        page: 1,
        per_page: 20,
        total_pages: 1,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/dashboard/stats') {
        return Promise.resolve(mockStatsResponse);
      }
      if (url === '/projects') {
        return Promise.resolve(mockProjectsResponse);
      }
      return Promise.reject(new Error('Unknown API call'));
    });
  });

  it('initially fetches and displays stats and projects list', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
    });

    // Check stats are rendered from mocked response (using case-insensitive matching)
    expect(screen.getByText(/active tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue tasks/i)).toBeInTheDocument();

    // Verify initial API params
    expect(api.get).toHaveBeenCalledWith('/projects', {
      params: {
        page: 1,
        per_page: 20,
      },
    });
  });

  it('updates project queries with search value after 400ms debounce interval', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Initial render fetch
    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    });

    // Reset calls to only track changes
    vi.mocked(api.get).mockClear();

    const searchInput = screen.getByPlaceholderText('search project');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    // Ensure the debounce has not fired immediately
    expect(api.get).not.toHaveBeenCalled();

    // Wait for 500ms using real setTimeout promise to allow debounce timer to execute inside act context
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Verify API is called with search query search parameters
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: {
          page: 1,
          per_page: 20,
          search: 'Alpha',
        },
      });
    });
  });

  it('instantly fetches updated projects list when status filter dropdown is changed', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    });

    vi.mocked(api.get).mockClear();

    // Select "planning" status filter option
    const selectDropdown = screen.getByRole('combobox');
    fireEvent.change(selectDropdown, { target: { value: 'planning' } });

    // Status change is instant (non-debounced). Wrap in waitFor to run assertion within act context
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: {
          page: 1,
          per_page: 20,
          status: 'planning',
        },
      });
    });
  });
});
