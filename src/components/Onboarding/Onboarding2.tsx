/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../lib/store';
import { AppState } from '../../types';
import { GOAL_OPTIONS } from '../../constants';

const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const YEAR_OPTIONS = ['2026', '2027', '2028', '2029'];

const formatTargetDate = (month: string, year: string) => {
  const monthIndex = MONTH_OPTIONS.indexOf(month);
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
};

const parseTargetDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return {
    month: MONTH_OPTIONS[date.getMonth()] || 'December',
    year: String(date.getFullYear()),
  };
};

const calculateDailyLimit = (amount: number, currentAmount: number, targetDate: string, monthlyIncome: number) => {
  const remaining = Math.max(amount - currentAmount, 0);
  const target = new Date(targetDate);
  const today = new Date();
  const diffDays = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const requiredDailySavings = remaining / diffDays;
  const requiredMonthlySavings = requiredDailySavings * 30;
  const requiredMonthlyExpenses = monthlyIncome - requiredMonthlySavings;
  return Math.max(10, Math.round(requiredMonthlyExpenses / 30));
};

export default function Onboarding2() {
  const { setAppState, goal, setGoal, setDailyLimit, monthlyIncome } = useApp();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([goal.name]);
  const { month: initialMonth, year: initialYear } = parseTargetDate(goal.targetDate);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);

  const toggleGoal = (name: string) => {
    if (selectedGoals.includes(name)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== name));
    } else {
      setSelectedGoals([...selectedGoals, name]);
      setGoal({ ...goal, name }); // Use the latest selected as the primary for now
    }
  };

  const targetDate = formatTargetDate(selectedMonth, selectedYear);

  useEffect(() => {
    if (goal.targetDate !== targetDate) {
      setGoal({ ...goal, targetDate });
    }
    setDailyLimit(calculateDailyLimit(goal.targetAmount, goal.currentAmount, targetDate, monthlyIncome));
  }, [goal.targetAmount, goal.currentAmount, monthlyIncome, selectedMonth, selectedYear, targetDate, goal, setDailyLimit, setGoal]);

  return (
    <div className="h-full bg-white flex flex-col p-8">
      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6 text-text-primary">
          What are you saving for?
        </h1>

        {/* Goal Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GOAL_OPTIONS.map((name) => (
            <button
              key={name}
              onClick={() => toggleGoal(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGoals.includes(name)
                  ? "bg-purple-light text-primary border-1.5 border-primary shadow-sm"
                  : "bg-[#F3F4F6] text-text-secondary border-1.5 border-transparent"
              }`}>
              {name}
            </button>
          ))}
        </div>

        {/* Goal Amount */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-secondary mb-3">
            How much do you need?
          </label>
          <div className="flex items-center gap-3 bg-surface p-4 rounded-xl">
            <span className="text-2xl font-bold text-primary">RM</span>
            <input
              type="number"
              placeholder="0"
              value={goal.targetAmount || ""}
              onChange={(e) =>
                setGoal({ ...goal, targetAmount: Number(e.target.value) })
              }
              className="bg-transparent border-none focus:outline-none text-3xl font-bold text-primary w-full"
            />
          </div>
        </div>

        {/* Date Row */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            By when?
          </label>
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 bg-surface p-4 rounded-xl appearance-none font-medium text-text-primary focus:outline-primary">
              {MONTH_OPTIONS.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-1/3 bg-surface p-4 rounded-xl appearance-none font-medium text-text-primary focus:outline-primary">
              {YEAR_OPTIONS.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={() => setAppState(AppState.ONBOARDING_3)}
        className="w-full h-13 mt-6 bg-primary text-white rounded-[14px] font-semibold text-lg shrink-0 hover:bg-primary-dark transition-colors">
        Continue →
      </button>
    </div>
  );
}
