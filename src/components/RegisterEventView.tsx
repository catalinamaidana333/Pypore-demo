'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { EventRegistrationError, useTraceability } from '@/context/TraceabilityContext';
import {
  EVENT_FORM_FIELDS,
  EVENT_POLICY_CATEGORY,
  EVENT_TITLE_PLACEHOLDERS,
  EVENT_TYPE_LABELS,
  UI_TEXTS,
  VIEW_LABELS,
} from '@/domain/demoConfig';
import { EventType, TraceabilityEvent } from '@/domain/traceability';
import { HederaTransactionLink } from './HederaTransactionLink';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

const inputClassName =
  'w-full rounded-[8px] border border-[#CAD8D0] bg-white px-3 py-2.5 text-sm text-[#10201A] outline-none transition focus:border-[#1E6B4F] focus:ring-2 focus:ring-[#1E6B4F]/15';

export function RegisterEventView() {
  const { registerSignedEvent } = useTraceability();
  const [eventType, setEventType] = useState<EventType>('VACUNACION');
  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [lastSignedEvent, setLastSignedEvent] = useState<TraceabilityEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    setFieldValues({});
    setStatus('idle');
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setStatus('loading');

    const metadata = Object.fromEntries(
      EVENT_FORM_FIELDS[eventType]
        .map((field) => [field, fieldValues[field]?.trim() ?? ''] as const)
        .filter(([, value]) => value !== '')
    );

    try {
      const signedEvent = await registerSignedEvent({
        type: eventType,
        title: title.trim(),
        metadata,
        visibilityCategory: EVENT_POLICY_CATEGORY[eventType],
      });
      setLastSignedEvent(signedEvent);
      setTitle('');
      setFieldValues({});
      setStatus('success');
    } catch (error) {
      setErrorMessage(
        error instanceof EventRegistrationError ? error.message : UI_TEXTS.signedError
      );
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <section>
      <h2 className="mb-4 text-base font-extrabold text-[#10201A]">{VIEW_LABELS.REGISTER.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[12px] border border-[#DFE7E1] bg-white p-4">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-[#5B6B63]">Tipo de hito</span>
          <div className="grid grid-cols-2 gap-1 rounded-[8px] border border-[#DFE7E1] bg-[#F3F5F1] p-1">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`rounded-[6px] px-3 py-2 text-xs font-semibold transition ${
                  type === eventType
                    ? 'bg-[#1E6B4F] text-white'
                    : 'text-[#5B6B63] hover:bg-white'
                }`}
              >
                {EVENT_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[#5B6B63]">Título</span>
          <input
            required
            value={title}
            onChange={(changeEvent) => setTitle(changeEvent.target.value)}
            placeholder={EVENT_TITLE_PLACEHOLDERS[eventType]}
            className={inputClassName}
          />
        </label>

        {EVENT_FORM_FIELDS[eventType].map((field) => (
          <label key={field} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#5B6B63]">{field}</span>
            <input
              value={fieldValues[field] ?? ''}
              onChange={(changeEvent) =>
                setFieldValues((prev) => ({ ...prev, [field]: changeEvent.target.value }))
              }
              className={inputClassName}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#1E6B4F] py-3 text-sm font-bold text-white transition hover:bg-[#185940] disabled:opacity-70"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {isLoading ? UI_TEXTS.signingLabel : UI_TEXTS.submitLabel}
        </button>

        {status === 'success' && lastSignedEvent && (
          <div className="rounded-[8px] border border-[#CFE0D6] bg-[#E3EEE8] p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-[#1E6B4F]">
              <CheckCircle2 size={14} />
              {UI_TEXTS.signedSuccess} · {UI_TEXTS.hashVerified}
            </p>
            <HederaTransactionLink
              transactionId={lastSignedEvent.hederaTransactionId}
              hashscanUrl={lastSignedEvent.hashscanUrl}
              className="mt-1 break-all text-[11px]"
            />
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-[8px] border border-[#DDAF9D] bg-[#FBF5F2] p-3 text-xs text-[#7D3C21]"
          >
            <TriangleAlert size={14} className="mt-0.5 shrink-0 text-[#B3522A]" />
            <p className="flex-1 font-medium leading-relaxed">{errorMessage}</p>
            <button
              type="button"
              aria-label={UI_TEXTS.dismissError}
              onClick={() => setStatus('idle')}
              className="shrink-0 rounded p-0.5 text-[#B3522A] transition hover:bg-[#F2DED5]"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
