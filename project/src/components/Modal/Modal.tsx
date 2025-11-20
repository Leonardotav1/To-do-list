import React, { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDownIcon } from "lucide-react"
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

    // Pega as funções do contexto.
    const { addTask, editTask, addTasksDay } = useTask()

    // Formata a data selecionada para string.
    const dateString = date?.toLocaleDateString()

    // Função no modal que chama a função do contexto, para adicionar as tasks.
    const handleAddTask = () => {
        // Caso não exista a data retorna 
        if (!dateString) {
            console.log("Nenhuma data selecionada")
            return
        }

        addTask(dateString, input)
    }

    const handleAddTaskDay = () => {
        if(!dateTask ) {
            return
        }

        addTasksDay(dateTask, input)
    }

    // Função que chama ao modal a função de editar tasks do contexto.
    const handleEditTask = () => {
        // Caso não exista nenhuma data ou index, retorna a mensagem.
        if (!dateTask || indexTask === undefined) {
            console.log("Nenhuma data selecionada")
            return
        }

        editTask(dateTask, input, indexTask)
    }

    // Handler que chama a função para adicionar ou editar tasks.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing) {
            handleEditTask()
        }
        else if(newTaskDay){
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

    // Handler para setar o estado do modal.  
    const handleOpenChange = (open: boolean) => {
        onOpenDialogChange(open)
        if (!open) {
            onOpenEditing(false)
            onOpenNewTaskDay(false)
            setInput("")
            setDate(undefined)
        }
    }


    return (
        <Dialog
            open={openDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Editar Tarefa" : "O que há de novo?"}
                        </DialogTitle>
                        <DialogDescription className="mb-2">
                            {isEditing
                                ? "Altere o conteúdo da sua tarefa abaixo."
                                : "Adicione uma nova tarefa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {isEditing
                            ? (<div className="grid gap-3">
                                <Label htmlFor="name-1">Tarefa</Label>
                                <Input id="name-1" name="name" placeholder={valueTask} onChange={(e) => { setInput(e.target.value) }} />
                            </div>)
                            : (<div className="grid gap-3">
                                <Label htmlFor="name-1">Tarefa</Label>
                                <Input id="name-1" name="name" placeholder="Ex: Ir ao dentista sábado" onChange={(e) => { setInput(e.target.value) }} />
                            </div>)
                        }
                        {!isEditing && !newTaskDay && (
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date" className="px-1">
                                    Data
                                </Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {date ? date.toLocaleDateString() : "Selecione o dia"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}