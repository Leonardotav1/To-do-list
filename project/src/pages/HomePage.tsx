import { ModalTask } from "@/components/Modal/Modal"
import { ModeToggle } from "@/components/Theme/mode-toogle"
import { Button } from "@/components/ui/button"
import { useTask } from "@/contexts/TodoContext"
import { Pen, Trash } from "lucide-react"
import { useState } from "react"
import imagem_vazia from "@/assets/undraw_add-notes_9xls.svg"

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

    // Função para colocar as datas no formato do JS.
    const parseBRDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/").map(Number)
        return new Date(year, month - 1, day).getTime()
    }


    return (
        <div className="flex flex-col justify-start gap-10 h-screen p-5  ">

            <div className="flex justify-center md:fixed md:top-8 md:right-8 ">
                <ModeToggle />
            </div>


            <span className="font-sans text-4xl text-center sm:text-5xl ">Lista de Lembretes</span>

            <div className="flex justify-center">
                <Button
                    className="bg-[#684afc] hover:bg-[#492cdb] text-white text-1xl p-6 cursor-pointer sm:text-2xl sm:p-7"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                >
                    Adicione uma tarefa
                </Button>
            </div>



            {Object.entries(tasksByDate).length === 0 ? (
                <div className="flex flex-col items-center justify-around h-full">
                    <div className="text-3xl text-center">Nenhuma tarefa por aqui</div>
                    <img src={imagem_vazia} alt="Adicione alguma coisa" />
                </div>

            ) : (
                <div className="flex flex-col items-center ">
                    <div className="flex max-sm:flex-col flex-wrap justify-center gap-y-5 gap-x-10 w-full">
                        {/* Exibe em ordem crescente de datas */}
                        {Object.entries(tasksByDate)
                            .sort(([dateA], [dateB]) => parseBRDate(dateA) - parseBRDate(dateB))
                            .map(([date, tasks]) => (
                                <div key={date} className="flex-none w-full max-w-full xl:w-1/4 flex flex-col border border-gray-200 shadow-md rounded-xl p-4">
                                    <h2 className="text-[1.4em] text-center sm:text-2xl">
                                        🗓️ {date}
                                    </h2>
                                    <hr className=" border-slate-400 w-full my-2" />


                                    {tasks.map((task, index) => (
                                        <div key={index} className="flex text-2xl gap-2 p-1">
                                            <div className="flex w-full items-center justify-between bg-card p-3 gap-3 rounded-lg transition">

                                                <span className="flex w-[70%]">{task.text}</span>

                                                <div className=" flex flex-col gap-2 sm:flex-row">
                                                    <Button
                                                        className="bg-blue-500 p-2 rounded-md hover:bg-blue-600"
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
                                                        className="bg-rose-700 p-2 rounded-md hover:bg-rose-800"
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