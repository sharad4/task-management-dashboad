import { createContext, useContext } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children, value }) => {
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error(`useTaskContext must be used within TaskProvider`);
  }
  return context;
};

export default TaskContext;
