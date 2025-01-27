"use client"

import type React from "react"
import { BookOpen, List, PlusCircle, BarChart2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

type NavigationProps = {
  setCurrentPage: (page: string) => void
  currentPage: string
}

const Navigation: React.FC<NavigationProps> = ({ setCurrentPage, currentPage }) => {
  const navItems = [
    { name: "Dashboard", icon: Home, page: "dashboard" },
    { name: "Verb List", icon: List, page: "verbos' },
    { name: "Practice", icon: BookOpen, page: "practice" },
    { name: "Add Verb", icon: PlusCircle, page: "addverb" },
    { name: "Progress", icon: BarChart2, page: "progress" },
  ]

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Spanish Verb Master</h1>
        <ul className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <li key={item.page}>
              <Button
                variant={currentPage === item.page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(item.page)}
                className="flex items-center"
              >
                <item.icon className="mr-1 h-4 w-4" />
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation

