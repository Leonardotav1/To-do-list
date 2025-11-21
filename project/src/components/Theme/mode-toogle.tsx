import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/Theme/theme-provider"
import { Switch } from "../ui/switch"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const isDark = theme === "dark"

    function toggleTheme() {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <div className="flex items-center gap-3">
            <Sun className="h-6 w-6" />

            <Switch checked={isDark} onCheckedChange={toggleTheme} />

            <Moon className="h-6 w-6" />
        </div>

    )
}