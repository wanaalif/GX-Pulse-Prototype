/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../../lib/store";
import { AppState } from "../../types";

export default function Onboarding3() {
  const { setAppState, goal, dailyLimit, categories } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isAnalyzing) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-primary" />
          </div>
        </motion.div>
        <h2 className="text-xl font-medium text-text-primary">
          Analysing your patterns...
        </h2>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col p-8">
      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 mb-10">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-text-primary">
          Your AI Budget is Ready
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center mb-8">
          <span className="text-primary font-bold text-5xl mb-2">
            RM {dailyLimit}
          </span>
          <span className="text-text-primary font-bold mb-1">
            Safe to spend daily
          </span>
          <span className="text-text-secondary text-sm">
            To reach RM {goal.targetAmount.toLocaleString()} by{" "}
            {new Date(goal.targetDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <div className="w-full h-px bg-gray-100 my-6" />

          <div
            onClick={() => setAppState(AppState.SPENDING_PLAN)}
            className="w-full grid grid-cols-3 gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            {categories.slice(0, 3).map((cat, index) => (
              <div
                key={cat.id}
                className={`flex flex-col ${index === 1 ? 'border-x border-gray-100' : ''}`}>
                <span className="text-[10px] text-text-secondary uppercase">
                  {cat.name}
                </span>
                <span className="text-xs font-bold text-text-primary">
                  RM {Math.round(cat.allocatedAmount / 30)}/day
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-sm text-text-secondary text-center px-4 leading-relaxed mb-auto">
          We've balanced your daily spending to keep you on track without
          feeling restricted.
        </p>

        <button
          onClick={() => setAppState(AppState.DASHBOARD)}
          className="w-full h-13 bg-primary text-white rounded-[14px] font-semibold text-lg hover:bg-primary-dark transition-colors mt-8">
          See My Full Plan →
        </button>
      </div>
    </div>
  );
}
