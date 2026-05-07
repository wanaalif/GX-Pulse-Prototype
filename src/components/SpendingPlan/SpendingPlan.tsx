/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertCircle, Info, TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../../lib/store';
import { AppState, SpendingCategory } from '../../types';

export default function SpendingPlan() {
  const { setAppState, categories, setCategories, dailyLimit, monthlyIncome, goal, recommendedDailyLimit, lockSpendingPlan } = useApp();
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [tempCategories, setTempCategories] = useState<SpendingCategory[]>(categories);

  const handleBack = () => setAppState(AppState.DASHBOARD);

  // ===== REAL-TIME CALCULATIONS =====
  const currentPlannedExpense = useMemo(() => 
    tempCategories.reduce((sum, c) => sum + c.allocatedAmount, 0),
    [tempCategories]
  );

  const currentMonthlySavings = useMemo(() => 
    monthlyIncome - currentPlannedExpense,
    [monthlyIncome, currentPlannedExpense]
  );

  const currentPlannedDailyLimit = useMemo(() => 
    currentPlannedExpense / 30,
    [currentPlannedExpense]
  );

  const monthsToReachGoal = useMemo(() => {
    if (currentMonthlySavings <= 0) return Infinity;
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    return remaining / currentMonthlySavings;
  }, [currentMonthlySavings, goal]);

  const dynamicTargetDate = useMemo(() => {
    if (monthsToReachGoal === Infinity) return null;
    const projected = new Date();
    projected.setDate(projected.getDate() + Math.ceil(monthsToReachGoal * 30));
    return projected;
  }, [monthsToReachGoal]);

  const formatMonthYear = (date: Date | null) => {
    if (!date) return 'Unreachable';
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // ===== IMPACT ANALYSIS =====
  const originalTargetDate = new Date(goal.targetDate);
  const daysDifference = dynamicTargetDate 
    ? Math.round((dynamicTargetDate.getTime() - originalTargetDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isOptimalPlan = currentPlannedDailyLimit <= recommendedDailyLimit;
  const isPlanViable = currentMonthlySavings > 0;

  // ===== HANDLERS =====
  const updateCategoryAmount = (id: string, newAmount: number) => {
    const updated = tempCategories.map(c =>
      c.id === id ? { ...c, allocatedAmount: Math.max(0, newAmount) } : c
    );
    setTempCategories(updated);
  };

  const handleMatchAIOptimal = () => {
    const optimalMonthlyBudget = recommendedDailyLimit * 30;
    const totalAllocated = tempCategories.reduce((sum, c) => sum + c.allocatedAmount, 0);
    
    if (totalAllocated === 0) {
      setToastMsg('No categories to optimize');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const scaled = tempCategories.map((c, index) => ({
      ...c,
      allocatedAmount: index === tempCategories.length - 1
        ? optimalMonthlyBudget - tempCategories.slice(0, -1).reduce((sum, cat) => 
            sum + Math.round((cat.allocatedAmount / totalAllocated) * optimalMonthlyBudget), 0)
        : Math.round((c.allocatedAmount / totalAllocated) * optimalMonthlyBudget),
    }));
    
    setTempCategories(scaled);
    setToastMsg('Plan matched to AI optimal settings');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLockPlan = () => {
    const preciseDailyLimit = currentPlannedExpense / 30;
    lockSpendingPlan(tempCategories, preciseDailyLimit);
    setToastMsg('Plan locked successfully');
    setShowToast(true);
    setTimeout(() => {
      setAppState(AppState.DASHBOARD);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-full bg-white pb-40">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-50 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center text-white">
              <CheckCircle size={12} />
            </div>
            <span className="text-sm font-bold leading-tight">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-white z-40 border-b border-gray-50 mb-2">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[22px] font-bold text-text-primary">My Spending Plan</h1>
        </div>
      </header>

      <div className="px-5">
        {/* Impact Banner */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl mb-6 border-2 flex items-start gap-3 ${
              !isPlanViable 
                ? 'bg-danger/10 border-danger/30'
                : isOptimalPlan
                ? 'bg-success/10 border-success/30'
                : 'bg-amber-light border-amber-nudge/30'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              !isPlanViable 
                ? 'bg-danger/20 text-danger'
                : isOptimalPlan
                ? 'bg-success/20 text-success'
                : 'bg-amber-nudge/20 text-amber-nudge'
            }`}>
              {!isPlanViable ? (
                <AlertCircle size={20} />
              ) : isOptimalPlan ? (
                <TrendingUp size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm mb-1 ${
                !isPlanViable 
                  ? 'text-danger'
                  : isOptimalPlan
                  ? 'text-success'
                  : 'text-amber-nudge'
              }`}>
                Current Plan: Goal reached in {formatMonthYear(dynamicTargetDate)}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {!isPlanViable 
                  ? '⚠ Goal is unreachable with current plan. Increase savings to proceed.'
                  : isOptimalPlan
                  ? `✓ You're saving faster! Goal reached ${Math.abs(daysDifference || 0)} days early.`
                  : `This allocation exceeds safe-to-spend. Goal delayed by ${daysDifference} days.`
                }
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Goal Anchor */}
        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm mb-8">
          <div className="w-12 h-12 bg-purple-light rounded-xl flex items-center justify-center text-2xl">
            {goal.icon}
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-base">{goal.name}</h3>
            <p className="text-xs text-text-secondary font-medium">
              RM {goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-6">
          {tempCategories.map((cat) => {
            const isEditing = editingId === cat.id;
            const progress = Math.min(100, (cat.spentAmount / cat.allocatedAmount) * 100);

            return (
              <div 
                key={cat.id} 
                className="flex flex-col gap-3 group"
                onClick={() => !isEditing && setEditingId(cat.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <span className={`font-medium ${cat.id === 'self-reward' ? 'text-primary' : 'text-text-primary'}`}>
                      {cat.name}
                    </span>
                    {cat.id === 'self-reward' && (
                      <div className="group/tooltip relative">
                        <Info size={14} className="text-primary opacity-50 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-text-primary text-white text-[10px] p-2 rounded-lg z-50">
                          "This is yours. Guilt-free." - research shows rewarding yourself prevents plan abandonment.
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">RM</span>
                      <input 
                        autoFocus
                        type="number"
                        className="w-20 bg-purple-light/50 border border-primary/20 rounded-md p-1 px-2 text-right font-bold text-primary focus:outline-none"
                        defaultValue={cat.allocatedAmount}
                        onBlur={(e) => {
                          updateCategoryAmount(cat.id, Number(e.target.value));
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                            updateCategoryAmount(cat.id, Number((e.target as HTMLInputElement).value));
                            setEditingId(null);
                          }
                          if(e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <span className="text-xs text-text-secondary">/mo</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                       <span className={`font-bold ${cat.id === 'self-reward' ? 'text-primary' : 'text-text-primary'}`}>
                        RM {cat.allocatedAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${progress > 90 ? 'bg-danger' : 'bg-primary'}`}
                  />
                </div>
                
                <div className="flex justify-between text-[10px] font-medium text-text-secondary uppercase tracking-widest">
                  <span>Spent: RM {cat.spentAmount}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redesigned Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-6 pb-10 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 z-50">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary mb-1 font-bold uppercase tracking-wider">Monthly Expense</span>
            <span className="text-lg font-bold text-text-primary">RM {Math.round(currentPlannedExpense).toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary mb-1 font-bold uppercase tracking-wider">Monthly Savings</span>
            <span className={`text-lg font-bold ${currentMonthlySavings < 0 ? 'text-danger' : 'text-primary'}`}>
              RM {Math.round(currentMonthlySavings).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary mb-1 font-bold uppercase tracking-wider">Daily Budget</span>
            <span className="text-lg font-bold text-text-primary">RM {currentPlannedDailyLimit.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleMatchAIOptimal}
            className="w-full h-13 bg-white text-primary border-2 border-primary rounded-2xl font-semibold text-base transition-all hover:bg-primary/5 active:scale-95"
          >
            Match AI Optimal Plan
          </button>
          <button 
            onClick={handleLockPlan}
            disabled={!isPlanViable}
            className={`w-full h-13 rounded-2xl font-semibold text-base shadow-lg transition-all active:scale-95 ${
              isPlanViable
                ? 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Lock This Plan →
          </button>
        </div>
      </footer>
    </div>
  );
}
