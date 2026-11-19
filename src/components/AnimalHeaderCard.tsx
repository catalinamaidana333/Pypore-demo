'use client';

import { MapPin, Nfc, QrCode, ShieldCheck } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { ROLE_CONFIGS, UI_TEXTS } from '@/domain/demoConfig';

export function AnimalHeaderCard() {
  const { animalRecord, currentRole } = useTraceability();

  return (
    <section className="rounded-[12px] bg-[#10201A] p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E3EEE8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1E6B4F]">
            <ShieldCheck size={12} />
            {UI_TEXTS.sovereignIdentity}
          </span>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AFC1B8]">Caravana</p>
          <p className="font-mono text-2xl font-semibold tracking-[0.08em]">{animalRecord.caravanaId}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-[8px] bg-white p-2 text-[#10201A]">
          <QrCode size={52} strokeWidth={1.5} />
          <span className="flex items-center gap-0.5 font-mono text-[9px] font-semibold">
            <Nfc size={10} />
            RFID
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 text-xs">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AFC1B8]">RENSPA</dt>
          <dd className="font-mono font-semibold">{animalRecord.renspa}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AFC1B8]">Raza</dt>
          <dd className="font-semibold">{animalRecord.breed}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AFC1B8]">Nacimiento</dt>
          <dd className="font-mono font-semibold">{animalRecord.birthDate}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AFC1B8]">Origen</dt>
          <dd className="flex items-center gap-1 font-semibold">
            <MapPin size={12} className="shrink-0 text-[#AFC1B8]" />
            {animalRecord.originLocation}
          </dd>
        </div>
      </dl>

      <p className="mt-3 font-mono text-[10px] text-[#AFC1B8]">
        {animalRecord.ownerName} · Vista: {ROLE_CONFIGS[currentRole].badge}
      </p>
    </section>
  );
}
