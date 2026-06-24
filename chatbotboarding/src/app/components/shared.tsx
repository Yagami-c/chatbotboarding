import { LEVEL_PARAMS, getLevelName, formatTime, DeviceState, HwState, LEVELS, LEVEL_DESCS } from "../types";
import { useState, useRef } from "react";

export function BtnRow({children}: {children:React.ReactNode}) {
  return <div className="flex flex-wrap gap-1.5 mt-2">{children}</div>;
}
export function Pill({label,primary,onClick}: {label:string;primary?:boolean;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className={`flex-1 min-w-[60px] px-3 py-[7px] rounded-full text-sm font-medium border-0 cursor-pointer transition-all active:scale-95
        ${primary?"bg-[#2ECC71] text-white":"bg-[#edf2f7] text-[#2d3748]"}`}>
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
  return <input {...props} className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white outline-none focus:border-[#2ECC71]" />;
}
export function SubmitBtn({label,onClick}: {label:string;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="w-full py-3 rounded-full bg-[#2ECC71] text-white font-semibold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all mt-2">
      {label}
    </button>
  );
}
export function ResultCard({children,green}: {children:React.ReactNode;green?:boolean}) {
  return (
    <div className={`rounded-2xl p-3.5 mt-1.5 border-l-4 ${green?"bg-[#f0fff4] border-[#48bb78]":"bg-[#f0fdf4] border-[#2ECC71]"}`}>
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
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-bounce"
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

  const ballBg={disconnected:"rgba(150,150,150,0.5)",idle:"rgba(46,204,113,0.65)",running:"rgba(46,204,113,0.75)",paused:"rgba(243,156,18,0.65)"}[deviceState];
  const badgeColor={disconnected:"#95A5A6",idle:"#27AE60",running:"#27AE60",paused:"#E67E22"}[deviceState];
  const statusDot={disconnected:"#BDC3C7",idle:"#2ECC71",running:"#2ECC71",paused:"#F39C12"}[deviceState];
  const statusLabel={disconnected:"未连接",idle:"已连接",running:"运行中",paused:"已暂停"}[deviceState];
  const hint={disconnected:"点击「连接」开始使用",idle:"已连接，点击「开始」启动",running:"设备运行中...",paused:"已暂停"}[deviceState];

  const IconDisconnected=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M9 5.5v5M17 5.5v5M7.5 10.5h11a2 2 0 012 2v.5a7 7 0 01-14 0v-.5a2 2 0 012-2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 18v3.5M4.5 4.5l17 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  const IconIdle=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="8.5" stroke="white" strokeWidth="1.5"/>
      <path d="M8.5 13.5l3.5 3.5 5.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const IconRunning=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{animation:"spin 2s linear infinite",display:"block"}}>
      <circle cx="13" cy="13" r="3" stroke="white" strokeWidth="1.5"/>
      <path d="M13 4.5V7M13 19v2.5M4.5 13H7M19 13h2.5M7.1 7.1l1.8 1.8M17.1 17.1l1.8 1.8M7.1 18.9l1.8-1.8M17.1 8.9l1.8-1.8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  const IconPaused=(
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="7.5" y="6.5" width="4" height="13" rx="2" fill="white"/>
      <rect x="14.5" y="6.5" width="4" height="13" rx="2" fill="white"/>
    </svg>
  );
  const icon={disconnected:IconDisconnected,idle:IconIdle,running:IconRunning,paused:IconPaused}[deviceState];

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
          background:ballBg,border:"1px solid rgba(255,255,255,0.3)",backdropFilter:"blur(8px)",
          boxShadow:dragging?"0 8px 24px rgba(46,204,113,0.5)":deviceState==="running"?"0 0 20px rgba(46,204,113,0.6),0 4px 16px rgba(46,204,113,0.3)":"0 4px 16px rgba(46,204,113,0.3)",
          zIndex:650,display:"flex",alignItems:"center",justifyContent:"center",
          cursor:dragging?"grabbing":"grab",touchAction:"none",userSelect:"none",
          transform:dragging?"scale(1.05)":"scale(1)",
          willChange:dragging?"top":"auto",
          transition:dragging?"transform 0.15s ease,box-shadow 0.2s":"transform 0.2s ease,box-shadow 0.2s ease,background 0.3s ease,top 0.15s ease"}}>
        {deviceState==="running"&&(
          <span style={{position:"absolute",inset:-8,borderRadius:"50%",border:"2px solid rgba(46,204,113,0.45)",
            animation:"ballPulse 2s ease-in-out infinite",pointerEvents:"none"}}/>
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
              <div style={{fontSize:15,fontWeight:700,color:"#27AE60"}}>{getLevelName(hwLevel)} · {LEVELS[hwLevel-1]||"温和"}</div>
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
                <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#2ECC71,#27AE60)",borderRadius:10,transition:"width 0.3s"}}/>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {deviceState==="disconnected"&&<button onClick={onConnect} style={{flex:1,height:44,borderRadius:22,background:"#2ECC71",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(46,204,113,0.3)"}}>连接设备</button>}
            {deviceState==="idle"&&<><button onClick={onStart} style={{flex:2,height:44,borderRadius:22,background:"#2ECC71",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(46,204,113,0.3)"}}>开始</button><button onClick={onReset} style={{flex:1,height:44,borderRadius:22,background:"#E0EFE6",color:"#1A3A2A",border:"none",fontWeight:600,fontSize:13,cursor:"pointer"}}>重置</button></>}
            {(deviceState==="running"||deviceState==="paused")&&<><button onClick={onTogglePause} style={{flex:1,height:44,borderRadius:22,background:deviceState==="paused"?"#2ECC71":"#F39C12",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>{deviceState==="paused"?"继续":"暂停"}</button><button onClick={onStop} style={{flex:1,height:44,borderRadius:22,background:"#E74C3C",color:"white",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>结束</button></>}
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
  {tab:"assistant",icon:"🧑‍⚕️",label:"小瑞"},{tab:"discover",icon:"✨",label:"发现"},{tab:"profile",icon:"👤",label:"我的"},
];
export function BottomNav({active,onChange}:{active:Tab;onChange:(t:Tab)=>void}) {
  return (
    <div className="flex justify-around items-center bg-white border-t border-[#e9ecf0] pt-1 pb-3 flex-shrink-0">
      {NAV_ITEMS.map(({tab,icon,label})=>(
        <button key={tab} onClick={()=>onChange(tab)}
          className={`flex flex-col items-center gap-0.5 text-[10px] border-0 bg-transparent px-2.5 py-0.5 cursor-pointer
            ${active===tab?"text-[#2ECC71] font-semibold":"text-[#8e98a3]"}`}>
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
