"use client";
import type { RootState } from "../app/store" 
import type React from "react";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { logout, reset } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useSelector } from "react-redux";
interface SidebarProps {
  onCreateTask: () => void;
}

export default function Sidebar({ onCreateTask }: SidebarProps) {
  const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
   const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    authService.logout(); // clear user from localStorage

    dispatch(logout());
    dispatch(reset());
    // If you use Redux, also dispatch logout/reset here
    router.push("/login");
  };

    const handleCreateTaskClick = () => {
    if (!user || !user.token) {
      router.push("/login");
    } else {
      onCreateTask();
    }
  };
  return (
    <div className="w-[200px] border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-foreground rounded flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-background"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="font-bold">Pro Manage</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          href="#"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <NavItem
          href="#"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          }
          label="Board"
          active
        />
        <NavItem href="#" icon={<BarChart2 size={18} />} label="Analytics" />
        <NavItem href="#" icon={<Settings size={18} />} label="Settings" />

        <div className="pt-4">
          <Button onClick={handleCreateTaskClick} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Create Task
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut size={18} className="mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
