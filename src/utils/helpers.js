import { PRIORITY_COLORS, PRIORITY_ORDER } from "./constant";
import { SortBy } from '../types/index';

export const validateTaskForm = (formData) => {
    const errors = {};

    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.assignee?.trim()) errors.assignee = 'Assignee is required';
    return errors;
};

export const sortTasks = (tasks, sortBy) => {
    return [...tasks].sort((a, b) => {
        switch (sortBy) {
            case SortBy.PRIORITY:
                return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
            case SortBy.TITLE:
                return a.title.localeCompare(b.title);
            case SortBy.CREAETD_AT:
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
};

export const filterTasks = (tasks, filter, searchTerm) => {
    let filtered = tasks;

    if (filter !== 'all') {
        filtered = filtered.filter(task => task.status === filter);
    }

    if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(task => task.title.toLowerCase().includes(lowerSearchTerm) ||
            task.assignee.toLowerCase().includes(lowerSearchTerm)
        );
    }

    return filtered;
};