'use client';

import { useState } from 'react';
import { TraceabilityProvider } from '@/context/TraceabilityContext';
import { AppView } from '@/domain/demoConfig';
import { AnimalHeaderCard } from './AnimalHeaderCard';
import { BottomNavigation } from './BottomNavigation';
import { PassportView } from './PassportView';
import { RegisterEventView } from './RegisterEventView';
import { RoleSimulatorBanner } from './RoleSimulatorBanner';
import { SovereigntyView } from './SovereigntyView';

const VIEW_COMPONENTS: Record<AppView, () => React.JSX.Element> = {
  PASSPORT: PassportView,
  SOVEREIGNTY: SovereigntyView,
  REGISTER: RegisterEventView,
};

export function AppShell() {
  const [activeView, setActiveView] = useState<AppView>('PASSPORT');
  const ActiveView = VIEW_COMPONENTS[activeView];

  return (
    <TraceabilityProvider>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between border-x border-[#DFE7E1] bg-[var(--color-page)] md:max-w-3xl">
        <div>
          <RoleSimulatorBanner />
          <main className="space-y-6 px-4 py-5">
            <AnimalHeaderCard />
            <ActiveView />
          </main>
        </div>
        <BottomNavigation activeView={activeView} onChange={setActiveView} />
      </div>
    </TraceabilityProvider>
  );
}
