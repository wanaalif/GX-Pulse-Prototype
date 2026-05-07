/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, SpendingCategory, Squad } from './types';

export const CATEGORIES: SpendingCategory[] = [
  { id: 'dining', name: 'Dining', icon: '🍴', allocatedAmount: 500, spentAmount: 242, color: '#4A25AA' },
  { id: 'transport', name: 'Transport', icon: '🚗', allocatedAmount: 80, spentAmount: 53, color: '#7B52D0' },
  { id: 'wardrobe', name: 'Wardrobe', icon: '👕', allocatedAmount: 20, spentAmount: 0, color: '#EDE7F6' },
  { id: 'toiletries', name: 'Toiletries', icon: '🧴', allocatedAmount: 20, spentAmount: 29, color: '#F9FAFB' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', allocatedAmount: 90, spentAmount: 67, color: '#EDE7F6' },
  { id: 'self-reward', name: 'Self-Reward', icon: '✨', allocatedAmount: 20, spentAmount: 0, color: '#4A25AA' },
];

export const INITIAL_GOAL: Goal = {
  id: 'japan-trip',
  name: 'Japan Trip',
  targetAmount: 4200,
  currentAmount: 1840.5,
  targetDate: '2026-12-01',
  icon: '🎯',
  category: 'Travel',
};

export const INITIAL_SQUAD: Squad = {
  id: 'squad-1',
  name: 'Backpackers 2026',
  goalName: 'Bali Graduation Trip 2026',
  targetAmount: 15000,
  currentAmount: 9200,
  streakWeeks: 5,
  bonusPoints: 1240,
  challengeProgress: 5,
  members: [
    { id: 'me', name: 'You', initials: 'Y', hasStreak: true, weeklyTarget: 100, weeklySaved: 100 },
    { id: 'sarah', name: 'Sarah', initials: 'S', hasStreak: true, weeklyTarget: 120, weeklySaved: 120 },
    { id: 'alex', name: 'Alex', initials: 'A', hasStreak: true, weeklyTarget: 80, weeklySaved: 80 },
    { id: 'jin', name: 'Jin', initials: 'J', hasStreak: false, weeklyTarget: 150, weeklySaved: 90 },
  ],
};

export const GOAL_OPTIONS = [
  'Japan Trip',
  'Emergency Fund',
  'New Laptop',
  'Graduation Trip',
  'First Car',
  'Apartment Deposit',
  'Study Abroad',
  'My Own Goal'
];

// Financial constants
export const FINANCIAL_CONSTANTS = {
  MONTHLY_INCOME: 800,
  DEFAULT_CURRENT_SPENT: 13.20,
  ACCOUNT_BALANCE: 1407.50,
  PULSE_CHECK_PURCHASE_AMOUNT: 50,
  PULSE_CHECK_DELAY_DAYS: 3,
};
