"use client"

import type React from "react"
import { useVerbs } from "../contexts/VerbContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trash2 } from "lucide-react"

const VerbList: React.FC = () => {
  const { verbs, removeVerb } = useVerbs()

  const getMasteryColor = (mastery: number) => {
    if (mastery < 25) return "bg-red-100"
    if (mastery < 50) return "bg-yellow-100"
    if (mastery < 75) return "bg-blue-100"
    if (mastery < 100) return "bg-green-100"
    return "bg-purple-100"
  }

  const getVerbTypeDisplay = (verb: Verb) => {
    switch (verb.type) {
      case "regular":
        return "Regular"
      case "irregular":
        return "Irregular"
      case "stem-changing":
        return `Stem-changing (${verb.stemChange?.from} → ${verb.stemChange?.to})`
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Verb List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Infinitive</TableHead>
            <TableHead>Meaning</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Verb Type</TableHead>
            <TableHead>Mastery</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verbs.map((verb) => (
            <TableRow key={verb.infinitive} className={getMasteryColor(verb.mastery)}>
              <TableCell className="font-medium">{verb.infinitive}</TableCell>
              <TableCell>{verb.meaning}</TableCell>
              <TableCell>{verb.infinitive.slice(-2)}</TableCell>
              <TableCell>{getVerbTypeDisplay(verb)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={verb.mastery} className="w-[100px]" />
                  <span>{verb.mastery}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => removeVerb(verb.infinitive)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default VerbList

