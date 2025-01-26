"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useVerbs } from "../contexts/VerbContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

const ConjugationTable: React.FC<{ verb: Verb }> = ({ verb }) => {
  const { conjugateVerb, updateMastery } = useVerbs()
  const [conjugations, setConjugations] = useState({
    yo: "",
    tú: "",
    él: "",
    nosotros: "",
    ellos1: "",
    ellos2: "",
  })
  const [feedback, setFeedback] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setConjugations({ yo: "", tú: "", él: "", nosotros: "", ellos1: "", ellos2: "" })
    setShowResults(false)
    setFeedback([])
  }, [conjugateVerb, updateMastery]) // Updated useEffect dependency

  const handleInputChange = (pronoun: string, value: string) => {
    setConjugations((prev) => ({ ...prev, [pronoun]: value }))
  }

  const checkAnswers = () => {
    setShowResults(true)
    let correctCount = 0
    const newFeedback: string[] = []

    Object.entries(conjugations).forEach(([pronoun, conjugation]) => {
      const correctConjugation = conjugateVerb(verb, pronoun === "ellos1" || pronoun === "ellos2" ? "ellos" : pronoun)
      if (conjugation.toLowerCase() === correctConjugation.toLowerCase()) {
        correctCount++
      } else {
        const feedback = generateFeedback(pronoun, conjugation, correctConjugation, verb)
        if (feedback) newFeedback.push(feedback)
      }
    })

    setFeedback(newFeedback)
    const masteryIncrease = (correctCount / 6) * 20 // 20% increase for full correct table
    updateMastery(verb.infinitive, Math.min(100, verb.mastery + masteryIncrease))
  }

  const generateFeedback = (pronoun: string, given: string, correct: string, verb: Verb) => {
    if (verb.type === "irregular") {
      return `For "${pronoun}", the correct irregular form is "${correct}".`
    }

    const verbEnding = verb.infinitive.slice(-2)
    const givenEnding = given.slice(-2)
    const correctEnding = correct.slice(-2)

    if (verb.type === "stem-changing" && ["yo", "tú", "él", "ellos", "ellos1", "ellos2"].includes(pronoun)) {
      return `For "${pronoun}", remember to change the stem from "${verb.stemChange?.from}" to "${verb.stemChange?.to}".`
    }

    if (givenEnding !== correctEnding) {
      return `For "${pronoun}", you used the wrong ending. The correct ending for -${verbEnding} verbs is "-${correctEnding}".`
    }

    return `For "${pronoun}", the correct conjugation is "${correct}".`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          {verb.infinitive} - {verb.meaning}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Singular</TableHead>
            <TableHead>Plural</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="yo">yo</Label>
                <Input
                  id="yo"
                  value={conjugations.yo}
                  onChange={(e) => handleInputChange("yo", e.target.value)}
                  className={
                    showResults
                      ? conjugations.yo.toLowerCase() === conjugateVerb(verb, "yo").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="nosotros">nosotros</Label>
                <Input
                  id="nosotros"
                  value={conjugations.nosotros}
                  onChange={(e) => handleInputChange("nosotros", e.target.value)}
                  className={
                    showResults
                      ? conjugations.nosotros.toLowerCase() === conjugateVerb(verb, "nosotros").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="tu">tú</Label>
                <Input
                  id="tu"
                  value={conjugations.tú}
                  onChange={(e) => handleInputChange("tú", e.target.value)}
                  className={
                    showResults
                      ? conjugations.tú.toLowerCase() === conjugateVerb(verb, "tú").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="ellos1">ustedes</Label>
                <Input
                  id="ellos1"
                  value={conjugations.ellos1}
                  onChange={(e) => handleInputChange("ellos1", e.target.value)}
                  className={
                    showResults
                      ? conjugations.ellos1.toLowerCase() === conjugateVerb(verb, "ellos").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="el">él/ella/usted</Label>
                <Input
                  id="el"
                  value={conjugations.él}
                  onChange={(e) => handleInputChange("él", e.target.value)}
                  className={
                    showResults
                      ? conjugations.él.toLowerCase() === conjugateVerb(verb, "él").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Label htmlFor="ellos2">ellos/ellas/ustedes</Label>
                <Input
                  id="ellos2"
                  value={conjugations.ellos2}
                  onChange={(e) => handleInputChange("ellos2", e.target.value)}
                  className={
                    showResults
                      ? conjugations.ellos2.toLowerCase() === conjugateVerb(verb, "ellos").toLowerCase()
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button onClick={checkAnswers}>Check Answers</Button>
      {feedback.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errors in conjugation</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {showResults && (
        <div className="mt-4">
          <h4 className="font-bold">Correct Answers:</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pronoun</TableHead>
                <TableHead>Conjugation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(conjugations).map(([pronoun, _]) => (
                <TableRow key={pronoun}>
                  <TableCell>{pronoun}</TableCell>
                  <TableCell>
                    {conjugateVerb(verb, pronoun === "ellos1" || pronoun === "ellos2" ? "ellos" : pronoun)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default ConjugationTable

