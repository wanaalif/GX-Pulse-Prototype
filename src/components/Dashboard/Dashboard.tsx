/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  User,
  Zap,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useApp } from "../../lib/store";
import PulseCheckModal from "../PulseCheck/PulseCheckModal";
import { AppState } from "../../types";

export default function Dashboard() {
  const {
    goal,
    dailyLimit,
    setDailyLimit,
    setAppState,
    currentSpent,
    accountBalance,
    projectedGoalDateValue,
    categories,
    recommendedDailyLimit,
    monthlySavings,
  } = useApp();
  const [showPulseCheck, setShowPulseCheck] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDailyLimit(val);
  };

  const savingsPercent = Math.round(
    (goal.currentAmount / goal.targetAmount) * 100,
  );
  const targetDate = new Date(goal.targetDate);
  const isGoalAchieved = goal.currentAmount >= goal.targetAmount;
  const isSavingOnTrack =
    projectedGoalDateValue !== null &&
    monthlySavings > 0 &&
    projectedGoalDateValue <= targetDate.getTime();

  return (
    <div className="flex flex-col min-h-full bg-white pb-8 pt-4 px-6">
      {/* Top Nav */}
      <header className="h-14 flex items-center justify-between bg-white">
        <h1 className="text-xl font-bold bg-primary text-white py-1 px-2 rounded flex items-center gap-1.5 leading-none">
          GXBank
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:bg-gray-100 p-2 rounded-full transition-colors relative">
            <Bell size={20} />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <User size={18} className="text-primary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 scrollbar-hide">
        {/* GPS Card */}
        <div className="bg-primary rounded-xl p-5 text-white mb-8 shadow-xl shadow-primary/20 relative overflow-hidden">
          {/* Subtle background zap */}
          <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none">
            <Zap size={200} />
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1 opacity-80 uppercase text-[10px] tracking-widest font-bold">
              <Zap size={12} fill="white" />
              GX-Pulse
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              🔥 Day 12 Streak
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium opacity-90">
                {goal.name}
              </span>
              <span className="text-[10px] opacity-70">
                RM {goal.targetAmount.toLocaleString()} Target
              </span>
            </div>
            <div className="w-full h-2.5 bg-accent-mid rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${savingsPercent}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-[11px] opacity-90">
              {savingsPercent}% saved · RM{" "}
              {(goal.targetAmount - goal.currentAmount).toLocaleString()} to go
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-5xl font-bold mb-1">
              RM {dailyLimit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-4 px-1 flex justify-between items-center">
          <span className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Daily Limit
          </span>
        </div>

        {/* Sliders Area */}
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              {/* DYNAMIC COMPACT BADGE (Left Side) */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {/* STATE 1: OPTIMAL */}
                  {dailyLimit === recommendedDailyLimit && (
                    <motion.div
                      key="optimal"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100/50">
                      <CheckCircle2 size={14} className="stroke-[2.5]" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">
                        Achieved by:{" "}
                        {new Date(goal.targetDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </motion.div>
                  )}

                  {/* STATE 2: FAST TRACK */}
                  {dailyLimit < recommendedDailyLimit && (
                    <motion.div
                      key="fast"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100/50">
                      <Zap size={14} className="stroke-[2.5]" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">
                        Fasten to:{" "}
                        {projectedGoalDateValue
                          ? new Date(projectedGoalDateValue).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                          : "TBD"}
                      </span>
                    </motion.div>
                  )}

                  {/* STATE 3: DELAYED */}
                  {dailyLimit > recommendedDailyLimit && monthlySavings > 0 && (
                    <motion.div
                      key="delayed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100/50">
                      <Clock size={14} className="stroke-[2.5]" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">
                        Delayed to:{" "}
                        {projectedGoalDateValue
                          ? new Date(projectedGoalDateValue).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                          : "TBD"}
                      </span>
                    </motion.div>
                  )}

                  {/* STATE 4: DEFICIT (CRITICAL) */}
                  {dailyLimit > recommendedDailyLimit &&
                    monthlySavings <= 0 && (
                      <motion.div
                        key="deficit"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100/50">
                        <AlertCircle size={14} className="stroke-[2.5]" />
                        <span className="text-[11px] font-bold tracking-wide uppercase">
                          Goal Paused
                        </span>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* DAILY LIMIT VALUE (Right Side) */}
              <div className="text-right shrink-0">
                <span className="text-3xl font-bold text-primary tracking-tight">
                  RM {dailyLimit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* The Slider */}
            <input
              type="range"
              min="10"
              max="150"
              step="1"
              value={dailyLimit}
              onChange={handleSliderChange}
              className="w-full h-2 bg-purple-light rounded-full appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[10px] text-text-secondary font-bold px-1 mt-2">
              <span>RM 10</span>
              <span>RM 150</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="flex flex-col p-3 rounded-xl">
            <span className="text-[10px] text-text-secondary mb-1">
              Spent today
            </span>
            <span className="font-bold text-sm text-text-primary">
              RM {currentSpent.toFixed(2)}{" "}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-xl">
            <span className="text-[10px] text-text-secondary mb-1">
              Remaining
            </span>
            <span className="font-bold text-sm text-primary">
              RM {(dailyLimit - currentSpent).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-xl">
            <span className="text-[10px] text-text-secondary mb-1">Status</span>
            <span
              className={`font-bold text-sm ${isGoalAchieved ? "text-success" : isSavingOnTrack ? "text-success" : "text-danger"}`}>
              {isGoalAchieved
                ? "✓ Goal achieved"
                : isSavingOnTrack
                  ? "✓ On track"
                  : "⚠ Off track"}
            </span>
          </div>
        </div>

        <div className="mb-6 px-1 flex justify-between items-center">
          <span className="text-xs font-bold text-text-primary uppercase tracking-widest">
            My Spending Breakdown
          </span>
          <button
            onClick={() => setAppState(AppState.SPENDING_PLAN)}
            className="text-primary text-[10px] font-bold flex items-center gap-0.5">
            View Full Plan <ChevronRight size={12} />
          </button>
        </div>

        {/* Breakdown Strip */}
        <div
          onClick={() => setAppState(AppState.SPENDING_PLAN)}
          className="grid grid-cols-3 gap-3 mb-10 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all">
          {categories.slice(0, 3).map((cat, index) => (
            <div
              key={cat.id}
              className={`flex flex-col ${index < 2 ? "border-r border-gray-100" : ""} ${index === 1 ? "px-1" : index === 2 ? "pl-1" : ""}`}>
              <span className="text-[9px] text-text-secondary uppercase mb-1">
                {cat.name}
              </span>
              <span className="text-xs font-bold text-text-primary">
                RM {Math.round(cat.allocatedAmount / 30)}/day
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6 px-1 flex justify-between items-center">
          <span className="text-xs text-text-secondary">
            Current balance: RM {accountBalance.toLocaleString()}
          </span>
          <button className="text-primary text-[10px] font-bold flex items-center gap-0.5">
            Details <ChevronRight size={12} />
          </button>
        </div>

        {/* Simulator Button */}
        <button
          onClick={() => setShowPulseCheck(true)}
          className="w-full h-14 bg-amber-nudge text-white rounded-[14px] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#D97706] transition-all shadow-lg active:scale-95">
          <TrendingUp size={20} />
          Simulate Purchase (RM 80)
        </button>
      </div>

      {/* Pulse Check Modal */}
      <AnimatePresence>
        {showPulseCheck && (
          <PulseCheckModal onClose={() => setShowPulseCheck(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
