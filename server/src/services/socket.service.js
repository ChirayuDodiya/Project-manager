// Broadcasts an event to a specific project room
export const broadcastToProject = (req, projectSlug, event, data) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`project:${projectSlug}`).emit(event, data);
  }
};

// Broadcasts when a task's status changes
export const broadcastTaskStatusChange = (req, projectSlug, task) => {
  broadcastToProject(req, projectSlug, 'task:status_changed', task);
};

// Broadcasts when a new comment is added
export const broadcastCommentAdded = (req, projectSlug, comment) => {
  broadcastToProject(req, projectSlug, 'comment:added', comment);
};

// Broadcasts when a task is assigned or reassigned
export const broadcastTaskAssigned = (req, projectSlug, task) => {
  broadcastToProject(req, projectSlug, 'task:assigned', task);
};

// Broadcasts when a new task is created
export const broadcastTaskCreated = (req, projectSlug, task) => {
  broadcastToProject(req, projectSlug, 'task:created', task);
};

// Broadcasts when a task is deleted
export const broadcastTaskDeleted = (req, projectSlug, taskId) => {
  broadcastToProject(req, projectSlug, 'task:deleted', { taskId });
};

// Broadcasts when a task is updated (e.g. title, desc, priority, etc)
export const broadcastTaskUpdated = (req, projectSlug, task) => {
  broadcastToProject(req, projectSlug, 'task:updated', task);
};

// Broadcasts when a comment is updated
export const broadcastCommentUpdated = (req, projectSlug, comment) => {
  broadcastToProject(req, projectSlug, 'comment:updated', comment);
};

// Broadcasts when a comment is deleted
export const broadcastCommentDeleted = (req, projectSlug, commentId) => {
  broadcastToProject(req, projectSlug, 'comment:deleted', { commentId });
};
