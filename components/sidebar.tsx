"use client"

import { 
  Menu, 
  Home, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Shield, 
  ShoppingCart, 
  Plane, 
  UserCog, 
  Briefcase, 
  Settings 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, active: true },
  { icon: CheckSquare },
  { icon: DollarSign },
  { icon: FileText },
  { icon: Shield },
  { icon: ShoppingCart },
  { icon: Plane },
  { icon: UserCog },
  { icon: Briefcase },
  { icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-[60px] bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-md",
            "bg-white hover:bg-gray-50"
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex-1 py-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-md",
                  item.active 
                    ? "bg-white shadow-sm" 
                    : "hover:bg-gray-50"
                )}
              >
                <Icon className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

