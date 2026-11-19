'use client';

import {
  BadgeCheck,
  LockKeyhole,
} from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { EVENT_TYPE_LABELS, UI_TEXTS, VIEW_LABELS } from '@/domain/demoConfig';
import { TraceabilityEvent } from '@/domain/traceability';
import { formatTechnicalDate, truncateHash } from '@/lib/format';
import { HederaTransactionLink } from './HederaTransactionLink';

function TimelineEvent({ event, isLocked }: { event: TraceabilityEvent; isLocked: boolean }) {
  return (
    <li className="relative pl-12">
      <span
        className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-page)] ${
          isLocked ? 'bg-[#B3522A] text-white' : 'bg-[#1E6B4F] text-white'
        }`}
        title={isLocked ? 'Pendiente' : 'Verificado'}
      >
        <img
          src="/traza-mark.svg"
          alt=""
          className={`h-5 w-5 rounded-full bg-white p-0.5 ${isLocked ? 'opacity-80' : ''}`}
        />
      </span>

      <article
        className={`rounded-[12px] border bg-white p-3.5 ${
          isLocked ? 'border-[#DDAF9D]' : 'border-[#DFE7E1]'
        }`}
      >
        <header className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5B6B63]">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <time className="font-mono text-[10px] uppercase text-[#5B6B63]">
            {formatTechnicalDate(event.timestamp)}
          </time>
        </header>

        {isLocked ? (
          <div className="mt-2 rounded-[8px] border border-dashed border-[#D8A18B] bg-[#FBF5F2] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B3522A]">
              <LockKeyhole size={14} />
              {UI_TEXTS.protectedData}
            </div>
            <div className="mt-2 space-y-1.5" aria-hidden>
              <div className="h-2.5 w-3/4 rounded bg-[#EBD0C4]" />
              <div className="h-2.5 w-1/2 rounded bg-[#EBD0C4]" />
            </div>
          </div>
        ) : (
          <>
            <h3 className="mt-1 text-sm font-bold text-[#10201A]">{event.title}</h3>
            <dl className="mt-2 space-y-1">
              {Object.entries(event.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 text-xs">
                  <dt className="text-[#5B6B63]">{key}</dt>
                  <dd className="text-right font-semibold text-[#10201A]">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <footer className="mt-3 space-y-1.5 border-t border-[#E8EEE9] pt-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E3EEE8] px-2 py-1 text-[10px] font-bold text-[#1E6B4F]">
            <BadgeCheck size={12} />
            {UI_TEXTS.hashVerified}
          </span>
          <div>
            <HederaTransactionLink
              transactionId={event.hederaTransactionId}
              hashscanUrl={event.hashscanUrl}
              className="text-[11px]"
            />
          </div>
          <p className="font-mono text-[10px] uppercase text-[#7A8881]">
            prev: {truncateHash(event.previousHash)}
          </p>
        </footer>
      </article>
    </li>
  );
}

export function PassportView() {
  const { animalRecord, isEventVisible } = useTraceability();

  return (
    <section>
      <h2 className="mb-4 text-base font-extrabold text-[#10201A]">{VIEW_LABELS.PASSPORT.title}</h2>
      <div className="relative">
        <span className="absolute bottom-4 left-[13px] top-4 w-px bg-[#CAD8D0]" aria-hidden />
        <ol className="relative space-y-4">
          {animalRecord.events.map((event) => (
            <TimelineEvent key={event.id} event={event} isLocked={!isEventVisible(event)} />
          ))}
        </ol>
      </div>
    </section>
  );
}
