import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  listProjects,
  createProject,
  showProject,
  updateProject,
  deleteProject,
  projectStats,
  listTasks,
  createTask,
} from '../controllers/project/project.controller.js';
import { ProjectPolicy } from '../policies/project.policy.js';
import { TaskPolicy } from '../policies/task.policy.js';
import { validateCreateProject, validateUpdateProject } from '../validators/project.validator.js';
import { validateCreateTask } from '../validators/task.validator.js';

const router = express.Router();

router.get('/', authMiddleware, listProjects);
router.post('/', authMiddleware, validateCreateProject, ProjectPolicy.canCreate, createProject);
router.get('/:slug', authMiddleware, showProject);
router.put('/:slug', authMiddleware, validateUpdateProject, ProjectPolicy.canUpdate, updateProject);
router.delete('/:slug', authMiddleware, ProjectPolicy.canDelete, deleteProject);
router.get('/:slug/stats', authMiddleware, projectStats);
router.get('/:slug/tasks', authMiddleware, listTasks);
router.post('/:slug/tasks', authMiddleware, validateCreateTask, TaskPolicy.canCreate, createTask);

export default router;
