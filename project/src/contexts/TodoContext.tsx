import { createContext, useContext, useState, type ReactNode } from "react";


interface ITodoContextProps {
    dateTasks: [] | string
}

// interface IDateTask{

// }

const TodoContext = createContext<ITodoContextProps | undefined>(undefined)

export const TodoProvider = ({ children }: { children: ReactNode }) => {

    const [dateTasks, setDateTasks] = useState([])
    



    return (
        <TodoContext.Provider value={{
            dateTasks,
        }}>
            {children}
        </TodoContext.Provider>
    )
}

export const useTask = () => {
    const context = useContext(TodoContext)
    if (!context) throw new Error("UseTask deve ser usado dentro do TodoProvider")
    return context
}