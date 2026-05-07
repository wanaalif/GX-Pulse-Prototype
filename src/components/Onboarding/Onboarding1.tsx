/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Briefcase } from "lucide-react";
import { useApp } from "../../lib/store";
import { AppState, UserType } from "../../types";

export default function Onboarding1() {
  const { userType, setUserType, setAppState } = useApp();

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="h-full flex flex-col"
        style={{ backgroundColor: "#4A25AA" }}>
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24">
          <div className="mt-12">
            <h1 className="text-[40px] font-bold text-white mb-2">GX-PULSE</h1>
            <p className="text-[#C4B5FD] text-center mb-16">
              Your money's GPS, not its rear-view mirror.
            </p>
          </div>

          <div className="w-full max-w-md space-y-4 px-5">
            <h2 className="text-white text-xl font-semibold mb-6">
              Who are you?
            </h2>
            <button
              onClick={() => setUserType(UserType.STUDENT)}
              className={`flex items-center gap-4 p-5 rounded-xl text-left transition-all w-full border-2 ${
                userType === UserType.STUDENT
                  ? "border-white bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}>
              <div
                className={`p-3 rounded-full ${userType === UserType.STUDENT ? "bg-white text-primary" : "bg-white/10 text-white/40"}`}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  University Student
                </h3>
                <p className="text-xs opacity-60 mt-1">
                  Building savings while studying
                </p>
              </div>
            </button>

            <button
              onClick={() => setUserType(UserType.GRADUATE)}
              className={`flex items-center gap-4 p-5 rounded-xl text-left transition-all w-full border-2 ${
                userType === UserType.GRADUATE
                  ? "border-white bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}>
              <div
                className={`p-3 rounded-full ${userType === UserType.GRADUATE ? "bg-white text-primary" : "bg-white/10 text-white/40"}`}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  Working Graduate
                </h3>
                <p className="text-xs opacity-60 mt-1">
                  Starting your career journey
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="px-10 pb-8">
          <button
            disabled={!userType}
            onClick={() => setAppState(AppState.ONBOARDING_2)}
            className="w-full h-13 bg-white text-primary rounded-[14px] font-bold text-lg hover:bg-purple-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-95">
            Let's set your GPS →
          </button>
        </div>
      </div>
    </div>
  );
}
