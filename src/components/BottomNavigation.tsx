'use client';

import { FilePlus2, LucideIcon, ScrollText, ShieldHalf } from 'lucide-react';
import { AppView, VIEW_LABELS } from '@/domain/demoConfig';

const NAV_ITEMS: { view: AppView; icon: LucideIcon }[] = [
  { view: 'PASSPORT', icon: ScrollText },
  { view: 'SOVEREIGNTY', icon: ShieldHalf },
  { view: 'REGISTER', icon: FilePlus2 },
];

interface BottomNavigationProps {
  activeView: AppView;
  onChange: (view: AppView) => void;
}

export function BottomNavigation({ activeView, onChange }: BottomNavigationProps) {
  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-3 border-t border-[#DFE7E1] bg-white shadow-[0_-2px_8px_rgba(16,32,26,0.04)]">
      {NAV_ITEMS.map(({ view, icon: Icon }) => {
        const isActive = view === activeView;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${
              isActive ? 'text-[#1E6B4F]' : 'text-[#7A8881] hover:text-[#10201A]'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 h-0.5 w-10 bg-[#1E6B4F]" aria-hidden />
            )}
            <span
              className="px-4 py-1"
            >
              <Icon size={20} />
            </span>
            {VIEW_LABELS[view].navLabel}
          </button>
        );
      })}
    </nav>
  );
}
