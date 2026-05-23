import { successResponse, errorResponse } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import prisma from '../../prisma/client.js';
import { serializeTask } from '../../serializers/task.serializer.js';

// PUT: /api/v1/tasks/{id} — Update task
const updateTask = asyncHandler(async (req, res) => {
  const task = req.task;
  const taskId = task.id;
  const updateData = { ...req.body };

  if (updateData.status && updateData.status !== task.status) {
    const statuses = ['todo', 'in_progress', 'in_review', 'done'];
    const currentIdx = statuses.indexOf(task.status);
    const newIdx = statuses.indexOf(updateData.status);

    if (newIdx > currentIdx + 1) {
      return errorResponse(
        res,
        `Invalid status transition from ${task.status} to ${updateData.status}`,
        400
      );
    }

    if (updateData.status === 'done') {
      const actualHours =
        updateData.actual_hours !== undefined ? updateData.actual_hours : task.actual_hours;
      if (actualHours === null || actualHours === undefined) {
        return errorResponse(res, 'Actual hours are required when moving task to done', 400);
      }
    }
  }

  const updatedTask = await prisma.tasks.update({
    where: { id: taskId },
    data: updateData,
    include: { users: true },
  });

  return successResponse(res, serializeTask(updatedTask), 'Task updated successfully');
});

// PATCH: /api/v1/tasks/{id}/status — Change status only (with transition validation)
const changeTaskStatus = asyncHandler(async (req, res) => {
  const task = req.task;
  const taskId = task.id;
  const { status, actual_hours } = req.body;

  if (status !== task.status) {
    const statuses = ['todo', 'in_progress', 'in_review', 'done'];
    const currentIdx = statuses.indexOf(task.status);
    const newIdx = statuses.indexOf(status);

    if (newIdx > currentIdx + 1) {
      return errorResponse(res, `Invalid status transition from ${task.status} to ${status}`, 400);
    }
  }

  if (status === 'done') {
    const actualHours = actual_hours !== undefined ? actual_hours : task.actual_hours;
    if (actualHours === null || actualHours === undefined) {
      return errorResponse(res, 'Actual hours are required when moving task to done', 400);
    }
  }

  const updateData = { status };
  if (actual_hours !== undefined) {
    updateData.actual_hours = actual_hours;
  }

  const updatedTask = await prisma.tasks.update({
    where: { id: taskId },
    data: updateData,
    include: { users: true },
  });

  return successResponse(res, serializeTask(updatedTask), 'Task status updated successfully');
});

// PATCH: /api/v1/tasks/{id}/assign — Assign/reassign task to a user
const assignTask = asyncHandler(async (req, res) => {
  const task = req.task;
  const taskId = task.id;
  const { assigned_to } = req.body;

  if (assigned_to !== undefined && assigned_to !== null) {
    const user = await prisma.users.findFirst({
      where: { id: assigned_to, deleted_at: null, is_active: true },
    });

    if (!user) {
      return errorResponse(res, 'Assigned user not found or is inactive', 400);
    }
  }

  const updatedTask = await prisma.tasks.update({
    where: { id: taskId },
    data: { assigned_to },
    include: { users: true },
  });

  return successResponse(res, serializeTask(updatedTask), 'Task assignment updated successfully');
});

// POST: /api/v1/tasks/reorder — Bulk update sort_order for drag-and-drop
const reorderTasks = asyncHandler(async (req, res) => {
  const tasks = req.body;

  if (!Array.isArray(tasks)) {
    return errorResponse(res, 'Request body must be an array', 400);
  }

  try {
    await prisma.$transaction(
      tasks.map((t) =>
        prisma.tasks.update({
          where: { id: t.id },
          data: { sort_order: t.sort_order },
        })
      )
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }

  return successResponse(res, null, 'Tasks reordered successfully');
});

// DELETE: /api/v1/tasks/{id} — Soft delete
const deleteTask = asyncHandler(async (req, res) => {
  const task = req.task;
  const taskId = task.id;

  const deletedTask = await prisma.tasks.update({
    where: { id: taskId },
    data: { deleted_at: new Date() },
  });

  return successResponse(res, null, 'Task deleted successfully');
});

export { updateTask, changeTaskStatus, assignTask, reorderTasks, deleteTask };
