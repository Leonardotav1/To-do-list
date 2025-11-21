import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Tipo para as tasks em formato de objeto com seus respectivos campos.
type TaskItem = {
    text: string,
    done: boolean
}

// Tipo para armazenar as tasks por data.
export type TasksByDate = {
    [date: string]: TaskItem[]
}

// Interface para as props.
interface ITodoContextProps {
    addTask: (date: string, task: string) => void
    addTasksDay: (date: string, task: string) => void
    removeTask: (date: string, index: number) => void
    editTask: (date: string, newTask: string, idTask: number) => void
    tasksByDate: TasksByDate
    setTasksByDate: React.Dispatch<React.SetStateAction<TasksByDate>>
}

// Criação do contexto.
const TodoContext = createContext<ITodoContextProps | undefined>(undefined)

// Provider que encapsula os dados.
export const TodoProvider = ({ children }: { children: ReactNode }) => {

    // Armazenamento das tasks
    const [tasksByDate, setTasksByDate] = useState<TasksByDate>(() => {
        // Verifica se há dados salvos no localStorage
        const saved = localStorage.getItem("tasks")
        // Se houver, retorna o JSON parseado, senão retorna um objeto vazio.
        return saved ? JSON.parse(saved) : {}
    })

    // Carrega os dados do localStorage ao iniciar o app.
    useEffect(() => {
        const saved = localStorage.getItem("tasks")
        if (saved) {
            try {
                setTasksByDate(JSON.parse(saved))
            } catch (err) {
                console.error("Erro ao carregar dados do localStorage", err)
            }
        }
    }, [])


    // Armazena o objeto de tasks ao localStrorage.
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasksByDate))
    }, [tasksByDate])

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

    const addTasksDay = (date: string, task: string) => {
        setTasksByDate(prev => {
            const newTasks = {...prev}

            if(!newTasks[date]) return prev

            newTasks[date] = [
                ...newTasks[date],
                {
                    text: task,
                    done: false
                }
            ]

            return newTasks
        })
    }

    // Função para remover uma task por dia
    const removeTask = (date: string, index: number) => {

        setTasksByDate(prev => {
            const newTasks = { ...prev }

            // Verfica se há tasks nesse dia.
            if (!newTasks[date]) return prev

            // Percorre o array e remove a task de acordo com o index.
            newTasks[date] = newTasks[date].filter((_, i) => i !== index)

            // Se em um dia não existir tasks deleta ele.
            if (newTasks[date].length == 0) {
                delete newTasks[date]
            }

            return newTasks
        })
    }

    // Função para editar uma task específica.
    const editTask = (date: string, newTask: string, idTask: number) => {
        setTasksByDate(prev => {
            const newTasks = { ...prev }

            // Verifica se há tarefas nesse dia
            if (!newTasks[date]) return prev

            // Clona o array de tarefas do dia
            const updatedTasks = [...newTasks[date]]

            // Altera apenas o texto da task específica
            updatedTasks[idTask] = {
                ...updatedTasks[idTask],
                text: newTask
            }

            // Atualiza o objeto
            newTasks[date] = updatedTasks

            return newTasks
        })
    }


    return (
        <TodoContext.Provider value={{
            addTask,
            addTasksDay,
            removeTask,
            editTask,
            tasksByDate,
            setTasksByDate
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