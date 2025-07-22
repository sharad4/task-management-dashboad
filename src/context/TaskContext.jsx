import { createContext, useContext } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children, value }) => {
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
