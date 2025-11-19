import { ModalTask } from "@/components/Modal/Modal"
import { Button } from "@/components/ui/button"
import { useTask } from "@/contexts/TodoContext"
import { set } from "date-fns"
import { Pen, Trash } from "lucide-react"
import { useState } from "react"
// import { useEffect } from "react"

export const Home = () => {
    // States para o modal de adicionar/editar task.
    const [modalOpen, setModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [newTaskDay, setNewTaskDay] = useState(false)

    // States para armazenar a task selecionada para edição.
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [selectedText, setSelectedText] = useState<string>("")

    // Pega as tasks do contexto e a função de remoção.
    const { tasksByDate, removeTask } = useTask()

    return (
        <div className="flex flex-col justify-start gap-10 h-screen p-5 bg-slate-50">

            <span className="font-sans text-5xl text-center text-slate-800 ">Lista de Lembretes</span>

            <div className="flex justify-center">
                <Button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                >Adicione uma tarefa</Button>
            </div>



            {Object.entries(tasksByDate).length === 0 ? (
                <div className="text-2xl text-center">Nenhuma tarefa ainda</div>
            ) : (
                <div className="flex flex-col items-center ">
                    <div className="grid grid-cols-4 gap-7 justify-around w-full">
                        {Object.entries(tasksByDate).map(([date, tasks]) => (
                            <div key={date} className="flex flex-col bg-slate-100 p-2 rounded ">
                                <h2 className="text-2xl text-center">
                                    🗓️ {date}
                                </h2>
                                <hr className=" border-slate-400 w-full my-2" />


                                {tasks.map((task, index) => (
                                    <div key={index} className="flex text-2xl gap-2 p-1">
                                        <div className="flex w-full justify-between bg-slate-300 p-2 rounded">

                                            <p>{task.text}</p>

                                            <div className=" flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedDate(date)
                                                        setSelectedIndex(index)
                                                        setSelectedText(task.text)
                                                        setModalOpen(true)
                                                        setIsEditing(true)
                                                    }}
                                                >
                                                    <Pen />
                                                </Button>


                                                <Button
                                                    variant={"destructive"}
                                                    onClick={() => removeTask(date, index)}
                                                >
                                                    <Trash />
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                ))}

                                <Button
                                    className="mt-2 bg-[#7B61FF] hover:bg-[#6A52E0] cursor-pointer text-white"
                                    onClick={() => {
                                        setModalOpen(true)
                                        setNewTaskDay(true)
                                        setSelectedDate(date)
                                    }}
                                >+ Nova tarefa</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Janela modal para gerenciamento das tasks */}
            <ModalTask
                openDialog={modalOpen}
                onOpenDialogChange={setModalOpen}
                isEditing={isEditing}
                onOpenEditing={setIsEditing}
                newTaskDay={newTaskDay}
                onOpenNewTaskDay={setNewTaskDay}
                valueTask={selectedText}
                indexTask={selectedIndex ?? undefined}
                dateTask={selectedDate ?? undefined}
            />

        </div>
    )
}