import { useState, useRef, useEffect } from "react";
import { LEVEL_PARAMS, LEVELS, LEVEL_DESCS, getLevelName, formatTime } from "../types";

interface QuickTrainingProps {
  onBack: () => void;
}

type DeviceState = "idle" | "running" | "paused" | "stopped";

const STEPS = [
  { label: "选择强度", sub: "设定使用参数" },
  { label: "穿戴准备", sub: "穿戴须知确认" },
  { label: "开始使用", sub: "设备控制" },
];

const STOP_REASONS = ["忘记了","没时间","效果不明显","使用不舒服","其他"];

const WEAR_STEPS = [
  { icon: "🪑", title: "坐在椅子上", desc: "找一把稳固的椅子坐好，保持膝盖自然弯曲约90°。" },
  { icon: "🦵", title: "套上设备", desc: "将 PAD 套圈套在膝关节上方，调整至舒适位置。" },
  { icon: "🔧", title: "检查松紧", desc: "确认绑带不过紧，能插入两指为宜。" },
  { icon: "✅", title: "保持放松", desc: "使用期间放松腿部，避免强行移动或大幅弯曲膝盖。" },
];

export function QuickTraining({ onBack }: QuickTrainingProps) {
  const [page, setPage] = useState(0);
  const [level, setLevel] = useState(2);
  const [customMode, setCustomMode] = useState(false);
  const [customPressure, setCustomPressure] = useState(125);
  const [customWork, setCustomWork] = useState(30);
  const [customRest, setCustomRest] = useState(10);
  const [customCycles, setCustomCycles] = useState(5);
  const [deviceState, setDeviceState] = useState<DeviceState>("idle");
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopReasons, setStopReasons] = useState<Record<string,boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const completedRef = useRef(false);

  const prm = customMode
    ? { pressure: customPressure, work: customWork, rest: customRest, cycles: customCycles }
    : LEVEL_PARAMS[level-1] || LEVEL_PARAMS[1];
  const totalTime = prm.cycles * (prm.work + prm.rest);
  const progress = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;

  const stopTimer = () => { if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;} };

  const handleStart = () => {
    const t = totalTime;
    setTotal(t); setRemaining(t); setCycle(0);
    setDeviceState("running"); completedRef.current = false;
    stopTimer();
    let rem = t;
    timerRef.current = setInterval(() => {
      setDeviceState(s => {
        if(s === "paused") return s;
        if(s === "stopped" || rem <= 0) { clearInterval(timerRef.current!); return "stopped"; }
        rem--;
        setCycle(Math.min(Math.floor((t - rem)/(prm.work + prm.rest))+1, prm.cycles));
        setRemaining(rem);
        if(rem <= 0) { completedRef.current = true; clearInterval(timerRef.current!); return "stopped"; }
        return s;
      });
    }, 1000);
  };

  useEffect(() => {
    if(deviceState === "stopped" && total > 0) {
      stopTimer();
      if(!completedRef.current) setShowStopModal(true);
    }
  }, [deviceState]);

  const handleStop = () => {
    if(window.confirm("确定要结束本次使用吗？")) {
      stopTimer(); setDeviceState("stopped");
    }
  };

  const handleReset = () => { stopTimer(); setDeviceState("idle"); setRemaining(0); setTotal(0); setCycle(0); };

  const handleStopSubmit = () => { setShowStopModal(false); setStopReasons({}); };

  const handleBack = () => {
    if (page === 0) onBack();
    else if (page === 2 && (deviceState === "running" || deviceState === "paused")) return;
    else setPage(p => p - 1);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f5f9f5] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={handleBack}
            className={`text-2xl bg-transparent border-0 cursor-pointer transition-colors
              ${page === 2 && (deviceState === "running" || deviceState === "paused") ? "text-[#d0d0d0] cursor-not-allowed" : "text-[#4a5568]"}`}>
            ←
          </button>
          <div className="flex-1">
            <div className="font-bold text-[#1a202c]">⚡ 快速体验</div>
            <div className="text-xs text-[#718096]">{STEPS[page].sub}</div>
          </div>
          <div className="text-xs text-[#718096] font-medium">{page+1} / {STEPS.length}</div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center mb-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-all
                ${i < page ? "bg-[#2ECC71] text-white" : i === page ? "bg-[#2ECC71] text-white ring-2 ring-[#a8f0c6] ring-offset-1" : "bg-[#e2e8f0] text-[#a0aec0]"}`}>
                {i < page ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 transition-all duration-300 ${i < page ? "bg-[#2ECC71]" : "bg-[#e2e8f0]"}`}/>
              )}
            </div>
          ))}
        </div>
        <div className="flex">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex-1 text-center text-[10px] font-medium transition-colors
              ${i === page ? "text-[#2ECC71]" : i < page ? "text-[#48bb78]" : "text-[#a0aec0]"}`}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Page 0: 选择强度 */}
      {page === 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-3">选择模式</div>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setCustomMode(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${!customMode?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                📋 设定模式
              </button>
              <button onClick={() => setCustomMode(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${customMode?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                ⚙️ 自定义模式
              </button>
            </div>

            {!customMode ? (
              <>
                <div className="flex gap-1.5 mb-3">
                  {[1,2,3,4,5,6].map(l=>(
                    <button key={l} onClick={()=>setLevel(l)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all
                        ${level===l?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                      L{l}
                    </button>
                  ))}
                </div>
                <div className="bg-[#f0fdf4] rounded-xl p-3 text-sm text-[#065f46]">
                  <div className="font-semibold">{getLevelName(level)} · {LEVELS[level-1]}</div>
                  <div className="text-xs mt-1 text-[#4a8a6a]">{LEVEL_DESCS[level]}</div>
                  <div className="flex gap-3 mt-2 text-xs text-[#4a5568] flex-wrap">
                    <span>💨 {prm.pressure} mmHg</span>
                    <span>⏱ {prm.work}s 工作</span>
                    <span>🔄 {prm.rest}s 休息</span>
                    <span>🔁 {prm.cycles} 轮</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#fef3c7] rounded-xl p-3 space-y-3">
                <div className="font-semibold text-sm text-[#92400e]">⚙️ 自定义参数</div>
                {[
                  {label:"💨 负压强度 (mmHg)",min:80,max:200,step:5,val:customPressure,set:setCustomPressure},
                  {label:"⏱ 作用时间 (秒)",min:10,max:60,step:5,val:customWork,set:setCustomWork,unit:"s"},
                  {label:"🔄 休息间隔 (秒)",min:5,max:30,step:5,val:customRest,set:setCustomRest,unit:"s"},
                  {label:"🔁 循环轮数",min:3,max:10,step:1,val:customCycles,set:setCustomCycles,unit:" 轮"},
                ].map(({label,min,max,step,val,set,unit})=>(
                  <div key={label}>
                    <label className="flex justify-between text-xs text-[#4a5568] mb-1">
                      <span>{label}</span>
                      <span className="font-semibold text-[#1a202c]">{val}{unit||""}</span>
                    </label>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={(e)=>set(Number(e.target.value))}
                      className="w-full h-2 bg-[#e2e8f0] rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ECC71] [&::-webkit-slider-thumb]:cursor-pointer"/>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#fde68a] text-xs text-[#92400e]">
                  预计总时长：<span className="font-semibold ml-1">{Math.floor(totalTime/60)}分{totalTime%60}秒</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setPage(1)}
            className="w-full py-3.5 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
            下一步：穿戴准备 →
          </button>
        </div>
      )}

      {/* Page 1: 穿戴准备 */}
      {page === 1 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4">
            <div className="font-semibold text-[#92400e] text-sm mb-1">⚠️ 穿戴前请确认</div>
            <div className="text-xs text-[#92400e]">请按以下步骤正确穿戴设备，确保安全使用。</div>
          </div>
          {WEAR_STEPS.map(({icon,title,desc},i)=>(
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#e2e8f0] flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#f0fdf4] flex items-center justify-center text-lg">{icon}</div>
              <div>
                <div className="text-sm font-semibold text-[#1a202c]">步骤 {i+1}：{title}</div>
                <div className="text-xs text-[#718096] mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
          <div className="bg-[#ecfdf5] border border-[#6ee7b7] rounded-2xl p-4 text-sm text-[#065f46]">
            <div className="font-medium mb-1">💡 提醒</div>
            <div className="text-xs">本次为手动控制模式，不含 AI 引导。如需智能陪伴，请前往「小瑞」页面。</div>
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={() => setPage(0)}
              className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
              ← 上一步
            </button>
            <button onClick={() => { setPage(2); handleStart(); }}
              className="flex-[2] py-3 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
              已准备好，开始使用 →
            </button>
          </div>
        </div>
      )}

      {/* Page 2: 使用中 */}
      {page === 2 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Device status */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦵</span>
              <div>
                <div className="text-sm font-semibold text-[#1a202c]">智能膝关节康养仪 PAD</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${
                    deviceState==="running"?"bg-[#2ECC71] animate-pulse":
                    deviceState==="paused"?"bg-[#F39C12]":
                    deviceState==="stopped"?"bg-[#E74C3C]":"bg-[#2ECC71]"}`}/>
                  <span className="text-xs text-[#718096]">
                    {deviceState==="running"?"运行中":deviceState==="paused"?"已暂停":deviceState==="stopped"?"已结束":"就绪"}
                  </span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-mono font-bold text-[#1a202c]">{formatTime(remaining)}</div>
                <div className="text-[10px] text-[#a0aec0]">剩余时间</div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="flex justify-between text-xs text-[#718096] mb-2">
              <span>使用进度</span>
              <span className="font-mono">{formatTime(total-remaining)} / {formatTime(total||totalTime)}</span>
            </div>
            <div className="h-3 bg-[#e2e8f0] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full transition-all duration-300"
                style={{width:`${progress}%`}}/>
            </div>
            <div className="flex justify-between text-xs text-[#718096]">
              <span>当前轮数：{cycle} / {prm.cycles}</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-3">设备控制</div>
            <div className="flex gap-2">
              {deviceState==="idle" && (
                <button onClick={handleStart}
                  className="flex-1 py-3 rounded-full font-bold text-sm border-0 cursor-pointer bg-[#2ECC71] text-white active:bg-[#27AE60]">
                  ▶ 开始
                </button>
              )}
              {(deviceState==="running"||deviceState==="paused") && <>
                <button onClick={()=>setDeviceState(s=>s==="running"?"paused":"running")}
                  className={`flex-1 py-3 rounded-full font-bold text-sm border-0 cursor-pointer transition-all
                    ${deviceState==="paused"?"bg-[#2ECC71] text-white":"bg-[#F39C12] text-white"}`}>
                  {deviceState==="paused"?"▶ 继续":"⏸ 暂停"}
                </button>
                <button onClick={handleStop}
                  className="flex-1 py-3 rounded-full bg-[#E74C3C] text-white font-bold text-sm border-0 cursor-pointer">
                  ⏹ 结束
                </button>
              </>}
              {deviceState==="stopped" && (
                <button onClick={handleReset}
                  className="flex-1 py-3 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer">
                  🔄 重新开始
                </button>
              )}
            </div>
          </div>

          {deviceState==="stopped" && (
            <button onClick={onBack}
              className="w-full py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
              ← 返回首页
            </button>
          )}
        </div>
      )}

      {/* Stop reason modal */}
      {showStopModal && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="text-lg font-bold text-[#1a202c] mb-1">⏹ 设备已结束</div>
            <p className="text-sm text-[#4a5568] mb-4">今天没有完成预定使用，主要原因是什么？（可多选）</p>
            {STOP_REASONS.map(r=>(
              <label key={r} className="flex items-center gap-2 py-2 cursor-pointer text-sm text-[#2d3748]">
                <input type="checkbox" checked={!!stopReasons[r]}
                  onChange={e=>setStopReasons(p=>({...p,[r]:e.target.checked}))}
                  className="accent-[#2ECC71]"/>
                {r}
              </label>
            ))}
            <div className="bg-[#ecfdf5] border border-[#6ee7b7] rounded-xl p-3 my-3 text-sm text-[#065f46]">
              💪 持之以恒，有助康复！明天记得继续哦～
            </div>
            <button onClick={handleStopSubmit}
              className="w-full py-3 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer">
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
