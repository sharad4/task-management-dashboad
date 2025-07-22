import { useReducer } from "react";
import { taskReducer, initialTaskState } from "../reducers/taskReducer";

export const useTaskManager = () => {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState);

    return {
        state,
        dispatch
    };
};