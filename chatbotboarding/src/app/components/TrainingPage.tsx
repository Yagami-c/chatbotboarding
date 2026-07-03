import { useState } from "react";

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
@keyframes pulse    { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes scanDown { 0%{top:0} 100%{top:88%} }
@keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
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
const ASSESS_EX = ["深蹲", "直腿抬高", "踝泵运动", "上楼梯"];
const FEEDBACKS = [
  "膝盖与脚尖方向一致，保持！👍",
  "膝盖弯曲角度良好",
  "注意重心，稍向后坐",
  "动作标准，下肢力量不错！",
  "放慢速度，控制动作质量",
];

function RealtimeAssessment() {
  const [active, setActive] = useState(false);
  const [ex, setEx]         = useState(0);
  const [score, setScore]   = useState(0);
  const [reps, setReps]     = useState(0);
  const [angle, setAngle]   = useState(90);
  const [fbIdx, setFbIdx]   = useState(0);

  const startStop = () => {
    if (active) {
      setActive(false); setScore(0); setReps(0); setAngle(90);
      return;
    }
    setActive(true);
    // simulate updates via CSS + periodic state changes (no RAF)
    let n = 0;
    const iv = setInterval(() => {
      n++;
      setScore(s => Math.min(100, s + Math.floor(Math.random() * 4)));
      setAngle(Math.floor(65 + Math.abs(Math.sin(n * 0.5)) * 40));
      if (n % 4 === 0) { setReps(r => r + 1); setFbIdx(i => (i + 1) % FEEDBACKS.length); }
      if (n > 120) clearInterval(iv);
    }, 900);
  };

  return (
    <div style={{ background: "white", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 2px 14px rgba(0,0,0,0.09)", border: "1px solid #E0EFE6" }}>

      {/* header */}
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E293B,#0F3460)",
        padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block",
            background: active ? "#4ADE80" : "#6B7280",
            animation: active ? "pulse 1.2s infinite" : "none" }}/>
          <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>实时动作测评</span>
          {active && <span style={{ fontSize: 10, color: "#4ADE80",
            background: "rgba(74,222,128,0.15)", borderRadius: 20, padding: "2px 8px" }}>AI 分析中</span>}
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>香港理工大学 · 动作识别</span>
      </div>

      {/* camera view */}
      <div style={{ position: "relative", background: "#0D1117", height: 186 }}>
        {active && <div style={{ position: "absolute", left: 0, right: 0, height: 2, zIndex: 2,
          background: "linear-gradient(90deg,transparent,#4ADE80,transparent)",
          animation: "scanDown 2s linear infinite" }}/>}

        <svg width="100%" height="186" viewBox="0 0 360 186" style={{ position: "absolute", inset: 0 }}>
          {/* grid */}
          {active && [72,144,216,288].map(x =>
            <line key={x} x1={x} y1="0" x2={x} y2="186" stroke="rgba(74,222,128,0.07)" strokeWidth="1"/>
          )}
          {active && [46,93,140,187].map(y =>
            <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="rgba(74,222,128,0.07)" strokeWidth="1"/>
          )}
          {/* skeleton */}
          <g opacity={active ? 1 : 0.3}>
            <line x1="150" y1="22" x2="150" y2="56" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="150" y1="56" x2="130" y2="74" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
            <line x1="150" y1="56" x2="170" y2="74" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
            <line x1="150" y1="56" x2="137" y2={80 + (active ? angle * 0.12 : 0)}
              stroke="#4ADE80" strokeWidth="3" strokeLinecap="round"/>
            <line x1="150" y1="56" x2="163" y2={80 + (active ? angle * 0.12 : 0)}
              stroke="#4ADE80" strokeWidth="3" strokeLinecap="round"/>
            <line x1="137" y1={80 + (active ? angle * 0.12 : 0)} x2="132" y2="118"
              stroke="#4ADE80" strokeWidth="3" strokeLinecap="round"/>
            <line x1="163" y1={80 + (active ? angle * 0.12 : 0)} x2="168" y2="118"
              stroke="#4ADE80" strokeWidth="3" strokeLinecap="round"/>
            {/* joints */}
            {[{x:150,y:14,r:8},{x:150,y:56},{x:130,y:74},{x:170,y:74},
              {x:137,y:80+(active?angle*0.12:0)},{x:163,y:80+(active?angle*0.12:0)},
              {x:132,y:118},{x:168,y:118}].map(({x,y,r=5},i) =>
              <circle key={i} cx={x} cy={y} r={r} fill="#1A7AC7" stroke="#4ADE80" strokeWidth="1.5"/>
            )}
            {/* knee angle */}
            {active && <>
              <path d={`M 124 ${74} A 13 13 0 0 1 ${124+14} ${80+angle*0.12}`}
                fill="none" stroke="#FCD34D" strokeWidth="2" opacity="0.9"/>
              <text x="107" y={80+angle*0.12} fontSize="10" fill="#FCD34D" fontWeight="bold">{angle}°</text>
            </>}
          </g>
          {/* corner brackets */}
          {[[28,20],[282,20],[28,162],[282,162]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x},${y}) rotate(${[0,90,270,180][i]})`}>
              <line x1="0" y1="0" x2="16" y2="0" stroke="#1A7AC7" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="0" y1="0" x2="0" y2="16" stroke="#1A7AC7" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          ))}
          {/* joint labels */}
          {active && [["髋关节",150,56],["膝关节",137,80+angle*0.12],["踝关节",132,118]].map(([l,x,y]) => (
            <g key={String(l)}>
              <line x1={Number(x)+8} y1={Number(y)} x2={Number(x)+30} y2={Number(y)}
                stroke="#1A7AC7" strokeWidth="1" opacity="0.6"/>
              <text x={Number(x)+32} y={Number(y)+4} fontSize="9" fill="#4ADE80">{l}</text>
            </g>
          ))}
        </svg>

        <div style={{ position: "absolute", top: 10, right: 12,
          background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "4px 9px",
          fontSize: 10, color: active ? "#4ADE80" : "#9CA3AF",
          display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block",
            background: active ? "#1A7AC7" : "#6B7280" }}/>
          {active ? "实时检测" : "待机"}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* exercise tabs */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          {/* Gradient indicators for scroll */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 24,
            background: "linear-gradient(to right, rgba(255,255,255,0.9), transparent)",
            pointerEvents: "none", zIndex: 1
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 24,
            background: "linear-gradient(to left, rgba(255,255,255,0.9), transparent)",
            pointerEvents: "none", zIndex: 1
          }} />

          <div style={{
            display: "flex", gap: 6, overflowX: "auto",
            scrollbarWidth: "none", msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory"
          }}
            className="hide-scrollbar">
            {ASSESS_EX.map((e, i) => (
              <button key={e} onClick={() => !active && setEx(i)} style={{
                padding: "8px 18px", borderRadius: 20, border: "none", flexShrink: 0,
                cursor: active && ex !== i ? "not-allowed" : "pointer", fontSize: 13,
                fontWeight: ex === i ? 600 : 400,
                background: ex === i ? "#1A7AC7" : "#F3F4F6",
                color: ex === i ? "white" : "#374151",
                opacity: active && ex !== i ? 0.4 : 1,
                transition: "all 0.15s",
                boxShadow: ex === i ? "0 2px 8px rgba(26,122,199,0.3)" : "none",
                transform: ex === i ? "scale(1.05)" : "scale(1)",
                scrollSnapAlign: "center"
              }}>{e}</button>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 4, marginTop: 6, fontSize: 10, color: "#9CA3AF"
          }}>
            <span>←</span>
            <span>滑动选择动作</span>
            <span>→</span>
          </div>
        </div>

        {/* metrics */}
        {active && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[{l:"评分",v:`${score}`,u:"分",c:"#1A7AC7"},{l:"次数",v:`${reps}`,u:"次",c:"#3B82F6"},{l:"角度",v:`${angle}`,u:"°",c:"#F59E0B"}].map(({l,v,u,c}) => (
              <div key={l} style={{ background: "#F7F8FA", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c, lineHeight: 1 }}>
                  {v}<span style={{ fontSize: 11 }}>{u}</span>
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* feedback */}
        {active && (
          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10,
            padding: "10px 12px", marginBottom: 12, display: "flex", alignItems: "center",
            gap: 8, fontSize: 13, color: "#065F46" }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span>{FEEDBACKS[fbIdx]}</span>
          </div>
        )}

        <button onClick={startStop} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
          fontSize: 15, fontWeight: 700, color: "white", transition: "all 0.2s",
          background: active ? "linear-gradient(135deg,#EF4444,#DC2626)" : "linear-gradient(135deg,#1A7AC7,#155FA0)",
          boxShadow: active ? "0 4px 14px rgba(239,68,68,0.35)" : "0 4px 14px rgba(7,193,96,0.35)",
        }}>
          {active ? "⏹ 停止测评" : "▶ 开始实时测评"}
        </button>
        <div style={{ marginTop: 7, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
          AI 动作识别 · 香港理工大学武汉研究院提供支持
        </div>
      </div>
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
  const toggle = (id: string) => setOpen(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#F7F8FA" }}>
      <style>{ANIM_CSS}</style>

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

        {/* real-time assessment */}
        <div style={{ marginBottom:14 }}><RealtimeAssessment/></div>

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
