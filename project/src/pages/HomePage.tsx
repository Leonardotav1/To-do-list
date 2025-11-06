import { ModalTask } from "@/components/Modal/Modal"
import { useTask } from "@/contexts/TodoContext"
import { useEffect } from "react"

export const Home = () => {

    const { tasksByDate } = useTask()

    useEffect(() => {

    }, [])

    return (
        <div>
            <div>
                <span>Clique aqui para adicionar uma tarefa</span>
            </div>

            <div>
                {/* Janela modal para adicionar uma tarefa */}
                <ModalTask />
            </div>

            <div>
                {/* Transforma o objeto em array, para usar o map */}
                {Object.entries(tasksByDate).map(([date, tasks]) => (
                    <div key={date}>
                        <h2>{date}</h2>
                        {/* Exibe as tasks daquele dia */}
                        {tasks.map((task, index)=>(
                            <div key={index} >
                                <p>{task.text}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}