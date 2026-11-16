"use client"

// Fișa completă pentru Mariana, calculată din răspunsuri, ca să putem verifica motorul.
// Arată alăturat configurarea implicită, varianta A și varianta B.

import Link from "next/link"
import { useMemo, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { calculeazaFisa } from "@/lib/evaluare/calcul"
import { CONFIG_IMPLICIT, VARIANTA_A, VARIANTA_B, type ConfigEvaluare } from "@/lib/evaluare/config"
import { randuriCalcul } from "@/lib/evaluare/fisa"
import { exempluPentru } from "@/lib/evaluare/interviu/exemplu"
import { construiesteIntrare, randuriFisa } from "@/lib/evaluare/interviu/mapare"
import { parseazaNumar } from "@/lib/evaluare/interviu/raspunsuri"
import { construiesteRezumat, verificaRezumat } from "@/lib/evaluare/interviu/rezumat"
import type { IntrareCalcul, Masuratori, RezultatCalcul, Sex } from "@/lib/evaluare/tipuri"
import { useEvaluare } from "../_components/stare"

const CONFIGURARI: { titlu: string; config: ConfigEvaluare }[] = [
  { titlu: "Implicit (alegerile din config.ts)", config: CONFIG_IMPLICIT },
  { titlu: "Varianta A (studiul Marianei)", config: VARIANTA_A },
  { titlu: "Varianta B (propunerile din plan)", config: VARIANTA_B },
]

/** Datele de bază introduse manual, ca text brut. */
interface Manual {
  sex: Sex
  varsta: string
  inaltime: string
  greutate: string
  scopSlabire: boolean
  ritmDorit: string
  sarcina: boolean
  insulina: boolean
  scoff: string
}

interface Suplimentar {
  coef: string
  gat: string
  talie: string
  abdomen: string
  solduri: string
}

const FARA_SUPLIMENTAR: Suplimentar = { coef: "", gat: "", talie: "", abdomen: "", solduri: "" }
const BAZA: Manual = {
  sex: "F",
  varsta: "30",
  inaltime: "170",
  greutate: "84,5",
  scopSlabire: true,
  ritmDorit: "",
  sarcina: false,
  insulina: false,
  scoff: "0",
}

// Cazurile din plan.md §4 (date anonime).
const CAZURI: { nume: string; manual: Manual; suplimentar: Suplimentar }[] = [
  { nume: "T1", manual: BAZA, suplimentar: { ...FARA_SUPLIMENTAR, coef: "1,375" } },
  {
    nume: "T2 (cu măsurători)",
    manual: BAZA,
    suplimentar: { coef: "1,375", gat: "38", talie: "87", abdomen: "92", solduri: "110" },
  },
  {
    nume: "T3 (prag minim)",
    manual: { ...BAZA, varsta: "60", inaltime: "155", greutate: "68" },
    suplimentar: { ...FARA_SUPLIMENTAR, coef: "1,2" },
  },
  {
    nume: "T4 (bărbat)",
    manual: { ...BAZA, sex: "B", varsta: "40", inaltime: "180", greutate: "95" },
    suplimentar: { ...FARA_SUPLIMENTAR, coef: "1,375" },
  },
  {
    nume: "T5 (carbohidrați negativi în A)",
    manual: { ...BAZA, varsta: "75", inaltime: "150", greutate: "100" },
    suplimentar: { ...FARA_SUPLIMENTAR, coef: "1,2" },
  },
  { nume: "T6 (17 ani)", manual: { ...BAZA, varsta: "17" }, suplimentar: FARA_SUPLIMENTAR },
  { nume: "T6 (sarcină)", manual: { ...BAZA, sarcina: true }, suplimentar: FARA_SUPLIMENTAR },
  { nume: "T6 (SCOFF 2)", manual: { ...BAZA, scoff: "2" }, suplimentar: FARA_SUPLIMENTAR },
  {
    nume: "T7 (IMC 23)",
    manual: { ...BAZA, greutate: "66,5" },
    suplimentar: { ...FARA_SUPLIMENTAR, coef: "1,375" },
  },
]

function masuratoriDin(s: Suplimentar): Masuratori | undefined {
  const m: Masuratori = {
    gat: parseazaNumar(s.gat),
    talie: parseazaNumar(s.talie),
    abdomen: parseazaNumar(s.abdomen),
    solduri: parseazaNumar(s.solduri),
  }
  return Object.values(m).some((v) => v !== undefined) ? m : undefined
}

function intrareManuala(m: Manual, s: Suplimentar): IntrareCalcul | null {
  const varsta = parseazaNumar(m.varsta)
  const inaltime = parseazaNumar(m.inaltime)
  const greutate = parseazaNumar(m.greutate)
  if (varsta === undefined || !inaltime || !greutate) return null
  return {
    sex: m.sex,
    varstaAni: varsta,
    inaltimeCm: inaltime,
    greutateKg: greutate,
    scopSlabire: m.scopSlabire,
    coefActivitate: parseazaNumar(s.coef),
    masuratori: masuratoriDin(s),
    ritmDoritKgPeSaptamana: parseazaNumar(m.ritmDorit),
    sarcinaSauAlaptare: m.sarcina,
    diabetCuInsulina: m.insulina,
    scoffRaspunsuriDa: parseazaNumar(m.scoff),
  }
}

export function FisaDebug() {
  const { stare, actualizeaza } = useEvaluare()
  const areInterviu = Object.keys(stare.raspunsuri).length > 0
  const [sursa, setSursa] = useState<"interviu" | "manual">(areInterviu ? "interviu" : "manual")
  const [manual, setManual] = useState<Manual>(BAZA)
  // La datele manuale pornim cu T1 (coeficient 1,375); la interviu, fără coeficient confirmat,
  // ca să se vadă propunerea codului.
  const [suplimentar, setSuplimentar] = useState<Suplimentar>(areInterviu ? FARA_SUPLIMENTAR : CAZURI[0].suplimentar)
  const [precizie, setPrecizie] = useState(false)

  const dinInterviu = sursa === "interviu" && areInterviu

  const rezultate = useMemo(
    () =>
      CONFIGURARI.map(({ titlu, config }) => {
        const intrare = dinInterviu
          ? construiesteIntrare(stare.raspunsuri, config, {
              azi: new Date(),
              masuratori: masuratoriDin(suplimentar),
              coefActivitate: parseazaNumar(suplimentar.coef),
            })
          : intrareManuala(manual, suplimentar)
        if (!intrare) return { titlu, eroare: "Lipsesc datele de bază (vârstă, sex, înălțime, greutate)." }
        try {
          return { titlu, intrare, rezultat: calculeazaFisa(intrare, config) }
        } catch (e) {
          return { titlu, eroare: e instanceof Error ? e.message : String(e) }
        }
      }),
    [dinInterviu, stare.raspunsuri, manual, suplimentar],
  )

  const rezumat = dinInterviu ? construiesteRezumat(stare.raspunsuri, CONFIG_IMPLICIT) : []
  const problemeRezumat = dinInterviu ? verificaRezumat(rezumat) : []

  const incarcaExemplu = () => {
    // Exemplul variantei de interviu active; interviul rămâne deschis la primul pas, netrimis.
    actualizeaza({
      raspunsuri: exempluPentru(CONFIG_IMPLICIT, new Date()),
      etapa: "interviu",
      idPas: null,
      oprire: null,
      rezumat: [],
      trimis: false,
    })
    setSursa("interviu")
    setSuplimentar(FARA_SUPLIMENTAR)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl">Fișa de verificare</h1>
        <Alert>
          <AlertTitle>Ecran de dezvoltare</AlertTitle>
          <AlertDescription>
            Nu există în producție. Arată fișa completă pentru Mariana, cu cifre, calculată în browser. De aici
            nimic nu se salvează și nu se trimite.
          </AlertDescription>
        </Alert>
        <p className="text-sm">
          <Link href="/evaluare" className="text-primary underline underline-offset-4">
            Înapoi la interviu
          </Link>{" "}
          (navigarea prin acest link păstrează răspunsurile; reîncărcarea paginii le șterge)
        </p>
      </header>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold md:text-xl">Sursa datelor</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={dinInterviu ? "default" : "outline"}
            disabled={!areInterviu}
            onClick={() => setSursa("interviu")}
          >
            Răspunsurile din interviu{areInterviu ? "" : " (nu există încă)"}
          </Button>
          <Button variant={dinInterviu ? "outline" : "default"} onClick={() => setSursa("manual")}>
            Date manuale
          </Button>
          <Button variant="secondary" onClick={incarcaExemplu}>
            Încarcă în interviu exemplul din studiul de caz
          </Button>
        </div>

        {!dinInterviu && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {CAZURI.map((caz) => (
                <Button
                  key={caz.nume}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setManual(caz.manual)
                    setSuplimentar(caz.suplimentar)
                  }}
                >
                  {caz.nume}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Sex</span>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3"
                  value={manual.sex}
                  onChange={(e) => setManual({ ...manual, sex: e.target.value as Sex })}
                >
                  <option value="F">Femeie</option>
                  <option value="B">Bărbat</option>
                </select>
              </label>
              <CampText eticheta="Vârstă (ani)" valoare={manual.varsta} onSchimba={(v) => setManual({ ...manual, varsta: v })} />
              <CampText eticheta="Înălțime (cm)" valoare={manual.inaltime} onSchimba={(v) => setManual({ ...manual, inaltime: v })} />
              <CampText eticheta="Greutate (kg)" valoare={manual.greutate} onSchimba={(v) => setManual({ ...manual, greutate: v })} />
              <CampText eticheta="Ritm dorit (kg/săpt.)" valoare={manual.ritmDorit} onSchimba={(v) => setManual({ ...manual, ritmDorit: v })} />
              <CampText eticheta="SCOFF: răspunsuri „da”" valoare={manual.scoff} onSchimba={(v) => setManual({ ...manual, scoff: v })} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Bifa eticheta="Scopul include slăbirea" bifat={manual.scopSlabire} onSchimba={(v) => setManual({ ...manual, scopSlabire: v })} />
              <Bifa eticheta="Sarcină sau alăptare" bifat={manual.sarcina} onSchimba={(v) => setManual({ ...manual, sarcina: v })} />
              <Bifa eticheta="Diabet tratat cu insulină" bifat={manual.insulina} onSchimba={(v) => setManual({ ...manual, insulina: v })} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-base font-semibold">Ce ar completa Mariana</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <CampText
              eticheta="Coeficient confirmat"
              valoare={suplimentar.coef}
              onSchimba={(v) => setSuplimentar({ ...suplimentar, coef: v })}
              substituent="gol = propus de cod"
            />
            <CampText eticheta="Gât (cm)" valoare={suplimentar.gat} onSchimba={(v) => setSuplimentar({ ...suplimentar, gat: v })} />
            <CampText eticheta="Talie (cm)" valoare={suplimentar.talie} onSchimba={(v) => setSuplimentar({ ...suplimentar, talie: v })} />
            <CampText eticheta="Abdomen (cm)" valoare={suplimentar.abdomen} onSchimba={(v) => setSuplimentar({ ...suplimentar, abdomen: v })} />
            <CampText eticheta="Șolduri (cm)" valoare={suplimentar.solduri} onSchimba={(v) => setSuplimentar({ ...suplimentar, solduri: v })} />
          </div>
        </div>
        <Bifa eticheta="Precizie completă (3 zecimale, fără rotunjirea de afișare)" bifat={precizie} onSchimba={setPrecizie} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {rezultate.map((r) => (
          <div key={r.titlu} className="space-y-3 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">{r.titlu}</h2>
            {"eroare" in r ? (
              <p className="text-sm text-destructive">{r.eroare}</p>
            ) : (
              <Rezultat rezultat={r.rezultat} precizie={precizie} />
            )}
          </div>
        ))}
      </section>

      {dinInterviu && (
        <>
          <section className="space-y-3 rounded-lg border p-4">
            <h2 className="text-lg font-semibold md:text-xl">Starea interviului</h2>
            <p className="text-sm">
              Varianta de interviu: <code>{CONFIG_IMPLICIT.interviu.varianta}</code> · etapă:{" "}
              <code>{stare.etapa}</code>
              {stare.oprire && (
                <>
                  {" "}
                  · oprire: <code>{stare.oprire.tip}</code> ({stare.oprire.detaliu})
                </>
              )}
              {stare.consimtamant && (
                <>
                  {" "}
                  · consimțământ <code>{stare.consimtamant.versiune}</code> la {stare.consimtamant.data}
                </>
              )}
            </p>
          </section>

          <section className="space-y-3 rounded-lg border p-4">
            <h2 className="text-lg font-semibold md:text-xl">Rezumatul pe care îl vede clienta</h2>
            <ul className="list-disc space-y-1 pl-5">
              {rezumat.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="text-sm">
              Verificare fără cifre:{" "}
              {problemeRezumat.length === 0 ? "trece" : `respins (${problemeRezumat.join(" ")})`}
            </p>
          </section>

          <section className="space-y-3 rounded-lg border p-4">
            <h2 className="text-lg font-semibold md:text-xl">Răspunsurile din interviu</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {randuriFisa(stare.raspunsuri, CONFIG_IMPLICIT).map((rand) => (
                    <TableRow key={rand.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{rand.bloc}</TableCell>
                      <TableCell>
                        {rand.intrebare} <code className="text-xs text-muted-foreground">{rand.id}</code>
                      </TableCell>
                      <TableCell className="font-medium">{rand.raspuns}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function Rezultat({ rezultat, precizie }: { rezultat: RezultatCalcul; precizie: boolean }) {
  return (
    <div className="space-y-4">
      {rezultat.stare === "oprit" ? (
        <Alert variant="destructive">
          <AlertTitle>Oprire de siguranță: fără plan și fără ținte</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {rezultat.opriri.map((o) => (
                <li key={o.tip}>
                  <code>{o.tip}</code>: {o.detaliu}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {randuriCalcul(rezultat, precizie).map((rand) => (
                <TableRow key={rand.eticheta}>
                  <TableCell className="py-2 text-muted-foreground">{rand.eticheta}</TableCell>
                  <TableCell className="py-2 font-medium">{rand.valoare}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-base font-semibold">Semnale ({rezultat.semnale.length})</h3>
        {rezultat.semnale.length === 0 && <p className="text-sm text-muted-foreground">Niciun semnal.</p>}
        <ul className="space-y-2 text-sm">
          {rezultat.semnale.map((s) => (
            <li key={s.cod} className="flex items-start gap-2">
              <Badge variant={s.nivel === "atentie" ? "default" : "secondary"} className="shrink-0">
                {s.nivel === "atentie" ? "atenție" : "informativ"}
              </Badge>
              <span>
                {s.mesaj} <code className="text-xs text-muted-foreground">{s.cod}</code>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function CampText(props: { eticheta: string; valoare: string; onSchimba: (v: string) => void; substituent?: string }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium">{props.eticheta}</span>
      <Input
        value={props.valoare}
        inputMode="decimal"
        placeholder={props.substituent}
        onChange={(e) => props.onSchimba(e.target.value)}
      />
    </label>
  )
}

function Bifa(props: { eticheta: string; bifat: boolean; onSchimba: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={props.bifat} onCheckedChange={(v) => props.onSchimba(v === true)} />
      {props.eticheta}
    </label>
  )
}
