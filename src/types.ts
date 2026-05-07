/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string
  icon: string;
  category: string;
}

export interface SpendingCategory {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: number; // monthly
  spentAmount: number; // monthly
  color: string;
}

export interface SquadMember {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  hasStreak: boolean;
  weeklyTarget: number;
  weeklySaved: number;
}

export interface Squad {
  id: string;
  name: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  streakWeeks: number;
  members: SquadMember[];
  bonusPoints: number;
  challengeProgress: number; // e.g. 5/7 days
}

export enum UserType {
  STUDENT = 'University Student',
  GRADUATE = 'Working Graduate',
}

export enum AppState {
  DEMO_SETUP = 'DEMO_SETUP',
  ONBOARDING_1 = 'onboarding_step_1',
  ONBOARDING_2 = 'onboarding_step_2',
  ONBOARDING_3 = 'onboarding_step_3',
  DASHBOARD = 'dashboard',
  SPENDING_PLAN = 'spending_plan',
  SQUAD = 'squad',
}
