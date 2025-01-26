"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useVerbs, conjugateVerb } from "../contexts/VerbContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const QuizMode: React.FC = () => {
  const { verbs, updateMastery } = useVerbs()
  const [currentVerb, setCurrentVerb] = useState(verbs[0])
  const [currentPronoun, setCurrentPronoun] = useState("")
  const [answer, setAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    generateQuestion()
  }, []) // Removed unnecessary dependency 'verbs'

  const generateQuestion = () => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)]
    const pronouns = ["yo", "tú", "él", "nosotros", "ustedes"]
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)]
    setCurrentVerb(randomVerb)
    setCurrentPronoun(randomPronoun)
    setAnswer("")
    setShowResult(false)
    setFeedback("")
  }

  const checkAnswer = () => {
    const correctConjugation = conjugateVerb(currentVerb.infinitive, currentPronoun)
    const isAnswerCorrect = answer.toLowerCase() === correctConjugation.toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      updateMastery(currentVerb.infinitive, Math.min(100, currentVerb.mastery + 5)) // 5% increase for correct answer
    } else {
      setFeedback(generateFeedback(currentPronoun, answer, correctConjugation, currentVerb.infinitive))
    }
  }

  const generateFeedback = (pronoun: string, given: string, correct: string, infinitive: string) => {
    const verbType = infinitive.slice(-2)
    const givenEnding = given.slice(-2)
    const correctEnding = correct.slice(-2)

    if (givenEnding === "os" && !["os", "mos"].includes(correctEnding)) {
      return `You used an ending for "nosotros". The correct ending for "${pronoun}" in -${verbType} verbs is "-${correctEnding}".`
    }
    if (["emos", "amos", "imos"].includes(givenEnding) && !["emos", "amos", "imos"].includes(correctEnding)) {
      return `You used an ending for "nosotros". The correct ending for "${pronoun}" in -${verbType} verbs is "-${correctEnding}".`
    }
    if (givenEnding === "en" && correctEnding === "es") {
      return `You used an ending for "ustedes". The correct ending for "${pronoun}" in -${verbType} verbs is "-es".`
    }
    if (givenEnding !== correctEnding) {
      return `You used the wrong ending. The correct ending for -${verbType} verbs is "-${correctEnding}".`
    }
    return `The correct conjugation for "${pronoun}" of "${infinitive}" is "${correct}".`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">
        {currentVerb.infinitive} - {currentVerb.meaning}
      </h3>
      <p>
        Conjugate for: <strong>{currentPronoun}</strong>
      </p>
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className={showResult ? (isCorrect ? "bg-green-100" : "bg-red-100") : ""}
      />
      <Button onClick={checkAnswer} className="mr-2">
        Check Answer
      </Button>
      <Button onClick={generateQuestion}>Next Question</Button>
      {showResult && !isCorrect && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incorrect</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}
      {showResult && isCorrect && (
        <Alert variant="success" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Correct!</AlertTitle>
          <AlertDescription>Great job! You've conjugated the verb correctly.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default QuizMode

