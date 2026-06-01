import type { Project } from '../types';
import { formatDate } from '../utils/formatDate';

interface ProjectDetailsCardProps {
  project: Project;
}

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const startDate = formatDate(project.start_date);
  const endDate = formatDate(project.end_date);

  return (
    <div className="w-[320px] bg-[#1e1e1e] border border-[#333] rounded-3xl p-6 text-white text-left font-sans select-none">
      <h2 className="text-xl font-bold text-white mb-2">{project.name}</h2>
      <div className="space-y-1.5 font-semibold text-white">
        <div>
          <span className="text-emerald-400">Status: </span>
          <span className="capitalize">{project.status}</span>
        </div>
        <div>
          <span className="text-emerald-400">Dates: </span>
          <span>
            {startDate} to {endDate}
          </span>
        </div>
        <div>
          <span className="text-emerald-400">Owner: </span>
          <span className="capitalize">{project.owner?.name || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsCard;
