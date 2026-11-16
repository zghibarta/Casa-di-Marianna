"use client"

// Afișează un câmp din graf după tipul lui. Nu conține logică de ramificare:
// ce câmpuri apar decide lib/evaluare/interviu/graf.ts.

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Camp } from "@/lib/evaluare/interviu/intrebari"
import type { RandAntrenament, Valoare } from "@/lib/evaluare/interviu/raspunsuri"
import { CAMPURI, OPTIUNI, type Optiune } from "@/lib/evaluare/interviu/texte"
import type { Intensitate } from "@/lib/evaluare/tipuri"
import { cn } from "@/lib/utils"

interface Props {
  camp: Camp
  valoare: Valoare | undefined
  eroare?: string
  onSchimba: (valoare: Valoare) => void
}

const CARD_OPTIUNE =
  "flex cursor-pointer items-center gap-3 rounded-md border bg-white p-3 leading-snug transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"

const RAND_GOL: RandAntrenament = { tip: "", ori: "", durata: "", intensitate: "" }

export function CampIntrebare({ camp, valoare, eroare, onSchimba }: Props) {
  const text = CAMPURI[camp.id]
  const idEticheta = `${camp.id}-eticheta`
  const idAjutor = text?.ajutor ? `${camp.id}-ajutor` : undefined
  const idEroare = eroare ? `${camp.id}-eroare` : undefined
  const descriere = [idAjutor, idEroare].filter(Boolean).join(" ") || undefined
  const sir = typeof valoare === "string" ? valoare : ""
  const optiuni: Optiune[] = camp.tip === "da_nu" ? OPTIUNI.da_nu : camp.optiuni ? OPTIUNI[camp.optiuni] : []

  const comune = {
    id: camp.id,
    "aria-labelledby": idEticheta,
    "aria-describedby": descriere,
    "aria-invalid": eroare ? true : undefined,
  }

  let control: React.ReactNode
  switch (camp.tip) {
    case "text":
      control = (
        <Input
          {...comune}
          value={sir}
          placeholder={text?.substituent}
          onChange={(e) => onSchimba(e.target.value)}
          autoComplete="off"
        />
      )
      break
    case "text_lung":
      control = <Textarea {...comune} value={sir} rows={3} onChange={(e) => onSchimba(e.target.value)} />
      break
    case "numar":
      control = (
        <div className="flex items-center gap-2">
          <Input
            {...comune}
            value={sir}
            inputMode="decimal"
            autoComplete="off"
            className="max-w-[10rem]"
            onChange={(e) => onSchimba(e.target.value)}
          />
          {camp.unitate && <span className="text-muted-foreground">{camp.unitate}</span>}
        </div>
      )
      break
    case "data":
      control = (
        <Input
          {...comune}
          type="date"
          value={sir}
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
          className="max-w-[12rem]"
          onChange={(e) => onSchimba(e.target.value)}
        />
      )
      break
    case "ora":
      control = (
        <Input
          {...comune}
          type="time"
          value={sir}
          className="max-w-[9rem]"
          onChange={(e) => onSchimba(e.target.value)}
        />
      )
      break
    case "da_nu":
    case "alegere":
    case "frecventa":
      control = (
        <RadioGroup
          value={sir}
          onValueChange={onSchimba}
          aria-labelledby={idEticheta}
          aria-describedby={descriere}
          className={cn("gap-2", camp.tip === "da_nu" && "grid-cols-2")}
        >
          {optiuni.map((opt) => (
            <label key={opt.valoare} htmlFor={`${camp.id}-${opt.valoare}`} className={CARD_OPTIUNE}>
              <RadioGroupItem value={opt.valoare} id={`${camp.id}-${opt.valoare}`} className="h-5 w-5 shrink-0" />
              <span>{opt.eticheta}</span>
            </label>
          ))}
        </RadioGroup>
      )
      break
    case "alegere_multipla": {
      const alese = Array.isArray(valoare) ? (valoare as string[]) : []
      control = (
        <div role="group" aria-labelledby={idEticheta} aria-describedby={descriere} className="grid gap-2">
          {optiuni.map((opt) => (
            <label key={opt.valoare} htmlFor={`${camp.id}-${opt.valoare}`} className={CARD_OPTIUNE}>
              <Checkbox
                id={`${camp.id}-${opt.valoare}`}
                checked={alese.includes(opt.valoare)}
                className="h-5 w-5"
                onCheckedChange={(bifat) =>
                  onSchimba(bifat === true ? [...alese, opt.valoare] : alese.filter((x) => x !== opt.valoare))
                }
              />
              <span>{opt.eticheta}</span>
            </label>
          ))}
        </div>
      )
      break
    }
    case "scala": {
      const min = camp.min ?? 1
      const max = camp.max ?? 10
      const trepte = Array.from({ length: max - min + 1 }, (_, i) => String(min + i))
      control = (
        <RadioGroupPrimitive.Root
          value={sir}
          onValueChange={onSchimba}
          aria-labelledby={idEticheta}
          aria-describedby={descriere}
          className="grid grid-cols-5 gap-2 sm:grid-cols-10"
        >
          {trepte.map((treapta) => (
            <RadioGroupPrimitive.Item
              key={treapta}
              value={treapta}
              className="h-11 rounded-md border bg-white text-base font-medium transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            >
              {treapta}
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>
      )
      break
    }
    case "antrenamente": {
      const randuri = Array.isArray(valoare) && valoare.length > 0 ? (valoare as RandAntrenament[]) : [RAND_GOL]
      const schimbaRand = (index: number, schimbari: Partial<RandAntrenament>) =>
        onSchimba(randuri.map((rand, i) => (i === index ? { ...rand, ...schimbari } : rand)))
      control = (
        <div className="space-y-3" role="group" aria-labelledby={idEticheta} aria-describedby={descriere}>
          {randuri.map((rand, index) => (
            <div key={index} className="grid gap-2 rounded-md border bg-white p-3 sm:grid-cols-2">
              <Input
                aria-label={`Activitatea ${index + 1}`}
                placeholder="Activitatea (de ex. mers pe jos)"
                value={rand.tip}
                className="sm:col-span-2"
                onChange={(e) => schimbaRand(index, { tip: e.target.value })}
              />
              <Input
                aria-label={`Activitatea ${index + 1}: de câte ori pe săptămână`}
                placeholder="De câte ori pe săptămână"
                inputMode="numeric"
                value={rand.ori}
                onChange={(e) => schimbaRand(index, { ori: e.target.value })}
              />
              <Input
                aria-label={`Activitatea ${index + 1}: durata în minute`}
                placeholder="Durata (minute)"
                inputMode="numeric"
                value={rand.durata}
                onChange={(e) => schimbaRand(index, { durata: e.target.value })}
              />
              <Select
                value={rand.intensitate}
                onValueChange={(v) => schimbaRand(index, { intensitate: v as Intensitate })}
              >
                <SelectTrigger aria-label={`Activitatea ${index + 1}: intensitatea`}>
                  <SelectValue placeholder="Intensitatea" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIUNI.intensitate.map((opt) => (
                    <SelectItem key={opt.valoare} value={opt.valoare}>
                      {opt.eticheta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                className="justify-self-start text-muted-foreground"
                onClick={() => onSchimba(randuri.filter((_, i) => i !== index))}
              >
                <Trash2 aria-hidden="true" />
                Șterge
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => onSchimba([...randuri, RAND_GOL])}>
            <Plus aria-hidden="true" />
            Adaugă o activitate
          </Button>
        </div>
      )
      break
    }
  }

  return (
    <div className="space-y-2">
      <p id={idEticheta} className="text-lg font-medium leading-snug">
        {text?.intrebare ?? camp.id}
      </p>
      {text?.ajutor && (
        <p id={idAjutor} className="text-sm text-muted-foreground">
          {text.ajutor}
        </p>
      )}
      {control}
      {eroare && (
        <p id={idEroare} role="alert" className="text-sm font-medium text-destructive">
          {eroare}
        </p>
      )}
    </div>
  )
}
