import { useState } from "react";
import { LEVEL_PARAMS, LEVELS, LEVEL_DESCS, getLevelName, formatTime, DeviceState } from "../types";

export interface AssessmentResult {
  name: string; gender: string; ageRange: string; duration: string;
  safety: string[]; stiffness: string; triggers: string[]; painLevel: number;
}

interface HomePageProps {
  userName: string; streak: number; weekDone: number; weekTotal: number;
  showOnboardingBanner: boolean; onShowOnboarding: () => void;
  onAssessmentDone: (r: AssessmentResult) => void;
  onDeviceStart: (level: number) => void;
  onDeviceMinimize: () => void;
  deviceState: DeviceState;
  hwLevel: number; hwRemaining: number; hwTotal: number;
  hwCycle: number; hwTotalCycles: number;
  onTogglePause: () => void; onStop: () => void; onReset: () => void;
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "上午好" : h < 18 ? "下午好" : "晚上好";
}

const SAFETY_LIST = [
  { v: "受伤", l: "最近2周内有明显膝盖受伤" },
  { v: "肿胀", l: "膝盖明显肿胀/发烫" },
  { v: "伤口", l: "膝盖周围有伤口或皮肤问题" },
  { v: "医生建议", l: "医生建议避免使用类似设备" },
  { v: "无", l: "以上都没有" },
];
const TRIGGERS_LIST = ["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","其他","无"];
const WEAR_STEPS = [
  { icon: "🪑", title: "坐在椅子上", desc: "找一把稳固的椅子坐好，保持膝盖自然弯曲约90°。" },
  { icon: "🦵", title: "套上设备", desc: "将 PAD 套圈套在膝关节上方，调整至舒适位置。" },
  { icon: "🔧", title: "检查松紧", desc: "确认绑带不过紧，能插入两指为宜。" },
  { icon: "✅", title: "保持放松", desc: "使用期间放松腿部，避免强行移动或大幅弯曲膝盖。" },
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
            style={{ flex: i === step ? 2 : 1, background: i <= step ? "#07C160" : "#e2e8f0" }} />
        ))}
      </div>
    </div>
  );
}

// ── Assessment Flow ────────────────────────────────────────────────────────────

function AssessmentFlow({ onDone, onCancel }: { onDone: (r: AssessmentResult) => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(""); const [gender, setGender] = useState(""); const [ageRange, setAgeRange] = useState("");
  const [duration, setDuration] = useState(""); const [safety, setSafety] = useState<Record<string,boolean>>({});
  const [stiffness, setStiffness] = useState(""); const [triggers, setTriggers] = useState<Record<string,boolean>>({}); const [painLevel, setPainLevel] = useState<number|null>(null);
  const safetyVals = Object.entries(safety).filter(([,v])=>v).map(([k])=>k);
  const triggerVals = Object.entries(triggers).filter(([,v])=>v).map(([k])=>k);
  const TITLES = ["基本信息","膝盖情况","症状详情"];

  const handleBack = () => { if (step === 0) onCancel(); else setStep(s => s - 1); };
  const handleSubmit = () => {
    const hasRisk = ["受伤","肿胀","伤口","医生建议"].some(r => safetyVals.includes(r));
    if (hasRisk && !window.confirm("检测到存在安全风险，建议咨询医生后再使用。是否仍要继续？")) return;
    onDone({ name: name.trim(), gender, ageRange, duration, safety: safetyVals, stiffness, triggers: triggerVals, painLevel: painLevel! });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FlowHeader step={step} total={3} title={`📋 ${TITLES[step]}`} onBack={handleBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f5f9f5]">
        {step === 0 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">叫你什么好？</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="输入昵称"
              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-[#fafcff] outline-none focus:border-[#07C160]"/>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">性别</div>
            <div className="flex gap-2">
              {["男","女","其他"].map(g=>(
                <button key={g} onClick={()=>setGender(g)}
                  className={`flex-1 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                    ${gender===g?"bg-[#07C160] text-white border-[#07C160]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {g==="男"?"👨 男":g==="女"?"👩 女":"其他"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">年龄范围</div>
            <div className="grid grid-cols-2 gap-2">
              {["20岁以下","20-40岁","40-60岁","60岁以上"].map(a=>(
                <button key={a} onClick={()=>setAgeRange(a)}
                  className={`py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                    ${ageRange===a?"bg-[#07C160] text-white border-[#07C160]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>{ if(!name.trim()||!gender||!ageRange){alert("请完整填写");return;} setStep(1); }}
            className="w-full py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">
            下一步 →
          </button>
        </>}

        {step === 1 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">膝盖不适多久了？</div>
            <div className="grid grid-cols-2 gap-2">
              {["不到1个月","1-3个月","3-6个月","6个月-1年","1年以上","无特别不适"].map(d=>(
                <button key={d} onClick={()=>setDuration(d)}
                  className={`py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                    ${duration===d?"bg-[#07C160] text-white border-[#07C160]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">安全筛查（可多选）</div>
            {SAFETY_LIST.map(({v,l})=>(
              <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
                <input type="checkbox" checked={!!safety[v]} onChange={e=>setSafety(p=>({...p,[v]:e.target.checked}))} className="accent-[#07C160]"/>
                {l}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(0)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ if(!duration||safetyVals.length===0){alert("请完整填写");return;} setStep(2); }}
              className="flex-[2] py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">下一步 →</button>
          </div>
        </>}

        {step === 2 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-2">起床/久坐后膝盖紧绷感？</div>
            {["没有特别感觉","有点紧","很紧"].map(s=>(
              <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
                <input type="radio" name="stiffness" checked={stiffness===s} onChange={()=>setStiffness(s)} className="accent-[#07C160]"/>
                {s}
              </label>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-1">哪些动作容易引发不适？（可多选）</div>
            {TRIGGERS_LIST.map(v=>(
              <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
                <input type="checkbox" checked={!!triggers[v]} onChange={e=>setTriggers(p=>({...p,[v]:e.target.checked}))} className="accent-[#07C160]"/>
                {v}
              </label>
            ))}
            <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
              <div className="text-xs text-[#718096] mb-2">不适程度（0=无 · 4=非常）：</div>
              <div className="flex gap-1.5">
                {[0,1,2,3,4].map(n=>(
                  <button key={n} onClick={()=>setPainLevel(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-all
                      ${painLevel===n?"bg-[#07C160] text-white border-[#07C160]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ if(!stiffness||triggerVals.length===0||painLevel===null){alert("请完整填写");return;} handleSubmit(); }}
              className="flex-[2] py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">提交查看方案 →</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── Device Flow ────────────────────────────────────────────────────────────────

function DeviceFlow({ onStart, onMinimize, onCancel, deviceState, hwLevel, hwRemaining, hwTotal, hwCycle, hwTotalCycles, onTogglePause, onStop, onReset }: {
  onStart: (level: number) => void; onMinimize: () => void; onCancel: () => void;
  deviceState: DeviceState; hwLevel: number; hwRemaining: number; hwTotal: number;
  hwCycle: number; hwTotalCycles: number;
  onTogglePause: () => void; onStop: () => void; onReset: () => void;
}) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(2);
  const prm = LEVEL_PARAMS[level - 1] || LEVEL_PARAMS[1];
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f5f9f5]">

        {step === 0 && <>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="text-sm font-semibold text-[#1a202c] mb-3">选择强度模式</div>
            <div className="flex gap-1.5 mb-3">
              {[1,2,3,4,5,6].map(l=>(
                <button key={l} onClick={()=>setLevel(l)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all
                    ${level===l?"bg-[#07C160] text-white border-[#07C160]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  L{l}
                </button>
              ))}
            </div>
            <div className="bg-[#f0fdf4] rounded-xl p-3 text-sm">
              <div className="font-semibold text-[#065f46]">{getLevelName(level)} · {LEVELS[level-1]}</div>
              <div className="text-xs mt-1 text-[#4a8a6a]">{LEVEL_DESCS[level]}</div>
              <div className="flex gap-3 mt-2 text-xs text-[#4a5568] flex-wrap">
                <span>💨 {prm.pressure} mmHg</span><span>⏱ {prm.work}s 工作</span>
                <span>🔄 {prm.rest}s 休息</span><span>🔁 {prm.cycles} 轮</span>
                <span>⏳ 约 {Math.floor(totalTime/60)}分{totalTime%60}秒</span>
              </div>
            </div>
          </div>
          <button onClick={()=>setStep(1)}
            className="w-full py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">
            下一步：穿戴准备 →
          </button>
        </>}

        {step === 1 && <>
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4">
            <div className="font-semibold text-[#92400e] text-sm">⚠️ 穿戴前请确认</div>
          </div>
          {WEAR_STEPS.map(({icon,title,desc},i)=>(
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#e2e8f0] flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f0fdf4] flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <div>
                <div className="text-sm font-semibold text-[#1a202c]">步骤 {i+1}：{title}</div>
                <div className="text-xs text-[#718096] mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pb-4">
            <button onClick={()=>setStep(0)} className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">← 上一步</button>
            <button onClick={()=>{ onStart(level); setStep(2); }}
              className="flex-[2] py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">
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
                  <span className={`w-2 h-2 rounded-full ${running?"bg-[#07C160] animate-pulse":done?"bg-[#fbbf24]":"bg-[#07C160]"}`}/>
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
              <div className="h-full bg-gradient-to-r from-[#07C160] to-[#06AE56] rounded-full transition-all duration-300" style={{width:`${progress}%`}}/>
            </div>
            <div className="flex justify-between text-xs text-[#718096]">
              <span>轮数：{hwCycle} / {hwTotalCycles}</span><span>{progress}%</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] flex gap-2">
            {running && <>
              <button onClick={onTogglePause}
                className={`flex-1 py-3 rounded-full font-bold text-sm border-0 cursor-pointer ${deviceState==="paused"?"bg-[#07C160] text-white":"bg-[#F39C12] text-white"}`}>
                {deviceState==="paused"?"▶ 继续":"⏸ 暂停"}
              </button>
              <button onClick={onStop} className="flex-1 py-3 rounded-full bg-[#E74C3C] text-white font-bold text-sm border-0 cursor-pointer">⏹ 结束</button>
            </>}
            {done && <button onClick={onReset} className="flex-1 py-3 rounded-full bg-[#07C160] text-white font-bold text-sm border-0 cursor-pointer">🔄 重新开始</button>}
          </div>
          {running && (
            <button onClick={onMinimize}
              className="w-full py-3 rounded-full bg-[#f0fdf4] text-[#07C160] font-semibold text-sm border border-[#07C160] cursor-pointer">
              ⬇ 收起 · 设备继续运行
            </button>
          )}
          {done && (
            <button onClick={onCancel} className="w-full py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
              ← 返回首页
            </button>
          )}
        </>}
      </div>
    </div>
  );
}

// ── Main HomePage ──────────────────────────────────────────────────────────────

export function HomePage({
  userName, streak, weekDone, weekTotal,
  showOnboardingBanner, onShowOnboarding,
  onAssessmentDone, onDeviceStart, onDeviceMinimize,
  deviceState, hwLevel, hwRemaining, hwTotal, hwCycle, hwTotalCycles,
  onTogglePause, onStop, onReset,
}: HomePageProps) {
  const [subView, setSubView] = useState<"main"|"assessment"|"device">("main");

  if (subView === "assessment") {
    return <AssessmentFlow
      onDone={(r) => { onAssessmentDone(r); setSubView("main"); }}
      onCancel={() => setSubView("main")}
    />;
  }
  if (subView === "device") {
    return <DeviceFlow
      onStart={onDeviceStart}
      onMinimize={() => { onDeviceMinimize(); setSubView("main"); }}
      onCancel={() => setSubView("main")}
      deviceState={deviceState} hwLevel={hwLevel} hwRemaining={hwRemaining}
      hwTotal={hwTotal} hwCycle={hwCycle} hwTotalCycles={hwTotalCycles}
      onTogglePause={onTogglePause} onStop={onStop} onReset={onReset}
    />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FA]">
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
