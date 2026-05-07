/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { Home, BarChart2, Users, Settings } from 'lucide-react';
import { AppProvider, useApp } from './lib/store';
import { AppState } from './types';

// Screens (will be created in separate files)
import { DemoSetup } from './components/DemoSetup/DemoSetup';
import Onboarding1 from './components/Onboarding/Onboarding1';
import Onboarding2 from './components/Onboarding/Onboarding2';
import Onboarding3 from './components/Onboarding/Onboarding3';
import Dashboard from './components/Dashboard/Dashboard';
import SquadStreaks from './components/Squad/SquadStreaks';
import SpendingPlan from './components/SpendingPlan/SpendingPlan';

function AppContent() {
  const { appState, setAppState } = useApp();

  const renderScreen = () => {
    switch (appState) {
      case AppState.DEMO_SETUP: return <DemoSetup />;
      case AppState.ONBOARDING_1: return <Onboarding1 />;
      case AppState.ONBOARDING_2: return <Onboarding2 />;
      case AppState.ONBOARDING_3: return <Onboarding3 />;
      case AppState.DASHBOARD: return <Dashboard />;
      case AppState.SPENDING_PLAN: return <SpendingPlan />;
      case AppState.SQUAD: return <SquadStreaks />;
      default: return <Dashboard />;
    }
  };

  const showNav = [AppState.DASHBOARD, AppState.SQUAD, AppState.SPENDING_PLAN].includes(appState);

  return (
    <div className="h-dvh w-full bg-white max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={appState}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && (
        <nav className="h-20 bg-white border-t border-gray-100 flex items-center justify-around px-4 pb-4">
          <button 
            onClick={() => setAppState(AppState.DASHBOARD)}
            className={`flex flex-col items-center gap-1 ${appState === AppState.DASHBOARD ? 'text-primary' : 'text-gray-400'}`}
          >
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-gray-400 opacity-50 cursor-not-allowed"
            disabled
          >
            <BarChart2 size={24} />
            <span className="text-[10px] font-medium">Analytics</span>
          </button>
          <button 
            onClick={() => setAppState(AppState.SQUAD)}
            className={`flex flex-col items-center gap-1 ${appState === AppState.SQUAD ? 'text-primary' : 'text-gray-400'}`}
          >
            <Users size={24} />
            <span className="text-[10px] font-medium">Squad</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-gray-400 opacity-50 cursor-not-allowed"
            disabled
          >
            <Settings size={24} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
