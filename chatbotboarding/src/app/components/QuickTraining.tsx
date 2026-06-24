import { useState, useRef, useEffect } from "react";
import { LEVEL_PARAMS, LEVELS, LEVEL_DESCS, getLevelName, formatTime } from "../types";

interface QuickTrainingProps {
  onBack: () => void;
}

type DeviceState = "disconnected" | "idle" | "running" | "paused";
type StopReason = string[];

export function QuickTraining({ onBack }: QuickTrainingProps) {
  const [level, setLevel] = useState(2);
  const [deviceState, setDeviceState] = useState<DeviceState>("disconnected");
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopReasons, setStopReasons] = useState<Record<string,boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const completedRef = useRef(false);

  const prm = LEVEL_PARAMS[level-1] || LEVEL_PARAMS[1];
  const totalTime = prm.cycles * (prm.work + prm.rest);
  const progress = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;

  const stopTimer = () => { if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;} };

  const handleConnect = () => setDeviceState("idle");

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
      if(!completedRef.current) {
        setShowStopModal(true);
      }
    }
  }, [deviceState]);

  const handleStop = () => {
    if(window.confirm("确定要结束本次训练吗？")) {
      stopTimer(); setDeviceState("stopped");
    }
  };

  const handleReset = () => { stopTimer(); setDeviceState("idle"); setRemaining(0); setTotal(0); setCycle(0); };

  const handleStopSubmit = () => {
    setShowStopModal(false);
    setStopReasons({});
  };

  const STOP_REASONS = ["忘记了","没时间","效果不明显","使用不舒服","其他"];

  return (
    <div className="flex-1 flex flex-col bg-[#f5f9f5] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl bg-transparent border-0 cursor-pointer text-[#4a5568]">←</button>
          <div>
            <div className="font-bold text-[#1a202c]">⚡ 快速训练</div>
            <div className="text-xs text-[#718096]">跳过评估，直接控制设备进行训练</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Device card */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-3">设备状态</div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🦵</span>
            <div>
              <div className="text-sm font-medium text-[#1a202c]">智能膝关节康养仪 PAD</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${deviceState==="disconnected"?"bg-[#cbd5e0]":"bg-[#2ECC71]"}`}/>
                <span className="text-xs text-[#718096]">
                  {{disconnected:"未连接",idle:"已连接",running:"运行中",paused:"已暂停"}[deviceState]}
                </span>
              </div>
            </div>
            {deviceState === "disconnected" && (
              <button onClick={handleConnect}
                className="ml-auto px-4 py-2 rounded-full bg-[#2ECC71] text-white text-sm font-semibold border-0 cursor-pointer">
                🔗 连接设备
              </button>
            )}
          </div>
        </div>

        {/* Level selector */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-3">手动参数设置</div>
          <div className="flex gap-1.5 mb-3">
            {[1,2,3,4,5,6].map(l=>(
              <button key={l} onClick={()=>{ if(deviceState==="idle"||deviceState==="disconnected") setLevel(l); }}
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
        </div>

        {/* Training control */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-3">训练控制</div>
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-[#718096] mb-1.5">
              <span>⏱ 进度</span>
              <span className="font-mono">{formatTime(total-remaining)} / {formatTime(total||totalTime)}</span>
            </div>
            <div className="h-3 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full transition-all duration-300"
                style={{width:`${progress}%`}}/>
            </div>
          </div>
          <div className="text-xs text-[#718096] mb-3">当前轮数：{cycle}/{prm.cycles}</div>
          {/* Buttons */}
          <div className="flex gap-2">
            {(deviceState==="disconnected"||deviceState==="idle") && (
              <button onClick={deviceState==="disconnected"?handleConnect:handleStart}
                disabled={false}
                className={`flex-1 py-3 rounded-full font-bold text-sm border-0 cursor-pointer transition-all
                  ${deviceState==="disconnected"?"bg-[#cbd5e0] text-white":"bg-[#2ECC71] text-white active:bg-[#27AE60]"}`}>
                {deviceState==="disconnected"?"先连接设备":"▶ 开始"}
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

        {/* Info tip */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 text-sm text-[#92400e]">
          <div className="font-medium mb-1">💡 提示</div>
          <p className="text-xs leading-relaxed">本页面为手动控制模式，不含 AI 引导与反馈。如需智能陪伴，请前往「小瑞」页面。</p>
        </div>
      </div>

      {/* Stop reason modal */}
      {showStopModal && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="text-lg font-bold text-[#1a202c] mb-1">⏹ 训练已结束</div>
            <p className="text-sm text-[#4a5568] mb-4">今天没有完成预定治疗，主要原因是什么？（可多选）</p>
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
