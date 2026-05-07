import { useState } from 'react';
import { useApp } from '../../lib/store';
import { AppState } from '../../types';
import { INITIAL_GOAL, FINANCIAL_CONSTANTS } from '../../constants';
import { Settings, Play, RefreshCw } from 'lucide-react';

export const DemoSetup = () => {
  const { goal, setGoal, financialConfig, setFinancialConfig, setAppState } = useApp();

  // Local form state so we don't commit until they hit "Start"
  const [localGoal, setLocalGoal] = useState(goal);
  const [localFinances, setLocalFinances] = useState(financialConfig);

  const handleStartDemo = () => {
    setGoal(localGoal);
    setFinancialConfig(localFinances);
    setAppState(AppState.ONBOARDING_1); // Or DASHBOARD, depending on where your demo starts
  };

  const handleReset = () => {
    localStorage.clear();
    setLocalGoal(INITIAL_GOAL);
    setLocalFinances(FINANCIAL_CONSTANTS);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-primary p-6 text-white text-center">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <h1 className="text-2xl font-bold">Quick Setup</h1>
          <p className="text-sm opacity-80 mt-1">Configure your financial settings</p>
        </div>

        <div className="p-6 space-y-6">
          

          <hr className="border-gray-100" />

          {/* Financial Settings */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Financial Constants</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income ($)</label>
                <input 
                  type="number" 
                  value={localFinances.MONTHLY_INCOME}
                  onChange={(e) => setLocalFinances({...localFinances, MONTHLY_INCOME: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-mid outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Balance ($)</label>
                <input 
                  type="number" 
                  value={localFinances.ACCOUNT_BALANCE}
                  onChange={(e) => setLocalFinances({...localFinances, ACCOUNT_BALANCE: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-mid outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={handleReset}
            className="flex-1 py-3 px-4 flex items-center justify-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleStartDemo}
            className="flex-2 py-3 px-4 flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-md font-medium"
          >
            <Play className="w-4 h-4" /> Start Demo App
          </button>
        </div>
      </div>
    </div>
  );
};