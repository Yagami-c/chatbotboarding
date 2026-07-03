import { useState } from "react";
import { LEVEL_PARAMS, LEVELS, LEVEL_DESCS, getLevelName, formatTime, DeviceState } from "../types";
import { NotificationsPage } from "./NotificationsPage";

export interface AssessmentResult {
  name: string; gender: string; ageRange: string; duration: string;
  safety: string[]; stiffness: string; triggers: string[]; painLevel: number;
}

interface HomePageProps {
  userName: string; streak: number; weekDone: number; weekTotal: number;
  showOnboardingBanner: boolean; onShowOnboarding: () => void;
  onAssessmentDone: (r: AssessmentResult) => void;
  onDeviceStart: (level: number, custom?: {pressure:number;work:number;rest:number;cycles:number}) => void;
  onDeviceMinimize: () => void;
  deviceState: DeviceState;
  hwLevel: number; hwRemaining: number; hwTotal: number;
  hwCycle: number; hwTotalCycles: number;
  onTogglePause: () => void; onStop: () => void; onReset: () => void;
  userGender?: string; userAgeRange?: string;
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "上午好" : h < 18 ? "下午好" : "晚上好";
}

const SAFETY_LIST = [
  { v: "受伤", l: "最近2周内有明显膝盖受伤" },
  { v: "肿胀", l: "膝盖明显肿胀/发烫" },
  { v: "伤口", l: "膝盖周围有伤口或皮肤问题" },
  { v: "医生建议", l: "医生叮嘱暂不适合使用此类设备" },
  { v: "显著受损", l: "膝盖有轻微脱臼或活动受限" },
  { v: "无", l: "以上都没有" },
];
const TRIGGERS_LIST = ["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","其他","无"];
const WEAR_STEPS = [
  { icon: "🪑", title: "舒适坐姿", desc: "坐在稳固的椅子上，膝盖自然弯曲。" },
  { icon: "🦵", title: "套上设备", desc: "将套圈套在膝关节上方，调整到舒适位置。" },
  { icon: "🔧", title: "调节松紧", desc: "绑带不要太紧，保持舒适即可。" },
  { icon: "✅", title: "放松享受", desc: "使用时放松腿部，让设备帮你养护。" },
];

function FlowHeader({ step, total, title, onBack, backDisabled }: {
  step: number; total: number; title: string; onBack: () => void; backDisabled?: boolean;
}) {
  return (
    <div className="px-4 pt-10 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} disabled={backDisabled}
          className={`text-xl bg-transparent border-0 cursor-pointer transition-colors
            ${backDisabled ? "text-[#d0d0d0] cursor-not-allowed" : "text-[#4a5568]"}`}>←</button>
        <div className="flex-1 font-bold text-[#1a202c] text-sm">{title}</div>
        <span className="text-xs text-[#718096] font-medium">{step + 1} / {total}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300"
            style={{ flex: i === step ? 2 : 1, background: i <= step ? "#1A7AC7" : "#e2e8f0" }} />
        ))}
      </div>
    </div>
  );
}

// ── Assessment Flow ────────────────────────────────────────────────────────────

function AssessmentFlow({ onDone, onCancel, onStartDevice, prefillName, prefillGender, prefillAgeRange }: {
  onDone: (r: AssessmentResult) => void;
  onCancel: () => void;
  onStartDevice: (level: number) => void;
  prefillName?: string;
  prefillGender?: string;
  prefillAgeRange?: string;
}) {
  // If user already has basic info, start from step 1 (knee condition)
  const hasBasicInfo = !!(prefillName && prefillGender && prefillAgeRange);
  const [step, setStep] = useState(hasBasicInfo ? 1 : 0);
  const [name, setName] = useState(prefillName || "");
  const [gender, setGender] = useState(prefillGender || "");
  const [ageRange, setAgeRange] = useState(prefillAgeRange || "");
  const [duration, setDuration] = useState("");
  const [safety, setSafety] = useState<Record<string,boolean>>({});
  const [stiffness, setStiffness] = useState("");
  const [triggers, setTriggers] = useState<Record<string,boolean>>({});
  const [painLevel, setPainLevel] = useState<number|null>(null);
  const [showResult, setShowResult] = useState(false);
  const [recommendedLevel, setRecommendedLevel] = useState(2);

  const safetyVals = Object.entries(safety).filter(([,v])=>v).map(([k])=>k);
  const triggerVals = Object.entries(triggers).filter(([,v])=>v).map(([k])=>k);
  const TITLES = ["基本信息","膝盖情况","症状详情"];

  const handleBack = () => {
    if (showResult) { setShowResult(false); return; }
    if (step === 0 || (step === 1 && hasBasicInfo)) onCancel();
    else setStep(s => s - 1);
  };

  const handleSubmit = () => {
    const hasRisk = ["受伤","肿胀","伤口","医生建议"].some(r => safetyVals.includes(r));
    if (hasRisk && !window.confirm("有些情况需要先确认安全，建议找专业人员聊聊后再使用。要继续吗？")) return;

    // Calculate recommended level based on stiffness and pain
    const baseLevel = stiffness === "没有特别感觉" ? 2 : stiffness === "有点紧" ? 3 : 4;
    const delta = painLevel === 0 ? -1 : painLevel! <= 2 ? 0 : 1;
    const computed = Math.max(1, Math.min(6, baseLevel + delta));
    setRecommendedLevel(computed);
    setShowResult(true);
  };

  const handleConfirmResult = () => {
    onDone({
      name: name.trim(),
      gender,
      ageRange,
      duration,
      safety: safetyVals,
      stiffness,
      triggers: triggerVals,
      painLevel: painLevel!
    });
    onStartDevice(recommendedLevel);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!showResult && <FlowHeader step={step} total={3} title={`📋 ${TITLES[step]}`} onBack={handleBack} />}

      {showResult ? (
        // Result screen
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-10 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={handleBack} className="text-xl bg-transparent border-0 cursor-pointer transition-colors text-[#4a5568]">←</button>
              <div className="flex-1 font-bold text-[#1a202c] text-sm">评估结果</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f0f6ff]">
            <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] text-center">
              <div className="text-4xl mb-3">✨</div>
              <div className="font-bold text-[#1a202c] text-lg mb-2">评估完成</div>
              <div className="text-sm text-[#718096] mb-4">根据你的情况，为你推荐以下强度：</div>
              <div className="bg-[#EFF6FF] rounded-xl p-4 mb-3">
                <div className="text-2xl font-bold text-[#1A7AC7] mb-1">{LEVELS[recommendedLevel-1]}</div>
                <div className="text-xs text-[#2563EB]">{LEVEL_DESCS[recommendedLevel]}</div>
              </div>
              <div className="text-xs text-[#718096] leading-relaxed">
                建议从此强度开始，后续可根据使用感受调整。
              </div>
            </div>
            <button onClick={handleConfirmResult}
              className="w-full py-3.5 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
              确认并开启设备 →
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f0f6ff]">
        {step === 0 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">性别</div>
            <div className="flex gap-2">
              {["男","女"].map(g=>(
                <button key={g} onClick={()=>setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all
                    ${gender===g?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">年龄段</div>
            <div className="flex gap-2 flex-wrap">
              {["18-30","31-45","46-60","60+"].map(a=>(
                <button key={a} onClick={()=>setAgeRange(a)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all
                    ${ageRange===a?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>{ if(!name.trim()||!gender||!ageRange){alert("请完整填写基本信息");return;} setStep(1); }}
            className="w-full py-3.5 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
            下一步 →
          </button>
        </>}

        {step === 1 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">持续多久了？</div>
            <div className="flex gap-2 flex-wrap">
              {["不到1周","1-4周","1-6个月","超过半年"].map(d=>(
                <button key={d} onClick={()=>setDuration(d)}
                  className={`flex-1 min-w-[calc(50%-4px)] py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all
                    ${duration===d?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">使用前确认（可多选）</div>
            <div className="text-xs text-[#718096] mb-3">选择适合你的选项，若无请跳过：</div>
            {["膝盖没有受伤","没有明显肿胀","没有开放伤口","医生建议过可以用","以上都不是"].map(s=>(
              <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
                <input type="checkbox" checked={!!safety[s]}
                  onChange={e=>setSafety(p=>({...p,[s]:e.target.checked}))}
                  className="accent-[#1A7AC7]"/>
                {s}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(0)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ if(!duration||safetyVals.length===0){alert("请完整填写");return;} setStep(2); }}
              className="flex-[2] py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">下一步 →</button>
          </div>
        </>}

        {step === 2 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">膝盖感觉？</div>
            <div className="flex flex-col gap-2">
              {["没有特别感觉","有点紧","感觉僵硬"].map(st=>(
                <button key={st} onClick={()=>setStiffness(st)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer transition-all text-left px-3
                    ${stiffness===st?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">什么时候不舒服？（可多选）</div>
            {["上下楼梯","走路久了","蹲下起立","长时间坐着","天气变化"].map(t=>(
              <label key={t} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
                <input type="checkbox" checked={!!triggers[t]}
                  onChange={e=>setTriggers(p=>({...p,[t]:e.target.checked}))}
                  className="accent-[#1A7AC7]"/>
                {t}
              </label>
            ))}
            <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
              <div className="text-xs text-[#718096] mb-2">不适程度（0=无 · 4=非常）：</div>
              <div className="flex gap-1.5">
                {[0,1,2,3,4].map(n=>(
                  <button key={n} onClick={()=>setPainLevel(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-all
                      ${painLevel===n?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ if(!stiffness||triggerVals.length===0||painLevel===null){alert("请完整填写");return;} handleSubmit(); }}
              className="flex-[2] py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">提交查看方案 →</button>
          </div>
        </>}
      </div>
      )}
    </div>
  );
}

// ── Device Flow ────────────────────────────────────────────────────────────────

function DeviceFlow({ onStart, onMinimize, onCancel, deviceState, hwLevel, hwRemaining, hwTotal, hwCycle, hwTotalCycles, onTogglePause, onStop, onReset, presetLevel }: {
  onStart: (level: number, custom?: {pressure:number;work:number;rest:number;cycles:number}) => void; onMinimize: () => void; onCancel: () => void;
  deviceState: DeviceState; hwLevel: number; hwRemaining: number; hwTotal: number;
  hwCycle: number; hwTotalCycles: number;
  onTogglePause: () => void; onStop: () => void; onReset: () => void;
  presetLevel?: number | null;
}) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(presetLevel || 2);
  const [customMode, setCustomMode] = useState(false);
  const [customPressure, setCustomPressure] = useState(125);
  const [customWork, setCustomWork] = useState(30);
  const [customRest, setCustomRest] = useState(10);
  const [customCycles, setCustomCycles] = useState(5);
  const prm = customMode
    ? { pressure: customPressure, work: customWork, rest: customRest, cycles: customCycles }
    : LEVEL_PARAMS[level - 1] || LEVEL_PARAMS[1];
  const totalTime = prm.cycles * (prm.work + prm.rest);
  const runningPrm = LEVEL_PARAMS[hwLevel - 1] || LEVEL_PARAMS[1];
  const runTotal = hwTotal || (runningPrm.cycles * (runningPrm.work + runningPrm.rest));
  const progress = runTotal > 0 ? Math.round(((runTotal - hwRemaining) / runTotal) * 100) : 0;
  const TITLES = ["选择强度", "穿戴准备", "使用中"];
  const running = deviceState === "running" || deviceState === "paused";
  const done = deviceState === "stopped";

  const handleBack = () => {
    if (step === 0) onCancel();
    else if (step === 2 && running) return;
    else setStep(s => s - 1);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FlowHeader step={step} total={3} title={`⚡ ${TITLES[step]}`} onBack={handleBack} backDisabled={step === 2 && running} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f0f6ff]">

        {step === 0 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-3">选择强度模式</div>
            <div className="flex gap-2 mb-3">
              <button onClick={()=>setCustomMode(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${!customMode?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                📋 设定模式
              </button>
              <button onClick={()=>setCustomMode(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${customMode?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                ⚙️ 自定义模式
              </button>
            </div>

            {!customMode ? (
              <>
                <div className="flex gap-1.5 mb-3">
                  {[1,2,3,4,5,6].map(l=>(
                    <button key={l} onClick={()=>setLevel(l)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all
                        ${level===l?"bg-[#1A7AC7] text-white border-[#1A7AC7]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                      L{l}
                    </button>
                  ))}
                </div>
                <div className="bg-[#EFF6FF] rounded-xl p-3 text-sm">
                  <div className="font-semibold text-[#1E3A5F]">{getLevelName(level)} · {LEVELS[level-1]}</div>
                  <div className="text-xs mt-1 text-[#2563EB]">{LEVEL_DESCS[level]}</div>
                  <div className="flex gap-3 mt-2 text-xs text-[#4a5568] flex-wrap">
                    <span>💨 {prm.pressure} mmHg</span><span>⏱ {prm.work}s 工作</span>
                    <span>🔄 {prm.rest}s 休息</span><span>🔁 {prm.cycles} 轮</span>
                    <span>⏳ 约 {Math.floor(totalTime/60)}分{totalTime%60}秒</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#fef3c7] rounded-xl p-3 space-y-3">
                <div className="font-semibold text-sm text-[#92400e]">⚙️ 自定义参数</div>
                {[
                  {label:"💨 负压强度 (mmHg)",min:80,max:220,step:5,val:customPressure,set:setCustomPressure},
                  {label:"⏱ 作用时间 (秒)",min:10,max:60,step:5,val:customWork,set:setCustomWork,unit:"s"},
                  {label:"🔄 休息间隔 (秒)",min:5,max:30,step:5,val:customRest,set:setCustomRest,unit:"s"},
                  {label:"🔁 循环轮数",min:3,max:10,step:1,val:customCycles,set:setCustomCycles,unit:" 轮"},
                ].map(({label,min,max,step:s,val,set,unit})=>(
                  <div key={label}>
                    <label className="flex justify-between text-xs text-[#4a5568] mb-1">
                      <span>{label}</span>
                      <span className="font-semibold text-[#1a202c]">{val}{unit||""}</span>
                    </label>
                    <input type="range" min={min} max={max} step={s} value={val}
                      onChange={e=>set(Number(e.target.value))}
                      className="w-full h-2 bg-[#e2e8f0] rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1A7AC7] [&::-webkit-slider-thumb]:cursor-pointer"/>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#fde68a] text-xs text-[#92400e]">
                  预计总时长：<span className="font-semibold ml-1">{Math.floor(totalTime/60)}分{totalTime%60}秒</span>
                </div>
              </div>
            )}
          </div>
          <button onClick={()=>setStep(1)}
            className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">
            下一步：穿戴准备 →
          </button>
        </>}

        {step === 1 && <>
          <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-2xl p-4">
            <div className="font-semibold text-[#1E3A5F] text-sm">💡 穿戴指引</div>
          </div>
          {WEAR_STEPS.map(({icon,title,desc},i)=>(
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#e2e8f0] flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <div>
                <div className="text-sm font-semibold text-[#1a202c]">步骤 {i+1}：{title}</div>
                <div className="text-xs text-[#718096] mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(0)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ onStart(customMode ? -1 : level, customMode ? {pressure:customPressure,work:customWork,rest:customRest,cycles:customCycles} : undefined); setStep(2); }}
              className="flex-[2] py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">
              已准备好，开始使用 →
            </button>
          </div>
        </>}

        {step === 2 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦵</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1a202c]">智能膝关节康养仪 PAD</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${running?"bg-[#1A7AC7] animate-pulse":done?"bg-[#fbbf24]":"bg-[#1A7AC7]"}`}/>
                  <span className="text-xs text-[#718096]">{running?(deviceState==="paused"?"已暂停":"运行中"):done?"已完成":"启动中..."}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-[#1a202c]">{formatTime(hwRemaining)}</div>
                <div className="text-[10px] text-[#a0aec0]">剩余时间</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="flex justify-between text-xs text-[#718096] mb-2">
              <span>使用进度</span><span>{formatTime(runTotal - hwRemaining)} / {formatTime(runTotal)}</span>
            </div>
            <div className="h-3 bg-[#e2e8f0] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[#1A7AC7] to-[#1570B8] rounded-full transition-all duration-300" style={{width:`${progress}%`}}/>
            </div>
            <div className="flex justify-between text-xs text-[#718096]">
              <span>轮数：{hwCycle} / {hwTotalCycles}</span><span>{progress}%</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] flex gap-2">
            {running && <>
              <button onClick={onTogglePause}
                className={`flex-1 py-3 rounded-full font-bold text-sm border-0 cursor-pointer ${deviceState==="paused"?"bg-[#1A7AC7] text-white":"bg-[#F39C12] text-white"}`}>
                {deviceState==="paused"?"▶ 继续":"⏸ 暂停"}
              </button>
              <button onClick={onStop} className="flex-1 py-3 rounded-full bg-[#E74C3C] text-white font-bold text-sm border-0 cursor-pointer">⏹ 结束</button>
            </>}
            {done && <button onClick={onReset} className="flex-1 py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">🔄 重新开始</button>}
          </div>
          {running && (
            <button onClick={onMinimize}
              className="w-full py-3 rounded-full bg-[#EFF6FF] text-[#1A7AC7] font-semibold text-sm border border-[#1A7AC7] cursor-pointer">
              ⬇ 收起 · 设备继续运行
            </button>
          )}
          {done && (
            <>
              <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-2xl p-3.5 text-sm text-[#1E3A5F]">
                <div className="font-semibold mb-1">🎉 使用完成！</div>
                <div className="text-xs">可到「训练」tab 跟练配套运动，或去「发现」tab 了解科普知识。</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { onCancel(); /* TODO: switch to training tab */ }} className="flex-1 py-3 rounded-full bg-[#F0F9FF] text-[#1A7AC7] font-semibold text-sm border border-[#BAE6FD] cursor-pointer active:bg-[#E0F2FE] transition-all">
                  🏃 训练
                </button>
                <button onClick={() => { onCancel(); /* TODO: switch to discover tab */ }} className="flex-1 py-3 rounded-full bg-[#F0FDF4] text-[#16A34A] font-semibold text-sm border border-[#BBF7D0] cursor-pointer active:bg-[#DCFCE7] transition-all">
                  📖 科普
                </button>
              </div>
              <button onClick={onCancel} className="w-full py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
                ← 返回首页
              </button>
            </>
          )}
        </>}
      </div>
    </div>
  );
}

// ── Main HomePage ──────────────────────────────────────────────────────────────

// ── Forum Section ─────────────────────────────────────────────────────────────

// ── Forum data ────────────────────────────────────────────────────────────────

const INIT_POSTS = [
  {
    id: 1, avatar: "李", avatarColor: "#1A7AC7",
    name: "膝盖要好好的", time: "2小时前",
    content: "今天做了第二阶段的下蹲动作，明显感觉比上周轻松了，疼痛感从5降到了2，继续坚持！大家有没有类似的感受？",
    likes: 24,
    commentList: [
      { id:1, avatar:"王", color:"#9C27B0", name:"运动达人", time:"1小时前", text:"我也有同感！坚持下去会越来越好的 💪" },
      { id:2, avatar:"张", color:"#FF5722", name:"老病友", time:"45分钟前", text:"第三阶段更明显，加油！" },
      { id:3, avatar:"M",  color:"#1A7AC7", name:"专家医生", time:"20分钟前", text:"很好的恢复进展，建议配合拉伸效果更佳。" },
    ],
  },
  {
    id: 2, avatar: "陈", avatarColor: "#2196F3",
    name: "健康生活家", time: "5小时前",
    content: "求问各位病友，每次用完设备后需要立刻冰敷吗？医生说可以缓解肿胀，但不知道要敷多久比较好...",
    likes: 12,
    commentList: [
      { id:1, avatar:"赵", color:"#FF9800", name:"康复顾问",  time:"4小时前", text:"一般建议15-20分钟，用毛巾包裹冰袋，不要直接接触皮肤。" },
      { id:2, avatar:"孙", color:"#E91E63", name:"病友小美", time:"3小时前", text:"我是敷10分钟，感觉挺舒服的" },
    ],
  },
];

// ── Forum Section (moved to DiscoverPage) — kept for reference ────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ForumSection_UNUSED() {
  const [showWxModal, setShowWxModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  // Like state per post
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(INIT_POSTS.map(p => [p.id, p.likes]))
  );
  // Comment drawer
  const [openCommentId, setOpenCommentId] = useState<number|null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<number,string>>({});
  const [commentLists, setCommentLists] = useState(
    Object.fromEntries(INIT_POSTS.map(p => [p.id, p.commentList]))
  );

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const nowLiked = !prev[id];
      setLikeCounts(c => ({ ...c, [id]: c[id] + (nowLiked ? 1 : -1) }));
      return { ...prev, [id]: nowLiked };
    });
  };

  const sendComment = (postId: number) => {
    const text = (commentTexts[postId] || "").trim();
    if (!text) return;
    const newComment = { id: Date.now(), avatar:"我", color:"#1A7AC7", name:"我", time:"刚刚", text };
    setCommentLists(prev => ({ ...prev, [postId]: [...(prev[postId]||[]), newComment] }));
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };

  const activePost = INIT_POSTS.find(p => p.id === openCommentId);

  return (
    <>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px 10px" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1E3A5F" }}>康养论坛</span>
          <button onClick={() => setShowPostModal(true)}
            style={{ padding: "5px 14px", borderRadius: 20, background: "#2D5BFF",
              color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            发布帖子
          </button>
        </div>

        {/* Post cards */}
        {INIT_POSTS.map((p, i) => {
          const isLiked = !!liked[p.id];
          const count = likeCounts[p.id];
          const commentCount = (commentLists[p.id]||[]).length;
          return (
            <div key={p.id} style={{ padding: "12px 16px",
              borderTop: i === 0 ? "1px solid #f5f5f5" : "none",
              borderBottom: "1px solid #f5f5f5" }}>
              {/* Author row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: p.avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {p.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{p.time}</div>
                </div>
              </div>
              {/* Content */}
              <div style={{ fontSize: 14, color: "#333", lineHeight: 1.55,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {p.content}
              </div>
              {/* Action bar */}
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                {/* Like */}
                <button onClick={() => toggleLike(p.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, border:"none",
                    cursor:"pointer", padding:"4px 8px", borderRadius:20,
                    background: isLiked ? "rgba(239,68,68,0.08)" : "transparent",
                    transition:"all 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked?"#EF4444":"none"}>
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      stroke={isLiked?"#EF4444":"#bbb"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13, color: isLiked ? "#EF4444" : "#999",
                    fontWeight: isLiked ? 600 : 400, transition:"color 0.2s" }}>
                    {count}
                  </span>
                </button>
                {/* Comment */}
                <button onClick={() => setOpenCommentId(p.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, border:"none",
                    cursor:"pointer", padding:"4px 8px", borderRadius:20,
                    background:"transparent" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                      stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13, color: "#999" }}>{commentCount}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* WeChat group CTA */}
        <div onClick={() => setShowWxModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
            background: "#EFF6FF", cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1A7AC7",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <ellipse cx="7.8" cy="8.5" rx="6" ry="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="5.8" cy="8.5" r="1" fill="white"/>
              <circle cx="9.8" cy="8.5" r="1" fill="white"/>
              <ellipse cx="14.2" cy="12.5" rx="4.5" ry="3.5" stroke="white" strokeWidth="1.4" fill="none"/>
              <circle cx="12.8" cy="12.5" r="0.8" fill="white"/>
              <circle cx="15.6" cy="12.5" r="0.8" fill="white"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A7AC7" }}>加入康群微信群</div>
            <div style={{ fontSize: 12, color: "#1E3A5F", marginTop: 2 }}>与病友交流康养经验</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#1A7AC7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ── Comment drawer ── */}
      {openCommentId !== null && activePost && (
        <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          {/* Backdrop */}
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }}
            onClick={() => setOpenCommentId(null)}/>
          {/* Sheet */}
          <div style={{ position:"relative", background:"white", borderRadius:"20px 20px 0 0",
            maxHeight:"75vh", display:"flex", flexDirection:"column",
            boxShadow:"0 -8px 40px rgba(0,0,0,0.12)" }}>
            {/* Handle + header */}
            <div style={{ textAlign:"center", paddingTop:12, paddingBottom:4, flexShrink:0 }}>
              <span style={{ display:"inline-block", width:36, height:4, background:"#E8E8E8", borderRadius:2 }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"8px 16px 12px", borderBottom:"1px solid #F5F5F5", flexShrink:0 }}>
              <span style={{ fontSize:16, fontWeight:700, color:"#1a1a1a" }}>
                评论 {(commentLists[openCommentId]||[]).length}
              </span>
              <button onClick={() => setOpenCommentId(null)}
                style={{ background:"none", border:"none", fontSize:22, color:"#999", cursor:"pointer", lineHeight:1 }}>✕</button>
            </div>

            {/* Post preview */}
            <div style={{ padding:"12px 16px", background:"#F7F8FA", borderBottom:"1px solid #F0F0F0", flexShrink:0 }}>
              <div style={{ fontSize:13, color:"#666", lineHeight:1.5,
                overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                {activePost.content}
              </div>
            </div>

            {/* Comment list */}
            <div style={{ flex:1, overflowY:"auto", padding:"0 16px" }}>
              {(commentLists[openCommentId]||[]).length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#bbb", fontSize:14 }}>
                  暂无评论，来说第一句话 👇
                </div>
              ) : (commentLists[openCommentId]||[]).map((c, i, arr) => (
                <div key={c.id} style={{ display:"flex", gap:10, padding:"14px 0",
                  borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:c.color,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"white", fontWeight:700, fontSize:13, flexShrink:0 }}>
                    {c.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{c.name}</span>
                      <span style={{ fontSize:11, color:"#bbb" }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize:14, color:"#333", lineHeight:1.5 }}>{c.text}</div>
                  </div>
                </div>
              ))}
              {/* Bottom padding so last comment isn't hidden behind input */}
              <div style={{ height:16 }}/>
            </div>

            {/* Input bar */}
            <div style={{ display:"flex", alignItems:"center", gap:10,
              padding:"10px 16px 28px", borderTop:"1px solid #F5F5F5",
              background:"white", flexShrink:0 }}>
              {/* My avatar */}
              <div style={{ width:32, height:32, borderRadius:"50%", background:"#1A7AC7",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"white", fontWeight:700, fontSize:13, flexShrink:0 }}>我</div>
              <input
                value={commentTexts[openCommentId]||""}
                onChange={e => setCommentTexts(prev => ({...prev,[openCommentId]:e.target.value}))}
                onKeyDown={e => e.key==="Enter" && sendComment(openCommentId!)}
                placeholder="写下你的评论..."
                style={{ flex:1, padding:"9px 14px", borderRadius:20, border:"1px solid #E8E8E8",
                  fontSize:14, outline:"none", background:"#F7F8FA", fontFamily:"inherit" }}
              />
              <button onClick={() => sendComment(openCommentId!)}
                style={{ width:36, height:36, borderRadius:"50%",
                  background:(commentTexts[openCommentId]||"").trim() ? "#1A7AC7" : "#E0E0E0",
                  border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background 0.2s", flexShrink:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WeChat group modal */}
      {showWxModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "flex-end" }} onClick={() => setShowWxModal(false)}>
          <div style={{ background: "white", width: "100%", borderRadius: "20px 20px 0 0",
            padding: "24px 20px 40px" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 auto 20px" }}/>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", textAlign: "center", marginBottom: 6 }}>
              💬 加入微信群
            </div>
            <div style={{ fontSize: 13, color: "#666", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
              加入「哎哟爱膝」康复交流群<br/>与病友交流康复经验，获取专家答疑
            </div>
            {/* QR placeholder */}
            <div style={{ width: 160, height: 160, margin: "0 auto 12px", background: "#f5f5f5",
              borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              border: "1px solid #e8e8e8" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                {/* Simple QR-like pattern */}
                <rect x="5" y="5" width="22" height="22" rx="3" stroke="#333" strokeWidth="3" fill="none"/>
                <rect x="11" y="11" width="10" height="10" rx="1" fill="#333"/>
                <rect x="33" y="5" width="22" height="22" rx="3" stroke="#333" strokeWidth="3" fill="none"/>
                <rect x="39" y="11" width="10" height="10" rx="1" fill="#333"/>
                <rect x="5" y="33" width="22" height="22" rx="3" stroke="#333" strokeWidth="3" fill="none"/>
                <rect x="11" y="39" width="10" height="10" rx="1" fill="#333"/>
                <rect x="33" y="33" width="4" height="4" fill="#333"/><rect x="40" y="33" width="4" height="4" fill="#333"/>
                <rect x="47" y="33" width="4" height="4" fill="#333"/><rect x="33" y="40" width="4" height="4" fill="#333"/>
                <rect x="40" y="40" width="11" height="4" fill="#333"/><rect x="47" y="47" width="8" height="8" rx="1" fill="#1A7AC7"/>
              </svg>
              <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>长按识别加入群聊</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: "#F59E0B", marginBottom: 20 }}>
              ⚠️ 群二维码 7 天内有效，如过期请刷新
            </div>
            <div style={{ fontSize: 13, color: "#1A7AC7", textAlign: "center", fontWeight: 600 }}>
              已有 1,284 位病友在群内交流
            </div>
          </div>
        </div>
      )}

      {/* Post modal */}
      {showPostModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "white",
          display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "48px 16px 14px",
            borderBottom: "1px solid #f0f0f0" }}>
            <button onClick={() => setShowPostModal(false)}
              style={{ background: "none", border: "none", fontSize: 22, color: "#666", cursor: "pointer", lineHeight: 1 }}>←</button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", flex: 1 }}>✏️ 发布帖子</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>标题</div>
              <input placeholder="请输入标题（限30字）" maxLength={30}
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10,
                  border: "1px solid #e8e8e8", fontSize: 14, outline: "none" }}/>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>内容</div>
              <textarea placeholder="请详细描述你的问题或经验分享..." rows={6}
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10,
                  border: "1px solid #e8e8e8", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit" }}/>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>分类</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["康复经验","疑问求助","打卡分享","其他"].map(tag => (
                  <button key={tag} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13,
                    border: "1px solid #1A7AC7", background: "transparent", color: "#1A7AC7", cursor: "pointer" }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 16px 32px", display: "flex", gap: 10, borderTop: "1px solid #f0f0f0" }}>
            <button onClick={() => setShowPostModal(false)}
              style={{ flex: 1, padding: "13px", borderRadius: 10, background: "#f5f5f5",
                color: "#666", fontSize: 15, fontWeight: 500, border: "none", cursor: "pointer" }}>取消</button>
            <button onClick={() => { alert("发布成功！"); setShowPostModal(false); }}
              style={{ flex: 2, padding: "13px", borderRadius: 10, background: "#1A7AC7",
                color: "white", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>发布 →</button>
          </div>
        </div>
      )}
    </>
  );
}

export function HomePage({
  userName, streak, weekDone, weekTotal,
  showOnboardingBanner, onShowOnboarding,
  onAssessmentDone, onDeviceStart, onDeviceMinimize,
  deviceState, hwLevel, hwRemaining, hwTotal, hwCycle, hwTotalCycles,
  onTogglePause, onStop, onReset,
  userGender, userAgeRange,
}: HomePageProps) {
  const [subView, setSubView] = useState<"main"|"assessment"|"device"|"notifications">("main");
  const [presetLevel, setPresetLevel] = useState<number|null>(null);

  if (subView === "notifications") {
    return <NotificationsPage onBack={() => setSubView("main")} />;
  }
  if (subView === "assessment") {
    return <AssessmentFlow
      onDone={(r) => { onAssessmentDone(r); }}
      onCancel={() => setSubView("main")}
      onStartDevice={(level) => { setPresetLevel(level); setSubView("device"); }}
      prefillName={userName}
      prefillGender={userGender}
      prefillAgeRange={userAgeRange}
    />;
  }
  if (subView === "device") {
    return <DeviceFlow
      onStart={(level, custom) => onDeviceStart(level, custom)}
      onMinimize={() => { onDeviceMinimize(); setSubView("main"); }}
      onCancel={() => { setPresetLevel(null); setSubView("main"); }}
      deviceState={deviceState} hwLevel={hwLevel} hwRemaining={hwRemaining}
      hwTotal={hwTotal} hwCycle={hwCycle} hwTotalCycles={hwTotalCycles}
      onTogglePause={onTogglePause} onStop={onStop} onReset={onReset}
      presetLevel={presetLevel}
    />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FA]">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <div className="text-2xl font-bold text-[#1a202c]">{getGreeting()}，{userName||"朋友"} 👋</div>
          <div className="text-sm text-[#718096] mt-0.5">膝盖训练 · 开启你的运动锻炼之旅</div>
        </div>
        <button onClick={() => setSubView("notifications")} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:4 }}>
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e94e77] rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>
      {showOnboardingBanner && (
        <div className="mx-4 mt-2 mb-0 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-[#92400e]">💡 新用户？先完成引导设置</span>
          <button onClick={onShowOnboarding} className="text-xs text-[#92400e] font-semibold bg-[#fde68a] px-2.5 py-1 rounded-full border-0 cursor-pointer ml-2 flex-shrink-0">去设置</button>
        </div>
      )}
      <div className="px-4 pt-4 pb-4 space-y-3">
        <div className="bg-[#fff4f0] rounded-2xl p-5 shadow-sm border border-[#ffe4d9]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">📋</span>
            <span className="font-bold text-[#1a202c] text-base">先了解一下膝盖情况</span>
          </div>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-3">7 道题，约 2 分钟，推荐个性化 PAD 方案。</p>
          <button onClick={()=>setSubView("assessment")}
            className="w-full py-3 rounded-xl bg-[#2D5BFF] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#1e40af] transition-colors">
            开始分析
          </button>
        </div>
        <div className="bg-[#e8f0ff] rounded-2xl p-5 shadow-sm border border-[#d0e1ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-[#1a202c] text-base">先体验一次</span>
          </div>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-3">无需了解即可体验，完成了解后获得个性化方案。</p>
          <button onClick={()=>setSubView("device")}
            className="w-full py-3 rounded-xl bg-[#2D5BFF] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#1e40af] transition-colors">
            开启设备
          </button>
        </div>
        {/* Stats row */}
        <div className="bg-white rounded-2xl px-5 py-4 flex gap-8 shadow-sm border border-[#DBEAFE]">
          <div>
            <div className="text-2xl font-bold text-[#1A7AC7]">{streak}</div>
            <div className="text-xs text-[#718096] mt-0.5">连续打卡</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FFA928]">{weekDone}<span className="text-base text-[#a0aec0]">/{weekTotal}</span></div>
            <div className="text-xs text-[#718096] mt-0.5">天本周完成</div>
          </div>
        </div>

        {/* Recent records */}
        <RecentRecords/>
      </div>
    </div>
  );
}

// ── Recent Training Records (inline, for homepage) ─────────────────────────

function RecentRecords() {
  const records = [
    { date:"01-15", weekday:"周一", plan:"第3天 · 日常训练", dur:12, level:"L2 温和", done:true },
    { date:"01-14", weekday:"周日", plan:"第2天 · 日常训练", dur:8,  level:"L2 温和", done:false },
    { date:"01-13", weekday:"周六", plan:"第1天 · 初始评估", dur:15, level:"L1 舒缓", done:true },
  ];
  return (
    <div style={{ background:"white", borderRadius:16, overflow:"hidden",
      boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #f0f0f0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 16px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:16 }}>📋</span>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>康养记录</span>
          <span style={{ fontSize:11, color:"#9CA3AF", background:"#F3F4F6",
            borderRadius:20, padding:"2px 8px" }}>近3次</span>
        </div>
        <span style={{ fontSize:12, color:"#1A7AC7", cursor:"pointer", fontWeight:500 }}>查看全部 →</span>
      </div>
      {records.map((r, i) => (
        <div key={r.date} style={{
          display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
          borderTop: i === 0 ? "1px solid #F5F5F5" : "none",
          borderBottom:"1px solid #F5F5F5",
        }}>
          <div style={{
            width:40, height:44, borderRadius:10, flexShrink:0, textAlign:"center",
            background:r.done?"#DBEAFE":"#FEF3C7",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{ fontSize:15, fontWeight:700, color:r.done?"#1A7AC7":"#F59E0B", lineHeight:1 }}>{r.date.slice(3)}</div>
            <div style={{ fontSize:10, color:r.done?"#1A7AC7":"#F59E0B" }}>{r.weekday}</div>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:500, color:"#1a1a1a", marginBottom:2 }}>{r.plan}</div>
            <div style={{ fontSize:11, color:"#9CA3AF" }}>⏱ {r.dur}分钟 · {r.level}</div>
          </div>
          <span style={{
            fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, flexShrink:0,
            background:r.done?"#DBEAFE":"#FEF3C7",
            color:r.done?"#1A7AC7":"#D97706",
          }}>{r.done?"✅ 完成":"⏸ 未完成"}</span>
        </div>
      ))}
    </div>
  );
}
