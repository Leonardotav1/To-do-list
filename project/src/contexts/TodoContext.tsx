import { createContext, useContext, useState, type ReactNode } from "react";

// Tipo para as tasks em formato de objeto com seus respectivos campos.
type TaskItem = {
        text: string,
        done: boolean
}

// Tipo para armazenar as tasks por data.
type TasksByDate = {
    [date: string]: TaskItem[]
}

// Interface para as props.
interface ITodoContextProps {
    addTask: (date: string, task: string) => void
    tasksByDate: TasksByDate

}

// Criação do contexto.
const TodoContext = createContext<ITodoContextProps | undefined>(undefined)

// Provider que encapsula os dados.
export const TodoProvider = ({ children }: { children: ReactNode }) => {

    // Armazenamento das tasks
    const [tasksByDate, setTasksByDate] = useState<TasksByDate>({})

    //Função para adicionar uma task de acordo com o dia.
    const addTask = (date: string, task: string) => {
        // Adiciona as tasks ao hook de tasks com o set.
        setTasksByDate(prev => {
            // Copia o estado anterior anterior
            const newTask = { ...prev }

            // Se não existir a data, adiciona ela no array
            if (!newTask[date]) {
                newTask[date] = [
                    // Objeto armazenado dentro do array
                    {
                        text: task,
                        done: false
                    }
                ]
            } else {
                // Se a data ja exisitir, percorre o array e adiciona tasks a ela.
                newTask[date] = [
                    ...newTask[date],
                    {
                        text: task,
                        done: false
                    }
                ]
            }

            // Retorna a task de acordo com a data
            return newTask

        })
    }



    return (
        <TodoContext.Provider value={{
            addTask,
            tasksByDate,
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