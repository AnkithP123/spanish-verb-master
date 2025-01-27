"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

type VerbType = "regular" | "irregular" | "stem-changing"

type Verb = {
  infinitive: string
  meaning: string
  type: VerbType
  irregularForms?: {
    [key: string]: string
  }
  stemChange?: {
    from: string
    to: string
  }
  mastery: number
  masteredModes: {
    quiz: boolean
    table: boolean
    speech: boolean
  }
}

type VerbContextType = {
  verbs: Verb[]
  addVerb: (verb: Verb) => void
  removeVerb: (infinitive: string) => void
  updateMastery: (infinitive: string, newMastery: number, mode: "quiz" | "table" | "speech") => void
  conjugateVerb: (verb: Verb, pronoun: string) => string
}

const VerbContext = createContext<VerbContextType | undefined>(undefined)

export const useVerbs = () => {
  const context = useContext(VerbContext)
  if (!context) {
    throw new Error("useVerbs must be used within a VerbProvider")
  }
  return context
}

export const conjugateVerb = (verb: Verb, pronoun: string): string => {
  if (verb.type === "irregular" && verb.irregularForms && verb.irregularForms[pronoun]) {
    return verb.irregularForms[pronoun]
  }

  const stem = verb.infinitive.slice(0, -2)
  const ending = verb.infinitive.slice(-2) as "ar" | "er" | "ir"

  const regularEndings = {
    ar: { yo: "o", tú: "as", él: "a", nosotros: "amos", ellos: "an" },
    er: { yo: "o", tú: "es", él: "e", nosotros: "emos", ellos: "en" },
    ir: { yo: "o", tú: "es", él: "e", nosotros: "imos", ellos: "en" },
  }

  let conjugatedStem = stem
  if (verb.type === "stem-changing" && verb.stemChange) {
    const { from, to } = verb.stemChange
    if (["yo", "tú", "él", "ellos"].includes(pronoun)) {
      conjugatedStem = stem.replace(from, to)
    }
  }

  return conjugatedStem + regularEndings[ending][pronoun]
}

export const VerbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verbs, setVerbs] = useState<Verb[]>([])

  useEffect(() => {
    const storedVerbs = localStorage.getItem("verbos")
    if (storedVerbs) {
      setVerbs(JSON.parse(storedVerbs))
    } else {
      const initialVerbs: Verb[] = [
        { infinitive: "hablar", meaning: "to speak", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "comer", meaning: "to eat", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "escribir", meaning: "to write", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "vivir", meaning: "to live", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "trabajar", meaning: "to work", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "estudiar", meaning: "to study", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "cantar", meaning: "to sing", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "bailar", meaning: "to dance", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "correr", meaning: "to run", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "leer", meaning: "to read", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "abrir", meaning: "to open", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "cocinar", meaning: "to cook", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "limpiar", meaning: "to clean", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "nadar", meaning: "to swim", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "pintar", meaning: "to paint", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "viajar", meaning: "to travel", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "comprar", meaning: "to buy", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "vender", meaning: "to sell", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "beber", meaning: "to drink", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "usar", meaning: "to use", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "dibujar", meaning: "to draw", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "enseñar", meaning: "to teach", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "escuchar", meaning: "to listen", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "mirar", meaning: "to watch", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "esperar", meaning: "to wait", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "caminar", meaning: "to walk", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "llamar", meaning: "to call", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "preguntar", meaning: "to ask", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "contestar", meaning: "to answer", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } },
        { infinitive: "ayudar", meaning: "to help", type: "regular", mastery: 0, masteredModes: { quiz: false, table: false, speech: false } }
      ]
      setVerbs(initialVerbs)
      localStorage.setItem("verbos", JSON.stringify(initialVerbs))
    }
  }, [])

  const addVerb = (newVerb: Verb) => {
    setVerbs((prevVerbs) => {
      const updatedVerbs = [...prevVerbs, newVerb]
      localStorage.setItem("verbos", JSON.stringify(updatedVerbs))
      return updatedVerbs
    })
  }

  const removeVerb = (infinitive: string) => {
    setVerbs((prevVerbs) => {
      const updatedVerbs = prevVerbs.filter((verb) => verb.infinitive !== infinitive)
      localStorage.setItem("verbos", JSON.stringify(updatedVerbs))
      return updatedVerbs
    })
  }

  const updateMastery = (infinitive: string, newMastery: number, mode: "quiz" | "table" | "speech") => {
    setVerbs((prevVerbs) => {
      const updatedVerbs = prevVerbs.map((verb) => {
        if (verb.infinitive === infinitive) {
          const updatedModes = { ...verb.masteredModes, [mode]: true }
          const allModesMastered = Object.values(updatedModes).every(Boolean)
          const finalMastery = allModesMastered ? 100 : Math.min(newMastery, 99)
          return { ...verb, mastery: finalMastery, masteredModes: updatedModes }
        }
        return verb
      })
      localStorage.setItem("verbos", JSON.stringify(updatedVerbs))
      return updatedVerbs
    })
  }

  return (
    <VerbContext.Provider value={{ verbs, addVerb, removeVerb, updateMastery, conjugateVerb }}>
      {children}
    </VerbContext.Provider>
  )
}
