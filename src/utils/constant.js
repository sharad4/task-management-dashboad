import { TaskPriority, TaskStatus } from '../types/index';

export const STATUS_COLORS = {
    [TaskStatus.TODO]: 'bg-gray-100 text-ggray-800',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800'
};

export const PRIORITY_COLORS = {
    [TaskPriority.LOW]: 'border-l-green-500',
    [TaskPriority.MEDIUM]: 'border-l-yellow-500',
    [TaskPriority.COMPLETED]: 'bg-l-red-500'
}

export const PRIORITY_ORDER = {
    [TaskPriority.HIGH]: 3,
    [TaskPriority.MEDIUM]: 2,
    [TaskPriority.LOW]: 1
};