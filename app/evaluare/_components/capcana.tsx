"use client"

// Câmp-capcană anti-spam: ascuns pentru oameni (și pentru cititoarele de ecran), dar vizibil
// pentru roboții care completează orice câmp. Serverul ignoră cererile în care are o valoare.

import { UI } from "@/lib/evaluare/interviu/texte"
import { CAMP_CAPCANA } from "@/lib/evaluare/trimitere/protocol"

export function Capcana({ valoare, onSchimba }: { valoare: string; onSchimba: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
      <label>
        {UI.capcana}
        <input
          type="text"
          name={CAMP_CAPCANA}
          tabIndex={-1}
          autoComplete="off"
          value={valoare}
          onChange={(e) => onSchimba(e.target.value)}
        />
      </label>
    </div>
  )
}
