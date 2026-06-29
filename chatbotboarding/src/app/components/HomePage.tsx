import { useState } from "react";

function getGreeting(){const h=new Date().getHours();return h<12?"上午好":h<18?"下午好":"晚上好";}

interface HomePageProps {
  userName: string;
  streak: number;
  weekDone: number;
  weekTotal: number;
  onStartAssessment: () => void;
  onStartTraining: () => void;
  showOnboardingBanner: boolean;
  onShowOnboarding: () => void;
}

export function HomePage({
  userName, streak, weekDone, weekTotal,
  onStartAssessment, onStartTraining,
  showOnboardingBanner, onShowOnboarding,
}: HomePageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FA]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <div className="text-2xl font-bold text-[#1a202c]">{getGreeting()}，{userName||"朋友"} 👋</div>
          <div className="text-sm text-[#718096] mt-0.5">膝关节养护 · 开启你的运动锻炼之旅</div>
        </div>
        <div className="relative">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#07C160] rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </div>
      </div>

      {/* Onboarding banner */}
      {showOnboardingBanner && (
        <div className="mx-4 mt-2 mb-0 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-[#92400e]">💡 新用户？先完成引导设置，让养护更高效</span>
          <button onClick={onShowOnboarding} className="text-xs text-[#92400e] font-semibold bg-[#fde68a] px-2.5 py-1 rounded-full border-0 cursor-pointer ml-2 flex-shrink-0">
            去设置
          </button>
        </div>
      )}

      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Card 1: Assessment */}
        <div className="bg-[#fff4f0] rounded-2xl p-5 shadow-sm border border-[#ffe4d9]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">📋</span>
            <span className="font-bold text-[#1a202c] text-base">先了解一下膝盖情况</span>
          </div>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-3">
            7 道题，约 2 分钟，为您推荐个性化 PAD 使用方案。
          </p>
          <button onClick={onStartAssessment}
            className="w-full py-3 rounded-xl bg-[#2D5BFF] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#1e40af] transition-colors">
            开始分析
          </button>
        </div>

        {/* Card 2: Quick Training */}
        <div className="bg-[#e8f0ff] rounded-2xl p-5 shadow-sm border border-[#d0e1ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-[#1a202c] text-base">先体验一次</span>
          </div>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-3">
            无需了解即可体验。完成了解后，将获得个性化的养护方案与进度跟踪。
          </p>
          <button onClick={onStartTraining}
            className="w-full py-3 rounded-xl bg-[#2D5BFF] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#1e40af] transition-colors">
            开启设备
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl px-5 py-4 flex gap-8 shadow-sm border border-[#e8f5e9]">
          <div>
            <div className="text-2xl font-bold text-[#07C160]">{streak}</div>
            <div className="text-xs text-[#718096] mt-0.5">连续打卡</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FFA928]">{weekDone}<span className="text-base text-[#a0aec0]">/{weekTotal}</span></div>
            <div className="text-xs text-[#718096] mt-0.5">天本周完成</div>
          </div>
        </div>
      </div>
    </div>
  );
}
