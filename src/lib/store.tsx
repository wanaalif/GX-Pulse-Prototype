/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, Goal, SpendingCategory, Squad, UserType } from '../types';
import { INITIAL_GOAL, INITIAL_SQUAD, CATEGORIES, FINANCIAL_CONSTANTS } from '../constants';

const loadPersisted = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return fallback;
  }
};

const calculateDailyLimit = (currentAmount: number, targetAmount: number, targetDate: string, monthlyIncome: number) => {
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const target = new Date(targetDate);
  const today = new Date();
  const diffDays = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const requiredDailySavings = remaining / diffDays;
  const requiredMonthlySavings = requiredDailySavings * 30;
  const requiredMonthlyExpenses = monthlyIncome - requiredMonthlySavings;
  return Math.round(Math.max(10, requiredMonthlyExpenses / 30));
};

const scaleCategoriesToBudget = (categories: SpendingCategory[], targetMonthlyBudget: number) => {
  const totalAllocated = categories.reduce((sum, category) => sum + category.allocatedAmount, 0);
  if (categories.length === 0 || totalAllocated === 0) {
    const base = Math.round(targetMonthlyBudget / Math.max(categories.length, 1));
    return categories.map((category, index) => ({
      ...category,
      allocatedAmount: index === categories.length - 1 ? targetMonthlyBudget - base * (categories.length - 1) : base,
    }));
  }

  let remaining = targetMonthlyBudget;
  return categories.map((category, index) => {
    const amount = index === categories.length - 1
      ? remaining
      : Math.round((category.allocatedAmount / totalAllocated) * targetMonthlyBudget);
    remaining -= amount;
    return {
      ...category,
      allocatedAmount: Math.max(0, amount),
    };
  });
};

interface AppContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  userType: UserType | null;
  setUserType: (type: UserType) => void;
  goal: Goal;
  setGoal: (goal: Goal) => void;
  categories: SpendingCategory[];
  setCategories: (categories: SpendingCategory[]) => void;
  squad: Squad;
  setSquad: (squad: Squad) => void;
  dailyLimit: number;
  setDailyLimit: (limit: number) => void;
  // Financial config for Demo Setup
  financialConfig: typeof FINANCIAL_CONSTANTS;
  setFinancialConfig: (config: typeof FINANCIAL_CONSTANTS) => void;
  // Computed financial values
  monthlyIncome: number;
  currentSpent: number;
  accountBalance: number;
  monthlySavings: number;
  recommendedDailyLimit: number;
  pulseCheckPurchaseAmount: number;
  pulseCheckOverLimit: number;
  pulseCheckDelayDays: number;
  projectedGoalDateValue: number | null;
  // Locking method
  lockSpendingPlan: (newCategories: SpendingCategory[], newDailyLimit: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>(AppState.DEMO_SETUP);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [goal, setGoal] = useState<Goal>(INITIAL_GOAL);
  const [categories, setCategories] = useState<SpendingCategory[]>(CATEGORIES);
  const [squad, setSquad] = useState<Squad>(INITIAL_SQUAD);
  const [dailyLimit, setDailyLimit] = useState<number>(
    calculateDailyLimit(INITIAL_GOAL.currentAmount, INITIAL_GOAL.targetAmount, INITIAL_GOAL.targetDate, FINANCIAL_CONSTANTS.MONTHLY_INCOME)
  );
  const [financialConfig, setFinancialConfig] = useState(() => loadPersisted('gx_finances', FINANCIAL_CONSTANTS));
  const currentSpent = FINANCIAL_CONSTANTS.DEFAULT_CURRENT_SPENT;

  useEffect(() => {
    localStorage.setItem('gx_goal', JSON.stringify(goal));
    localStorage.setItem('gx_categories', JSON.stringify(categories));
    localStorage.setItem('gx_squad', JSON.stringify(squad));
    localStorage.setItem('gx_finances', JSON.stringify(financialConfig));
    localStorage.setItem('gx_dailyLimit', JSON.stringify(dailyLimit));
  }, [goal, categories, squad, financialConfig, dailyLimit]);
   
  useEffect(() => {
    const targetMonthlyBudget = dailyLimit * 30;
    const currentTotal = categories.reduce((sum, category) => sum + category.allocatedAmount, 0);
    if (currentTotal === targetMonthlyBudget || categories.length === 0) return;
    setCategories(scaleCategoriesToBudget(categories, targetMonthlyBudget));
  }, [dailyLimit, goal.targetAmount, goal.targetDate]);

  // Computed values
  const monthlyIncome = FINANCIAL_CONSTANTS.MONTHLY_INCOME;
  const accountBalance = FINANCIAL_CONSTANTS.ACCOUNT_BALANCE;
  const monthlySavings = monthlyIncome - dailyLimit * 30;
  const pulseCheckPurchaseAmount = FINANCIAL_CONSTANTS.PULSE_CHECK_PURCHASE_AMOUNT;
  const pulseCheckOverLimit = pulseCheckPurchaseAmount - (dailyLimit - currentSpent);
  const pulseCheckDelayDays = FINANCIAL_CONSTANTS.PULSE_CHECK_DELAY_DAYS;

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const targetDate = new Date(goal.targetDate);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const remainingDays = Math.max(1, Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const requiredDailySavings = remaining / remainingDays;
  const requiredMonthlySavings = requiredDailySavings * 30;
  const requiredMonthlyExpenses = Math.max(0, monthlyIncome - requiredMonthlySavings);
  const recommendedDailyLimit = Math.round(Math.max(10, requiredMonthlyExpenses / 30));

  const calculateProjectedGoalDateValue = () => {
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    if (remaining === 0) return new Date().getTime();
    if (monthlySavings <= 0) return null;

    const dailySavings = monthlySavings / 30;
    const daysNeeded = Math.ceil(remaining / dailySavings);
    const projected = new Date();
    projected.setDate(projected.getDate() + daysNeeded);
    return projected.getTime();
  };

  const projectedGoalDateValue = calculateProjectedGoalDateValue();

  const lockSpendingPlan = (newCategories: SpendingCategory[], newDailyLimit: number) => {
    setCategories(newCategories);
    setDailyLimit(newDailyLimit);
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        userType,
        setUserType,
        goal,
        setGoal,
        categories,
        setCategories,
        squad,
        setSquad,
        dailyLimit,
        setDailyLimit,
        financialConfig,
        setFinancialConfig,
        monthlyIncome,
        currentSpent,
        accountBalance,
        monthlySavings,
        recommendedDailyLimit,
        pulseCheckPurchaseAmount,
        pulseCheckOverLimit,
        pulseCheckDelayDays,
        projectedGoalDateValue,
        lockSpendingPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
