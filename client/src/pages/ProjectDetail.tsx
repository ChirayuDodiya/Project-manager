import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Project } from '../types';
import ProjectDetailsCard from '../components/ProjectDetailsCard';
import KanbanBoard from '../components/KanbanBoard';
import AddTaskModal from '../components/AddTaskModal';
import ProjectMembersModal from '../components/ProjectMembersModal';
import { socket } from '../services/socket';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  // Fetch project details
  useEffect(() => {
    let active = true;
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        if (active && response.data && response.data.success) {
          setProject(response.data.data.project);
        }
      } catch {
        // ignore error
      }
    };
    if (slug) {
      void fetchProject();
    }
    return () => {
      active = false;
    };
  }, [slug]);

  // Join/leave project socket room on mount/unmount
  useEffect(() => {
    if (slug) {
      socket.emit('join:project', slug);
    }
    return () => {
      if (slug) {
        socket.emit('leave:project', slug);
      }
    };
  }, [slug]);

  const handleProjectUpdated = (updatedProject: Project) => {
    setProject(updatedProject);
    if (updatedProject.slug !== slug) {
      navigate(`/projects/${updatedProject.slug}`, { replace: true });
    }
  };

  if (!project) {
    return null;
  }

  return (
    <main className="p-2 text-white min-h-full bg-[#121212] select-none">
      <div className=" mx-auto space-y-8 text-left">
        <div className="flex items-start gap-6">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center justify-center w-12 h-10 bg-[#043314] border border-white hover:bg-[#074c1f] rounded-xl text-white text-xl font-medium tracking-wide transition-colors duration-200 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#098032]"
            title="Back to Dashboard"
          >
            &lt;-
          </Link>

          {/* Project Details Card */}
          <ProjectDetailsCard project={project} onProjectUpdated={handleProjectUpdated} />

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => setIsAddTaskModalOpen(true)}
            className="self-end h-10 px-6 bg-[#043314] border border-white hover:bg-[#074c1f] rounded-xl text-white text-xl font-medium tracking-wide transition-colors duration-200 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#098032]"
          >
            Add Task
          </button>

          {/* Member List Button */}
          <button
            type="button"
            onClick={() => setIsMembersModalOpen(true)}
            className="self-end h-10 px-6 bg-[#1e1e1e] border border-white hover:bg-[#2d2d2d] rounded-xl text-white text-xl font-medium tracking-wide transition-colors duration-200 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#333]"
          >
            member list
          </button>
        </div>

        {/* Kanban Board */}
        {slug && <KanbanBoard slug={slug} />}

        {/* Add Task Modal */}
        {slug && (
          <AddTaskModal
            isOpen={isAddTaskModalOpen}
            onClose={() => setIsAddTaskModalOpen(false)}
            slug={slug}
          />
        )}

        {/* Project Members Modal */}
        {slug && (
          <ProjectMembersModal
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            slug={slug}
          />
        )}
      </div>
    </main>
  );
}

export default ProjectDetail;
