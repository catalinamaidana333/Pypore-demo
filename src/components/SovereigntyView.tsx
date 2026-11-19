'use client';

import { LockKeyhole, ShieldHalf } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import {
  SOVEREIGNTY_POLICY_CONFIGS,
  UI_TEXTS,
  VIEW_LABELS,
} from '@/domain/demoConfig';
import { SovereigntyPolicyKey } from '@/domain/traceability';

const POLICY_ORDER: SovereigntyPolicyKey[] = [
  'shareSanitaryHistory',
  'shareWeightMetrics',
  'shareExactLocation',
  'shareGeneticData',
];

export function SovereigntyView() {
  const { animalRecord, currentRole, toggleSovereigntyPolicy } = useTraceability();

  if (currentRole !== 'PRODUCER') {
    return (
      <section className="rounded-[12px] border border-[#DDAF9D] bg-[#FBF5F2] p-6 text-center">
        <LockKeyhole size={32} className="mx-auto text-[#B3522A]" />
        <h2 className="mt-3 text-base font-bold text-[#7D3C21]">{UI_TEXTS.producerOnlyTitle}</h2>
        <p className="mt-1 text-sm text-[#8F563D]">{UI_TEXTS.producerOnlyBody}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#10201A]">
        <ShieldHalf size={18} className="text-[#B3522A]" />
        {VIEW_LABELS.SOVEREIGNTY.title}
      </h2>
      <ul className="space-y-3">
        {POLICY_ORDER.map((key) => {
          const config = SOVEREIGNTY_POLICY_CONFIGS[key];
          const isShared = animalRecord.sovereigntyPolicy[key];
          return (
            <li
              key={key}
                className={`rounded-[12px] border bg-white p-4 transition ${
                isShared ? 'border-[#CFE0D6]' : 'border-[#DDAF9D]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#10201A]">{config.label}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isShared ? 'text-[#1E6B4F]' : 'text-[#B3522A]'
                    }`}
                  >
                    {isShared ? UI_TEXTS.sharingOn : UI_TEXTS.sharingOff}
                  </span>
                </div>
                <button
                  role="switch"
                  aria-checked={isShared}
                  aria-label={config.label}
                  onClick={() => toggleSovereigntyPolicy(key)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    isShared ? 'bg-[#1E6B4F]' : 'bg-[#B3522A]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${
                      isShared ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-xs text-[#5B6B63]">{config.description}</p>
              <p className="mt-1.5 text-xs font-medium text-[#10201A]">{config.impact}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
