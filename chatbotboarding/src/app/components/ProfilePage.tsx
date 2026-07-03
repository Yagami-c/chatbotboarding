import React, { useState, useEffect, useRef } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const G = {
  primary:  "#07C160",
  dark:     "#059945",
  light:    "#E8F8F0",
  bg:       "#F4FBF7",
  text1:    "#1A3A2A",
  text2:    "#4A6A5A",
  text3:    "#8AAA9A",
  border:   "#F0F5F2",
  arrow:    "#C5D5CD",
  danger:   "#FA5151",
};

interface ProfilePageProps {
  userName?: string;
  onLogout?: () => void;
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke={G.arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:12,
      padding:"48px 16px 14px",
      background:"white",
      borderBottom:`1px solid ${G.border}`,
      flexShrink:0,
    }}>
      <button onClick={onBack} style={{background:"none",border:"none",fontSize:22,color:"#666",cursor:"pointer",lineHeight:1,padding:"2px 4px"}}>←</button>
      <span style={{fontSize:17,fontWeight:600,color:G.text1,flex:1}}>{title}</span>
    </div>
  );
}

function MenuCell({
  icon, iconBg, label, right, sub, showArrow=true, onClick,
}: {
  icon:string; iconBg:string; label:string; right?:React.ReactNode;
  sub?:string; showArrow?:boolean; onClick?:()=>void;
}) {
  return (
    <div onClick={onClick} style={{
      display:"flex",alignItems:"center",gap:14,
      padding:"0 16px",height:56,cursor:onClick?"pointer":"default",
      borderBottom:`1px solid ${G.border}`,background:"white",
    }}>
      <div style={{
        width:36,height:36,borderRadius:10,background:iconBg,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:18,flexShrink:0,
      }}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,color:G.text1,fontWeight:500}}>{label}</div>
        {sub&&<div style={{fontSize:12,color:G.text3,marginTop:1}}>{sub}</div>}
      </div>
      {right&&<div style={{fontSize:13,color:G.text3,flexShrink:0,marginRight:4}}>{right}</div>}
      {showArrow&&<Arrow/>}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background:"white",borderRadius:12,overflow:"hidden",
      boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
      margin:"0 16px 12px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Sub-pages ─────────────────────────────────────────────────────────────────

// ── OTA update states ─────────────────────────────────────────────────────────
type OtaState = "idle" | "checking" | "upToDate" | "available" | "updating" | "done" | "error";

const OTA_CHANGELOG = [
  "优化负压算法，提升治疗精准度",
  "修复偶发连接断开问题",
  "新增电量低提示功能",
  "提升蓝牙稳定性与响应速度",
];

function OtaPanel({ currentVer, onClose }: { currentVer:string; onClose:()=>void }) {
  const [state, setState] = useState<OtaState>("idle");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(""); // "下载中" | "安装中" | "验证中"
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const clearTimer = () => { if(timerRef.current) { clearInterval(timerRef.current); timerRef.current=null; } };

  const checkUpdate = () => {
    setState("checking");
    setTimeout(()=>setState("available"), 2200);
  };

  const startUpdate = () => {
    setState("updating");
    setProgress(0);
    let p = 0;
    const phases = [
      {at:0,  label:"准备中..."},
      {at:5,  label:"连接设备..."},
      {at:12, label:"下载固件包..."},
      {at:65, label:"安装固件..."},
      {at:88, label:"验证完整性..."},
      {at:96, label:"重启设备..."},
    ];
    timerRef.current = setInterval(()=>{
      p += Math.random()*3 + 0.8;
      if(p >= 100) { p=100; clearTimer(); setTimeout(()=>setState("done"),600); }
      setProgress(Math.min(100,p));
      const cur = [...phases].reverse().find(x=>p>=x.at);
      if(cur) setPhase(cur.label);
    }, 250);
  };

  useEffect(()=>()=>clearTimer(),[]);

  const newVer = "v2.2.0";

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.5)",
      display:"flex",alignItems:"flex-end"}}>
      <div style={{background:"white",width:"100%",borderRadius:"20px 20px 0 0",
        padding:"0 0 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
        {/* Handle */}
        <div style={{textAlign:"center",paddingTop:12,paddingBottom:16}}>
          <span style={{display:"inline-block",width:36,height:4,background:"#E8E8E8",borderRadius:2}}/>
        </div>

        {/* ── idle ── */}
        {state==="idle"&&(
          <div style={{padding:"0 20px"}}>
            <div style={{fontSize:17,fontWeight:700,color:G.text1,marginBottom:4}}>固件更新</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              background:G.bg,borderRadius:12,padding:"12px 16px",marginBottom:20}}>
              <div>
                <div style={{fontSize:12,color:G.text3}}>当前版本</div>
                <div style={{fontSize:16,fontWeight:700,color:G.text1,marginTop:2}}>{currentVer}</div>
              </div>
              <div style={{fontSize:12,color:G.text3}}>PAD-K200</div>
            </div>
            <button onClick={checkUpdate}
              style={{width:"100%",padding:"14px",borderRadius:10,background:G.primary,
                color:"white",fontWeight:600,fontSize:16,border:"none",cursor:"pointer",
                boxShadow:`0 4px 14px rgba(7,193,96,0.35)`}}>
              检查固件更新
            </button>
            <button onClick={onClose}
              style={{width:"100%",padding:"12px",marginTop:10,borderRadius:10,
                background:"transparent",color:G.text3,fontSize:15,border:"none",cursor:"pointer"}}>
              取消
            </button>
          </div>
        )}

        {/* ── checking ── */}
        {state==="checking"&&(
          <div style={{padding:"20px 20px 0",textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:G.light,
              display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                style={{animation:"spin 1s linear infinite"}}>
                <circle cx="16" cy="16" r="12" stroke="#E0EFE6" strokeWidth="3"/>
                <path d="M16 4 A12 12 0 0 1 28 16" stroke={G.primary} strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{fontSize:16,fontWeight:600,color:G.text1,marginBottom:6}}>正在检查更新</div>
            <div style={{fontSize:13,color:G.text3}}>连接服务器，获取最新固件信息...</div>
          </div>
        )}

        {/* ── upToDate ── */}
        {state==="upToDate"&&(
          <div style={{padding:"20px 20px 0",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:17,fontWeight:700,color:G.text1,marginBottom:6}}>已是最新版本</div>
            <div style={{fontSize:13,color:G.text3,marginBottom:24}}>当前固件 {currentVer} 已是最新</div>
            <button onClick={onClose}
              style={{width:"100%",padding:"13px",borderRadius:10,background:G.primary,
                color:"white",fontWeight:600,fontSize:15,border:"none",cursor:"pointer"}}>
              确定
            </button>
          </div>
        )}

        {/* ── available ── */}
        {state==="available"&&(
          <div style={{padding:"0 20px"}}>
            {/* Version banner */}
            <div style={{background:"linear-gradient(135deg,#07C160,#059945)",
              borderRadius:14,padding:"16px",marginBottom:16,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>新版本可用</div>
                <div style={{fontSize:24,fontWeight:800,color:"white",marginTop:2}}>{newVer}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>当前版本</div>
                <div style={{fontSize:14,color:"rgba(255,255,255,0.85)",marginTop:2}}>{currentVer}</div>
              </div>
            </div>

            {/* Changelog */}
            <div style={{fontSize:13,fontWeight:600,color:G.text1,marginBottom:10}}>更新内容</div>
            <div style={{background:G.bg,borderRadius:12,padding:"12px 14px",marginBottom:16}}>
              {OTA_CHANGELOG.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,
                  fontSize:13,color:G.text2,marginBottom:i<OTA_CHANGELOG.length-1?8:0}}>
                  <span style={{color:G.primary,flexShrink:0,marginTop:1}}>•</span>
                  <span style={{lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>

            {/* Warning note */}
            <div style={{background:"#FFFBE6",border:"1px solid #FDE68A",borderRadius:10,
              padding:"10px 12px",marginBottom:16,fontSize:12,color:"#92400E",lineHeight:1.5}}>
              ⚠️ 升级过程中请保持设备连接，约需 1-2 分钟。升级完成后设备将自动重启。
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={onClose}
                style={{flex:1,padding:"13px",borderRadius:10,background:"#F5F5F5",
                  color:G.text2,fontSize:15,fontWeight:500,border:"none",cursor:"pointer"}}>
                稍后更新
              </button>
              <button onClick={startUpdate}
                style={{flex:2,padding:"13px",borderRadius:10,background:G.primary,
                  color:"white",fontSize:15,fontWeight:600,border:"none",cursor:"pointer",
                  boxShadow:`0 4px 14px rgba(7,193,96,0.35)`}}>
                立即升级
              </button>
            </div>
          </div>
        )}

        {/* ── updating ── */}
        {state==="updating"&&(
          <div style={{padding:"0 20px"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:17,fontWeight:700,color:G.text1,marginBottom:4}}>OTA 升级中</div>
              <div style={{fontSize:13,color:G.text3}}>请勿关闭应用或断开设备</div>
            </div>

            {/* Circular progress */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{position:"relative",width:110,height:110}}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" stroke="#E0EFE6" strokeWidth="8" fill="none"/>
                  <circle cx="55" cy="55" r="46" stroke={G.primary} strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*46}`}
                    strokeDashoffset={`${2*Math.PI*46*(1-progress/100)}`}
                    style={{transition:"stroke-dashoffset 0.3s ease",transform:"rotate(-90deg)",transformOrigin:"55px 55px"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:G.primary,lineHeight:1}}>{Math.round(progress)}%</div>
                  <div style={{fontSize:10,color:G.text3,marginTop:2}}>{newVer}</div>
                </div>
              </div>
            </div>

            {/* Phase label */}
            <div style={{textAlign:"center",fontSize:14,color:G.text2,marginBottom:16,fontWeight:500}}>
              {phase}
            </div>

            {/* Step indicators */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
              {[
                {label:"下载",threshold:12},
                {label:"安装",threshold:65},
                {label:"验证",threshold:88},
                {label:"重启",threshold:96},
              ].map(({label,threshold},i)=>{
                const done = progress>=threshold;
                const active = i===0?progress>=5&&progress<12:progress>=threshold&&progress<[65,88,96,100][i];
                return (
                  <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:28,height:28,borderRadius:"50%",
                      background:done?G.primary:"#E8E8E8",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:12,color:done?"white":G.text3,fontWeight:600,
                      boxShadow:done?`0 2px 8px rgba(7,193,96,0.35)`:"none",
                      transition:"all 0.3s"}}>
                      {done?<span style={{fontSize:14}}>✓</span>:(i+1)}
                    </div>
                    <div style={{fontSize:10,color:done?G.primary:G.text3,fontWeight:done?600:400}}>{label}</div>
                  </div>
                );
              })}
            </div>

            <div style={{background:"#FFF3E0",borderRadius:10,padding:"10px 14px",
              fontSize:12,color:"#E65100",textAlign:"center"}}>
              🔒 升级过程中请勿断电或关闭蓝牙
            </div>
          </div>
        )}

        {/* ── done ── */}
        {state==="done"&&(
          <div style={{padding:"0 20px",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",
              background:"linear-gradient(135deg,#07C160,#059945)",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(7,193,96,0.4)"}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l8 8 12-16" stroke="white" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{fontSize:20,fontWeight:700,color:G.text1,marginBottom:6}}>升级成功！</div>
            <div style={{fontSize:13,color:G.text3,marginBottom:4}}>固件已更新至 {newVer}</div>
            <div style={{fontSize:12,color:G.text3,marginBottom:24}}>设备正在重启，请稍候...</div>

            <div style={{background:G.bg,borderRadius:12,padding:"12px 16px",
              display:"flex",justifyContent:"space-between",marginBottom:20}}>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:11,color:G.text3}}>更新前</div>
                <div style={{fontSize:14,fontWeight:600,color:G.text2,marginTop:2}}>{currentVer}</div>
              </div>
              <div style={{fontSize:18,color:G.text3,alignSelf:"center"}}>→</div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:G.text3}}>更新后</div>
                <div style={{fontSize:14,fontWeight:600,color:G.primary,marginTop:2}}>{newVer}</div>
              </div>
            </div>

            <button onClick={onClose}
              style={{width:"100%",padding:"14px",borderRadius:10,background:G.primary,
                color:"white",fontWeight:600,fontSize:16,border:"none",cursor:"pointer",
                boxShadow:`0 4px 14px rgba(7,193,96,0.35)`}}>
              完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DevicePage({ onBack }: { onBack:()=>void }) {
  const [showOta, setShowOta] = useState(false);
  const [connected, setConnected] = useState(true);
  const currentFirmware = "v2.1.4";

  const history = [
    { date:"2024-01-15 09:30", dur:"12 分钟", status:"✅ 完成" },
    { date:"2024-01-14 21:00", dur:"8 分钟",  status:"⏸ 中断" },
    { date:"2024-01-14 09:15", dur:"15 分钟", status:"✅ 完成" },
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg,position:"relative"}}>
      <SubHeader title="设备管理" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>
        <Card>
          <div style={{padding:"16px",borderBottom:`1px solid ${G.border}`}}>
            {/* Device header */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:52,height:52,borderRadius:14,
                background:"linear-gradient(135deg,#E8F8EF,#C8F0DC)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🦵</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:600,color:G.text1}}>智能膝关节康养仪 PAD</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <span style={{width:8,height:8,borderRadius:"50%",
                    background:connected?G.primary:"#BDBDBD",display:"inline-block"}}/>
                  <span style={{fontSize:13,color:connected?G.primary:G.text3}}>
                    {connected?"已连接":"未连接"}
                  </span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {l:"🔋 电量",   v:"85%",          color:"#07C160"},
                {l:"固件版本", v:currentFirmware, color:G.text1},
                {l:"设备型号", v:"PAD-K200",       color:G.text1},
                {l:"序列号",   v:"PAD-2024-001234",color:G.text1},
              ].map(({l,v,color})=>(
                <div key={l} style={{background:G.bg,borderRadius:10,padding:"10px 12px"}}>
                  <div style={{fontSize:11,color:G.text3,marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10,padding:"14px 16px"}}>
            <button onClick={()=>setConnected(v=>!v)}
              style={{flex:1,padding:"11px",borderRadius:10,
                border:`1px solid ${G.border}`,background:"white",
                color:connected?"#FA5151":G.primary,fontSize:14,cursor:"pointer",fontWeight:500}}>
              {connected?"断开连接":"重新连接"}
            </button>
            <button onClick={()=>setShowOta(true)}
              style={{flex:1.5,padding:"11px",borderRadius:10,border:"none",
                background:G.primary,color:"white",fontSize:14,fontWeight:600,cursor:"pointer",
                boxShadow:`0 3px 12px rgba(7,193,96,0.35)`,
                display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v14M6 10l6-8 6 8M5 20h14" stroke="white" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              检查固件更新
            </button>
          </div>
        </Card>

        {/* Firmware info card */}
        <Card style={{padding:"14px 16px"}}>
          <div style={{fontSize:14,fontWeight:600,color:G.text1,marginBottom:10}}>固件信息</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {l:"当前版本", v:currentFirmware},
              {l:"发布日期", v:"2024-01-10"},
              {l:"校验码",   v:"SHA256: a3f8c2...d91b"},
              {l:"OTA 通道", v:"稳定版（Stable）"},
            ].map(({l,v})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",
                padding:"6px 0",borderBottom:`1px solid ${G.border}`}}>
                <span style={{fontSize:13,color:G.text3}}>{l}</span>
                <span style={{fontSize:13,color:G.text1,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Connection history */}
        <Card>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${G.border}`}}>
            <div style={{fontSize:15,fontWeight:600,color:G.text1}}>连接记录</div>
          </div>
          {history.map((h,i)=>(
            <div key={i} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"12px 16px",
              borderBottom:i<history.length-1?`1px solid ${G.border}`:"none",
            }}>
              <div>
                <div style={{fontSize:13,color:G.text1}}>{h.date}</div>
                <div style={{fontSize:12,color:G.text3,marginTop:2}}>使用 {h.dur}</div>
              </div>
              <span style={{fontSize:12,color:G.text2}}>{h.status}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* OTA panel overlay */}
      {showOta&&<OtaPanel currentVer={currentFirmware} onClose={()=>setShowOta(false)}/>}
    </div>
  );
}

// ── Records Page — 康养记录 ────────────────────────────────────────────────────

const HISTORY_RECORDS = [
  {
    id:1, date:"2024-01-15", weekday:"周一",
    plan:"7天康复计划 · Day 3", type:"日常训练",
    duration:12, level:"L2 温和", completed:true, pain:2,
    note:"感觉比昨天轻松，坚持！",
  },
  {
    id:2, date:"2024-01-14", weekday:"周日",
    plan:"7天康复计划 · Day 2", type:"日常训练",
    duration:8, level:"L2 温和", completed:false, pain:3,
    note:"",
  },
  {
    id:3, date:"2024-01-13", weekday:"周六",
    plan:"7天康复计划 · Day 1", type:"初始评估",
    duration:15, level:"L1 舒缓", completed:true, pain:3,
    note:"第一次使用，有些不适应",
  },
  {
    id:4, date:"2024-01-10", weekday:"周三",
    plan:"体验训练", type:"快速训练",
    duration:10, level:"L2 温和", completed:true, pain:null,
    note:"",
  },
  {
    id:5, date:"2024-01-08", weekday:"周一",
    plan:"体验训练", type:"快速训练",
    duration:5, level:"L1 舒缓", completed:false, pain:null,
    note:"",
  },
];

type RecordDetail = typeof HISTORY_RECORDS[0] | null;

function RecordsPage({ onBack }: { onBack:()=>void }) {
  const [detail, setDetail] = useState<RecordDetail>(null);
  const [filter, setFilter] = useState<"all"|"done"|"partial">("all");

  const filtered = HISTORY_RECORDS.filter(r=>
    filter==="all" ? true : filter==="done" ? r.completed : !r.completed
  );

  // Stats
  const totalSessions = HISTORY_RECORDS.length;
  const doneSessions  = HISTORY_RECORDS.filter(r=>r.completed).length;
  const totalMins     = HISTORY_RECORDS.reduce((s,r)=>s+r.duration,0);

  if (detail) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg}}>
      <SubHeader title="训练详情" onBack={()=>setDetail(null)}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>
        {/* Date banner */}
        <div style={{
          margin:"0 16px 12px",borderRadius:16,
          background:detail.completed
            ?"linear-gradient(135deg,#07C160,#059945)"
            :"linear-gradient(135deg,#F59E0B,#D97706)",
          padding:"20px 20px",
        }}>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginBottom:4}}>{detail.weekday} · {detail.date}</div>
          <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:2}}>{detail.plan}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
            <span style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px",fontSize:12,color:"white"}}>
              {detail.type}
            </span>
            <span style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px",fontSize:12,color:"white"}}>
              {detail.completed?"✅ 已完成":"⏸ 未完成"}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <Card style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[
              {l:"使用时长",v:`${detail.duration} 分钟`,icon:"⏱"},
              {l:"训练强度",v:detail.level,icon:"💪"},
              {l:"不适程度",v:detail.pain!=null?`${detail.pain}/4`:"无记录",icon:"📊"},
            ].map(({l,v,icon})=>(
              <div key={l} style={{textAlign:"center",background:G.bg,borderRadius:10,padding:"12px 6px"}}>
                <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:G.text1,marginBottom:2}}>{v}</div>
                <div style={{fontSize:11,color:G.text3}}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Session timeline */}
        <Card style={{padding:"14px 16px"}}>
          <div style={{fontSize:14,fontWeight:600,color:G.text1,marginBottom:12}}>训练过程</div>
          {[
            {t:"开始连接",v:detail.date+" 09:15",done:true},
            {t:"设备启动",v:detail.level,done:true},
            {t:"训练进行",v:`持续 ${detail.duration} 分钟`,done:true},
            {t:"训练结束",v:detail.completed?"正常完成":"中途结束",done:detail.completed},
            {t:"反馈记录",v:detail.pain!=null?"已记录不适程度":"无",done:detail.pain!=null},
          ].map(({t,v,done},i,arr)=>(
            <div key={t} style={{display:"flex",gap:12,marginBottom:i<arr.length-1?12:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
                  background:done?G.primary:G.border,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,color:done?"white":G.text3,fontWeight:600}}>
                  {done?"✓":i+1}
                </div>
                {i<arr.length-1&&<div style={{width:2,height:20,background:G.border,marginTop:2}}/>}
              </div>
              <div style={{paddingTop:1}}>
                <div style={{fontSize:13,fontWeight:500,color:G.text1}}>{t}</div>
                <div style={{fontSize:12,color:G.text3,marginTop:1}}>{v}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Note */}
        {detail.note&&(
          <Card style={{padding:"14px 16px"}}>
            <div style={{fontSize:13,fontWeight:600,color:G.text1,marginBottom:6}}>备注</div>
            <div style={{fontSize:14,color:G.text2,lineHeight:1.6,background:G.bg,borderRadius:10,padding:"10px 12px"}}>
              "{detail.note}"
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg}}>
      <SubHeader title="康养记录" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>

        {/* Summary stats */}
        <div style={{margin:"0 16px 12px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {v:String(totalSessions),l:"总次数",color:G.primary},
            {v:String(doneSessions), l:"已完成",color:"#3B82F6"},
            {v:`${totalMins}m`,      l:"总时长",color:"#F59E0B"},
          ].map(({v,l,color})=>(
            <div key={l} style={{background:"white",borderRadius:12,padding:"12px 8px",textAlign:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:20,fontWeight:700,color}}>{v}</div>
              <div style={{fontSize:11,color:G.text3,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:"flex",gap:0,margin:"0 16px 12px",
          background:G.bg,borderRadius:10,padding:3,border:`1px solid ${G.border}`}}>
          {([["all","全部"],["done","已完成"],["partial","未完成"]] as const).map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              style={{flex:1,padding:"7px",borderRadius:8,border:"none",cursor:"pointer",
                fontSize:13,fontWeight:filter===v?600:400,
                background:filter===v?"white":"transparent",
                color:filter===v?G.text1:G.text3,
                boxShadow:filter===v?"0 1px 3px rgba(0,0,0,0.1)":"none",
                transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Records list */}
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"48px 0",color:G.text3}}>
            <div style={{fontSize:40,marginBottom:12}}>📭</div>
            <div style={{fontSize:14}}>暂无记录</div>
          </div>
        ):(
          <Card>
            {filtered.map((r,i)=>(
              <div key={r.id} onClick={()=>setDetail(r)}
                style={{
                  display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
                  borderBottom:i<filtered.length-1?`1px solid ${G.border}`:"none",
                  cursor:"pointer",
                }}>
                {/* Date badge */}
                <div style={{
                  width:44,height:48,borderRadius:10,flexShrink:0,textAlign:"center",
                  background:r.completed?G.light:"#FEF3C7",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  gap:1,
                }}>
                  <div style={{fontSize:16,fontWeight:700,color:r.completed?G.primary:"#F59E0B",lineHeight:1}}>
                    {r.date.slice(8)}
                  </div>
                  <div style={{fontSize:10,color:r.completed?G.primary:"#F59E0B"}}>{r.weekday}</div>
                </div>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:500,color:G.text1,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {r.plan}
                    </span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:G.text3}}>
                    <span>⏱ {r.duration}分钟</span>
                    <span>·</span>
                    <span>{r.level}</span>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <span style={{
                    fontSize:11,padding:"3px 8px",borderRadius:20,fontWeight:500,
                    background:r.completed?"#E8F8EF":"#FEF3C7",
                    color:r.completed?G.primary:"#D97706",
                  }}>
                    {r.completed?"已完成":"未完成"}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke={G.text3} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </Card>
        )}

        <div style={{height:24}}/>
      </div>
    </div>
  );
}

function PointsPage({ onBack }: { onBack:()=>void }) {
  const history = [
    {delta:"+30",label:"完成Day2训练",  date:"2024-01-14"},
    {delta:"+30",label:"完成Day1训练",  date:"2024-01-13"},
    {delta:"+20",label:"完成初始评估",  date:"2024-01-13"},
    {delta:"-10",label:"兑换优惠券",    date:"2024-01-12"},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg}}>
      <SubHeader title="积分中心" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>
        {/* Balance card */}
        <div style={{
          margin:"0 16px 12px",borderRadius:16,
          background:`linear-gradient(135deg,${G.primary},${G.dark})`,
          padding:"24px 20px",textAlign:"center",
        }}>
          <div style={{fontSize:40,marginBottom:6}}>⭐</div>
          <div style={{fontSize:36,fontWeight:700,color:"white",lineHeight:1}}>400</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginTop:6}}>可用积分</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:4}}>累计获得 520 积分 · 已使用 120 积分</div>
        </div>

        {/* History */}
        <Card>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${G.border}`}}>
            <div style={{fontSize:15,fontWeight:600,color:G.text1}}>积分明细</div>
          </div>
          {history.map((h,i)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"12px 16px",borderBottom:i<history.length-1?`1px solid ${G.border}`:"none",
            }}>
              <div>
                <div style={{fontSize:14,color:G.text1}}>{h.label}</div>
                <div style={{fontSize:12,color:G.text3,marginTop:2}}>{h.date}</div>
              </div>
              <span style={{fontSize:16,fontWeight:600,color:h.delta.startsWith("+")?G.primary:G.danger}}>{h.delta}</span>
            </div>
          ))}
        </Card>

        {/* Rules */}
        <Card style={{padding:"14px 16px"}}>
          <div style={{fontSize:14,fontWeight:600,color:G.text1,marginBottom:10}}>积分规则</div>
          {[
            "完成每日训练 +30 积分",
            "完成评估 +20 积分",
            "连续打卡7天 +50 积分奖励",
            "积分可兑换康复周边、优惠券等",
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:13,color:G.text2,marginBottom:6,alignItems:"flex-start"}}>
              <span style={{color:G.primary,flexShrink:0}}>•</span>{r}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AppearancePage({ onBack }: { onBack:()=>void }) {
  const [theme,setTheme] = useState("light");
  const [color,setColor] = useState(G.primary);
  const themes=[{v:"light",l:"☀️ 浅色模式"},{v:"dark",l:"🌙 深色模式"},{v:"system",l:"⚙️ 跟随系统"}];
  const colors=["#07C160","#3B82F6","#8B5CF6","#F59E0B"];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg}}>
      <SubHeader title="外观设置" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>
        <div style={{padding:"0 16px 8px",fontSize:13,color:G.text3,fontWeight:500}}>主题模式</div>
        <Card>
          {themes.map((t,i)=>(
            <div key={t.v} onClick={()=>setTheme(t.v)} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"0 16px",height:52,cursor:"pointer",
              borderBottom:i<themes.length-1?`1px solid ${G.border}`:"none",
            }}>
              <span style={{fontSize:15,color:G.text1}}>{t.l}</span>
              {theme===t.v&&<span style={{fontSize:16,color:G.primary}}>✓</span>}
            </div>
          ))}
        </Card>

        <div style={{padding:"8px 16px",fontSize:13,color:G.text3,fontWeight:500}}>品牌色</div>
        <Card style={{padding:"16px"}}>
          <div style={{display:"flex",gap:14,justifyContent:"center"}}>
            {colors.map(c=>(
              <button key={c} onClick={()=>setColor(c)} style={{
                width:44,height:44,borderRadius:"50%",background:c,
                border:color===c?"3px solid white":"3px solid transparent",
                cursor:"pointer",
                boxShadow:color===c?`0 0 0 2.5px ${c}`:"none",
                outline:"none",
              }}/>
            ))}
          </div>
        </Card>

        <div style={{padding:"0 16px 24px"}}>
          <button style={{width:"100%",padding:"13px",borderRadius:10,border:`1px solid ${G.border}`,background:"white",color:G.text2,fontSize:15,cursor:"pointer"}}>
            恢复默认设置
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ onBack, onLogout }: { onBack:()=>void; onLogout?:()=>void }) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:G.bg}}>
      <SubHeader title="设置与关于" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 0"}}>
        <Card>
          <MenuCell icon="🔊" iconBg="#E8F4FF" label="通知设置" sub="训练提醒、康复资讯推送"/>
          <MenuCell icon="🤖" iconBg="#E8F8EF" label="智能模式" right="已开启" sub="AI全程引导"/>
          <MenuCell icon="🔒" iconBg="#F3E8FF" label="隐私设置" sub="数据授权与隐私保护"/>
          <MenuCell icon="📄" iconBg="#FEF3C7" label="用户协议"/>
          <MenuCell icon="📄" iconBg="#FFF3E8" label="隐私政策"/>
          <MenuCell icon="ℹ️" iconBg={G.bg} label="版本信息" right="v2.1.4" sub="检查更新"/>
          <MenuCell icon="📤" iconBg="#E8F4FF" label="导出数据"/>
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"0 16px",height:56,background:"white",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#FFE8E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🗑️</div>
              <div>
                <div style={{fontSize:15,color:G.text1,fontWeight:500}}>清除缓存</div>
                <div style={{fontSize:12,color:G.text3,marginTop:1}}>缓存占用 28.5 MB</div>
              </div>
            </div>
            <button style={{padding:"6px 14px",borderRadius:20,background:G.light,color:G.primary,fontSize:13,fontWeight:600,border:"none",cursor:"pointer"}}>
              清除
            </button>
          </div>
        </Card>

        <div style={{padding:"0 16px 32px"}}>
          <button onClick={onLogout} style={{
            width:"100%",padding:"14px",borderRadius:10,border:"none",cursor:"pointer",
            background:"white",color:G.danger,fontSize:15,fontWeight:500,
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
          }}>
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Logout confirm dialog ──────────────────────────────────────────────────────

function LogoutDialog({ onConfirm, onCancel }: { onConfirm:()=>void; onCancel:()=>void }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 32px"}}>
      <div style={{background:"white",borderRadius:16,overflow:"hidden",width:"100%",maxWidth:300}}>
        <div style={{padding:"24px 20px 16px",textAlign:"center"}}>
          <div style={{fontSize:18,fontWeight:700,color:G.text1,marginBottom:10}}>退出登录</div>
          <div style={{fontSize:14,color:G.text2,lineHeight:1.6}}>退出后不会删除任何数据，<br/>下次登录可继续使用。</div>
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${G.border}`}}>
          <button onClick={onCancel} style={{flex:1,padding:"14px",border:"none",background:"none",fontSize:16,color:G.text2,cursor:"pointer",borderRight:`1px solid ${G.border}`}}>
            取消
          </button>
          <button onClick={onConfirm} style={{flex:1,padding:"14px",border:"none",background:"none",fontSize:16,fontWeight:600,color:G.primary,cursor:"pointer"}}>
            确认退出
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────

type SubView = "main"|"device"|"plan"|"points"|"appearance"|"settings";

export function ProfilePage({ userName="用户", onLogout }: ProfilePageProps) {
  const [sub,setSub]   = useState<SubView>("main");
  const [showLogout,setShowLogout] = useState(false);

  const handleLogout = () => { setShowLogout(false); onLogout?.(); };

  // Render sub-pages
  if (sub==="device")     return <DevicePage onBack={()=>setSub("main")}/>;
  if (sub==="plan")       return <RecordsPage onBack={()=>setSub("main")}/>;
  if (sub==="points")     return <PointsPage onBack={()=>setSub("main")}/>;
  if (sub==="appearance") return <AppearancePage onBack={()=>setSub("main")}/>;
  if (sub==="settings")   return <SettingsPage onBack={()=>setSub("main")} onLogout={()=>setShowLogout(true)}/>;

  return (
    <div style={{flex:1,overflowY:"auto",background:G.bg}}>

      {/* ── Green header card ─── */}
      <div style={{
        background:`linear-gradient(135deg,${G.primary} 0%,${G.dark} 100%)`,
        padding:"48px 20px 0",
        position:"relative",overflow:"hidden",
      }}>
        {/* Decorative circles */}
        <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:20,right:60,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>

        {/* User row */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          {/* Avatar */}
          <div style={{
            width:64,height:64,borderRadius:"50%",
            background:"rgba(255,255,255,0.25)",
            border:"2.5px solid white",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:26,fontWeight:700,color:"white",flexShrink:0,
          }}>
            {(userName||"U").charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:600,color:"white"}}>{userName}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:3}}>会员 ID: 88472910</div>
          </div>
          <button style={{
            fontSize:13,color:"white",background:"rgba(255,255,255,0.2)",
            border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",
            display:"flex",alignItems:"center",gap:4,
          }}>
            编辑资料 <span style={{fontSize:12}}>→</span>
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          borderTop:"1px solid rgba(255,255,255,0.2)",
          paddingTop:14,paddingBottom:18,
        }}>
          {[
            {v:"400",l:"可用积分"},
            {v:"12",l:"训练天数"},
            {v:"5",l:"评估报告"},
          ].map(({v,l},i,a)=>(
            <div key={l} style={{
              textAlign:"center",
              borderRight:i<a.length-1?"1px solid rgba(255,255,255,0.2)":"none",
              padding:"0 4px",cursor:"pointer",
            }}>
              <div style={{fontSize:22,fontWeight:700,color:"white",lineHeight:1}}>{v}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{paddingTop:16}}>
        {/* ── Group 1: Device + Plan + Points ── */}
        <Card>
          <MenuCell
            icon="🔗" iconBg="#E8F8EF" label="设备管理"
            right={<span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:G.primary,display:"inline-block"}}/>已连接</span>}
            onClick={()=>setSub("device")}
          />
          {/* 康养记录已移至首页 */}
          <MenuCell icon="⭐" iconBg="#FEF3C7" label="积分中心" right="400 积分" onClick={()=>setSub("points")} showArrow/>
        </Card>

        {/* ── Group 2: Appearance + Settings ── */}
        <Card>
          <MenuCell icon="🌙" iconBg="#F3F4FF" label="外观设置" right="浅色模式" onClick={()=>setSub("appearance")}/>
          <MenuCell icon="⚙️" iconBg="#F5F5F5" label="设置与关于" onClick={()=>setSub("settings")} showArrow/>
        </Card>

        {/* ── Logout ── */}
        <div style={{padding:"0 16px 32px"}}>
          <button onClick={()=>setShowLogout(true)} style={{
            width:"100%",padding:"14px",borderRadius:10,border:"none",cursor:"pointer",
            background:"white",color:G.danger,fontSize:15,fontWeight:400,
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
          }}>
            退出登录
          </button>
        </div>
      </div>

      {showLogout&&<LogoutDialog onConfirm={handleLogout} onCancel={()=>setShowLogout(false)}/>}
    </div>
  );
}
