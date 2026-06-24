import { useState } from "react";

interface OnboardingProps {
  onDone: (smartMode: boolean, next: "assessment" | "quick-training" | "home") => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [smartMode, setSmartMode] = useState(true);

  const goNext = () => setStep(s => s + 1);
  const skip = () => onDone(smartMode, "home");

  if (step === 1) return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white text-center">
      <div className="text-7xl mb-6">🧑‍⚕️</div>
      <h1 className="text-2xl font-bold text-[#1a202c] mb-3">欢迎来到<br/>「哎哟爱膝之家」</h1>
      <p className="text-[#4a5568] text-base leading-relaxed mb-10">
        我是带你一起爱膝的私人助理「小瑞」<br/>
        我会陪伴你完成 7 天的<br/>膝关节康复之旅
      </p>
      <button onClick={goNext}
        className="w-full max-w-xs py-3.5 rounded-full bg-[#2ECC71] text-white font-bold text-base border-0 cursor-pointer active:bg-[#27AE60] transition-all shadow-[0_4px_16px_rgba(46,204,113,0.4)]">
        下一步 →
      </button>
      <button onClick={skip} className="mt-4 text-sm text-[#a0aec0] bg-transparent border-0 cursor-pointer">
        跳过 →
      </button>
      {/* Step dots */}
      <div className="flex gap-2 mt-10">
        {[1,2,3].map(i=><span key={i} className={`w-2 h-2 rounded-full ${i===1?"bg-[#2ECC71]":"bg-[#e2e8f0]"}`}/>)}
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="flex-1 flex flex-col px-6 pt-12 pb-6 bg-white overflow-y-auto">
      <div className="text-5xl text-center mb-4">🤖</div>
      <h2 className="text-xl font-bold text-[#1a202c] text-center mb-2">智能模式</h2>
      <p className="text-[#4a5568] text-sm text-center leading-relaxed mb-5">
        开启「智能模式」后，小瑞将全程主动引导你：
      </p>
      <div className="bg-[#f0fdf4] border border-[#6ee7b7] rounded-2xl p-4 mb-5 text-sm text-[#065f46] space-y-2">
        {["每日评估与方案推荐","设备使用提醒与陪伴","实时反馈与强度优化","科普与运动建议推送"].map(t=>(
          <div key={t} className="flex items-center gap-2"><span className="text-[#2ECC71]">•</span>{t}</div>
        ))}
      </div>
      <div className="bg-[#f7fafc] rounded-2xl p-4 border border-[#e2e8f0] mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#1a202c] text-sm">开启智能模式</div>
            <div className="text-xs text-[#718096] mt-0.5">AI 引导，小瑞全程陪伴</div>
          </div>
          <button onClick={()=>setSmartMode(m=>!m)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-0 cursor-pointer
              ${smartMode?"bg-[#2ECC71]":"bg-[#cbd5e0]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
              ${smartMode?"translate-x-6":"translate-x-0.5"}`}/>
          </button>
        </div>
      </div>
      <p className="text-xs text-[#a0aec0] text-center mb-6">
        💡 你也可以在「我的 - 设置」中随时调整
      </p>
      <button onClick={()=>{
        if(smartMode){
          // 智能模式：直接进入小瑞AI对话页面
          onDone(true,"home");
        }else{
          // 手动模式：继续到第3步选择页面
          goNext();
        }
      }}
        className="w-full py-3.5 rounded-full bg-[#2ECC71] text-white font-bold text-base border-0 cursor-pointer active:bg-[#27AE60] transition-all">
        确认
      </button>
      <button onClick={()=>{setSmartMode(false);goNext();}}
        className="mt-3 text-sm text-[#a0aec0] bg-transparent border-0 cursor-pointer text-center w-full">
        暂不开启 →
      </button>
      <div className="flex gap-2 justify-center mt-6">
        {[1,2,3].map(i=><span key={i} className={`w-2 h-2 rounded-full ${i===2?"bg-[#2ECC71]":"bg-[#e2e8f0]"}`}/>)}
      </div>
    </div>
  );

  // step 3
  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-12 pb-6 bg-white">
      <div className="text-5xl text-center mb-4">📋</div>
      <h2 className="text-xl font-bold text-[#1a202c] text-center mb-2">训练前先填表？</h2>
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 mb-6 w-full text-sm text-[#92400e]">
        <div className="font-semibold mb-2">💡 提示</div>
        <p className="leading-relaxed">
          训练之前可以先填表测评，获取个性化 PAD 方案，让训练更有效。<br/><br/>
          你也可以跳过评估，直接开始训练。
        </p>
      </div>
      <div className="flex gap-3 w-full mb-4">
        <button onClick={()=>onDone(smartMode,"assessment")}
          className="flex-1 py-3.5 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
          📝 开始评估
        </button>
        <button onClick={()=>onDone(smartMode,"quick-training")}
          className="flex-1 py-3.5 rounded-full bg-[#ebf8f0] text-[#2ECC71] font-bold text-sm border border-[#2ECC71] cursor-pointer active:bg-[#d4f5e3] transition-all">
          🏃 直接训练
        </button>
      </div>
      <button onClick={skip} className="text-sm text-[#a0aec0] bg-transparent border-0 cursor-pointer">
        跳过 →
      </button>
      <div className="flex gap-2 justify-center mt-6">
        {[1,2,3].map(i=><span key={i} className={`w-2 h-2 rounded-full ${i===3?"bg-[#2ECC71]":"bg-[#e2e8f0]"}`}/>)}
      </div>
    </div>
  );
}
