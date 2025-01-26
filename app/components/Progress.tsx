"use client"

import type React from "react"
import { useVerbs } from "../contexts/VerbContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const ProgressComponent: React.FC = () => {
  const { verbs } = useVerbs()

  const totalMastery = verbs.reduce((sum, verb) => sum + verb.mastery, 0)
  const averageMastery = totalMastery / verbs.length || 0

  const masteryLevels = {
    beginner: verbs.filter((verb) => verb.mastery < 25).length,
    intermediate: verbs.filter((verb) => verb.mastery >= 25 && verb.mastery < 50).length,
    advanced: verbs.filter((verb) => verb.mastery >= 50 && verb.mastery < 75).length,
    expert: verbs.filter((verb) => verb.mastery >= 75 && verb.mastery < 100).length,
    mastered: verbs.filter((verb) => verb.mastery === 100).length,
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      <Card>
        <CardHeader>
          <CardTitle>Overall Mastery</CardTitle>
          <CardDescription>Your average mastery across all verbs</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={averageMastery} className="w-full" />
          <p className="mt-2 text-center">{averageMastery.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(masteryLevels).map(([level, count]) => (
          <Card key={level}>
            <CardHeader>
              <CardTitle className="capitalize">{level}</CardTitle>
              <CardDescription>Verbs at this level</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-center">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProgressComponent

