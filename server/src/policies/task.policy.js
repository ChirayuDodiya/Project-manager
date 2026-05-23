import { errorResponse } from '../utils/response.js';

const TaskPolicy = {
  canCreate(req, res, next) {
    next();
  },

  canUpdate(req, res, next) {
    const user = req.user;
    const project = req.project;

    if (user?.role === 'admin' || project?.owner_id === user?.id) {
      return next();
    }

    return errorResponse(res, 'You are not authorized to update this task.', 403);
  },

  canDelete(req, res, next) {
    const user = req.user;

    if (user?.role === 'admin') {
      return next();
    }

    return errorResponse(res, 'You are not authorized to delete this task.', 403);
  },

  canChangeStatus(req, res, next) {
    const user = req.user;
    const task = req.task;

    if (user?.role === 'admin' || user?.role === 'manager' || task?.assigned_to === user?.id) {
      return next();
    }

    return errorResponse(res, 'You are not authorized to change the status of this task.', 403);
  },

  canAssign(req, res, next) {
    const user = req.user;
    const project = req.project;

    if (user?.role === 'admin' || user?.role === 'manager' || project?.owner_id === user?.id) {
      return next();
    }

    return errorResponse(res, 'You are not authorized to assign this task.', 403);
  },
};

export { TaskPolicy };
