/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, PiggyBank, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../lib/store';

interface PulseCheckModalProps {
  onClose: () => void;
}

export default function PulseCheckModal({ onClose }: PulseCheckModalProps) {
  const { dailyLimit, goal, pulseCheckPurchaseAmount, pulseCheckOverLimit, pulseCheckDelayDays } = useApp();
  const [isSaved, setIsSaved] = useState(false);

  const purchaseAmount = pulseCheckPurchaseAmount;
  const overLimit = pulseCheckOverLimit;
  const delayDays = pulseCheckDelayDays;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-xs"
      />

      <AnimatePresence mode="wait">
        {!isSaved ? (
          <motion.div
            key="nudge"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="w-full bg-white rounded-t-[24px] p-8 flex flex-col items-center relative z-10 max-w-md"
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full absolute top-3" />

            <div className="w-10 h-10 rounded-full bg-amber-light border-2 border-amber-nudge flex items-center justify-center mb-4">
              <Zap size={20} className="text-amber-nudge" fill="currentColor" />
            </div>

            <h2 className="text-[22px] font-bold text-text-primary mb-4">Pulse Check!</h2>

            <p className="text-center text-text-secondary mb-6 leading-relaxed">
              This <span className="text-text-primary font-bold">RM {purchaseAmount}</span> checkout will push you <span className="text-text-primary font-bold">RM {overLimit.toFixed(2)}</span> over today's limit and delay your {goal.name} by <span className="text-text-primary font-bold">{delayDays} days</span>.
            </p>

            <div className="w-full bg-purple-light rounded-xl p-4 flex gap-3 items-center mb-8">
              <div className="text-primary">
                <PiggyBank size={24} />
              </div>
              <div className="text-sm">
                <p className="text-text-primary font-medium">But if you save <span className="text-primary font-bold">RM 10</span> now:</p>
                <p className="text-text-secondary text-xs">Goal by November — 1 month sooner</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full mb-4">
              <button
                onClick={handleSave}
                className="w-full h-13 bg-primary text-white rounded-[14px] font-semibold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Pause & Save RM 10 Instead
              </button>
              <button
                onClick={onClose}
                className="w-full h-13 bg-white text-primary border-1.5 border-primary rounded-[14px] font-semibold text-base transition-all hover:bg-gray-50 active:scale-95"
              >
                Proceed Anyway
              </button>
            </div>

            <p className="text-xs text-gray-400 font-medium">No judgement — you're in control.</p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white z-60 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-8"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            
            <h2 className="text-[28px] font-bold text-text-primary mb-2">RM 10 saved!</h2>
            
            <div className="w-64">
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-2">
                <span>{goal.name}: 34%</span>
                <span className="text-primary">→ 35.2%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: '34%' }}
                  animate={{ width: '35.2%' }}
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                />
              </div>
            </div>

            <div className="bg-amber-light px-4 py-2 rounded-full text-amber-nudge font-bold text-sm flex items-center gap-1.5">
              🔥 Day 13 streak!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
