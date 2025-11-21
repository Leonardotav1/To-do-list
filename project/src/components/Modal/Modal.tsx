import React, { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react"
import { useTask } from "@/contexts/TodoContext"

// Interface para as props do modal.
interface IModal {
    openDialog: boolean
    onOpenDialogChange: (open: boolean) => void
    isEditing: boolean
    onOpenEditing: (open: boolean) => void
    newTaskDay: boolean
    onOpenNewTaskDay: (open: boolean) => void
    valueTask?: string
    indexTask?: number
    dateTask?: string
}

export const ModalTask = ({
    openDialog,
    onOpenDialogChange,
    isEditing,
    onOpenEditing,
    newTaskDay,
    onOpenNewTaskDay,
    valueTask,
    indexTask,
    dateTask,
}: IModal) => {

    // States para controle do modal,input e data.
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [input, setInput] = useState("")

    // State para controlar erros
    const [error, setError] = useState("")

    // Pega as funções do contexto.
    const { addTask, editTask, addTasksDay } = useTask()

    // Formata a data selecionada para string.
    const dateString = date?.toLocaleDateString()

    // Função no modal que chama a função do contexto, para adicionar as tasks.
    const handleAddTask = () => {
        // Caso não exista a data retorna 
        if (!dateString) {
            return
        }

        addTask(dateString, input)
    }

    const handleAddTaskDay = () => {
        // Caso não exista a rota retorna.
        if (!dateTask) {
            return
        }

        addTasksDay(dateTask, input)
    }

    // Função que chama ao modal a função de editar tasks do contexto.
    const handleEditTask = () => {
        // Caso não exista nenhuma data ou index, retorna a mensagem.
        if (!dateTask || indexTask === undefined) {
            return
        }

        editTask(dateTask, input, indexTask)
    }

    // Handler que chama a função para adicionar ou editar tasks.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Verifica se o input está vazio
        if (input.trim() === "") {
            setError("Digite algo")
            return
        }

        // Verifica se existe uma data.
        if (!isEditing && !newTaskDay && !date) {
            setError("Selecione uma data")
            return
        }

        // Após o envio seta o erro como vazio novamente
        setError("")

        // Chama a função de acordo com o que foi pedido no front.
        if (isEditing) {
            handleEditTask()
        }
        else if (newTaskDay) {
            handleAddTaskDay()
        }
        else {
            if (!date) {
                return alert("Nenhuma data foi selecionada!")
            }
            handleAddTask()
        }

        handleOpenChange(false)
    }

    // Handler para setar o estado do modal, e outros states.  
    const handleOpenChange = (open: boolean) => {

        if (!open) {
            setTimeout(() => {
                onOpenEditing(false)
                onOpenNewTaskDay(false)
                setInput("")
                setDate(undefined)
                setError("")
            }, 200)

        }
        onOpenDialogChange(open)
    }


    return (
        <Dialog
            open={openDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]  border-0 ">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className=" mb-4 ">
                        <DialogTitle className="text-2xl">
                            {isEditing ? "Editar Tarefa" : "O que há de novo?"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {isEditing
                            ? (<div className="grid gap-3">
                                <Label htmlFor="name-1" className=" text-2xl">Tarefa</Label>
                                <Input
                                    className={` ${error ? "border-2 border-red-500" : "border-black"}`}
                                    id="name-1"
                                    autoComplete="off"
                                    name="name"
                                    placeholder={valueTask}
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        setError("")
                                    }} />
                                {/* Mensagem de erro abaixo do input */}
                                {error && (
                                    <div className="flex gap-2 p-1 bg-red-600 pl-2 rounded">
                                        <AlertCircleIcon className="w-5" color="white" />
                                        <span className="text-white">{error}</span>
                                    </div>
                                )}

                            </div>)
                            : (<div className="grid gap-3">
                                <Label htmlFor="name-1" className=" text-xl">Tarefa</Label>
                                <Input
                                    className={` ${error ? "border-2 border-red-500" : ""}`}
                                    id="name-1"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Ex: Ir ao dentista sábado"
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        setError("")
                                    }} />
                                {/* Mensagem de erro abaixo do input */}
                                {error && (
                                    <div className="flex gap-2 p-1 bg-red-600 pl-2 rounded">
                                        <AlertCircleIcon className="w-5 " color="white" />
                                        <span className="text-white">{error}</span>
                                    </div>
                                )}

                            </div>)
                        }
                        {!isEditing && !newTaskDay && (
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date" className="px-1 text-xl">
                                    Data
                                </Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {date ? date.toLocaleDateString() : "Selecione o dia"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0 " align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date)
                                                setOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>)
                        }

                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button className="bg-rose-700 p-2 rounded-md hover:bg-rose-800 text-white">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}