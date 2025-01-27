"use client"

import { useState } from "react"
import Dashboard from "./components/Dashboard"
import VerbList from "./components/VerbList"
import Practice from "./components/Practice"
import AddVerb from "./components/AddVerb"
import Progress from "./components/Progress"
import Navigation from "./components/Navigation"
import { VerbProvider } from "./contexts/VerbContext"
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  return (
    <VerbProvider>
      <div className="min-h-screen bg-background">
        <Navigation setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main className="container mx-auto px-4 py-8">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "verbos' && <VerbList />}
          {currentPage === "practice" && <Practice />}
          {currentPage === "addverb" && <AddVerb />}
          {currentPage === "progress" && <Progress />}
        </main>
        <Toaster />
      </div>
    </VerbProvider>
  )
}

