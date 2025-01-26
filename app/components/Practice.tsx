"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useVerbs } from "../contexts/VerbContext"
import ConjugationTable from "./ConjugationTable"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Mic, MicOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Practice: React.FC = () => {
  const { verbs, conjugateVerb, updateMastery } = useVerbs()
  const [currentVerb, setCurrentVerb] = useState(verbs[0])
  const [currentPronoun, setCurrentPronoun] = useState("")
  const [answer, setAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const verbRef = useRef(verbs[0])
  const pronounRef = useRef("")

  useEffect(() => {
    selectRandomVerb()
  }, [])

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = "es-ES"
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        checkSpokenAnswer(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false)
      }

      recognitionRef.current.onaudiostart = (event) => {
        console.log("Audio started:", event)
      }
    }
  }, [])

  const selectRandomVerb = () => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)]
    setCurrentVerb(randomVerb)
    const pronouns = ["yo", "tú", "él", "nosotros", "ellos"]
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)]
    setCurrentPronoun(randomPronoun)
    setAnswer("")
    setShowResult(false)
    setFeedback("")
    setTranscript("")
    verbRef.current = randomVerb
    pronounRef.current = randomPronoun
  }

  const checkAnswer = () => {
    const correctConjugation = conjugateVerb(currentVerb, currentPronoun)
    const isAnswerCorrect = answer.toLowerCase().trim() === correctConjugation.toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      updateMastery(currentVerb.infinitive, Math.min(100, currentVerb.mastery + 5), "quiz")
    } else {
      setFeedback(`The correct conjugation is: "${correctConjugation}".`)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setShowResult(false)
      setTranscript("")
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const checkSpokenAnswer = (spokenText: string) => {
    const correctConjugation = conjugateVerb(verbRef.current, pronounRef.current)
    const isAnswerCorrect = spokenText.toLowerCase().trim() === correctConjugation.toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)

    if (isAnswerCorrect) {
      updateMastery(currentVerb.infinitive, Math.min(100, currentVerb.mastery + 5), "speech")
      setFeedback("Great job! Your pronunciation was correct.")
    } else {
      setFeedback(`The correct conjugation is: "${correctConjugation}". You said: "${spokenText}".`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Practice</h2>
      <Tabs defaultValue="quiz">
        <TabsList>
          <TabsTrigger value="quiz">Quiz Mode</TabsTrigger>
          <TabsTrigger value="table">Conjugation Table</TabsTrigger>
          <TabsTrigger value="speech">Speech Practice</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentVerb.infinitive} - {currentVerb.meaning}
              </CardTitle>
              <CardDescription>
                Conjugate for: <strong>{currentPronoun}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={showResult ? (isCorrect ? "bg-green-100" : "bg-red-100") : ""}
              />
              <div className="flex space-x-2">
                <Button onClick={checkAnswer}>Check Answer</Button>
                <Button onClick={selectRandomVerb}>Next Question</Button>
              </div>
              {showResult && (
                <Alert variant={isCorrect ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
                  <AlertDescription>{isCorrect ? "Great job!" : feedback}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <ConjugationTable verb={currentVerb} />
          <Button onClick={selectRandomVerb} className="mt-4">
            New Verb
          </Button>
        </TabsContent>
        <TabsContent value="speech">
          <Card>
            <CardHeader>
              <CardTitle>Speech Practice</CardTitle>
              <CardDescription>
                Conjugate and speak: <strong>{currentVerb.infinitive}</strong> for <strong>{currentPronoun}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button onClick={toggleListening} variant="outline" size="icon" className="w-12 h-12">
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
              </div>
              {transcript && <p className="text-center">You said: "{transcript}"</p>}
              <div className="flex space-x-2 justify-center">
                <Button onClick={selectRandomVerb}>Next Verb</Button>
              </div>
              {showResult && (
                <Alert variant={isCorrect ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Practice

