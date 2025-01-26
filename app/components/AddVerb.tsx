"use client"

import type React from "react"
import { useState } from "react"
import { useVerbs } from "../contexts/VerbContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const AddVerb: React.FC = () => {
  const { addVerb } = useVerbs()
  const [newVerb, setNewVerb] = useState({
    infinitive: "",
    meaning: "",
    type: "regular" as "regular" | "irregular" | "stem-changing",
    irregularForms: {
      yo: "",
      tú: "",
      él: "",
      nosotros: "",
      ellos: "",
    },
    stemChange: {
      from: "",
      to: "",
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!["ar", "er", "ir"].includes(newVerb.infinitive.slice(-2))) {
      toast({
        title: "Invalid Verb",
        description: "The verb must end in -ar, -er, or -ir.",
        variant: "destructive",
      })
      return
    }

    const verbToAdd = {
      infinitive: newVerb.infinitive,
      meaning: newVerb.meaning,
      type: newVerb.type,
      mastery: 0
    }

    if (newVerb.type === "irregular") {
      verbToAdd.irregularForms = newVerb.irregularForms
    } else if (newVerb.type === "stem-changing") {
      verbToAdd.stemChange = newVerb.stemChange
    }

    addVerb(verbToAdd)
    setNewVerb({
      infinitive: "",
      meaning: "",
      type: "regular",
      irregularForms: { yo: "", tú: "", él: "", nosotros: "", ellos: "" },
      stemChange: { from: "", to: "" },
    })
    toast({
      title: "Verb Added",
      description: `${newVerb.infinitive} has been added to your verb list.`,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Verb</CardTitle>
        <CardDescription>Enter the details of the new verb you want to add to your practice list.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="infinitive">Infinitive</Label>
            <Input
              id="infinitive"
              value={newVerb.infinitive}
              onChange={(e) => setNewVerb({ ...newVerb, infinitive: e.target.value })}
              required
              placeholder="e.g., hablar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meaning">Meaning</Label>
            <Input
              id="meaning"
              value={newVerb.meaning}
              onChange={(e) => setNewVerb({ ...newVerb, meaning: e.target.value })}
              required
              placeholder="e.g., to speak"
            />
          </div>
          <div className="space-y-2">
            <Label>Verb Type</Label>
            <RadioGroup
              value={newVerb.type}
              onValueChange={(value: "regular" | "irregular" | "stem-changing") =>
                setNewVerb({ ...newVerb, type: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="irregular" />
                <Label htmlFor="irregular">Irregular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stem-changing" id="stem-changing" />
                <Label htmlFor="stem-changing">Stem-changing</Label>
              </div>
            </RadioGroup>
          </div>
          {newVerb.type === "irregular" && (
            <div className="space-y-2">
              <Label>Irregular Forms</Label>
              {Object.keys(newVerb.irregularForms).map((pronoun) => (
                <div key={pronoun} className="flex items-center space-x-2">
                  <Label htmlFor={`irregular-${pronoun}`} className="w-20">
                    {pronoun}
                  </Label>
                  <Input
                    id={`irregular-${pronoun}`}
                    value={newVerb.irregularForms[pronoun]}
                    onChange={(e) =>
                      setNewVerb({
                        ...newVerb,
                        irregularForms: { ...newVerb.irregularForms, [pronoun]: e.target.value },
                      })
                    }
                    placeholder={`e.g., ${pronoun === "yo" ? "voy" : ""}`}
                  />
                </div>
              ))}
            </div>
          )}
          {newVerb.type === "stem-changing" && (
            <div className="space-y-2">
              <Label>Stem Change</Label>
              <div className="flex items-center space-x-2">
                {/* <Input
                  value={newVerb.stemChange.from}
                  onChange={(e) =>
                    setNewVerb({
                      ...newVerb,
                      stemChange: { ...newVerb.stemChange, from: e.target.value },
                    })
                  }
                  placeholder="From (e.g., e)"
                  className="w-1/2"
                /> */}
                <Input
                  value={newVerb.stemChange.to}
                  onChange={(e) =>
                    setNewVerb({
                      ...newVerb,
                      stemChange: { ...newVerb.stemChange, to: e.target.value, from: newVerb.infinitive.slice(0, -2) },
                    })
                  }
                  placeholder="New stem (part that goes before the ending)"
                  className="w-1/2"
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Add Verb
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AddVerb

