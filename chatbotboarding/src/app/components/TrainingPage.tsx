import { useState, useEffect, useRef } from "react";

import gif转身摸臀 from "../../assets/gifs/转身摸臀.gif";
import gif后踢臀部 from "../../assets/gifs/后踢臀部.gif";
import gif提膝碰肘 from "../../assets/gifs/提膝碰肘.gif";
import gif螃蟹步   from "../../assets/gifs/螃蟹步.gif";
import gif臀部找椅 from "../../assets/gifs/臀部找椅.gif";
import gif站立提踵 from "../../assets/gifs/站立提踵.gif";
import gif快步走   from "../../assets/gifs/快步走.gif";
import gif拉伸臀部 from "../../assets/gifs/拉伸臀部.gif";
import gif拉伸大腿后侧 from "../../assets/gifs/拉伸大腿后侧.gif";
import gif拉伸躯干 from "../../assets/gifs/拉伸躯干.gif";

const ANIM_CSS = `
@keyframes pulse      { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes scanDown   { 0%{top:0} 100%{top:88%} }
@keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0.3} }
@keyframes slideUp    { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fadeIn     { from{opacity:0} to{opacity:1} }
@keyframes errPill    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const GIF_MAP: Record<string, string> = {
  "转身摸臀":     gif转身摸臀,
  "后踢臀部":     gif后踢臀部,
  "提膝碰肘":     gif提膝碰肘,
  "螃蟹步":       gif螃蟹步,
  "臀部找椅":     gif臀部找椅,
  "站立提踵":     gif站立提踵,
  "快步走":       gif快步走,
  "拉伸臀部":     gif拉伸臀部,
  "拉伸大腿后侧": gif拉伸大腿后侧,
  "拉伸躯干":     gif拉伸躯干,
};

/* ─── Real-time Assessment ───────────────────────────────────────────────────*/
const ASSESS_EXERCISES: { name: string; desc: string; gifKey: string }[] = [
  { name: "臀部找椅", desc: "双脚与肩同宽，臀部向后轻触椅边后慢慢起身，膝盖不超过脚尖", gifKey: "臀部找椅" },
  { name: "深蹲",     desc: "双脚与肩同宽，下蹲时膝盖和脚尖方向一致，背部挺直",         gifKey: "螃蟹步" },
  { name: "提膝碰肘", desc: "左手扶椅，右手搭左肩，吐气收腹提左膝碰右肘，左右交替",       gifKey: "提膝碰肘" },
  { name: "站立提踵", desc: "双脚与肩同宽，双手扶椅，脚尖踮到最高再缓慢放下",             gifKey: "站立提踵" },
];
const ERROR_MSGS = [
  "膝盖前伸幅度过大",
  "重心偏左，请调整",
  "背部弯曲，请挺直",
  "动作标准！保持",
  "下蹲深度不足",
];

/* Entry button in Training tab */
function RealtimeAssessmentEntry({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 14,
      background: "linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0F3460 100%)",
      border: "none", borderRadius: 14, padding: "14px 16px", cursor: "pointer",
      boxShadow: "0 4px 18px rgba(15,52,96,0.35)", marginBottom: 14,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="2.5" fill="#4ADE80"/>
          <line x1="12" y1="7.5" x2="12" y2="13" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="10" x2="8" y2="13" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="10" x2="16" y2="13" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="13" x2="9" y2="19" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="13" x2="15" y2="19" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 3 }}>实时动作评估</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>AI 骨架追踪 · 实时纠错 · 标准对比</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5,
        background: "rgba(74,222,128,0.18)", borderRadius: 20, padding: "4px 10px" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block",
          animation: "pulse 1.4s infinite" }}/>
        <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 600 }}>开始</span>
      </div>
    </button>
  );
}

/* Fullscreen overlay page */
function RealtimeAssessmentPage({ onClose }: { onClose: () => void }) {
  const [exIdx, setExIdx]   = useState(0);
  const [active, setActive] = useState(false);
  const [angle, setAngle]   = useState(90);
  const [errIdx, setErrIdx] = useState(0);
  const [reps, setReps]     = useState(0);
  const [progress, setProgress] = useState(0);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStop = () => {
    if (active) {
      if (ivRef.current) clearInterval(ivRef.current);
      setActive(false); setAngle(90); setReps(0); setProgress(0);
      return;
    }
    setActive(true);
    let n = 0;
    ivRef.current = setInterval(() => {
      n++;
      setAngle(Math.floor(65 + Math.abs(Math.sin(n * 0.45)) * 42));
      setProgress(p => Math.min(100, p + 0.7));
      if (n % 5 === 0) { setReps(r => r + 1); setErrIdx(i => (i + 1) % ERROR_MSGS.length); }
    }, 700);
  };

  useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current); }, []);

  const ex = ASSESS_EXERCISES[exIdx];
  const gifSrc = GIF_MAP[ex.gifKey];
  const isError = active && errIdx < 3;
  const skelColor = isError ? "#EF4444" : "#4ADE80";

  // Skeleton points driven by angle
  const hipY  = 68;
  const kneeY = hipY + 24 + (active ? angle * 0.13 : 0);
  const ankleY = kneeY + 36;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#0A0F1E",
      display: "flex", flexDirection: "column",
      animation: "slideUp 0.28s ease",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        background: "linear-gradient(180deg,#0F172A 0%,rgba(15,23,42,0.95) 100%)",
        padding: "44px 16px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
            color: "white", fontSize: 18, lineHeight: 1, padding: "4px 10px", cursor: "pointer",
          }}>←</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{ex.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
                display: "inline-block", animation: "pulse 1.2s infinite" }}/>
              <span style={{ fontSize: 11, color: "#4ADE80" }}>实时纠错模式已开启</span>
            </div>
          </div>
        </div>
        {/* Exercise selector chips */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="hide-scrollbar">
          {ASSESS_EXERCISES.map((e, i) => (
            <button key={e.name} onClick={() => !active && setExIdx(i)} style={{
              padding: "5px 12px", borderRadius: 16, border: "none", flexShrink: 0,
              background: exIdx === i ? "#1A7AC7" : "rgba(255,255,255,0.1)",
              color: exIdx === i ? "white" : "rgba(255,255,255,0.55)",
              fontSize: 11, fontWeight: exIdx === i ? 700 : 400, cursor: "pointer",
              opacity: active && exIdx !== i ? 0.35 : 1,
            }}>{e.name}</button>
          ))}
        </div>
        <button style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
          padding: "6px 8px", cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Main panels ── */}
      <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden", minHeight: 0 }}>

        {/* LEFT: Live camera / skeleton */}
        <div style={{ flex: 1, position: "relative", background: "#0D1117", display: "flex", flexDirection: "column" }}>
          {/* Panel label */}
          <div style={{ position: "absolute", top: 10, left: 12, zIndex: 10,
            display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>实时镜像预览</span>
            <span style={{ fontSize: 9, background: "#EF4444", color: "white", borderRadius: 4,
              padding: "2px 6px", fontWeight: 700 }}>LIVE CAMERA</span>
          </div>

          {/* Scan line */}
          {active && <div style={{ position: "absolute", left: 0, right: 0, height: 2, zIndex: 5,
            background: `linear-gradient(90deg,transparent,${skelColor},transparent)`,
            animation: "scanDown 2s linear infinite" }}/>}

          {/* Skeleton SVG */}
          <svg width="100%" height="100%" viewBox="0 0 200 280"
            style={{ position: "absolute", inset: 0 }} preserveAspectRatio="xMidYMid meet">
            {/* grid */}
            {active && [50,100,150].map(x =>
              <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="rgba(74,222,128,0.06)" strokeWidth="1"/>)}
            {active && [70,140,210].map(y =>
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(74,222,128,0.06)" strokeWidth="1"/>)}

            <g opacity={active ? 1 : 0.25}>
              {/* torso */}
              <line x1="100" y1="30" x2="100" y2="60" stroke={skelColor} strokeWidth="2.5" strokeLinecap="round"/>
              {/* shoulders */}
              <line x1="100" y1="60" x2="76"  y2="80" stroke={skelColor} strokeWidth="2" strokeLinecap="round"/>
              <line x1="100" y1="60" x2="124" y2="80" stroke={skelColor} strokeWidth="2" strokeLinecap="round"/>
              {/* hips */}
              <line x1="100" y1="60" x2="88"  y2={hipY}  stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              <line x1="100" y1="60" x2="112" y2={hipY}  stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              {/* thighs */}
              <line x1="88"  y1={hipY}  x2="84"  y2={kneeY} stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              <line x1="112" y1={hipY}  x2="116" y2={kneeY} stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              {/* shins */}
              <line x1="84"  y1={kneeY} x2="82"  y2={ankleY} stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              <line x1="116" y1={kneeY} x2="118" y2={ankleY} stroke={skelColor} strokeWidth="3" strokeLinecap="round"/>
              {/* joints */}
              {[
                {x:100,y:22,r:7},{x:100,y:60,r:5},
                {x:76,y:80,r:4},{x:124,y:80,r:4},
                {x:88,y:hipY,r:5},{x:112,y:hipY,r:5},
                {x:84,y:kneeY,r:5},{x:116,y:kneeY,r:5},
                {x:82,y:ankleY,r:4},{x:118,y:ankleY,r:4},
              ].map(({x,y,r},i) =>
                <circle key={i} cx={x} cy={y} r={r} fill="#1A7AC7" stroke={skelColor} strokeWidth="1.5"/>
              )}
              {/* knee angle arc */}
              {active && <>
                <path d={`M 76 ${kneeY-8} A 12 12 0 0 1 ${76+12} ${kneeY}`}
                  fill="none" stroke="#FCD34D" strokeWidth="1.8" opacity="0.85"/>
                <text x="56" y={kneeY+2} fontSize="9" fill="#FCD34D" fontWeight="bold">{angle}°</text>
              </>}
              {/* joint labels */}
              {active && [
                ["髋",88,hipY-6],["膝",80,kneeY-6],["踝",78,ankleY-6],
              ].map(([l,x,y]) => (
                <text key={String(l)} x={Number(x)-14} y={Number(y)} fontSize="8" fill="rgba(74,222,128,0.7)">{l}</text>
              ))}
            </g>

            {/* Corner brackets */}
            {[[8,8],[172,8],[8,252],[172,252]].map(([x,y],i) => (
              <g key={i} transform={`translate(${x},${y}) rotate(${[0,90,270,180][i]})`}>
                <line x1="0" y1="0" x2="14" y2="0" stroke="#1A7AC7" strokeWidth="2" strokeLinecap="round"/>
                <line x1="0" y1="0" x2="0" y2="14" stroke="#1A7AC7" strokeWidth="2" strokeLinecap="round"/>
              </g>
            ))}
          </svg>

          {/* Error pill */}
          {active && (
            <div style={{
              position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
              background: isError ? "rgba(239,68,68,0.92)" : "rgba(34,197,94,0.92)",
              borderRadius: 20, padding: "6px 14px", zIndex: 10,
              display: "flex", alignItems: "center", gap: 6,
              animation: isError ? "errPill 0.4s ease" : "none",
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 13 }}>{isError ? "⚠️" : "✅"}</span>
              <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>
                {isError ? `纠错：${ERROR_MSGS[errIdx]}` : "动作标准！保持"}
              </span>
            </div>
          )}

          {/* Bottom badges */}
          <div style={{ position: "absolute", bottom: 10, left: 12, right: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5,
              background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "4px 8px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80",
                display: "inline-block", animation: active ? "pulse 1s infinite" : "none" }}/>
              <span style={{ fontSize: 10, color: "#4ADE80" }}>AI 实时追踪中</span>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>镜像预览已开启</span>
          </div>
        </div>

        {/* RIGHT: Reference GIF */}
        <div style={{ flex: 1, background: "#111827", display: "flex", flexDirection: "column",
          borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "10px 12px 6px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>标准动作参考</span>
          </div>

          {/* GIF area */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
            {gifSrc ? (
              <img src={gifSrc} alt={ex.name} style={{
                width: "100%", height: "100%", objectFit: "contain",
                display: "block", background: "#0D1117",
              }}/>
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#0D1117",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.2)", fontSize: 12 }}>暂无演示</div>
            )}
            {/* Subtitle overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.82))",
              padding: "20px 10px 8px",
            }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, textAlign: "center" }}>
                {ex.desc}
              </div>
            </div>
          </div>

          {/* Progress bar + controls */}
          <div style={{ padding: "8px 12px 10px", background: "#0F172A",
            borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#1A7AC7",
                borderRadius: 2, transition: "width 0.5s" }}/>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <button onClick={() => { setProgress(0); setReps(0); }} style={{
                background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
                padding: "6px 10px", cursor: "pointer", color: "white", fontSize: 14,
              }}>↺</button>
              <button onClick={startStop} style={{
                background: active ? "#EF4444" : "#1A7AC7", border: "none", borderRadius: 20,
                padding: "8px 22px", cursor: "pointer", color: "white", fontSize: 13, fontWeight: 700,
              }}>{active ? "暂停" : "开始"}</button>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
                padding: "6px 10px", color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center" }}>
                {reps}次
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating thumbnail (top-right) ── */}
      {active && gifSrc && (
        <div style={{
          position: "absolute", top: 108, right: 8, width: 64, height: 64,
          borderRadius: 10, overflow: "hidden", border: "1.5px solid rgba(74,222,128,0.5)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)", zIndex: 50,
        }}>
          <img src={gifSrc} alt="示范" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(0,0,0,0.6)", fontSize: 8, color: "white",
            textAlign: "center", padding: "2px 0" }}>示范</div>
        </div>
      )}
    </div>
  );
}

/* ─── Exercise card ──────────────────────────────────────────────────────────*/
function ExCard({ name, sets, desc, accent, light }: {
  name: string; sets: string; desc: string; accent: string; light: string;
}) {
  const [open, setOpen] = useState(false);
  const gifSrc = GIF_MAP[name];
  return (
    <div style={{ borderBottom: "1px solid #F0F0F0" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        {gifSrc ? (
          <img src={gifSrc} alt={name}
            style={{ width: "100%", height: 200, objectFit: "contain", background: "#F7F8FA", display: "block" }}/>
        ) : (
          <div style={{ height: 160, background: "#F0F4F8",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#A0AEC0", fontSize: 13 }}>{name}</div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, background: accent,
          color: "white", borderRadius: 20, padding: "3px 10px",
          fontSize: 10, fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }}>
          动作演示
        </div>
      </div>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "12px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#191919" }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: accent,
              background: light, borderRadius: 20, padding: "3px 10px" }}>{sets}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{
              transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
              <path d="M6 9l6 6 6-6" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, overflow: "hidden",
          display: "-webkit-box", WebkitLineClamp: open ? undefined : 2,
          WebkitBoxOrient: "vertical" as const }}>
          {desc}
        </div>
        {open && (
          <div style={{ marginTop: 8, background: light, borderRadius: 10,
            padding: "10px 12px", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
            {desc}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Section data ───────────────────────────────────────────────────────────*/
const SECTIONS = [
  {
    id: "w", emoji: "🔥", title: "一、热身",
    accent: "#F97316", light: "#FFF7ED", dark: "#C2410C", border: "#FDBA74",
    items: [
      { name:"转身摸臀", sets:"左右各 10 次", desc:"双脚与肩同宽，上身挺直，向后转身，用手去摸对侧臀部，左右交替各10次。" },
      { name:"后踢臀部", sets:"左右各 10 次", desc:"双脚与肩同宽，双手叉腰，脚跟向后踢臀部，左右交替各10次。" },
    ],
  },
  {
    id: "s", emoji: "💪", title: "二、强化运动",
    subtitle: "以下 4 个动作为一个循环，共做 3 个循环",
    accent: "#3B82F6", light: "#EFF6FF", dark: "#1D4ED8", border: "#93C5FD",
    items: [
      { name:"提膝碰肘", sets:"左右各 8 次 × 3 循环", desc:"双脚与肩同宽，左手扶椅，右手搭左肩，吐气收腹提左膝碰右肘，保持身体面向正前方，8次后换另外一侧。" },
      { name:"螃蟹步", sets:"左右各 4 步 × 2 组 × 3 循环", desc:"双脚与肩同宽，双手叉腰，微蹲，保持微蹲状态向左侧移4小步，再向右侧移4步，做2组。" },
      { name:"臀部找椅", sets:"8 次 × 3 循环", desc:"双脚与肩同宽，双手叉腰，站于椅前半步距离，臀部向后轻触椅子边缘后慢慢起身，做8次。膝盖不超过脚尖。" },
      { name:"站立提踵", sets:"8 次 × 3 循环", desc:"双脚与肩同宽，身体直立，双手扶椅，脚尖踮到最高再缓慢放下，做8次。" },
    ],
  },
  {
    id: "c", emoji: "🌿", title: "三、调整放松",
    accent: "#8B5CF6", light: "#F5F3FF", dark: "#5B21B6", border: "#C4B5FD",
    items: [
      { name:"快步走", sets:"快走 100 步", desc:"用最自然的状态快速走100步，保持步伐轻盈。" },
      { name:"拉伸臀部", sets:"左右各 20 秒 × 2 组", desc:"坐位，身体挺直，右侧脚踝搭在左侧大腿上，身体挺直慢慢向前倾，同时轻轻下压右侧膝盖，感觉右侧臀部被拉紧，保持20秒后换另外一侧。" },
      { name:"拉伸大腿后侧", sets:"左右各 20 秒 × 2 组", desc:"坐位，伸直右腿，勾起脚尖，身体挺直慢慢向前倾，保持膝盖伸直，感受到大腿后侧拉紧，20秒后换另外一侧。" },
      { name:"拉伸躯干", sets:"左右各 20 秒 × 2 组", desc:"坐位，身体直立，左腿搭在右腿上，身体向左转到最大范围，用左手轻扶椅背保持稳定，右手臂轻轻将大腿向后推，感受到左侧躯干有拉紧的感觉，保持20秒后换另外一侧。" },
    ],
  },
];

/* ─── Main page ──────────────────────────────────────────────────────────────*/
export function TrainingPage() {
  const [open, setOpen] = useState(new Set(["w"]));
  const [showAssess, setShowAssess] = useState(false);
  const toggle = (id: string) => setOpen(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#F7F8FA" }}>
      <style>{ANIM_CSS}</style>

      {showAssess && <RealtimeAssessmentPage onClose={() => setShowAssess(false)}/>}

      {/* header */}
      <div style={{ background:"white", borderBottom:"1px solid #F0F0F0",
        padding:"44px 16px 12px", flexShrink:0 }}>
        <div style={{ fontSize:20, fontWeight:800, color:"#191919" }}>🏃 训练</div>
        <div style={{ fontSize:13, color:"#9CA3AF", marginTop:2 }}>每天跟练，用主动运动换取长久灵活</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 28px" }}>

        {/* today stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
          {[{icon:"🔥",v:"2/3",l:"今日循环",c:"#F97316"},{icon:"⏱",v:"18分",l:"已用时",c:"#3B82F6"},{icon:"💪",v:"32",l:"动作次数",c:"#1A7AC7"}].map(({icon,v,l,c}) => (
            <div key={l} style={{ background:"white", borderRadius:12, padding:"10px 6px",
              textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{fontSize:18,marginBottom:2}}>{icon}</div>
              <div style={{fontSize:17,fontWeight:800,color:c,lineHeight:1}}>{v}</div>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* real-time assessment entry */}
        <RealtimeAssessmentEntry onOpen={() => setShowAssess(true)}/>

        {/* exercise sections */}
        {SECTIONS.map(sec => {
          const isOpen = open.has(sec.id);
          return (
            <div key={sec.id} style={{ marginBottom:12 }}>
              <div onClick={() => toggle(sec.id)} style={{
                background: sec.light, border:`1.5px solid ${sec.border}`,
                borderRadius: isOpen ? "14px 14px 0 0" : 14, padding:"12px 16px",
                display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer",
              }}>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:sec.dark}}>{sec.emoji} {sec.title}</div>
                  {sec.subtitle && <div style={{fontSize:11,color:sec.accent,marginTop:2}}>{sec.subtitle}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,fontWeight:600,color:sec.accent,
                    background:`${sec.accent}18`,borderRadius:20,padding:"3px 9px"}}>
                    {sec.items.length} 个动作
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                    transition:"transform 0.2s", transform:isOpen?"rotate(180deg)":"none" }}>
                    <path d="M6 9l6 6 6-6" stroke={sec.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {isOpen && (
                <div style={{background:"white",borderRadius:"0 0 14px 14px",overflow:"hidden",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.06)",border:`1.5px solid ${sec.border}`,borderTop:"none"}}>
                  {sec.items.map(ex => (
                    <ExCard key={ex.name} name={ex.name} sets={ex.sets} desc={ex.desc}
                      accent={sec.accent} light={sec.light}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div style={{background:"white",borderRadius:12,padding:"12px 14px",
          fontSize:12,color:"#6B7280",lineHeight:1.7,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
          📌 <strong>训练提示：</strong>如某动作引起明显不适，请立即停止。建议每次训练前适当热身，训练后充分拉伸。
        </div>
      </div>
    </div>
  );
}
