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
