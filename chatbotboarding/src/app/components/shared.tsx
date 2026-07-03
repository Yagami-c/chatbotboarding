import { LEVEL_PARAMS, getLevelName, formatTime, DeviceState, LEVELS, LEVEL_DESCS, Tab } from "../types";
import { useState, useRef } from "react";

// ── WeChat Mini Program design tokens ─────────────────────────────────────────
const WX = {
  green:    "#1A7AC7",
  greenDk:  "#1570B8",
  greenLt:  "#DBEAFE",
  bg:       "#F7F8FA",
  card:     "#FFFFFF",
  border:   "#E8E8E8",
  text1:    "#191919",
  text2:    "#666666",
  text3:    "#BBBBBB",
  danger:   "#FA5151",
  warning:  "#F59E0B",
};

// ── Atoms ──────────────────────────────────────────────────────────────────────

export function BtnRow({children}: {children:React.ReactNode}) {
  return <div className="flex flex-wrap gap-2 mt-2">{children}</div>;
}

/** Chip-style selector pill — WeChat tag style */
export function Pill({label,primary,onClick}: {label:string;primary?:boolean;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      style={{
        flex:"1 0 auto",minWidth:60,
        padding:"8px 12px",borderRadius:8,
        fontSize:14,fontWeight:primary?600:400,
        background:primary?WX.green:"#F2F2F2",
        color:primary?"white":WX.text2,
        border:"none",cursor:"pointer",
        transition:"all 0.15s ease",
        outline:"none",
      }}>
      {label}
    </button>
  );
}

/** WeChat cell-style list card */
export function FormCard({children}: {children:React.ReactNode}) {
  return (
    <div style={{background:WX.card,borderRadius:12,marginTop:8,overflow:"hidden",
      border:`1px solid ${WX.border}`}}>
      {children}
    </div>
  );
}

export function FormGroup({label,children}: {label:string;children:React.ReactNode}) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:500,color:WX.text1,marginBottom:8}}>{label}</div>
      {children}
    </div>
  );
}

/** WeChat-style input field */
export function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      style={{
        width:"100%",boxSizing:"border-box",
        padding:"11px 14px",
        border:`1px solid ${WX.border}`,borderRadius:10,
        fontSize:15,color:WX.text1,background:WX.card,
        outline:"none",
        fontFamily:"inherit",
      }}
      onFocus={e=>{e.currentTarget.style.borderColor=WX.green;props.onFocus?.(e);}}
      onBlur={e=>{e.currentTarget.style.borderColor=WX.border;props.onBlur?.(e);}}
    />
  );
}

/** WeChat primary button */
export function SubmitBtn({label,onClick,disabled}: {label:string;onClick:()=>void;disabled?:boolean}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width:"100%",padding:"14px",marginTop:12,
        borderRadius:10,border:"none",cursor:disabled?"not-allowed":"pointer",
        background:disabled?"#C8C9CA":WX.green,
        color:"white",fontSize:17,fontWeight:600,
        letterSpacing:1,
        fontFamily:"inherit",
        transition:"opacity 0.15s",
      }}>
      {label}
    </button>
  );
}

/** Result / highlight card */
export function ResultCard({children,green}: {children:React.ReactNode;green?:boolean}) {
  return (
    <div style={{
      background:green?"#DBEAFE":"#EFF6FF",
      borderLeft:`4px solid ${green?"#1A7AC7":"#1A7AC7"}`,
      borderRadius:"0 12px 12px 0",
      padding:"14px",marginTop:8,
    }}>
      {children}
    </div>
  );
}

export function InfoBox({emoji,text}: {emoji:string;text:string}) {
  return (
    <div style={{
      display:"flex",alignItems:"flex-start",gap:8,
      background:"#FFFBE6",border:"1px solid #FFE58F",
      borderRadius:10,padding:"10px 12px",margin:"6px 0",
    }}>
      <span style={{flexShrink:0,fontSize:16}}>{emoji}</span>
      <span style={{fontSize:13,color:"#8C6900",lineHeight:1.5}}>{text}</span>
    </div>
  );
}

export function ThinkingDots() {
  return (
    <span style={{display:"inline-flex",gap:4,alignItems:"center",marginLeft:4}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{
          width:6,height:6,borderRadius:"50%",
          background:WX.green,
          animation:"bounce 1.4s infinite",
          animationDelay:`${[-0.32,-0.16,0][i]}s`,
          display:"inline-block",
        }}/>
      ))}
    </span>
  );
}

export function Stars({score, max=4}: {score:number; max?:number}) {
  return (
    <span>
      {Array.from({length:max}).map((_,i)=>
        <span key={i} style={{color:i<score?"#FAAD14":"#D9D9D9",fontSize:16}}>{i<score?"★":"☆"}</span>
      )}
    </span>
  );
}

// ── FloatBall Remote ──────────────────────────────────────────────────────────

// ── FloatBall — clean WeChat-native device remote ─────────────────────────────
export function FloatBall({deviceState,hwLevel,hwCycle,hwTotalCycles,hwRemaining,hwTotal,
  onConnect,onStart,onTogglePause,onStop,onReset}:{
  deviceState:DeviceState;hwLevel:number;hwCycle:number;hwTotalCycles:number;
  hwRemaining:number;hwTotal:number;
  onConnect:()=>void;onStart:()=>void;onTogglePause:()=>void;onStop:()=>void;onReset:()=>void;
}) {
  const [open,setOpen]=useState(false);
  const [posY,setPosY]=useState(340);
  const [dragging,setDragging]=useState(false);
  const ballRef=useRef<HTMLDivElement>(null);
  const dragRef=useRef({startY:0,startPosY:0,moved:false});

  const progress=hwTotal>0?Math.round(((hwTotal-hwRemaining)/hwTotal)*100):0;
  const elapsed=hwTotal-hwRemaining;
  const prm=LEVEL_PARAMS[hwLevel-1]||LEVEL_PARAMS[1];

  // State palette — each state has a distinct identity
  const STATE_CFG = {
    disconnected: { color:"#94A3B8", bg:"#F1F5F9", label:"未连接",      emoji:"🔌", hint:"点击右侧按钮连接设备" },
    idle:         { color:"#16A34A", bg:"#DCFCE7", label:"已连接·待机", emoji:"✅", hint:"设备就绪，点击「开始」启动养护" },
    running:      { color:"#FFFFFF", bg:"#2563EB", label:"运行中",      emoji:"▶️", hint:"养护进行中，请保持静止放松" },
    paused:       { color:"#92400E", bg:"#FEF3C7", label:"已暂停",      emoji:"⏸", hint:"已暂停，点击「继续」恢复" },
    stopped:      { color:"#16A34A", bg:"#DCFCE7", label:"本次完成",    emoji:"✓", hint:"本次养护已完成，记得及时反馈感受" },
  }[deviceState];
  const stateColor  = STATE_CFG.color;
  const stateBg     = STATE_CFG.bg;
  const statusLabel = STATE_CFG.label;
  const statusDot   = stateColor;
  const hint        = STATE_CFG.hint;

  const onPointerDown=(e:React.PointerEvent)=>{
    dragRef.current={startY:e.clientY,startPosY:posY,moved:false};
    ballRef.current?.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onPointerMove=(e:React.PointerEvent)=>{
    const dy=e.clientY-dragRef.current.startY;
    if(Math.abs(dy)>6){dragRef.current.moved=true;setDragging(true);}
    if(dragRef.current.moved) setPosY(Math.max(100,Math.min(680,dragRef.current.startPosY+dy)));
  };
  const onPointerUp=()=>{
    const was=dragRef.current.moved;
    dragRef.current.moved=false;setDragging(false);
    if(!was) setOpen(o=>!o);
  };

  // 3D orb gradient — each state is visually distinct
  const ballGrad = {
    disconnected: "radial-gradient(circle at 36% 28%, #CBD5E1 0%, #94A3B8 42%, #475569 100%)",
    idle:         "radial-gradient(circle at 36% 28%, #86EFAC 0%, #16A34A 42%, #166534 100%)",
    running:      "radial-gradient(circle at 36% 28%, #60A5FA 0%, #2563EB 42%, #1E40AF 100%)",
    paused:       "radial-gradient(circle at 36% 28%, #FDE68A 0%, #F59E0B 42%, #92400E 100%)",
    stopped:      "radial-gradient(circle at 36% 28%, #86EFAC 0%, #16A34A 42%, #166534 100%)",
  }[deviceState];

  const ballShadow = dragging
    ? "0 16px 36px rgba(0,0,0,0.4)"
    : deviceState === "running"
    ? "0 0 40px rgba(37,99,235,0.9), 0 0 80px rgba(37,99,235,0.6), 0 8px 28px rgba(0,0,0,0.3)"
    : deviceState === "paused"
    ? "0 0 28px rgba(245,158,11,0.7), 0 8px 22px rgba(0,0,0,0.25)"
    : deviceState === "idle" || deviceState === "stopped"
    ? "0 0 24px rgba(22,163,74,0.6), 0 8px 20px rgba(0,0,0,0.2)"
    : "0 8px 24px rgba(0,0,0,0.35)";

  const badgeCol = {
    disconnected:"#94A3B8", idle:"#16A34A", running:"#EF4444", paused:"#F59E0B", stopped:"#16A34A"
  }[deviceState];

  // Knee PAD device icon — white, always same shape, state shown by orb color
  const KneePadIcon = (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Knee cap — upper oval */}
      <ellipse cx="14" cy="10" rx="5.5" ry="5"
        stroke="rgba(255,255,255,0.92)" strokeWidth="1.6"
        fill="rgba(255,255,255,0.15)"/>
      {/* PAD device body — rounded rect below knee */}
      <rect x="8" y="15" width="12" height="7" rx="2.5"
        stroke="rgba(255,255,255,0.92)" strokeWidth="1.6"
        fill="rgba(255,255,255,0.18)"/>
      {/* Three electrode contact dots on device */}
      <circle cx="11" cy="18.5" r="1.3" fill="rgba(255,255,255,0.9)"/>
      <circle cx="14" cy="18.5" r="1.3" fill="rgba(255,255,255,0.9)"/>
      <circle cx="17" cy="18.5" r="1.3" fill="rgba(255,255,255,0.9)"/>
      {/* Therapy pulse wave below */}
      <path d="M6 24 Q8 22.5 10 24 Q12 25.5 14 24 Q16 22.5 18 24 Q20 25.5 22 24"
        stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Strap lines connecting device sides */}
      <path d="M8 17 Q5 16 6 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M20 17 Q23 16 22 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Running: pulse ring animation overlay (shown via outer div) */}
      {deviceState==="paused"&&(
        <>
          <line x1="11.5" y1="16.5" x2="11.5" y2="20.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="14.5" y1="16.5" x2="14.5" y2="20.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );

  const DisconnectedIcon = (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="10" rx="5.5" ry="5"
        stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" fill="none"/>
      <rect x="8" y="15" width="12" height="7" rx="2.5"
        stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" fill="none"
        strokeDasharray="3 2"/>
      <circle cx="11" cy="18.5" r="1.3" fill="rgba(255,255,255,0.35)"/>
      <circle cx="14" cy="18.5" r="1.3" fill="rgba(255,255,255,0.35)"/>
      <circle cx="17" cy="18.5" r="1.3" fill="rgba(255,255,255,0.35)"/>
      {/* Slash */}
      <path d="M7 7l14 14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  return (
    <>
      {open&&<div style={{position:"fixed",inset:0,zIndex:640}} onClick={()=>setOpen(false)}/>}

      {/* ── 3D orb ball ── */}
      <div ref={ballRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        style={{
          position:"absolute", right:8, top:posY-28,
          width:56, height:56, borderRadius:"50%",
          background:ballGrad,
          boxShadow:ballShadow,
          zIndex:650,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:dragging?"grabbing":"grab",
          touchAction:"none", userSelect:"none",
          transform:`scale(${dragging?1.07:1})`,
          transition:dragging?"transform 0.1s,box-shadow 0.15s":"transform 0.22s,box-shadow 0.3s,background 0.35s",
        }}>

        {/* Top-left specular highlight — key to 3D look */}
        <div style={{
          position:"absolute", top:6, left:8,
          width:22, height:11, borderRadius:"50%",
          background:"linear-gradient(145deg,rgba(255,255,255,0.72) 0%,rgba(255,255,255,0) 100%)",
          transform:"rotate(-18deg)",
          pointerEvents:"none",
        }}/>

        {/* Bottom rim shadow — gives sphere depth */}
        <div style={{
          position:"absolute", bottom:5, left:"50%", transform:"translateX(-50%)",
          width:34, height:8, borderRadius:"50%",
          background:"rgba(0,0,0,0.22)",
          filter:"blur(3px)",
          pointerEvents:"none",
        }}/>

        {/* Inner edge shine ring */}
        <div style={{
          position:"absolute", inset:1, borderRadius:"50%",
          border:"1px solid rgba(255,255,255,0.3)",
          pointerEvents:"none",
        }}/>

        {/* Pulsing outer rings */}
        {(deviceState==="running"||deviceState==="idle")&&<>
          <div style={{
            position:"absolute", inset:-8, borderRadius:"50%",
            border:`2.5px solid ${deviceState==="running"?"rgba(37,99,235,0.7)":"rgba(22,163,74,0.4)"}`,
            animation:"ballPulse 2s ease-in-out infinite",
            pointerEvents:"none",
          }}/>
          {deviceState==="running"&&<div style={{
            position:"absolute", inset:-16, borderRadius:"50%",
            border:"2px solid rgba(37,99,235,0.4)",
            animation:"ballPulse 2s ease-in-out infinite 0.5s",
            pointerEvents:"none",
          }}/>}
        </>}
        {/* Completed state — green checkmark */}
        {deviceState==="stopped"&&<div style={{
          position:"absolute", top:-6, right:-6,
          width:20, height:20, borderRadius:"50%",
          background:"#16A34A", border:"3px solid white",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, color:"white", fontWeight:"bold",
          boxShadow:"0 2px 8px rgba(22,163,74,0.4)",
          pointerEvents:"none",
        }}>✓</div>}

        {/* Device icon */}
        {deviceState==="disconnected" ? DisconnectedIcon : KneePadIcon}

        {/* Status badge */}
        <div style={{
          position:"absolute", bottom:3, right:3,
          width:13, height:13, borderRadius:"50%",
          background:badgeCol, border:"2.5px solid white",
          animation:deviceState==="running"?"badgeBreathe 1.5s ease-in-out infinite":"none",
          boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
        }}/>
      </div>

      {/* Panel — WeChat-style sidebar */}
      <div style={{
        position:"absolute",top:0,right:0,bottom:0,width:272,zIndex:660,
        background:WX.card,borderRadius:"16px 0 0 16px",
        boxShadow:"-8px 0 32px rgba(0,0,0,0.12)",
        display:"flex",flexDirection:"column",
        transform:open?"translateX(0)":"translateX(100%)",
        opacity:open?1:0,
        pointerEvents:open?"auto":"none",
        transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1),opacity 0.2s",
      }}>
        {/* Panel header */}
        <div style={{
          display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"16px 16px 12px",
          borderBottom:`1px solid ${WX.border}`,
          flexShrink:0,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:600,fontSize:16,color:WX.text1}}>设备遥控</span>
            <span style={{
              fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:20,
              background:stateBg,color:stateColor,
            }}>{STATE_CFG.emoji} {statusLabel}</span>
          </div>
          <button onClick={()=>setOpen(false)}
            style={{background:"none",border:"none",color:WX.text3,cursor:"pointer",fontSize:22,lineHeight:1,padding:"2px 6px"}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px 16px 20px"}}>
          {/* Device status cell */}
          <div style={{
            display:"flex",alignItems:"center",gap:10,
            background:WX.bg,borderRadius:10,
            padding:"12px",marginBottom:12,
          }}>
            <span style={{fontSize:24}}>🦵</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:WX.text1,fontWeight:500}}>智能膝关节康养仪 PAD</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:statusDot,display:"inline-block"}}/>
                  <span style={{fontSize:12,color:WX.text2}}>{statusLabel}</span>
                </div>
                {deviceState!=="disconnected"&&(
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    {/* Battery icon */}
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="9" rx="2" stroke={WX.text3} strokeWidth="1.2"/>
                      <rect x="1.5" y="1.5" width="11" height="7" rx="1.5"
                        fill={85>20?"#1A7AC7":"#FA5151"}/>
                      <path d="M16.5 3.5v3" stroke={WX.text3} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <span style={{fontSize:12,color:WX.text2,fontWeight:500}}>85%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mode card */}
          {deviceState!=="disconnected"&&<>
            <div style={{background:WX.greenLt,borderRadius:10,padding:"10px 12px",marginBottom:12}}>
              <div style={{fontSize:11,color:WX.text2,marginBottom:3}}>当前模式</div>
              <div style={{fontSize:15,fontWeight:600,color:WX.greenDk}}>{getLevelName(hwLevel)} · {LEVELS[hwLevel-1]||"温和"}</div>
              <div style={{fontSize:11,color:WX.text2,marginTop:2,lineHeight:1.4}}>{LEVEL_DESCS[hwLevel]}</div>
            </div>

            {/* Params 2×2 grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {l:"负压强度",v:`${prm.pressure} mmHg`},
                {l:"作用时间",v:`${prm.work} s`},
                {l:"休息间隔",v:`${prm.rest} s`},
                {l:"循环轮数",v:deviceState==="idle"?`0/${prm.cycles}`:`${hwCycle}/${hwTotalCycles}`},
              ].map(({l,v})=>(
                <div key={l} style={{background:WX.bg,border:`1px solid ${WX.border}`,borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:WX.text3,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:WX.text1}}>{v}</div>
                </div>
              ))}
            </div>
          </>}

          {/* Progress bar */}
          {(deviceState==="running"||deviceState==="paused")&&<div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:WX.text2,marginBottom:6}}>
              <span>进度</span>
              <span style={{fontVariantNumeric:"tabular-nums",color:WX.text1,fontWeight:500}}>
                {formatTime(elapsed)} / {formatTime(hwTotal)}
              </span>
            </div>
            <div style={{height:6,background:WX.border,borderRadius:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background:WX.green,borderRadius:10,transition:"width 0.3s"}}/>
            </div>
          </div>}

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {deviceState==="disconnected"&&
              <button onClick={onConnect} style={btnStyle(WX.green)}>连接设备</button>}
            {deviceState==="idle"&&<>
              <button onClick={onStart} style={{...btnStyle(WX.green),flex:2}}>开始</button>
              <button onClick={onReset} style={{...btnStyle("#F2F2F2",WX.text2),flex:1}}>重置</button>
            </>}
            {(deviceState==="running"||deviceState==="paused")&&<>
              <button onClick={onTogglePause}
                style={btnStyle(deviceState==="paused"?WX.green:WX.warning)}>
                {deviceState==="paused"?"继续":"暂停"}
              </button>
              <button onClick={onStop} style={btnStyle(WX.danger)}>结束</button>
            </>}
            {deviceState==="stopped"&&
              <button onClick={onReset} style={btnStyle(WX.warning)}>🔄 重置</button>}
          </div>

          <div style={{fontSize:12,color:WX.text3,textAlign:"center"}}>{hint}</div>
        </div>
      </div>
    </>
  );
}

function btnStyle(bg:string,color="white"): React.CSSProperties {
  return {flex:1,height:44,borderRadius:8,background:bg,color,border:"none",
    fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit"};
}

// ── Bottom Nav — colorful tab icons ──────────────────────────────────────────

// Tab color palette
const TAB_COLORS = {
  home:      { active: "#FF6B35", light: "rgba(255,107,53,0.12)"  },
  training:  { active: "#3B82F6", light: "rgba(59,130,246,0.12)"  },
  assistant: { active: "#1A7AC7", light: "rgba(7,193,96,0.12)"    },
  discover:  { active: "#F59E0B", light: "rgba(245,158,11,0.12)"  },
  profile:   { active: "#8B5CF6", light: "rgba(139,92,246,0.12)"  },
};

const NAV: {tab:Tab; label:string; icon:(a:boolean)=>React.ReactNode}[] = [
  {
    // 首页 — filled house with door
    tab:"home", label:"首页",
    icon:(a)=>{
      const c = a ? TAB_COLORS.home.active : "#C2C2C2";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          {a ? (
            // active: filled
            <>
              <path d="M12 2.5L1.5 10.5h2V21h6v-6h5v6h6V10.5h2L12 2.5z"
                fill={c}/>
              <rect x="9.5" y="15" width="5" height="6" rx="1" fill="white" opacity="0.6"/>
            </>
          ) : (
            // inactive: outline
            <path d="M12 3L2 10.5h2.5V21h5.5v-5.5h4V21h5.5V10.5H22L12 3z"
              fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
          )}
        </svg>
      );
    },
  },
  {
    // 训练 — running person (标准跑步人形)
    tab:"training", label:"训练",
    icon:(a)=>{
      const c = a ? TAB_COLORS.training.active : "#C2C2C2";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* head */}
          <circle cx="15.5" cy="3.5" r="2" fill={c}/>
          {/* torso leaning forward */}
          <path d="M14 6.5L10.5 13" stroke={c} strokeWidth="2" strokeLinecap="round"/>
          {/* front leg */}
          <path d="M10.5 13L8 17.5L11 20" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* back leg */}
          <path d="M10.5 13L13 17.5L10 20.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* front arm */}
          <path d="M13 9L10 11.5L7.5 10" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* back arm */}
          <path d="M13 9L16 11.5L18.5 10.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    },
  },
  {
    tab:"assistant", label:"小瑞",
    icon:(a)=>(<XiaoRuiAvatar active={a}/>),
  },
  {
    // 发现 — binocular / compass globe
    tab:"discover", label:"发现",
    icon:(a)=>{
      const c = a ? TAB_COLORS.discover.active : "#C2C2C2";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5"
            stroke={c} strokeWidth="1.8"
            fill={a ? "rgba(245,158,11,0.08)" : "none"}/>
          {/* horizontal equator */}
          <path d="M2.5 12h19" stroke={c} strokeWidth="1.4" strokeDasharray="2 2"/>
          {/* globe meridian */}
          <ellipse cx="12" cy="12" rx="4.5" ry="9.5" stroke={c} strokeWidth="1.4"/>
          {/* compass N dot */}
          <circle cx="12" cy="3.5" r="1.2" fill={c}/>
        </svg>
      );
    },
  },
  {
    // 我的 — person silhouette
    tab:"profile", label:"我的",
    icon:(a)=>{
      const c = a ? TAB_COLORS.profile.active : "#C2C2C2";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          {a ? (
            // active: filled silhouette
            <>
              <circle cx="12" cy="7.5" r="4" fill={c}/>
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" fill={c} opacity="0.85"/>
            </>
          ) : (
            // inactive: outline
            <>
              <circle cx="12" cy="7.5" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
              <path d="M4.5 21c0-4 3.4-7 7.5-7s7.5 3 7.5 7"
                stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            </>
          )}
        </svg>
      );
    },
  },
];

/** 小瑞 3D avatar for the center tab */
function XiaoRuiAvatar({ active }: { active: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", position: "relative",
      transition: "transform 0.2s ease",
      transform: active ? "scale(1.08)" : "scale(1)",
    }}>
      {/* Outer glow ring when active */}
      {active && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          background: "rgba(7,193,96,0.18)", zIndex: 0,
        }}/>
      )}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: "relative", zIndex: 1 }}>
        {/* Body — 3D green sphere */}
        <defs>
          <radialGradient id="avatarBg" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#4DEBA0"/>
            <stop offset="45%" stopColor="#1A7AC7"/>
            <stop offset="100%" stopColor="#04874A"/>
          </radialGradient>
          <radialGradient id="avatarSheen" cx="40%" cy="25%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF0E0"/>
            <stop offset="100%" stopColor="#FFD6A5"/>
          </radialGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.25)"/>
          </filter>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="16" cy="30" rx="8" ry="2" fill="rgba(0,0,0,0.12)"/>

        {/* Main sphere */}
        <circle cx="16" cy="15" r="13" fill="url(#avatarBg)" filter="url(#softShadow)"/>

        {/* Top-left specular highlight */}
        <ellipse cx="11" cy="9" rx="5" ry="3.5" fill="url(#avatarSheen)" opacity="0.9"/>

        {/* Doctor cap (white cap with green cross) */}
        <rect x="8" y="5" width="16" height="7" rx="3" fill="white" opacity="0.96"/>
        <rect x="14.5" y="6.5" width="3" height="4" rx="1" fill="#1A7AC7"/>
        <rect x="13" y="8" width="6" height="1.5" rx="0.75" fill="#1A7AC7"/>

        {/* Face */}
        <circle cx="16" cy="17" r="7" fill="url(#faceGrad)"/>

        {/* Eyes */}
        <ellipse cx="13.2" cy="16.2" rx="1.3" ry="1.6" fill="#2D1B00"/>
        <ellipse cx="18.8" cy="16.2" rx="1.3" ry="1.6" fill="#2D1B00"/>
        {/* Eye shine */}
        <circle cx="13.8" cy="15.5" r="0.55" fill="white"/>
        <circle cx="19.4" cy="15.5" r="0.55" fill="white"/>

        {/* Smile */}
        <path d="M12.5 19.2 Q16 21.8 19.5 19.2" stroke="#2D1B00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

        {/* Rosy cheeks */}
        <circle cx="11.5" cy="18.5" r="1.8" fill="rgba(255,140,120,0.35)"/>
        <circle cx="20.5" cy="18.5" r="1.8" fill="rgba(255,140,120,0.35)"/>

        {/* Stethoscope */}
        <path d="M11 22 Q9 25 11 26 Q13 27 13 25 Q13 23 15 23" stroke="#1A7AC7" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <circle cx="15" cy="23" r="1.2" fill="#1A7AC7" opacity="0.85"/>
      </svg>
    </div>
  );
}

export function BottomNav({active,onChange}:{active:Tab;onChange:(t:Tab)=>void}) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-around", alignItems:"stretch",
      background: WX.card,
      borderTop: `1px solid ${WX.border}`,
      flexShrink: 0,
      paddingBottom: "max(env(safe-area-inset-bottom,0px),6px)",
    }}>
      {NAV.map(({tab,label,icon})=>{
        const a = active===tab;
        const col = TAB_COLORS[tab].active;
        const isCenter = tab==="assistant";
        return (
          <button key={tab} onClick={()=>onChange(tab)}
            style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center",
              gap: isCenter ? 2 : 4,
              paddingTop: isCenter ? 6 : 8,
              paddingBottom: isCenter ? 6 : 8,
              border:"none", cursor:"pointer",
              background: a ? TAB_COLORS[tab].light : "transparent",
              borderTop: `2.5px solid ${a ? col : "transparent"}`,
              transition:"all 0.18s ease",
              position:"relative",
            }}>
            {icon(a)}
            <span style={{
              fontSize: 10,
              fontWeight: a ? 700 : 400,
              color: a ? col : "#BDBDBD",
              transition:"color 0.18s",
              letterSpacing: a ? 0.2 : 0,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Survey Modal — WeChat bottom sheet ────────────────────────────────────────

export function SurveyModal({open,title,onClose,children}:{
  open:boolean;title:string;onClose:()=>void;children:React.ReactNode;
}) {
  return (
    <>
      {open&&(
        <div style={{
          position:"absolute",inset:0,zIndex:700,
          background:"rgba(0,0,0,0.45)",
        }} onClick={onClose}/>
      )}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:710,
        background:WX.card,borderRadius:"20px 20px 0 0",
        padding:"0 0 24px",maxHeight:"86%",overflowY:"auto",
        boxShadow:"0 -4px 24px rgba(0,0,0,0.10)",
        transform:open?"translateY(0)":"translateY(100%)",
        opacity:open?1:0,
        transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1),opacity 0.2s",
        pointerEvents:open?"auto":"none",
      }}>
        {/* Handle */}
        <div style={{textAlign:"center",paddingTop:10,paddingBottom:4}}>
          <span style={{display:"inline-block",width:36,height:4,background:WX.border,borderRadius:2}}/>
        </div>
        {/* Header */}
        {title&&(
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"10px 16px 12px",
            borderBottom:`1px solid ${WX.border}`,
          }}>
            <span style={{fontSize:17,fontWeight:600,color:WX.text1}}>{title}</span>
            <button onClick={onClose}
              style={{background:"none",border:"none",color:WX.text3,cursor:"pointer",fontSize:22,lineHeight:1,padding:"2px 6px"}}>✕</button>
          </div>
        )}
        <div style={{padding:"16px 16px 0"}}>
          {children}
        </div>
      </div>
    </>
  );
}
