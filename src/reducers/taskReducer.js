

export const TASK_ACTIONS = {
    ADD_TASK: 'ADD_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    DELETE_TASK: 'DELETE_TASK',
    SET_FILTER: 'SET_FILTER',
    SET_SORT: 'SET_SORT',
    BULK_UPDATE: 'BULK_UPDATE'
};

export const initialTaskState = {
    tasks: [
        {
            id: 1,
            title: 'Learn React 19',
            priority: 'high',
            status: 'in-progress',
            assignee: 'John',
            createdAt: new Date()
        },
         {
            id: 2,
            title: 'Build Dashboard',
            priority: 'medium',
            status: 'todo',
            assignee: 'Jane',
            createdAt: new Date()
        },
         {
            id: 3,
            title: 'Write Tests',
            priority: 'low',
            status: 'completed',
            assignee: 'Bob',
            createdAt: new Date()
        },
    ],
    filter: 'all',
    sortBy: 'createdAt'
};

export const taskReducer = (state, action) => {
    switch (action.type) {
        case TASK_ACTIONS.ADD_TASK:
            return {
                ...state,
                tasks: [...state.tasks, {
                    ...action.payload,
                    id: Date.now(),
                    createdAt: new Date()
                }]
            };

        case TASK_ACTIONS.UPDATE_TASK:
            return {
                ...state,
                tasks: state.tasks.map(task => task.id === action.payload.id ? {...task, ...action.payload} : task)
            };
        case TASK_ACTIONS.DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload)
            };
        case TASK_ACTIONS.SET_FILTER:
            return {
                ...state,
                filter: action.payload
            }
        case TASK_ACTIONS.SET_SORT:
            return {
             ...state,
             sortBy: action.payload
            }
        case TASK_ACTIONS.BULK_UPDATE:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    action.payload.ids.includes(task.id)
                    ? {...task, ...action.payload.updates}
                    : task
                )
            };

            default:
                return state;
    }
}