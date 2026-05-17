import { serializeUser } from './user.serializer.js';

const serializeTask = (task) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.due_date,
    estimated_hours: task.estimated_hours,
    actual_hours: task.actual_hours,
    sort_order: task.sort_order,
    assigned_to: task.assignedTo ? serializeUser(task.assignedTo) : null,
    created_at: task.createdAt,
  };
};

export { serializeTask };
