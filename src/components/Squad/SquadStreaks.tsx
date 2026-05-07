/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Info, Gift, Award, Users, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../lib/store';

// A lightweight Framer Motion confetti burst using emojis/shapes
const ConfettiBurst = () => {
  const particles = Array.from({ length: 15 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((_, i) => {
        const randomX = (Math.random() - 0.5) * 400;
        const randomY = (Math.random() - 0.5) * 400 - 100;
        const randomRotate = Math.random() * 360;
        const emojis = ['✨', '💰', '🎉', '🎊', '💸'];
        const emoji = emojis[i % emojis.length];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [1, 1, 0], 
              scale: [0, 1.5, 1], 
              x: randomX, 
              y: randomY, 
              rotate: randomRotate 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-2xl"
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
};

export default function SquadStreaks() {
  const { squad, setSquad } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);

  const handleContribute = () => {
    // Prevent multiple clicks during the demo
    if (hasContributed) return;

    // 1. Update global state (Add RM 50)
    setSquad({
      ...squad,
      currentAmount: squad.currentAmount + 50,
    });

    // 2. Trigger Confetti and Toast
    setHasContributed(true);
    setShowConfetti(true);
    setShowToast(true);

    // 3. Cleanup animations after 3 seconds
    setTimeout(() => {
      setShowToast(false);
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-white px-6 pt-4 pb-8 relative">
      
      {/* 💥 Confetti Overlay */}
      {showConfetti && <ConfettiBurst />}

      {/* 🍞 Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] max-w-sm"
          >
            <CheckCircle2 className="text-success" size={20} />
            <div>
              <p className="text-sm font-bold">RM 50 contributed!</p>
              <p className="text-[11px] opacity-80">You're helping your squad reach Bali 🌴</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-14 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-text-primary leading-none">Squad Streaks</h1>
        <button className="w-9 h-9 rounded-full border-1.5 border-primary flex items-center justify-center text-primary hover:bg-primary/5 transition-colors">
          <Plus size={20} />
        </button>
      </header>

      {/* Squad Goal Banner */}
      <div className="bg-primary rounded-xl p-5 text-white mb-8 shadow-xl shadow-primary/20 relative overflow-hidden shrink-0">
        <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none">
          <Users size={200} />
        </div>

        <div className="flex justify-between items-center mb-2 relative z-10">
          <div className="flex items-center gap-1.5 opacity-80 uppercase text-[10px] tracking-widest font-bold">
            <Users size={12} fill="currentColor" />
            Squad Goal
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
            🔥 Week {squad.streakWeeks} Streak
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <h2 className="text-3xl font-bold mb-1 tracking-tight">
            {squad.goalName}
          </h2>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium opacity-90">Progress</span>
            <span className="text-[10px] opacity-70">
              RM {squad.targetAmount.toLocaleString()} Target
            </span>
          </div>
          <div className="w-full h-2.5 bg-accent-mid rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(squad.currentAmount / squad.targetAmount) * 100}%` }}
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            />
          </div>
          <div className="flex justify-between text-[11px] opacity-90">
            {/* Animate the number change visually */}
            <motion.span 
              key={squad.currentAmount}
              initial={{ scale: 1.2, color: "#FEF3C7" }}
              animate={{ scale: 1, color: "#FFFFFF" }}
              transition={{ duration: 0.5 }}
            >
              RM {squad.currentAmount.toLocaleString()} saved
            </motion.span>
            <span>{Math.round((squad.currentAmount / squad.targetAmount) * 100)}% there</span>
          </div>
        </div>
      </div>

      {/* Member Grid */}
      <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-widest">Squad Members</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {squad.members.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className={`absolute -inset-1 rounded-full ${member.hasStreak ? 'streak-ring-active p-0.75 bg-amber-nudge' : 'border-2 border-[#E5E7EB]'}`}>
                <div className="w-full h-full bg-white rounded-full" />
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-lg relative z-10">
                {member.initials}
              </div>
            </div>
            <span className="text-xs text-text-secondary mb-1.5">{member.name}</span>
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(member.weeklySaved / member.weeklyTarget) * 100}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Tracker */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6 relative overflow-hidden shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Bonus Tracker</span>
            <Info size={12} className="opacity-50" />
          </div>
          <Award size={20} className="text-primary" />
        </div>
        
        <div className="mb-2">
          <span className="text-[32px] font-bold text-primary leading-tight">{squad.bonusPoints.toLocaleString()} GrabPoints</span>
        </div>
        <p className="text-xs text-text-secondary mb-4 font-medium">Earned by your squad this week</p>
        
        <div className="text-[11px] text-primary font-bold flex items-center gap-1">
          On track for 5,600 pts by December →
        </div>
      </div>

      {/* Weekly Challenge */}
      <div className="bg-amber-light/30 border border-amber-light p-5 rounded-2xl mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-amber-light rounded-xl text-amber-nudge shadow-sm">
            <Gift size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-nudge mb-1">This Week's Challenge</h3>
            <p className="text-[11px] text-text-secondary leading-tight">
              All 4 members hit their daily limit 5/7 days → <span className="text-amber-nudge font-bold underline">Squad earns 2x bonus points</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-amber-nudge rounded-full" style={{ width: '71%' }} />
          </div>
          <div className="flex justify-end uppercase text-[10px] font-black text-amber-nudge italic tracking-tighter">
            5/7 Days
          </div>
        </div>
      </div>

      {/* Interactive Contribution Button */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={handleContribute}
        disabled={hasContributed}
        className={`w-full h-13 rounded-[14px] font-semibold text-base shadow-lg transition-all mt-auto shrink-0 flex items-center justify-center gap-2 ${
          hasContributed 
            ? 'bg-gray-100 text-gray-400 shadow-none' 
            : 'bg-primary text-white shadow-primary/20 hover:bg-primaryDark'
        }`}
      >
        {hasContributed ? (
          <>
            <CheckCircle2 size={20} />
            Contribution Added
          </>
        ) : (
          'Add My Contribution →'
        )}
      </motion.button>
    </div>
  );
}