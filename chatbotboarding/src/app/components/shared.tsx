import { LEVEL_PARAMS, getLevelName, formatTime, DeviceState, HwState, LEVELS, LEVEL_DESCS } from "../types";
import { useState, useRef } from "react";

export function BtnRow({children}: {children:React.ReactNode}) {
  return <div className="flex flex-wrap gap-1.5 mt-2">{children}</div>;
}
export function Pill({label,primary,onClick}: {label:string;primary?:boolean;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className={`flex-1 min-w-[60px] px-3 py-[7px] rounded-full text-sm font-medium border-0 cursor-pointer transition-all active:scale-95
        ${primary?"bg-[#07C160] text-white":"bg-[#edf2f7] text-[#2d3748]"}`}>
      {label}
    </button>
  );
}
export function FormCard({children}: {children:React.ReactNode}) {
  return <div className="bg-[#f7fafc] rounded-2xl p-3.5 mt-2 border border-[#e2e8f0]">{children}</div>;
}
export function FormGroup({label,children}: {label:string;children:React.ReactNode}) {
  return (
    <div className="mb-2.5">
      <label className="block text-[13px] font-medium text-[#2d3748] mb-1">{label}</label>
      {children}
    </div>
  );
}
export function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white outline-none focus:border-[#07C160]" />;
}
export function SubmitBtn({label,onClick}: {label:string;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="w-full py-3 rounded-full bg-[#07C160] text-white font-semibold text-sm border-0 cursor-pointer active:bg-[#06AE56] transition-all mt-2">
      {label}
    </button>
  );
}
export function ResultCard({children,green}: {children:React.ReactNode;green?:boolean}) {
  return (
    <div className={`rounded-2xl p-3.5 mt-1.5 border-l-4 ${green?"bg-[#f0fff4] border-[#48bb78]":"bg-[#f0fdf4] border-[#07C160]"}`}>
      {children}
    </div>
  );
}
export function InfoBox({emoji,text}: {emoji:string;text:string}) {
  return (
    <div className="flex items-start gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-3 py-2.5 my-1 text-sm text-[#92400e]">
      <span className="flex-shrink-0">{emoji}</span><span>{text}</span>
    </div>
  );
}
export function ThinkingDots() {
  return (
    <span className="inline-flex gap-1 items-center ml-1">
      {[0,1,2].map(i=>(
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#07C160] animate-bounce"
          style={{animationDelay:`${[-0.32,-0.16,0][i]}s`,animationDuration:"1.4s"}} />
      ))}
    </span>
  );
}
export function Stars({score, max=4}: {score:number; max?:number}) {
  return (
    <span>{Array.from({length:max}).map((_,i)=>
      <span key={i} style={{color:i<score?"#f59e0b":"#d1d5db",fontSize:16}}>{i<score?"★":"☆"}</span>
    )}</span>
  );
}

// ── Float Ball Remote ─────────────────────────────────────────────────────────

export function FloatBall({deviceState,hwLevel,hwCycle,hwTotalCycles,hwRemaining,hwTotal,
  onConnect,onStart,onTogglePause,onStop,onReset}:{
  deviceState:DeviceState;hwLevel:number;hwCycle:number;hwTotalCycles:number;
  hwRemaining:number;hwTotal:number;
  onConnect:()=>void;onStart:()=>void;onTogglePause:()=>void;onStop:()=>void;onReset:()=>void;
}) {
  const [open,setOpen]=useState(false);
  const [posY,setPosY]=useState(300);
  const [dragging,setDragging]=useState(false);
  const ballRef=useRef<HTMLDivElement>(null);
  const dragRef=useRef({startY:0,startPosY:0,moved:false});

  const progress=hwTotal>0?Math.round(((hwTotal-hwRemaining)/hwTotal)*100):0;
  const elapsed=hwTotal-hwRemaining;
  const prm=LEVEL_PARAMS[hwLevel-1]||LEVEL_PARAMS[1];

  const ballBg={
    disconnected:"linear-gradient(145deg,#b0bec5 0%,#78909c 45%,#455a64 100%)",
    idle:"linear-gradient(145deg,#a8f0cc 0%,#07C160 45%,#14532d 100%)",
    running:"linear-gradient(145deg,#7de8b8 0%,#22c55e 45%,#14532d 100%)",
    paused:"linear-gradient(145deg,#fde68a 0%,#f59e0b 45%,#78350f 100%)",
    stopped:"linear-gradient(145deg,#fde68a 0%,#fbbf24 45%,#92400e 100%)",
  }[deviceState];
  const ballShadow=dragging
    ?"inset 0 2px 5px rgba(255,255,255,0.45),0 12px 32px rgba(0,0,0,0.35),0 4px 12px rgba(7,193,96,0.3)"
    :deviceState==="running"
    ?"inset 0 2px 5px rgba(255,255,255,0.45),inset 0 -1px 3px rgba(0,0,0,0.2),0 0 28px rgba(7,193,96,0.65),0 4px 16px rgba(7,193,96,0.35),0 2px 6px rgba(0,0,0,0.2)"
    :deviceState==="paused"
    ?"inset 0 2px 5px rgba(255,255,255,0.45),inset 0 -1px 3px rgba(0,0,0,0.2),0 4px 22px rgba(243,156,18,0.55),0 2px 8px rgba(0,0,0,0.2)"
    :deviceState==="stopped"
    ?"inset 0 2px 5px rgba(255,255,255,0.45),inset 0 -1px 3px rgba(0,0,0,0.2),0 4px 24px rgba(251,191,36,0.6),0 2px 8px rgba(0,0,0,0.2)"
    :deviceState==="idle"
    ?"inset 0 2px 5px rgba(255,255,255,0.45),inset 0 -1px 3px rgba(0,0,0,0.15),0 4px 22px rgba(7,193,96,0.45),0 2px 8px rgba(0,0,0,0.18)"
    :"inset 0 2px 4px rgba(255,255,255,0.3),inset 0 -1px 3px rgba(0,0,0,0.25),0 6px 24px rgba(0,0,0,0.4),0 2px 8px rgba(0,0,0,0.2)";
  const badgeColor={disconnected:"#95A5A6",idle:"#06AE56",running:"#06AE56",paused:"#E67E22",stopped:"#F59E0B"}[deviceState];
  const statusDot={disconnected:"#BDC3C7",idle:"#07C160",running:"#07C160",paused:"#F39C12",stopped:"#FBBF24"}[deviceState];
  const statusLabel={disconnected:"未连接",idle:"已连接",running:"运行中",paused:"已暂停",stopped:"已完成"}[deviceState];
  const hint={disconnected:"点击「连接」开始使用",idle:"已连接，点击「开始」启动",running:"设备运行中...",paused:"已暂停",stopped:"本次使用已完成"}[deviceState];

  const IconDisconnected=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.4))">
      <path d="M9.5 5v5M16.5 5v5" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 10h10a1.5 1.5 0 011.5 1.5v.5A6.5 6.5 0 0113 18.5 6.5 6.5 0 016.5 12v-.5A1.5 1.5 0 018 10z" stroke="white" strokeWidth="1.6" fill="rgba(255,255,255,0.12)"/>
      <path d="M13 18.5V22" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 5l16 16" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  const IconIdle=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))">
      <circle cx="13" cy="13" r="9" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" fill="rgba(255,255,255,0.08)"/>
      <path d="M8.5 13l3.5 3.5L19 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const IconRunning=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{animation:"spin 2s linear infinite",display:"block"}} filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))">
      <circle cx="13" cy="13" r="3.5" fill="rgba(255,255,255,0.9)"/>
      <circle cx="13" cy="13" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2 3"/>
      <path d="M13 4V7M13 19v3M4 13h3M19 13h3M6.5 6.5l2 2M17.5 17.5l2 2M6.5 19.5l2-2M17.5 8.5l2-2" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  const IconPaused=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))">
      <rect x="8" y="6.5" width="3.5" height="13" rx="1.75" fill="white" opacity="0.95"/>
      <rect x="14.5" y="6.5" width="3.5" height="13" rx="1.75" fill="white" opacity="0.95"/>
      <rect x="8" y="6.5" width="3.5" height="4" rx="1.75" fill="rgba(255,255,255,0.5)"/>
      <rect x="14.5" y="6.5" width="3.5" height="4" rx="1.75" fill="rgba(255,255,255,0.5)"/>
    </svg>
  );
  const IconStopped=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))">
      <path d="M13 4l2.2 5.5 5.8.8-4.2 4.1 1 5.8L13 17.5l-4.8 2.7 1-5.8L5 10.3l5.8-.8z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  );
  const icon={disconnected:IconDisconnected,idle:IconIdle,running:IconRunning,paused:IconPaused,stopped:IconStopped}[deviceState];

  const onPointerDown=(e:React.PointerEvent)=>{
    dragRef.current={startY:e.clientY,startPosY:posY,moved:false};
    ballRef.current?.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onPointerMove=(e:React.PointerEvent)=>{
    const dy=e.clientY-dragRef.current.startY;
    if(Math.abs(dy)>6){dragRef.current.moved=true;setDragging(true);}
    if(dragRef.current.moved) setPosY(Math.max(80,Math.min(660,dragRef.current.startPosY+dy)));
  };
  const onPointerUp=()=>{
    const was=dragRef.current.moved;
    dragRef.current.moved=false;setDragging(false);
    if(!was) setOpen(o=>!o);
  };

  return(
    <>
      {open&&<div style={{position:"absolute",inset:0,zIndex:640,background:"rgba(0,0,0,0.2)"}} onClick={()=>setOpen(false)}/>}
      <div ref={ballRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        style={{position:"absolute",right:0,top:posY-28,width:56,height:56,borderRadius:"50%",
          background:ballBg,
          border:"1px solid rgba(255,255,255,0.45)",
          boxShadow:ballShadow,
          zIndex:650,display:"flex",alignItems:"center",justifyContent:"center",
          cursor:dragging?"grabbing":"grab",touchAction:"none",userSelect:"none",
          transform:dragging?"scale(1.08)":"scale(1)",
          willChange:dragging?"top":"auto",
          transition:dragging?"transform 0.12s ease,box-shadow 0.15s":"transform 0.2s ease,box-shadow 0.25s ease,background 0.3s ease,top 0.15s ease"}}>
        {/* inner top-left highlight — gives metallic sphere look */}
        <span style={{position:"absolute",top:5,left:7,width:22,height:11,borderRadius:"50%",
          background:"linear-gradient(175deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0) 100%)",
          pointerEvents:"none"}}/>
        {/* bottom edge rim light */}
        <span style={{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",width:28,height:6,borderRadius:"50%",
          background:"rgba(0,0,0,0.18)",pointerEvents:"none",filter:"blur(2px)"}}/>
        {deviceState==="running"&&(
          <>
            <span style={{position:"absolute",inset:-8,borderRadius:"50%",border:"2px solid rgba(7,193,96,0.45)",
              animation:"ballPulse 2s ease-in-out infinite",pointerEvents:"none"}}/>
            <span style={{position:"absolute",inset:-14,borderRadius:"50%",
              border:"2px dashed rgba(7,193,96,0.55)",
              animation:"spinRing 2s linear infinite",pointerEvents:"none"}}/>
          </>
        )}
        {icon}
        <span style={{position:"absolute",top:4,right:4,width:12,height:12,borderRadius:"50%",
          background:badgeColor,border:"2px solid white",
          animation:deviceState==="running"?"badgeBreathe 1.5s ease-in-out infinite":"none"}}/>
      </div>

      <div style={{position:"absolute",top:0,right:0,bottom:0,width:272,zIndex:660,
        background:"white",borderRadius:"20px 0 0 20px",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.15)",border:"1px solid #E0EFE6",borderRight:"none",
        display:"flex",flexDirection:"column",
        transform:open?"translateX(0)":"translateX(100%)",opacity:open?1:0,
        pointerEvents:open?"auto":"none",
        transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1),opacity 0.2s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 16px 12px",borderBottom:"1px solid #E0EFE6",flexShrink:0}}>
          <span style={{fontWeight:700,fontSize:15,color:"#1A3A2A"}}>🔧 设备遥控</span>
          <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",fontSize:20,color:"#8AAA9A",cursor:"pointer",lineHeight:1,padding:"2px 6px"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 12px",background:"#F4FBF7",borderRadius:12}}>
            <span style={{fontSize:20}}>🦵</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:"#4A6A5A",fontWeight:500}}>智能膝关节康养仪 PAD</div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:statusDot,display:"inline-block"}}/>
                <span style={{fontSize:12,color:"#4A6A5A"}}>{statusLabel}</span>
              </div>
            </div>
          </div>
          {deviceState!=="disconnected"&&(
            <div style={{background:"#F4FBF7",borderRadius:12,padding:"10px 12px",marginBottom:12}}>
              <div style={{fontSize:11,color:"#4A6A5A",marginBottom:4}}>当前模式</div>
              <div style={{fontSize:15,fontWeight:700,color:"#06AE56"}}>{getLevelName(hwLevel)} · {LEVELS[hwLevel-1]||"温和"}</div>
              <div style={{fontSize:12,color:"#6A8A7A",marginTop:3,lineHeight:1.4}}>{LEVEL_DESCS[hwLevel]}</div>
            </div>
          )}
          {deviceState!=="disconnected"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"负压强度",v:`${prm.pressure} mmHg`},{l:"作用时间",v:`${prm.work} s`},{l:"休息间隔",v:`${prm.rest} s`},{l:"循环轮数",v:deviceState==="idle"?`0/${prm.cycles}`:`${hwCycle}/${hwTotalCycles}`}].map(({l,v})=>(
                <div key={l} style={{background:"#FAFFFE",border:"1px solid #E0EFE6",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#8AAA9A",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1A3A2A"}}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {(deviceState==="running"||deviceState==="paused")&&(
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#4A6A5A",marginBottom:5}}>
                <span>⏱ 进度</span>
                <span style={{fontVariantNumeric:"tabular-nums"}}>{formatTime(elapsed)} / {formatTime(hwTotal)}</span>
              </div>
              <div style={{height:6,background:"#E0EFE6",borderRadius:10,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#07C160,#06AE56)",borderRadius:10,transition:"width 0.3s"}}/>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {deviceState==="disconnected"&&<button onClick={onConnect} style={{flex:1,height:44,borderRadius:22,background:"#07C160",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(7,193,96,0.3)"}}>连接设备</button>}
            {deviceState==="idle"&&<><button onClick={onStart} style={{flex:2,height:44,borderRadius:22,background:"#07C160",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(7,193,96,0.3)"}}>开始</button><button onClick={onReset} style={{flex:1,height:44,borderRadius:22,background:"#E0EFE6",color:"#1A3A2A",border:"none",fontWeight:600,fontSize:13,cursor:"pointer"}}>重置</button></>}
            {(deviceState==="running"||deviceState==="paused")&&<><button onClick={onTogglePause} style={{flex:1,height:44,borderRadius:22,background:deviceState==="paused"?"#07C160":"#F39C12",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>{deviceState==="paused"?"继续":"暂停"}</button><button onClick={onStop} style={{flex:1,height:44,borderRadius:22,background:"#E74C3C",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>结束</button></>}
            {deviceState==="stopped"&&<button onClick={onReset} style={{flex:1,height:44,borderRadius:22,background:"#F59E0B",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(245,158,11,0.3)"}}>🔄 重置</button>}
          </div>
          <div style={{fontSize:12,color:"#8AAA9A",textAlign:"center"}}>{hint}</div>
        </div>
      </div>
    </>
  );
}

// ── Bottom nav ─────────────────────────────────────────────────────────────────

import { Tab } from "./types";
const NAV_ITEMS:{tab:Tab;icon:string;label:string}[]=[
  {tab:"home",icon:"🏠",label:"首页"},{tab:"training",icon:"🏃",label:"训练"},
  {tab:"assistant",icon:"🤖",label:"小瑞"},{tab:"discover",icon:"✨",label:"发现"},{tab:"profile",icon:"👤",label:"我的"},
];
export function BottomNav({active,onChange}:{active:Tab;onChange:(t:Tab)=>void}) {
  return (
    <div className="flex justify-around items-center bg-white border-t border-[#e9ecf0] pt-1 flex-shrink-0"
      style={{paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)"}}>
      {NAV_ITEMS.map(({tab,icon,label})=>(
        <button key={tab} onClick={()=>onChange(tab)}
          className={`flex flex-col items-center gap-0.5 text-[10px] border-0 px-2.5 py-0.5 cursor-pointer transition-all
            ${active===tab && tab!=="assistant" ?"text-[#07C160] font-semibold transform scale-110":""}
            ${tab!=="assistant" && active!==tab ?"text-[#8e98a3] bg-transparent":""}
            ${tab==="assistant"?"relative -translate-y-2":""}`}
          style={tab==="assistant" ? {
            background: active===tab
              ? "linear-gradient(145deg, #07C160 0%, #06AE56 100%)"
              : "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
            color: active===tab ? "white" : "#07C160",
            borderRadius: "20px",
            padding: "8px 16px",
            boxShadow: active===tab
              ? "0 8px 24px rgba(7,193,96,0.35), 0 2px 8px rgba(7,193,96,0.2)"
              : "0 4px 14px rgba(7,193,96,0.18), 0 1px 4px rgba(7,193,96,0.1)",
            fontWeight: 600,
            border: active===tab ? "none" : "1px solid rgba(7,193,96,0.2)",
          } : {}}>
          <span className="text-[22px]">{icon}</span>{label}
        </button>
      ))}
    </div>
  );
}

// ── Survey Modal ───────────────────────────────────────────────────────────────

export function SurveyModal({open,title,onClose,children}:{open:boolean;title:string;onClose:()=>void;children:React.ReactNode}) {
  return (
    <>
      {open&&<div style={{position:"absolute",inset:0,zIndex:700,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(3px)",borderRadius:28}} onClick={onClose}/>}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:710,background:"white",borderRadius:"28px 28px 0 0",
        padding:"24px 20px 32px",maxHeight:"84%",overflowY:"auto",
        boxShadow:"0 -10px 40px rgba(0,0,0,0.12)",
        transform:open?"translateY(0)":"translateY(100%)",opacity:open?1:0,
        transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1),opacity 0.25s ease",
        pointerEvents:open?"auto":"none",
      }}>
        <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:4,margin:"0 auto 16px"}}/>
        <button onClick={onClose} style={{position:"absolute",top:16,right:20,background:"none",border:"none",fontSize:24,color:"#a0aec0",cursor:"pointer"}}>✕</button>
        {title&&<div className="text-xl font-bold text-[#1a202c] mb-4">{title}</div>}
        {children}
      </div>
    </>
  );
}
