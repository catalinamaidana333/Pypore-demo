'use client';

import { Eye } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { ROLE_CONFIGS, UI_TEXTS } from '@/domain/demoConfig';
import { ViewerRole } from '@/domain/traceability';

const ROLE_ORDER: ViewerRole[] = ['PRODUCER', 'AUDITOR_SENASA', 'FRIGORIFICO'];

export function RoleSimulatorBanner() {
  const { currentRole, setCurrentRole } = useTraceability();

  return (
    <header className="sticky top-0 z-30 border-b border-[#DFE7E1] bg-[var(--color-surface)] px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/pypore-mark.svg" alt="" className="h-11 w-11" />
          <div>
            <p className="font-display text-[25px] font-extrabold leading-none text-[#10201A]">
              Pypor<span className="text-[#B3522A]">é</span>
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#5B6B63]">
              Trazabilidad ganadera
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-[#B3522A]">
          <Eye size={12} />
          Demo
        </div>
      </div>
      <div role="tablist" aria-label={UI_TEXTS.simulatorTitle} className="grid grid-cols-3 gap-1 rounded-lg border border-[#DFE7E1] bg-[#F3F5F1] p-1">
        {ROLE_ORDER.map((role) => {
          const isActive = role === currentRole;
          return (
            <button
              key={role}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentRole(role)}
              className={`rounded-[6px] px-1 py-2 text-[11px] font-semibold leading-tight transition ${
                isActive
                  ? 'bg-[#1E6B4F] text-white'
                  : 'text-[#5B6B63] hover:bg-white'
              }`}
            >
              {ROLE_CONFIGS[role].shortLabel}
            </button>
          );
        })}
      </div>
    </header>
  );
}
