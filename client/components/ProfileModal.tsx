"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { reset } from "../features/auth/authSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop, LogOut, User, Settings, HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { User as UserType } from "@/types/kanban"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")

  useEffect(() => {
    setSelectedTheme(theme || "system")
  }, [theme])

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value)
    setTheme(value)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    dispatch(reset())
    onClose()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={ "bg-blue-400"} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium">{user?.name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
        </div>

        <Separator />

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h4 className="font-medium">Theme Preference</h4>
            <RadioGroup value={selectedTheme} onValueChange={handleThemeChange} className="grid grid-cols-3 gap-2">
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only peer" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-2 h-5 w-5" />
                  Light
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-2 h-5 w-5" />
                  Dark
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="sr-only peer" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Laptop className="mb-2 h-5 w-5" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex items-center justify-start gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" className="flex items-center justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="flex items-center justify-start gap-2">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
