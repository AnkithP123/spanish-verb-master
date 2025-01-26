"use client"

import type React from "react"
import { useVerbs } from "../contexts/VerbContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const Dashboard: React.FC = () => {
  const { verbs } = useVerbs()

  const totalVerbs = verbs.length
  const masteredVerbs = verbs.filter((verb) => verb.mastery === 100).length
  const averageMastery = verbs.reduce((sum, verb) => sum + verb.mastery, 0) / totalVerbs || 0

  const verbTypeData = verbs.reduce(
    (acc, verb) => {
      acc[verb.type] = (acc[verb.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const verbTypeChartData = Object.entries(verbTypeData).map(([type, count]) => ({
    type,
    count,
  }))

  const masteryLevels = {
    Beginner: verbs.filter((verb) => verb.mastery < 25).length,
    Intermediate: verbs.filter((verb) => verb.mastery >= 25 && verb.mastery < 50).length,
    Advanced: verbs.filter((verb) => verb.mastery >= 50 && verb.mastery < 75).length,
    Expert: verbs.filter((verb) => verb.mastery >= 75 && verb.mastery < 100).length,
    Mastered: masteredVerbs,
  }

  const masteryChartData = Object.entries(masteryLevels).map(([level, count]) => ({
    level,
    count,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Verbs</CardTitle>
          <CardDescription>Number of verbs in your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalVerbs}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mastered Verbs</CardTitle>
          <CardDescription>Verbs with 100% mastery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{masteredVerbs}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Mastery</CardTitle>
          <CardDescription>Overall progress across all verbs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{averageMastery.toFixed(2)}%</p>
          <Progress value={averageMastery} className="mt-2" />
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Verb Types Distribution</CardTitle>
          <CardDescription>Distribution of verb types in your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verbTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Mastery Levels</CardTitle>
          <CardDescription>Distribution of verbs across mastery levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={masteryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

