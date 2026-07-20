import React, { useState, useEffect, useRef, useCallback } from "react";
import { AppScreen, Tab, UserData, Msg, Task, Phase, SurveyStep, HwState, DeviceState, BluetoothConnectState, PermissionStatus, BluetoothDevice, LEVEL_PARAMS, LEVELS, getLevelName, formatTime, LEVEL_DESCS } from "./types";

// ── Toast notification system ──────────────────────────────────────────────────
type ToastType = "info" | "success" | "warning" | "error";
interface Toast { id: number; message: string; type: ToastType; icon: string }
let _toastId = 0;

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, width: "calc(100% - 32px)", maxWidth: 360, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => onRemove(t.id)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", borderRadius: 12,
            background: t.type === "success" ? "#ecfdf5" : t.type === "error" ? "#fef2f2" : t.type === "warning" ? "#fffbeb" : "#eff6ff",
            border: `1px solid ${t.type === "success" ? "#86efac" : t.type === "error" ? "#fca5a5" : t.type === "warning" ? "#fcd34d" : "#93c5fd"}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            fontSize: 13, fontWeight: 500,
            color: t.type === "success" ? "#15803d" : t.type === "error" ? "#dc2626" : t.type === "warning" ? "#92400e" : "#1e40af",
            animation: "fadeUp 0.25s ease",
            pointerEvents: "auto", cursor: "pointer",
          }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const icons: Record<ToastType, string> = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, type, icon: icons[type] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  const remove = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, show, remove };
}
import { FloatBall, BtnRow, Pill, FormCard, FormGroup, StyledInput, SubmitBtn, ResultCard, InfoBox, ThinkingDots, Stars, BottomNav } from "./components/shared";
import { WeChatLogin } from "./components/WeChatLogin";
import { Onboarding } from "./components/Onboarding";
import { askDeepSeek, ChatMessage } from "./deepseek";
import { HomePage } from "./components/HomePage";
import { BluetoothConfigWizard } from "./components/BluetoothConfigWizard";
import { PermissionRequest } from "./components/PermissionRequest";

const STORAGE_USER_KEY = "chatbotboarding_userData";
const STORAGE_SMART_MODE_KEY = "chatbotboarding_smartMode";
const STORAGE_BLUETOOTH_KEY = "chatbotboarding_bluetooth";
const STORAGE_PERMISSION_KEY = "chatbotboarding_permissions";

function loadBluetoothConfig(): { connectedDevice?: BluetoothDevice; pairedDevices?: BluetoothDevice[] } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_BLUETOOTH_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadPermissionStatus(): PermissionStatus {
  if (typeof window === "undefined") return { bluetooth: "not_checked", location: "not_checked" };
  try {
    const raw = window.localStorage.getItem(STORAGE_PERMISSION_KEY);
    return raw ? JSON.parse(raw) : { bluetooth: "not_checked", location: "not_checked" };
  } catch {
    return { bluetooth: "not_checked", location: "not_checked" };
  }
}

const DEFAULT_USER_DATA: UserData = {
  name: "", gender: "", ageRange: "", duration: "",
  safety: [], stiffness: null, baseLevel: 2,
  triggers: [], mainTrigger: "",
  painLevel: 0, finalLevel: 2,
  firstTime: true,
  dailyRecords: {},
  pressure: 0, workSec: 0, restSec: 0, cycles: 0,
  dailyFeel: "",
  postUseFeel: "",
  earlyStopReason: "",
  postTrainingPain: 0,
  postTrainingStrength: 0,
  day7Trigger: "", day7Pain: 0, day7Feel: "",
  lastTrainingDate: "",
  trainingDates: [],
  sessionsToday: 0,
};

function loadUserData(): UserData {
  if (typeof window === "undefined") return DEFAULT_USER_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return DEFAULT_USER_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER_DATA, ...parsed };
  } catch {
    return DEFAULT_USER_DATA;
  }
}

function loadSmartMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_SMART_MODE_KEY);
    return raw ? JSON.parse(raw) : false;
  } catch {
    return false;
  }
}
import { ManualAssessment } from "./components/ManualAssessment";
import { QuickTraining } from "./components/QuickTraining";
import { Day7Intro } from "./components/Day7Intro";
import { TrainingPage } from "./components/TrainingPage";
import { DiscoverPage } from "./components/DiscoverPage";
import { ProfilePage } from "./components/ProfilePage";
import { COLORS, DESIGN } from "./design-system";
import gif转身摸臀 from "../assets/gifs/转身摸臀.gif";
import gif后踢臀部 from "../assets/gifs/后踢臀部.gif";
import gif提膝碰肘 from "../assets/gifs/提膝碰肘.gif";
import gif螃蟹步   from "../assets/gifs/螃蟹步.gif";
import gif臀部找椅 from "../assets/gifs/臀部找椅.gif";
import gif站立提踵 from "../assets/gifs/站立提踵.gif";
import gif快步走   from "../assets/gifs/快步走.gif";
import gif拉伸臀部 from "../assets/gifs/拉伸臀部.gif";
import gif拉伸大腿后侧 from "../assets/gifs/拉伸大腿后侧.gif";
import gif拉伸躯干 from "../assets/gifs/拉伸躯干.gif";

const EXERCISE_GIF: Record<string, string> = {
  "转身摸臀": gif转身摸臀, "后踢臀部": gif后踢臀部, "提膝碰肘": gif提膝碰肘,
  "螃蟹步": gif螃蟹步, "臀部找椅": gif臀部找椅, "站立提踵": gif站立提踵,
  "快步走": gif快步走, "拉伸臀部": gif拉伸臀部, "拉伸大腿后侧": gif拉伸大腿后侧,
  "拉伸躯干": gif拉伸躯干,
};

// ── Constants ─────────────────────────────────────────────────────────────────

const LEVEL_NAMES: Record<number,string> = {1:"L1（低）",2:"L2（中低）",3:"L3（中）",4:"L4（中高）",5:"L5（高）",6:"L6（最高）"};

const DAY1_TASKS: Task[] = [
  {title:"👋 认识你",desc:"了解基本情况"},{title:"🎯 生成方案",desc:"推荐适合强度"},
  {title:"💪 开始体验",desc:"陪你用一遍"},{title:"📝 记录感受",desc:"反馈今天怎样"},{title:"🔄 下次调参",desc:"根据反馈优化"},
];
const DAILY_TASKS: Task[] = [
  {title:"👋 晨间聊天",desc:"今天怎么样"},{title:"🎯 生成方案",desc:"根据反馈调整"}, 
  {title:"💪 开始体验",desc:"陪你用一遍"},{title:"📝 记录成果",desc:"完成度如何"},{title:"🔄 持续优化",desc:"下次更好用"},
];
const DAY7_TASKS: Task[] = [
  {title:"📊 阶段回顾",desc:"7天变化总结"},{title:"🎯 效果对比",desc:"与开始时对比"},
  {title:"🚀 下阶段方案",desc:"继续进阶"},
];

// ── Task breakdown ─────────────────────────────────────────────────────────────

function TaskBreakdown({tasks,current,deviceRunning}: {tasks:Task[];current:number;deviceRunning?:boolean}) {
  if(!tasks.length) return null;
  const cur=tasks[current];
  const next=tasks[current+1];
  return (
    <div className="bg-[#f8fafc] px-4 py-2.5 border-b border-[#edf2f7] flex-shrink-0 flex items-center gap-3">
      {/* progress dots */}
      <div className="flex gap-1 flex-shrink-0">
        {tasks.map((_,i)=>(
          <span key={i} className={`rounded-full transition-all duration-300 ${i<current?"w-1.5 h-1.5 bg-[#1A7AC7]":i===current?"w-2.5 h-2.5 bg-[#1A7AC7]":"w-1.5 h-1.5 bg-[#e2e8f0]"}`}/>
        ))}
      </div>
      {/* current */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold bg-[#1A7AC7] text-white
          ${deviceRunning?"shadow-[0_0_0_3px_rgba(7,193,96,0.3)] animate-[taskPulse_1.5s_ease-in-out_infinite]":""}`}>
          {deviceRunning?(
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{animation:"spin 1.4s linear infinite",display:"block"}}>
              <circle cx="6.5" cy="6.5" r="2" stroke="white" strokeWidth="1.2"/>
              <path d="M6.5 1.5V3M6.5 10V11.5M1.5 6.5H3M10 6.5H11.5M3.2 3.2l1 1M8.8 8.8l1 1M3.2 9.8l1-1M8.8 4.2l1-1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          ):"⏳"}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[#1a202c] truncate">{cur?.title}</div>
          <div className="text-[10px] text-[#a0aec0] truncate">{cur?.desc}</div>
        </div>
      </div>
      {/* next */}
      {next&&<>
        <span className="text-[#cbd5e1] text-sm flex-shrink-0">→</span>
        <div className="flex items-center gap-1.5 min-w-0 opacity-50">
          <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] bg-[#e2e8f0] text-[#a0aec0]">⏸</span>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#4a5568] truncate">{next.title}</div>
            <div className="text-[10px] text-[#a0aec0] truncate">{next.desc}</div>
          </div>
        </div>
      </>}
    </div>
  );
}

// ── Survey forms ───────────────────────────────────────────────────────────────

function NewUserSurvey({onDone,onSkip,prefill}:{onDone:(n:string,g:string,a:string,d:string)=>void;onSkip?:()=>void;prefill?:{name?:string;gender?:string;ageRange?:string}}) {
  const [name,setName]=useState(prefill?.name||"");const [g,setG]=useState(prefill?.gender||"");const [a,setA]=useState(prefill?.ageRange||"");const [d,setD]=useState("");
  const filledCount = [name.trim(), g, a, d].filter(Boolean).length;
  return (
    <div>
      {(prefill?.name||prefill?.gender||prefill?.ageRange) && (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3 mb-4 text-sm text-[#1e40af] flex items-start gap-2">
          <span className="text-lg">✓</span>
          <div>
            <div className="font-medium">系统已为你恢复之前的信息</div>
            <div className="text-xs text-[#1856bf] mt-1">保留了你上次输入的资料，可以直接继续或修改</div>
          </div>
        </div>
      )}
      <FormGroup label="昵称是什么？"><StyledInput value={name} onChange={e=>setName(e.target.value)} placeholder="比如：小王、康康"/></FormGroup>
      <FormGroup label="性别"><BtnRow><Pill label="👨 男" primary={g==="男"} onClick={()=>setG("男")}/><Pill label="👩 女" primary={g==="女"} onClick={()=>setG("女")}/></BtnRow></FormGroup>
      <FormGroup label="年龄段"><BtnRow>{["40岁以下","40-60岁","60岁以上"].map(v=><Pill key={v} label={v} primary={a===v} onClick={()=>setA(v)}/>)}</BtnRow></FormGroup>
      <FormGroup label="膝盖最近怎样？"><BtnRow>{["刚开始不舒服","已有一段时间了","基本没问题"].map(v=><Pill key={v} label={v} primary={d===v} onClick={()=>setD(v)}/>)}</BtnRow></FormGroup>
      <div className="mb-3 text-xs text-[#6b7280]">
        完成进度：{filledCount} / 4
      </div>
      <div className="space-y-2">
        <SubmitBtn label={filledCount === 4 ? "全部完成 →" : "继续"} onClick={()=>{if(!name.trim()){alert("请先起个昵称");return;}if(!g){alert("请选择性别");return;}if(!a){alert("请选择年龄段");return;}if(!d){alert("请选择膝盖状况");return;}onDone(name.trim(),g,a,d);}}/>
        {onSkip && (
          <button type="button" onClick={onSkip} className="w-full py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-sm font-medium text-[#4b5563] hover:bg-[#f0f4f8] transition-colors">
            ⏸️ 先不填，继续体验
          </button>
        )}
      </div>
    </div>
  );
}
function ReturnerSurvey({onDone,onSkip}:{onDone:(g:string,a:string)=>void;onSkip?:()=>void}) {
  const [g,setG]=useState("");const [a,setA]=useState("");
  return (
    <div>
      <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-3 mb-4 text-sm flex items-start gap-2">
        <span className="text-lg">👋</span>
        <div>
          <div className="font-medium text-[#15803d]">欢迎回来！</div>
          <div className="text-xs text-[#166534] mt-1">快速确认一下基本信息，我们继续坚持康养</div>
        </div>
      </div>
      <FormGroup label="性别"><BtnRow><Pill label="👨 男" primary={g==="男"} onClick={()=>setG("男")}/><Pill label="👩 女" primary={g==="女"} onClick={()=>setG("女")}/></BtnRow></FormGroup>
      <FormGroup label="年龄段"><BtnRow>{["40岁以下","40-60岁","60岁以上"].map(v=><Pill key={v} label={v} primary={a===v} onClick={()=>setA(v)}/>)}</BtnRow></FormGroup>
      <div className="space-y-2">
        <SubmitBtn label={g && a ? "开始今日康养 →" : "继续"} onClick={()=>{if(!g||!a){alert("请完整填写哦");return;}onDone(g,a);}}/>
        {onSkip && (
          <button type="button" onClick={onSkip} className="w-full py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-sm font-medium text-[#4b5563] hover:bg-[#f0f4f8] transition-colors">
            ⏸️ 先体验，之后再改
          </button>
        )}
      </div>
    </div>
  );
}
function BigOption({label,selected,onClick,multi}:{label:string;selected:boolean;onClick:()=>void;multi?:boolean}) {
  return (
    <button onClick={onClick} style={{
      width:"100%",padding:"16px 18px",marginBottom:10,borderRadius:14,
      border:`2px solid ${selected?"#1A7AC7":"#e8e8e8"}`,
      background:selected?"#EFF6FF":"#fafafa",
      textAlign:"left",cursor:"pointer",fontFamily:"inherit",
      fontSize:15,fontWeight:selected?600:400,color:selected?"#1A7AC7":"#2d3748",
      display:"flex",alignItems:"center",gap:12,
      transition:"all 0.15s ease",
      boxShadow:selected?"0 0 0 3px rgba(26,122,199,0.12)":"none",
    }}>
      <span style={{
        width:22,height:22,borderRadius:multi?6:"50%",flexShrink:0,
        border:`2px solid ${selected?"#1A7AC7":"#d0d0d0"}`,
        background:selected?"#1A7AC7":"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        {selected&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </span>
      {label}
    </button>
  );
}

function SafetySurvey({onSubmit}:{onSubmit:(v:string[])=>void}) {
  const [local,setLocal]=useState<Record<string,boolean>>({});
  const items=[{v:"受伤",l:"最近2周内膝盖有明显受伤"},{v:"肿胀",l:"膝盖明显肿胀或发热"},{v:"伤口",l:"膝盖周围有伤口或皮肤问题"},{v:"医生建议",l:"医生建议暂时不用这类设备"},{v:"显著受损",l:"最近有受伤，还有轻微肿胀"},{v:"无",l:"✅ 以上都没有，可以正常使用"}];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>确认一下，你现在是否有以下情况？</p>
      {items.map(({v,l})=>(
        <BigOption key={v} label={l} selected={!!local[v]} multi onClick={()=>setLocal(p=>({...p,[v]:!p[v]}))}/>
      ))}
      <SubmitBtn label="确定，可以开始" onClick={()=>{const vals=Object.entries(local).filter(([,v])=>v).map(([k])=>k);if(!vals.length){alert("请至少选择一项");return;}onSubmit(vals);}}/>
    </div>
  );
}
function TriggerSurvey({onSubmit}:{onSubmit:(v:string[])=>void}) {
  const [local,setLocal]=useState("");
  const items=["下蹲","上/下楼梯","久坐后站起来","长时间走路","跑步/运动","其他","基本没有"];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>最容易让膝盖不舒服的动作是？</p>
      {items.map(v=>(
        <BigOption key={v} label={v} selected={local===v} onClick={()=>{setLocal(v);}}/>
      ))}
      <SubmitBtn label="就是这个" onClick={()=>{if(!local){alert("请选择一个动作");return;}onSubmit([local]);}}/>
    </div>
  );
}
function PainSurvey({trigger,onSubmit}:{trigger:string;onSubmit:(v:number)=>void}) {
  const [val,setVal]=useState<number|null>(null);
  const opts=["没感觉 — 完全不影响","轻微 — 有点点不舒服","中等 — 明显不适","较重 — 需要慢一点","很重 — 几乎无法完成"];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>做「{trigger}」时，不舒服程度怎样？</p>
      {opts.map((l,i)=>(
        <BigOption key={i} label={l} selected={val===i} onClick={()=>setVal(i)}/>
      ))}
      <SubmitBtn label="确定" onClick={()=>{if(val===null){alert("请选择不适程度");return;}onSubmit(val);}}/>
    </div>
  );
}
function PostUseSurvey({onDone}:{onDone:(feel:string)=>void}) {
  const [val,setVal]=useState("");
  const opts=[{v:"good",l:"👍 很棒，完全没不适"},{v:"neutral",l:"😐 还好，没什么感觉"},{v:"mild",l:"🤔 有点不舒服"},{v:"skin",l:"⚠️ 膝盖周围皮肤不适"}];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>这次使用后，你感觉怎样？</p>
      {opts.map(({v,l})=>(
        <BigOption key={v} label={l} selected={val===v} onClick={()=>setVal(v)}/>
      ))}
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function StrengthSurvey({onDone}:{onDone:(strength:string)=>void}) {
  const [val,setVal]=useState("");
  const opts=[{v:"weak",l:"偏轻 — 我还能承受更强"},{v:"ok",l:"刚刚好 — 正合适"},{v:"strong",l:"有点强 — 需要降低"}];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>这个强度对你来说怎样？</p>
      {opts.map(({v,l})=>(
        <BigOption key={v} label={l} selected={val===v} onClick={()=>setVal(v)}/>
      ))}
      <div style={{marginTop:12,padding:"10px 14px",background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:12,fontSize:12,color:"#92400e"}}>
        💡 你的反馈很重要，小瑞会自动调整下次强度
      </div>
      <div style={{marginTop:12}}>
        <SubmitBtn label={val ? "记住我的感受" : "继续"} onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
      </div>
    </div>
  );
}
function DailyReasonSurvey({onDone}:{onDone:(r:string)=>void}) {
  const [reason,setReason]=useState("");
  const opts=[{v:"forgot",l:"😅 忘记了"},{v:"no_time",l:"⏰ 没有时间"},{v:"no_effect",l:"🤷 效果不明显"},{v:"discomfort",l:"😞 用着不舒服"},{v:"other",l:"📝 其他原因"}];
  return (
    <div>
      <div className="bg-[#fee2e2] border border-[#fca5a5] rounded-xl p-3 mb-4 text-sm flex items-start gap-2">
        <span className="text-lg">⚠️</span>
        <div>
          <div className="font-medium text-[#991b1b]">坚持才见效果哦</div>
          <div className="text-xs text-[#7f1d1d] mt-1">告诉我原因，我们一起来解决</div>
        </div>
      </div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>今天没完成，主要是因为？</p>
      {opts.map(({v,l})=>(
        <BigOption key={v} label={l} selected={reason===v} onClick={()=>setReason(v)}/>
      ))}
      <SubmitBtn label="记录下来" onClick={()=>{if(!reason){alert("请选择原因");return;}onDone(reason);}}/>
    </div>
  );
}
function Day7TriggerSurvey({mainTrigger,onDone}:{mainTrigger:string;onDone:(same:boolean)=>void}) {
  return (
    <div>
      <div className="bg-[#ecfdf5] rounded-xl p-3 mb-4 text-sm border border-[#86efac] flex items-start gap-2">
        <span className="text-lg">📍</span>
        <div>
          <div className="text-[#15803d] font-medium">7天前你说的是</div>
          <div className="text-[#166534] mt-1">最容易不舒服的动作：<strong>{mainTrigger}</strong></div>
        </div>
      </div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>现在还是「{mainTrigger}」最困扰你吗？</p>
      <BigOption label="✅ 还是这个" selected={false} onClick={()=>onDone(true)}/>
      <BigOption label="🔄 已经改善了" selected={false} onClick={()=>onDone(false)}/>
    </div>
  );
}
function Day7NewTriggerSurvey({onDone}:{onDone:(trigger:string)=>void}) {
  const [val,setVal]=useState("");
  const items=["下蹲","上/下楼梯","久坐后站起来","长时间走路","跑步/运动","其他","基本没有诱因"];
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>现在最容易让膝盖不舒服的是？</p>
      {items.map(v=>(
        <BigOption key={v} label={v} selected={val===v} onClick={()=>setVal(v)}/>
      ))}
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function Day7FeelSurvey({onDone}:{onDone:(feel:string)=>void}) {
  const [val,setVal]=useState("");
  return (
    <div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>这7天来，你的膝盖整体怎样了？</p>
      {[{v:"better",l:"🎉 明显改善了"},{v:"same",l:"😐 差不多"},{v:"worse",l:"📉 感觉变差了"}].map(({v,l})=>(
        <BigOption key={v} label={l} selected={val===v} onClick={()=>setVal(v)}/>
      ))}
      <SubmitBtn label="记录成果" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function Day7SkinSurvey({onDone}:{onDone:(hasSkin:boolean)=>void}) {
  return (
    <div>
      <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-xl p-3 mb-4 text-sm flex items-start gap-2">
        <span className="text-lg">🔍</span>
        <div>
          <div className="font-medium text-[#92400e]">最后一个问题</div>
          <div className="text-xs text-[#b45309] mt-1">帮助我们确保你的使用体验很好</div>
        </div>
      </div>
      <p style={{fontSize:15,color:"#4a5568",marginBottom:16,fontWeight:500}}>膝盖周围的皮肤有明显不适吗？</p>
      <BigOption label="是的，有不适" selected={false} onClick={()=>onDone(true)}/>
      <BigOption label="✅ 没有，很好" selected={false} onClick={()=>onDone(false)}/>
    </div>
  );
}

// ── Mid-session stop modal (AI mode) ─────────────────────────────────────────

function StopReasonModal({open,onClose}:{open:boolean;onClose:(reasons:string[])=>void}) {
  const [local,setLocal]=useState<Record<string,boolean>>({});
  const OPTS=[{v:"忘记了",l:"😅 忘记了"},{v:"没时间",l:"⏰ 没有时间"},{v:"效果不明显",l:"🤷 还看不出效果"},{v:"使用不舒服",l:"😞 使用不舒服"},{v:"其他",l:"📝 其他原因"}];
  if(!open) return null;
  return (
    <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
      <div className="bg-white w-full rounded-t-3xl p-6">
        <div className="text-lg font-bold text-[#1a202c] mb-1">⏹ 这次就到这儿了</div>
        <p className="text-sm text-[#4a5568] mb-4">告诉我为什么没完成吧（可多选）</p>
        {OPTS.map(({v,l})=>(
          <label key={v} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-[#2d3748] hover:bg-[#f8fafc] px-2 rounded transition-colors">
            <input type="checkbox" checked={!!local[v]} onChange={e=>setLocal(p=>({...p,[v]:e.target.checked}))} className="accent-[#1A7AC7] w-4 h-4"/>
            {l}
          </label>
        ))}
        <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-3 my-3 text-sm text-[#15803d]">
          💪 康养就是坚持，明天继续哦～
        </div>
        <button onClick={()=>{onClose(Object.entries(local).filter(([,v])=>v).map(([k])=>k));setLocal({});}}
          className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-bold text-sm border-0 cursor-pointer">
          记录原因，下次改进
        </button>
      </div>
    </div>
  );
}

// ── Survey Modal ──────────────────────────────────────────────────────────────

const SURVEY_TITLES: Record<string, string> = {
  new_user:"👋 认识你一下", returner:"👋 欢迎回来", safety:"⚠️ 安全检查",
  triggers:"🤔 最困扰你的", pain:"📊 不舒服程度", day1_post_use:"😊 使用感受",
  day1_strength:"💪 强度反馈", daily_reason:"🤔 没完成原因",
  day7_trigger:"📍 触发动作", day7_new_trigger:"🔄 换个动作", day7_pain:"📊 现在程度",
  day7_feel:"🎯 7天成果", day7_skin:"🔍 皮肤状况",
};

function SurveyModal({open,onClose,step,userData,onSubmit}:{
  open:boolean;onClose:()=>void;step:SurveyStep;userData:UserData;onSubmit:(data:Partial<UserData>)=>void;
}) {
  if(!open||!step) return null;
  const title = SURVEY_TITLES[step] ?? "📋 问卷";
  return (
    <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
      {/* bottom sheet */}
      <div style={{background:"#fff",width:"100%",borderRadius:"24px 24px 0 0",maxHeight:"80%",display:"flex",flexDirection:"column",
        boxShadow:"0 -4px 32px rgba(0,0,0,0.18)"}}>
        {/* drag handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#e0e0e0"}}/>
        </div>
        {/* header */}
        <div style={{padding:"12px 20px 10px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:700,color:"#1a202c"}}>{title}</div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:"none",background:"#f2f2f2",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",lineHeight:1}}>×</button>
        </div>
        {/* scrollable content */}
        <div style={{overflowY:"auto",padding:"16px 20px 32px",flex:1}}>
          {step==="new_user"&&<NewUserSurvey prefill={{name:userData.name,gender:userData.gender,ageRange:userData.ageRange}} onDone={(n,g,a,d)=>{onSubmit({name:n,gender:g,ageRange:a,duration:d,firstTime:true});onClose();}} onSkip={onClose}/>}
          {step==="returner"&&<ReturnerSurvey onDone={(g,a)=>{onSubmit({gender:g,ageRange:a,firstTime:false});onClose();}} onSkip={onClose}/>}
          {step==="safety"&&<SafetySurvey onSubmit={v=>{onSubmit({safety:v});onClose();}}/>}
          {step==="triggers"&&<TriggerSurvey onSubmit={v=>{onSubmit({triggers:v});onClose();}}/>}
          {step==="pain"&&<PainSurvey trigger={userData.mainTrigger||"触发动作"} onSubmit={v=>{onSubmit({painLevel:v});onClose();}}/>}
          {step==="day1_post_use"&&<PostUseSurvey onDone={f=>{onSubmit({postUseFeel:f});onClose();}}/>}
          {step==="day1_strength"&&<StrengthSurvey onDone={s=>{onSubmit({dailyFeel:s});onClose();}}/>}
          {step==="daily_reason"&&<DailyReasonSurvey onDone={r=>{onSubmit({dailyFeel:r});onClose();}}/>}
          {step==="day7_trigger"&&<Day7TriggerSurvey mainTrigger={userData.mainTrigger} onDone={same=>{onSubmit({day7Trigger:same?userData.mainTrigger:""});onClose();}}/>}
          {step==="day7_new_trigger"&&<Day7NewTriggerSurvey onDone={t=>{onSubmit({day7Trigger:t});onClose();}}/>}
          {step==="day7_pain"&&<PainSurvey trigger={userData.day7Trigger||userData.mainTrigger||"触发动作"} onSubmit={v=>{onSubmit({day7Pain:v});onClose();}}/>}
          {step==="day7_feel"&&<Day7FeelSurvey onDone={f=>{onSubmit({day7Feel:f});onClose();}}/>}
          {step==="day7_skin"&&<Day7SkinSurvey onDone={hasSkin=>{onSubmit({dailyFeel:hasSkin?"skin":"no_skin"});onClose();}}/>}
        </div>
      </div>
    </div>
  );
}

// ── Trigger → training recommendation map ────────────────────────────────────

const ALL_EXERCISES: Record<string, { sets: string; desc: string }> = {
  "转身摸臀":    { sets:"左右各 10 次",          desc:"双脚与肩同宽，上身挺直，向后转身用手摸对侧臀部，左右交替。" },
  "后踢臀部":    { sets:"左右各 10 次",          desc:"双脚与肩同宽，双手叉腰，脚跟向后踢臀部，左右交替。" },
  "提膝碰肘":    { sets:"左右各 8 次 × 3 循环", desc:"吐气收腹提膝碰对侧肘，保持身体面向正前方，做完一侧再换边。" },
  "螃蟹步":      { sets:"左右各 4 步 × 2 组",   desc:"微蹲保持姿势，横向移步，左右各走 4 步为一组。" },
  "臀部找椅":    { sets:"8 次 × 3 循环",         desc:"站在椅前，臀部向后轻触椅缘后缓慢起身，膝盖不超过脚尖。" },
  "站立提踵":    { sets:"8 次 × 3 循环",         desc:"双手扶椅，脚尖踮到最高再缓慢放下。" },
  "快步走":      { sets:"快走 100 步",            desc:"以最自然的状态快速走 100 步，步伐轻盈。" },
  "拉伸臀部":    { sets:"左右各 20 秒 × 2 组",   desc:"坐位，脚踝搭在对侧大腿上，上身挺直前倾，感受臀部拉紧。" },
  "拉伸大腿后侧":{ sets:"左右各 20 秒 × 2 组",   desc:"坐位，伸直腿勾脚尖，上身挺直前倾，感受大腿后侧拉紧。" },
  "拉伸躯干":    { sets:"左右各 20 秒 × 2 组",   desc:"坐位，身体向一侧转到最大范围，感受躯干拉紧，保持 20 秒。" },
};

const TRIGGER_TRAINING: Record<string, { label: string; exercises: string[] }> = {
  "下蹲":         { label: "臀腿强化",  exercises: ["臀部找椅", "螃蟹步", "拉伸臀部"] },
  "上楼梯/斜坡":  { label: "股四头肌",  exercises: ["站立提踵", "臀部找椅", "拉伸大腿后侧"] },
  "下楼梯/斜坡":  { label: "离心控制",  exercises: ["螃蟹步", "臀部找椅", "拉伸大腿后侧"] },
  "久坐后站起来": { label: "热身激活",  exercises: ["转身摸臀", "后踢臀部", "拉伸躯干"] },
  "长时间走路":   { label: "放松恢复",  exercises: ["快步走", "拉伸臀部", "拉伸大腿后侧"] },
  "跑步/运动":    { label: "强化+放松", exercises: ["提膝碰肘", "螃蟹步", "拉伸躯干"] },
};
const DEFAULT_TRAINING = { label: "综合训练", exercises: ["转身摸臀", "臀部找椅", "拉伸臀部"] };

function GifPlayerModal({ name, onClose }: { name: string; onClose: () => void }) {
  const ex = ALL_EXERCISES[name];
  const gif = EXERCISE_GIF[name];
  const [paused, setPaused] = useState(false);
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 900,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 28,
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "72%", maxWidth: 320,
          background: "#fff", borderRadius: 20,
          overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        }}>
        <div style={{ position: "relative", background: "#000", minHeight: 180 }}>
          {gif && !paused && (
            <img src={gif} alt={name} style={{ width: "100%", display: "block", maxHeight: 240, objectFit: "cover" }} />
          )}
          {paused && (
            <div style={{ width: "100%", height: 180, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, opacity: 0.6 }}>已暂停</span>
            </div>
          )}
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              position: "absolute", bottom: 8, right: 8,
              background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 20,
              color: "#fff", fontSize: 12, padding: "4px 12px", cursor: "pointer",
            }}>
            {paused ? "▶ 继续" : "⏸ 暂停"}
          </button>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a202c", marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{ex?.sets}</div>
          <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>{ex?.desc}</div>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={onClose}
              style={{ fontSize: 12, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}>
              点击空白处关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingRecommendCard({ stiffness }: { stiffness: number | null }) {
  const [exercises] = useState<string[]>(() => {
    const stretches = ["拉伸臀部", "拉伸大腿后侧", "拉伸躯干"];
    const randStretch = () => stretches[Math.floor(Math.random() * stretches.length)];
    if (stiffness === 1 || stiffness === 2) {
      const groups = [["快步走", randStretch()], ["转身摸臀", randStretch()]];
      return groups[Math.floor(Math.random() * groups.length)];
    }
    const pairs = [
      ["后踢臀部", "拉伸大腿后侧"],
      ["臀部找椅", "拉伸臀部"],
      ["站立提踵", "拉伸大腿后侧"],
      ["螃蟹步", "拉伸臀部"],
      ["提膝碰肘", "拉伸躯干"],
    ];
    return pairs[Math.floor(Math.random() * pairs.length)];
  });
  const label = (stiffness === 1 || stiffness === 2) ? "拉伸放松" : "强化训练";
  const [playerName, setPlayerName] = useState<string | null>(null);
  return (
    <>
      {playerName && <GifPlayerModal name={playerName} onClose={() => setPlayerName(null)} />}
      <div className="rounded-2xl bg-white border border-[#BFDBFE] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#EFF6FF]">
          <div className="text-sm font-bold text-[#1A7AC7]">🏃 今日训练推荐</div>
          <div className="text-xs text-[#6B7280] mt-0.5">{label}</div>
        </div>
        <div className="divide-y divide-[#EFF6FF]">
          {exercises.map((name, i) => {
            const ex = ALL_EXERCISES[name];
            return (
              <div key={name} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <button
                      onClick={() => setPlayerName(name)}
                      className="text-sm font-semibold text-[#1A7AC7] underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 text-left">
                      {name}
                    </button>
                    <div className="text-xs text-[#9CA3AF]">{ex?.sets}</div>
                  </div>
                </div>
                <button
                  onClick={() => setPlayerName(name)}
                  className="text-xs text-[#1A7AC7] bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-2.5 py-1 cursor-pointer flex-shrink-0">
                  ▶ 演示
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── DailyOptimizeSummary — extracted to avoid hook-in-conditional violation ────
function DailyOptimizeSummary({feel,currentDay,stiffness,onNext,onGoTraining,onGoDiscover}:{
  feel:string;currentDay:number;stiffness?:number|null;onNext:()=>void;onGoTraining?:()=>void;onGoDiscover?:()=>void;
}) {
  const [tab,setTab]=useState<"today"|"example">("today");
  const better=feel==="better", worse=feel==="worse";
  const title=better?"看到进步了！":worse?"最近状态有所波动。":"状态稳定。";
  const body=better?"建议继续保持当前方案。":worse?"请留意活动量变化，如持续不适请及时反馈。":"建议继续完成本阶段计划。";
  return (
    <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
      <div className="flex gap-2 mb-1">
        <button onClick={()=>setTab("today")}
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all ${tab==="today"?"border-[#1A7AC7] text-[#1A7AC7]":"border-transparent text-[#8e98a3]"}`}>
          今日总结
        </button>
        <button onClick={()=>setTab("example")}
          className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-all ${tab==="example"?"border-[#1A7AC7] text-[#1A7AC7]":"border-transparent text-[#8e98a3]"}`}>
          举例
        </button>
      </div>
      {tab==="today"?(
        <div className={`rounded-2xl p-4 border-l-4 ${worse?"bg-[#fff7ed] border-[#f97316]":better?"bg-[#EFF6FF] border-[#1A7AC7]":"bg-[#EFF6FF] border-[#1A7AC7]"}`}>
          <div className="text-base font-bold mb-1">{title}</div>
          <div className="text-sm text-[#374151]">{body}</div>
        </div>
      ):(
        <div className="rounded-2xl p-4 bg-[#f7fafc] border border-[#e2e8f0] space-y-3">
          <div><div className="text-xs font-semibold text-[#1A7AC7] mb-0.5">好多了：</div><div className="text-sm text-[#374151]">看到进步了！建议继续保持当前方案。</div></div>
          <div className="border-t border-[#e2e8f0] pt-3"><div className="text-xs font-semibold text-[#718096] mb-0.5">差不多：</div><div className="text-sm text-[#374151]">状态稳定。建议继续完成本阶段计划。</div></div>
          <div className="border-t border-[#e2e8f0] pt-3"><div className="text-xs font-semibold text-[#f97316] mb-0.5">还是不舒服：</div><div className="text-sm text-[#374151]">最近状态有所波动。请留意活动量变化，如持续不适请及时反馈。</div></div>
        </div>
      )}

      {/* 个性化训练推荐 */}
      <TrainingRecommendCard stiffness={stiffness ?? null} />

      {/* 科普快捷入口 */}
      {onGoDiscover && (
        <button onClick={onGoDiscover} className="w-full py-2.5 rounded-full bg-[#F0FDF4] text-[#16A34A] font-semibold text-sm border border-[#BBF7D0] cursor-pointer active:bg-[#DCFCE7] transition-all">
          📖 科普
        </button>
      )}

      <button onClick={onNext} className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#1570B8] transition-all">
        📅 {currentDay<6?`进入第${currentDay+1}天`:currentDay===6?"进入阶段回顾":"完成"}
      </button>
    </div>
  );
}

// ── AssistantPage ─────────────────────────────────────────────────────────────

function AssistantPage({msgs,phase,tasks,taskIdx,currentDay,ud,thinking,messagesRef,
  onSubmitDuration,onSubmitStiffness,onGoToNextDay,onSubmitDailyFeel,onReset,
  day1PainRef,onStartAssessment,onStartTraining,smartMode,onToggleSmartMode,
  addMsg,simulateThinking,askBot,setPhase,setUserData,setSurveyStep,setTaskIdx,setMsgs,setTab,onStartDevice,deviceState}:{
  msgs:Msg[];phase:Phase;tasks:Task[];taskIdx:number;currentDay:number;ud:UserData;
  thinking:boolean;messagesRef:React.RefObject<HTMLDivElement|null>;
  onSubmitDuration:(d:string)=>void;onSubmitStiffness:(l:number)=>void;
  onGoToNextDay:()=>void;onSubmitDailyFeel:(f:string)=>void;onReset:()=>void;
  day1PainRef:React.RefObject<number>;
  onStartAssessment:()=>void;onStartTraining:()=>void;
  smartMode:boolean;onToggleSmartMode:()=>void;
  addMsg:(role:"bot"|"user",html:string,editPhase?:Phase)=>void;
  simulateThinking:(cb:()=>void)=>void;
  askBot:(userText:string,fallback:string,afterCb?:()=>void)=>Promise<void>;
  setPhase:(p:Phase)=>void;
  setUserData:React.Dispatch<React.SetStateAction<UserData>>;
  setSurveyStep:React.Dispatch<React.SetStateAction<SurveyStep|null>>;
  setTaskIdx:React.Dispatch<React.SetStateAction<number>>;
  setMsgs:React.Dispatch<React.SetStateAction<Msg[]>>;
  setTab:(t:Tab)=>void;
  onStartDevice:(level:number)=>void;
  deviceState:DeviceState;
}) {
  const lv=ud.finalLevel;
  const prm=LEVEL_PARAMS[lv-1]||LEVEL_PARAMS[1];
  const total=prm.cycles*(prm.work+prm.rest);
  const day1Pain=day1PainRef.current||0;

  const [showDeviceConfirm, setShowDeviceConfirm] = useState(false);
  const targetTherapyPhase = useRef<Phase>("day1_therapy");

  // 进入 day1_recommend 时记录目标 phase
  const lvRef = useRef(lv);
  lvRef.current = lv;
  useEffect(() => {
    if (phase === "day1_recommend") {
      targetTherapyPhase.current = "day1_therapy";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Small bot avatar inline
  const BotAvatar = () => (
    <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1A7AC7,#155FA0)",
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
      boxShadow:"0 2px 8px rgba(7,193,96,0.3)"}}>
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="white" opacity="0.15"/>
        <path d="M16 4C16 4 8 9 8 16a8 8 0 0016 0C24 9 16 4 16 4z" fill="rgba(255,255,255,0.9)"/>
        <circle cx="12" cy="16" r="2" fill="#1A7AC7"/><circle cx="20" cy="16" r="2" fill="#1A7AC7"/>
        <path d="M12 20 Q16 23 20 20" stroke="#1A7AC7" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{minHeight:0}}>

      {/* Device confirm sheet */}
      {showDeviceConfirm&&(
        <div style={{position:"absolute",inset:0,zIndex:820,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"white",width:"100%",borderRadius:"24px 24px 0 0",padding:"0 0 36px",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)"}}>
            <div style={{textAlign:"center",paddingTop:12,paddingBottom:20}}>
              <span style={{display:"inline-block",width:40,height:4,background:"#e2e8f0",borderRadius:2}}/>
            </div>
            {/* Device illustration */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#DBEAFE,#C8F0DC)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🦵</div>
            </div>
            <div style={{fontWeight:700,fontSize:17,color:"#1a202c",textAlign:"center",marginBottom:6}}>开始膝盖养护</div>
            <div style={{fontSize:13,color:"#6b7280",textAlign:"center",marginBottom:8,lineHeight:1.6,padding:"0 32px"}}>
              设备已就绪，让我们开始吧
            </div>
            {/* Checklist */}
            <div style={{margin:"0 20px 20px",background:"#EFF6FF",borderRadius:12,padding:"12px 14px",border:"1px solid #93C5FD"}}>
              {["膝盖清洁干燥","绑带舒适贴合","坐姿放松"].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#374151",
                  marginBottom:i<2?8:0}}>
                  <span style={{width:18,height:18,borderRadius:"50%",background:"#1A7AC7",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:"white",fontWeight:700}}>✓</span>
                  {t}
                </div>
              ))}
            </div>
            <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>{
                setShowDeviceConfirm(false);
                onStartDevice(lvRef.current);
                setTimeout(()=>setPhase(targetTherapyPhase.current),1000);
              }} style={{width:"100%",padding:"14px 0",borderRadius:32,background:"#1A7AC7",color:"white",
                fontWeight:700,fontSize:16,border:"none",cursor:"pointer",
                boxShadow:"0 4px 16px rgba(7,193,96,0.4)"}}>
                开始使用
              </button>
              <button onClick={()=>setShowDeviceConfirm(false)}
                style={{width:"100%",padding:"12px 0",borderRadius:32,background:"transparent",
                  color:"#9ca3af",fontWeight:500,fontSize:14,border:"none",cursor:"pointer"}}>
                稍后再用
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── Compressed to single line */}
      <div style={{
        background:"white", borderBottom:`1px solid ${COLORS.borderGray}`,
        padding:"48px 16px 12px", flexShrink:0
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          {/* Avatar + Name + Day badge in one line */}
          <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0,flex:1}}>
            <div style={{
              width:40,height:40,borderRadius:"50%",
              background:`linear-gradient(135deg,${COLORS.brandBlue},#3A7BC8)`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
              boxShadow:DESIGN.shadow.card
            }}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="10" r="5" fill="white" opacity="0.9"/>
                <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="13" cy="10" r="1.2" fill={COLORS.brandBlue}/><circle cx="19" cy="10" r="1.2" fill={COLORS.brandBlue}/>
                <path d="M13 13 Q16 15 19 13" stroke={COLORS.brandBlue} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div style={{minWidth:0,flex:1}}>
              <div style={{
                fontSize:15,fontWeight:700,color:COLORS.deepNavy,lineHeight:1.3,
                display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"
              }}>
                <span>小瑞</span>
                <span style={{
                  background:COLORS.brandBlue,color:"white",
                  padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600
                }}>第{currentDay}天</span>
              </div>
            </div>
          </div>
          {/* Smart mode toggle + 开始评估 */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:COLORS.neutralGray,fontWeight:500}}>{smartMode?"智能":"手动"}</span>
              <button onClick={onToggleSmartMode}
                style={{
                  width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",position:"relative",
                  background:smartMode?COLORS.brandBlue:"#d1d5db",transition:"background 0.2s"
                }}>
                <span style={{
                  position:"absolute",top:2,left:smartMode?22:2,width:20,height:20,
                  borderRadius:"50%",background:"white",transition:"left 0.2s",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.2)"
                }}/>
              </button>
            </div>
            {(phase==="smart_intro"||phase==="smart_confirm_assessment"||phase==="day1_survey")&&(
              <button onClick={() => {
                addMsg("user","开始评估");
                if (ud.name && ud.gender && ud.ageRange) {
                  setSurveyStep("safety");
                } else {
                  setSurveyStep("new_user");
                }
              }}
                style={{
                  background:COLORS.brandBlue,color:"white",
                  padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,
                  border:"none",cursor:"pointer",whiteSpace:"nowrap"
                }}>
                开始评估
              </button>
            )}
          </div>
        </div>
      </div>

      <TaskBreakdown tasks={tasks} current={taskIdx} deviceRunning={deviceState==="running"}/>

      {/* ── Chat area ── */}
      <div ref={messagesRef}
        style={{flex:1,overflowY:"auto",padding:"16px 14px 8px",display:"flex",flexDirection:"column",gap:12,
          background:COLORS.lightGray}}
        className="[&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-[#c8c8c8] [&::-webkit-scrollbar-thumb]:rounded-full">

        {msgs.map((m,idx)=>(
          <div key={m.id} style={{display:"flex",flexDirection:"column",
            alignItems:m.role==="bot"?"flex-start":"flex-end",gap:4}}>
            {/* Bot: avatar + bubble row */}
            {m.role==="bot"?(
              <div style={{display:"flex",alignItems:"flex-end",gap:8,maxWidth:"88%"}}>
                <BotAvatar/>
                <div style={{
                  background:"white",borderRadius:DESIGN.radius.card,
                  padding:"10px 14px",fontSize:14,lineHeight:1.55,color:COLORS.deepNavy,
                  boxShadow:DESIGN.shadow.card,
                  animation:"fadeUp 0.25s ease",
                }} dangerouslySetInnerHTML={{__html:m.html}}/>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,maxWidth:"80%"}}>
                <div style={{
                  background:COLORS.brandBlue,borderRadius:DESIGN.radius.card,
                  padding:"10px 14px",fontSize:14,lineHeight:1.55,color:"white",
                  animation:"fadeUp 0.25s ease",
                }} dangerouslySetInnerHTML={{__html:m.html}}/>
                {m.editPhase&&(
                  <button onClick={()=>{setMsgs(prev=>prev.slice(0,idx));setPhase(m.editPhase!);}}
                    style={{
                      fontSize:11,color:COLORS.neutralGray,background:"transparent",
                      border:`1px solid ${COLORS.borderGray}`,
                      borderRadius:20,padding:"2px 10px",cursor:"pointer"
                    }}>
                    ✏️ 修改
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {thinking&&(
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <BotAvatar/>
            <div style={{
              background:"white",borderRadius:DESIGN.radius.card,padding:"12px 16px",
              boxShadow:DESIGN.shadow.card
            }}>
              <ThinkingDots/>
            </div>
          </div>
        )}

        {phase==="smart_confirm_assessment"&&(
          <div className="self-start max-w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
            <button onClick={() => {
              addMsg("user", "开始了解");
              // Skip profile questions if name/gender/age already collected
              if (ud.name && ud.gender && ud.ageRange) {
                setSurveyStep("safety");
              } else {
                setSurveyStep("new_user");
              }
            }}
              style={{
                background:COLORS.brandBlue,color:"white",padding:"12px 16px",
                borderRadius:DESIGN.radius.button,fontSize:14,fontWeight:600,
                border:0,cursor:"pointer",minHeight:44
              }}>
              开始
            </button>
            <button onClick={() => {
              addMsg("user", "直接开始用");
              simulateThinking(() => {
                addMsg("bot", "好的！请先选择一个强度模式，或者自定义参数。");
                setTimeout(() => setPhase("day1_manual_level"), 600);
              });
            }}
              style={{
                background:"white",border:`1px solid ${COLORS.borderGray}`,
                color:COLORS.textSecondary,padding:"12px 16px",
                borderRadius:DESIGN.radius.button,fontSize:14,fontWeight:600,
                cursor:"pointer",minHeight:44
              }}>
              直接开始用
            </button>
          </div>
        )}

        {/* Duration — compact chips */}
        {phase==="day1_duration"&&(
          <div style={{alignSelf:"flex-start",maxWidth:"88%",animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
              {["不到3个月","3个月以上","没有特别不适"].map((l)=>(
                <button key={l} onClick={()=>onSubmitDuration(l)}
                  style={{
                    padding:"9px 16px",borderRadius:DESIGN.radius.tag,
                    border:`1.5px solid ${COLORS.borderGray}`,
                    background:"white",color:COLORS.textPrimary,fontSize:14,cursor:"pointer",
                    fontFamily:"inherit",boxShadow:DESIGN.shadow.card,minHeight:44
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stiffness — illustrated cards */}
        {phase==="day1_stiffness"&&(
          <div style={{alignSelf:"flex-start",width:"88%",animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"flex",gap:8}}>
              {[
                {l:"没有特别感觉",sub:"关节活动自如",v:0,color:COLORS.mistBlue},
                {l:"有点紧",sub:"轻微紧绷感",v:1,color:"#FEF3C7"},
                {l:"很紧",sub:"明显受限",v:2,color:"#FEE2E2"},
              ].map(({l,sub,v,color})=>(
                <button key={v} onClick={()=>onSubmitStiffness(v)}
                  style={{
                    flex:1,padding:"12px 8px",borderRadius:DESIGN.radius.button,
                    border:`1.5px solid ${COLORS.borderGray}`,
                    background:"white",cursor:"pointer",textAlign:"center",
                    fontFamily:"inherit",boxShadow:DESIGN.shadow.card,minHeight:44
                  }}>
                  <div style={{fontSize:12,fontWeight:600,color:COLORS.deepNavy,lineHeight:1.3}}>{l}</div>
                  <div style={{fontSize:11,color:COLORS.neutralGray,marginTop:2}}>{sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Triggers — 2-col grid */}
        {phase==="day1_triggers"&&(
          <div style={{alignSelf:"flex-start",width:"90%",animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                "下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","其他","无"
              ].map((t)=>(
                <button key={t} onClick={()=>{
                  addMsg("user", t, "day1_triggers");
                  setUserData(p=>({...p,triggers:[t],mainTrigger:t==="无"?"":t}));
                  simulateThinking(()=>{
                    if(t==="无"){
                      addMsg("bot","明白了，没有特别困扰的动作。我接着了解不适程度。");
                      setTimeout(()=>setPhase("day1_pain"),800);
                    }else{
                      addMsg("bot",`好的，你在「${t}」时感觉不舒服。这个动作时，不适程度是？`);
                      setTimeout(()=>setPhase("day1_pain"),800);
                    }
                  });
                }}
                  style={{
                    padding:"12px 8px",borderRadius:DESIGN.radius.button,
                    border:`1px solid ${COLORS.borderGray}`,
                    background:"white",color:COLORS.textPrimary,fontSize:13,fontWeight:500,
                    cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                    boxShadow:DESIGN.shadow.card,minHeight:44
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pain — visual scale */}
        {phase==="day1_pain"&&(
          <div style={{alignSelf:"flex-start",width:"90%",animation:"fadeUp 0.25s ease"}}>
            <div style={{fontSize:12,color:COLORS.neutralGray,marginBottom:8}}>
              动作：{ud.mainTrigger||"日常动作"}，不适程度？
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[
                {i:0,label:"无不适",color:COLORS.brandBlue,bg:COLORS.mistBlue},
                {i:1,label:"轻微不适",color:COLORS.successGreen,bg:"#F6FFED"},
                {i:2,label:"中等不适",color:"#FAAD14",bg:"#FFFBE6"},
                {i:3,label:"较重不适",color:"#FF7A45",bg:"#FFF2E8"},
                {i:4,label:"非常不适",color:COLORS.riskRed,bg:"#FFF1F0"},
              ].map(({i,label,color,bg})=>(
                <button key={i} onClick={()=>{
                  addMsg("user",`${i} — ${label}`,"day1_pain");
                  const base = ud.baseLevel ?? 2;
                  const delta = i === 0 ? -1 : i <= 2 ? 0 : 1;
                  const computed = Math.max(1, Math.min(6, base + delta));
                  setUserData(p=>({...p,painLevel:i,finalLevel:computed}));
                  day1PainRef.current=i;
                  simulateThinking(()=>{
                    addMsg("bot","收到！我会根据你的情况生成初始方案。");
                    setTimeout(()=>{
                      setTaskIdx(1);
                      setPhase("day1_recommend");
                      addMsg("bot",`根据你的情况，我为你推荐<strong>${getLevelName(computed)}</strong>强度开始。`);
                    },800);
                  });
                }}
                  style={{
                    display:"flex",alignItems:"center",gap:12,
                    padding:"11px 14px",borderRadius:DESIGN.radius.button,
                    border:`1.5px solid ${color}22`,background:bg,
                    cursor:"pointer",fontFamily:"inherit",
                    boxShadow:DESIGN.shadow.card,minHeight:44
                  }}>
                  <div style={{flex:1,textAlign:"left"}}>
                    <span style={{fontSize:14,fontWeight:600,color:COLORS.deepNavy}}>{i} — {label}</span>
                  </div>
                  {/* Visual bar */}
                  <div style={{display:"flex",gap:3}}>
                    {[0,1,2,3,4].map(d=>(
                      <div key={d} style={{width:6,height:6,borderRadius:3,
                        background:d<=i?color:COLORS.borderGray,transition:"background 0.2s"}}/>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {phase==="day1_manual_level"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
            <p className="text-xs text-[#718096] mb-1">选择强度模式，或自定义参数：</p>
            {LEVELS.map((name,i)=>{
              const lv=i+1;
              const p=LEVEL_PARAMS[i];
              return (
                <button key={lv} onClick={()=>{
                  addMsg("user", `${getLevelName(lv)} · ${name}`, "day1_manual_level");
                  setUserData(prev=>({...prev,finalLevel:lv,baseLevel:lv}));
                  simulateThinking(()=>{
                    addMsg("bot",`好的，已选择 <strong>${getLevelName(lv)} ${name}</strong> 模式。`);
                    setTimeout(()=>setPhase("day1_recommend"),600);
                  });
                }}
                  className="bg-white border border-[#e8ecf0] text-[#2d3748] px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer active:bg-[#f7fafc] transition-colors text-left">
                  <span className="font-semibold">{getLevelName(lv)} · {name}</span>
                </button>
              );
            })}
          </div>
        )}
        {/* Recommendation card — clean, single info block */}
        {phase==="day1_recommend"&&(
          <div style={{alignSelf:"flex-start",width:"92%",display:"flex",flexDirection:"column",gap:10,animation:"fadeUp 0.25s ease"}}>
            {/* Plan card */}
            <div style={{background:"white",borderRadius:16,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#DBEAFE",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌿</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"#1A7AC7"}}>推荐方案</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>{LEVELS[lv-1]||"温和"}模式 · {getLevelName(lv)}</div>
                </div>
              </div>
              {/* Params — show mode and total time only */}
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <div style={{flex:1,background:"#F7F8FA",borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>🎯 模式</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>{LEVELS[lv-1]||"温和"}</div>
                </div>
                <div style={{flex:1,background:"#F7F8FA",borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>⏱ 总时长</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>{Math.floor(total/60)}分{total%60}秒</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#9ca3af",textAlign:"center"}}>
                📅 每天 1-2 次 · 约 {Math.floor(total/60)} 分 {total%60} 秒
              </div>
            </div>

            {/* Compact tips */}
            <div style={{background:"#EFF6FF",borderRadius:12,padding:"12px 14px",
              border:"1px solid #93C5FD"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#1E3A5F",marginBottom:6}}>💡 使用提示</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {["确保膝盖清洁干燥","绑带舒适不紧绷","使用时放松享受"].map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#1E3A5F"}}>
                    <span style={{color:"#1A7AC7",flexShrink:0}}>•</span>{t}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button onClick={()=>{targetTherapyPhase.current="day1_therapy";setShowDeviceConfirm(true);}}
              style={{width:"100%",padding:"15px 0",borderRadius:14,
                background:"linear-gradient(135deg,#1A7AC7,#155FA0)",
                color:"white",fontWeight:700,fontSize:16,border:"none",cursor:"pointer",
                boxShadow:"0 4px 16px rgba(7,193,96,0.4)",letterSpacing:0.3}}>
              开始首次使用 →
            </button>
          </div>
        )}
        {phase==="day1_optimize"&&(()=>{
          const feel=ud.postUseFeel;
          const strength=ud.dailyFeel;
          const isSkin=feel==="skin";
          const levelUp=strength==="weak";
          const levelDown=isSkin||strength==="strong";
          // Q5-based summary: good=方案适合, neutral=偏轻, mild/skin=偏强
          const q5Good=feel==="good";
          const q5Light=feel==="neutral";
          const title=q5Good?"当前方案适合你":q5Light?"当前强度偏轻":"当前强度偏强";
          const body=q5Good
            ?"整体感觉良好，未出现明显不适。"
            :q5Light
            ?"为了获得更好的效果，我会为你提高一级强度。"
            :"为了提高舒适度，下次我会为你降低一级强度。";
          return (
            <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
              <div className={`rounded-2xl p-4 border-l-4 ${(!q5Good&&!q5Light)?"bg-[#fff7ed] border-[#f97316]":q5Light?"bg-[#EFF6FF] border-[#1A7AC7]":"bg-[#EFF6FF] border-[#1A7AC7]"}`}>
                <div className="text-base font-bold mb-1">{title}</div>
                <div className="text-sm text-[#374151]">{body}</div>
                <div className="text-sm text-[#374151] mt-1">下次再见！</div>
                <div className="mt-2.5 flex items-center gap-2 text-xs text-[#6b7280]">
                  <span>下次强度：</span>
                  <span className="font-semibold text-[#1a202c]">{getLevelName(ud.finalLevel)}</span>
                </div>
              </div>
              <button onClick={onGoToNextDay} className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#1570B8] transition-all">
                📅 进入第2天
              </button>
              <TrainingRecommendCard stiffness={ud.stiffness ?? null} />
              <button onClick={()=>setTab("discover")} className="w-full py-3 rounded-full bg-[#F0FDF4] text-[#16A34A] font-semibold text-sm border border-[#BBF7D0] cursor-pointer active:bg-[#DCFCE7] transition-all">
                📖 科普
              </button>
            </div>
          );
        })()}
        {phase==="daily_feel"&&(
          <div style={{alignSelf:"flex-start",width:"90%",animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"flex",gap:8}}>
              {[
                {v:"better",label:"好多了",sub:"有改善",color:COLORS.brandBlue,bg:COLORS.mistBlue},
                {v:"same",  label:"还行",  sub:"差不多",color:COLORS.neutralGray,bg:COLORS.lightGray},
                {v:"worse", label:"不舒服",sub:"有波动",color:"#F59E0B",bg:"#FFFBE6"},
              ].map(({v,label,sub,color,bg})=>(
                <button key={v} onClick={()=>onSubmitDailyFeel(v)}
                  style={{flex:1,padding:"14px 8px",borderRadius:DESIGN.radius.button,
                    border:`1.5px solid ${color}33`,background:bg,
                    cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                    boxShadow:DESIGN.shadow.card,minHeight:44}}>
                  <div style={{fontSize:14,fontWeight:600,color:COLORS.deepNavy,marginBottom:2}}>{label}</div>
                  <div style={{fontSize:11,color:COLORS.neutralGray,marginTop:2}}>{sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {phase==="daily_recommend"&&(
          <div style={{alignSelf:"flex-start",width:"92%",display:"flex",flexDirection:"column",gap:10,animation:"fadeUp 0.25s ease"}}>
            <div style={{background:"white",borderRadius:16,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>今日方案</div>
                <span style={{fontSize:12,padding:"3px 10px",borderRadius:20,
                  background:ud.dailyFeel==="worse"?"#FEF3C7":"#DBEAFE",
                  color:ud.dailyFeel==="worse"?"#92400E":"#1E3A5F"}}>
                  {ud.dailyFeel==="worse"?"已调整↓":"维持"}
                </span>
              </div>
              <div style={{fontSize:22,fontWeight:700,color:"#1A7AC7",marginBottom:4}}>
                {getLevelName(ud.finalLevel)} <span style={{fontSize:14,fontWeight:400,color:"#9ca3af"}}>{LEVELS[(ud.finalLevel||2)-1]}模式</span>
              </div>
              <div style={{fontSize:12,color:"#9ca3af"}}>
                {LEVELS[(ud.finalLevel||2)-1]}模式 · 约 {Math.floor((prm.cycles*(prm.work+prm.rest))/60)} 分钟
              </div>
            </div>
            <button onClick={()=>{targetTherapyPhase.current="daily_therapy";setShowDeviceConfirm(true);}}
              style={{width:"100%",padding:"15px 0",borderRadius:14,
                background:"linear-gradient(135deg,#1A7AC7,#155FA0)",
                color:"white",fontWeight:700,fontSize:16,border:"none",cursor:"pointer",
                boxShadow:"0 4px 16px rgba(7,193,96,0.4)"}}>
              开始今日训练 →
            </button>
          </div>
        )}
        {phase==="daily_optimize"&&(
          <DailyOptimizeSummary
            feel={ud.dailyFeel}
            currentDay={currentDay}
            stiffness={ud.stiffness}
            onNext={onGoToNextDay}
            onGoTraining={() => setTab("training")}
            onGoDiscover={() => setTab("discover")}
          />
        )}
        {phase==="safety_warning"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-3">
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <div className="font-semibold text-[#92400E] text-sm mb-1">温馨提示</div>
                  <div className="text-xs text-[#92400E] leading-relaxed">
                    建议先休息 1-2 天，或咨询专业医生后再使用设备。
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setTab("discover")}
              className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-semibold text-sm border-0 cursor-pointer active:bg-[#1570B8] transition-all">
              📖 去科普了解更多
            </button>
          </div>
        )}
        {phase==="day7_summary"&&(()=>{
          const d7pain=ud.day7Pain;
          const d1pain=day1Pain;
          const improve=d1pain-d7pain;
          const trigger=ud.day7Trigger||ud.mainTrigger||"触发动作";
          const feelLabel={better:"感觉改善",same:"差不多",worse:"变差了"}[ud.day7Feel]||"";
          type CatKey = "明显改善"|"轻度改善"|"基本稳定"|"状态下降";
          const cat: CatKey=improve>=2||(improve>=1&&ud.day7Feel==="better")?"明显改善":improve>=1||ud.day7Feel==="better"?"轻度改善":improve===0&&ud.day7Feel!=="worse"?"基本稳定":"状态下降";
          const catEmoji={明显改善:"🎉",轻度改善:"👍",基本稳定:"✅",状态下降:"⚠️"}[cat];
          const catMsg:{[K in CatKey]:string}={
            明显改善:"你的膝盖状态较开始明显改善，当前方案正在发挥积极作用！",
            轻度改善:"你的膝盖状态有所改善，建议继续完成下一阶段方案。",
            基本稳定:"你的膝盖状态总体稳定，建议继续坚持使用并完成计划。",
            状态下降:"近期膝盖状态有所下降，系统将根据你的反馈调整下一阶段方案。",
          };
          return (
            <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
              <ResultCard green={improve>=0}>
                <div className="text-lg font-bold mb-2">{catEmoji} 第一阶段总结</div>
                <div className="text-sm font-semibold text-[#1a202c] mb-2">最困扰动作：{trigger}</div>
                <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 mb-1.5">
                  <span className="text-xs text-[#718096]">7天前</span>
                  <div className="flex items-center gap-2"><Stars score={d1pain} max={4}/><span className="text-xs text-[#4a5568]">({d1pain}/4)</span></div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 mb-2">
                  <span className="text-xs text-[#718096]">现在</span>
                  <div className="flex items-center gap-2"><Stars score={d7pain} max={4}/><span className="text-xs text-[#4a5568]">({d7pain}/4)</span></div>
                </div>
                <div className={`text-sm font-medium ${improve>0?"text-[#16a34a]":improve<0?"text-[#dc2626]":"text-[#6b7280]"}`}>
                  {improve>0?`↓ 不适减轻 ${improve} 级`:improve<0?`↑ 不适增加 ${Math.abs(improve)} 级`:"→ 不适程度持平"}
                  {feelLabel&&` · 主观感受：${feelLabel}`}
                </div>
                <div className="mt-2 bg-[#EFF6FF] rounded-lg px-3 py-2 text-xs text-[#166534] leading-relaxed">{catMsg[cat]}</div>
              </ResultCard>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5">
                <div className="font-semibold text-[#1a202c] mb-1">📋 下一阶段</div>
                <div className="text-sm text-[#4a5568]">我们已根据你的最新反馈优化下一阶段方案。</div>
                <div className="flex gap-2 mt-3">
                  <button onClick={onGoToNextDay} className="flex-1 py-2.5 rounded-full bg-[#1A7AC7] text-white font-semibold text-sm border-0 cursor-pointer active:bg-[#1570B8] transition-all">查看下一阶段</button>
                  <button onClick={onReset} className="flex-1 py-2.5 rounded-full bg-[#edf2f7] text-[#4a5568] font-medium text-sm border-0 cursor-pointer active:bg-[#e2e8f0] transition-all">重新开始</button>
                </div>
              </div>
            </div>
          );
        })()}
        {phase==="done"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease]">
            <button onClick={onReset} className="w-full py-3 rounded-full bg-[#1A7AC7] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#155FA0] transition-all">
              🔄 重新开始
            </button>
          </div>
        )}
      </div>

      {/* Text input area */}
      <div className="px-3 py-2.5 bg-white border-t border-[#e8ecf0] flex-shrink-0">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>)=>{
          e.preventDefault();
          const input=e.currentTarget.elements.namedItem("chatInput") as HTMLInputElement;
          const text=input.value.trim();
          if(!text)return;
          addMsg("user",text);
          input.value="";
          askBot(text,"我理解了，让我为你记录下来。如果有其他问题随时告诉我！");
        }} className="flex gap-2 items-center">
          <input
            type="text"
            name="chatInput"
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-full bg-[#f7fafc] focus:outline-none focus:border-[#1A7AC7] transition-colors"
          />
          <button type="submit" className="w-9 h-9 rounded-full bg-[#1A7AC7] text-white flex items-center justify-center border-0 cursor-pointer active:bg-[#1570B8] transition-colors flex-shrink-0">
            <span className="text-base">↑</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("wechat-login");
  const [tab, setTab] = useState<Tab>("home");
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [phase, setPhase] = useState<Phase>("smart_intro");
  const [surveyStep, setSurveyStep] = useState<SurveyStep>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [taskIdx, setTaskIdx] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);
  const [smartMode, setSmartMode] = useState<boolean>(loadSmartMode());

  const [userData, setUserData] = useState<UserData>(() => loadUserData());

  // Toast 通知
  const [toasts, setToasts] = useState<{id:number;msg:string;type:"info"|"success"|"error"|"warn"}[]>([]);
  const toastIdRef = useRef(0);
  const showToast = (msg: string, type: "info"|"success"|"error"|"warn" = "info") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, {id, msg, type}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  const dismissToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // 蓝牙和权限状态
  const [bluetoothConnectState, setBluetoothConnectState] = useState<BluetoothConnectState>("not_configured");
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(loadPermissionStatus());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAYS = [1000, 3000, 5000]; // ms
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [pendingPermissionType, setPendingPermissionType] = useState<"bluetooth" | "location" | "both" | null>(null);
  const [scannedDevices, setScannedDevices] = useState<BluetoothDevice[]>([]);

  const [deviceState, setDeviceState] = useState<DeviceState>("disconnected");
  const [hwState, setHwState] = useState<HwState>("idle");
  const [hwLevel, setHwLevel] = useState(2);
  const [hwCycle, setHwCycle] = useState(1);
  const [hwTotalCycles, setHwTotalCycles] = useState(5);
  const [hwRemaining, setHwRemaining] = useState(0);
  const [hwTotal, setHwTotal] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } catch {
      // ignore storage failures
    }
  }, [userData]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_SMART_MODE_KEY, JSON.stringify(smartMode));
    } catch {
      // ignore storage failures
    }
  }, [smartMode]);

  // 持久化蓝牙和权限状态
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_BLUETOOTH_KEY, JSON.stringify({
        connectedDevice: userData.connectedDevice,
        pairedDevices: userData.pairedDevices
      }));
      window.localStorage.setItem(STORAGE_PERMISSION_KEY, JSON.stringify(permissionStatus));
    } catch {
      // ignore storage failures
    }
  }, [userData.connectedDevice, userData.pairedDevices, permissionStatus]);

  // 蓝牙状态变化 → Toast 通知
  useEffect(() => {
    const msgs: Record<BluetoothConnectState, {text:string;type:"success"|"error"|"info"|"warning"}|null> = {
      not_configured: null,
      permission_needed: {text:"需要蓝牙权限才能连接设备",type:"warning"},
      checking_permission: {text:"正在检查蓝牙权限…",type:"info"},
      permission_denied: {text:"蓝牙权限被拒绝，请在系统设置中开启",type:"error"},
      scanning: {text:"正在扫描附近设备…",type:"info"},
      pairing: {text:"正在配对设备…",type:"info"},
      connecting: {text:"正在连接设备…",type:"info"},
      verifying: {text:"正在验证设备…",type:"info"},
      connected: {text:"✓ 设备已连接",type:"success"},
      disconnected: {text:"设备已断开连接",type:"warning"},
      connection_failed: {text:"连接失败，请重试",type:"error"},
      pairing_failed: {text:"配对失败，请靠近设备后重试",type:"error"},
      timeout: {text:"连接超时，请重试",type:"error"},
      permission_revoked: {text:"蓝牙权限已撤销，设备已断开",type:"error"},
    };
    const m = msgs[bluetoothConnectState];
    if (m) showToast(m.text, m.type);
  }, [bluetoothConnectState]);

  // 自动重连机制 - 设备运行中断连
  useEffect(() => {
    if (deviceState === "disconnected" && hwState === "running" && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_DELAYS[Math.min(reconnectAttempts, RECONNECT_DELAYS.length - 1)];
      const timer = setTimeout(() => {
        setBluetoothConnectState("connecting");
        setReconnectAttempts(prev => prev + 1);
        // 模拟重连成功（实际应调用蓝牙API）
        setTimeout(() => {
          setDeviceState("idle");
          setBluetoothConnectState("connected");
        }, 800);
      }, delay);
      return () => clearTimeout(timer);
    } else if (deviceState === "disconnected" && hwState === "running" && reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      // 多次重连失败，显示错误
      setHwState("idle");
      setUserData(prev => ({ ...prev, lastErrorMessage: "设备连接已中断，已尝试3次重连仍未成功。请检查设备或重新配置。" }));
    }
  }, [deviceState, hwState, reconnectAttempts]);

  // 权限变更检测 - 如果权限被撤销
  useEffect(() => {
    if (permissionStatus.bluetooth === "denied" && deviceState !== "disconnected") {
      setDeviceState("disconnected");
      setHwState("idle");
      setBluetoothConnectState("permission_revoked");
      setUserData(prev => ({ ...prev, lastErrorMessage: "蓝牙权限已被撤销，设备已断开连接。" }));
    }
  }, [permissionStatus.bluetooth]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);
  const day1PainRef = useRef<number>(0);
  const isEarlyStopRef = useRef(false);
  const chatHistoryRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [msgs, thinking, phase]);

  // 监听设备训练完成
  useEffect(() => {
    if (hwRemaining === 0 && hwTotal > 0 && hwState === "running" && tab === "assistant" && !isEarlyStopRef.current) {
      setHwState("idle");
      setDeviceState("idle");

      if (phase === "day1_therapy") {
        const today = new Date().toISOString().split("T")[0];
        setUserData(prev => ({
          ...prev,
          lastTrainingDate: today,
          trainingDates: [...(prev.trainingDates || []), today],
          sessionsToday: prev.lastTrainingDate === today ? (prev.sessionsToday || 0) + 1 : 1,
        }));
        setTaskIdx(3);
        simulateThinking(() => {
          addMsg("bot", "第一次使用完成！请告诉我你的感受。");
          setTimeout(() => { setSurveyStep("day1_post_use"); }, 600);
        }, 500);
      } else if (phase === "daily_therapy") {
        const today = new Date().toISOString().split("T")[0];
        setUserData(prev => ({
          ...prev,
          lastTrainingDate: today,
          trainingDates: [...(prev.trainingDates || []), today],
          sessionsToday: prev.lastTrainingDate === today ? (prev.sessionsToday || 0) + 1 : 1,
        }));
        setTaskIdx(3);

        // Day 7特殊处理：使用完成后进入阶段回顾
        if (currentDay === 7) {
          simulateThinking(() => {
            addMsg("bot", "恭喜你已经完成第一阶段的养护计划啦！现在跟我一起做阶段性回顾和总结，看看是否需要调整计划哦！");
            setTimeout(() => {
              setSurveyStep("day7_trigger");
            }, 800);
          }, 500);
        } else {
          // 正常日常流程
          simulateThinking(() => {
            addMsg("bot", "今日使用完成！");
            setTimeout(() => {
              addMsg("bot", "让我为你生成今日总结。");
              setTimeout(() => {
                setPhase("daily_optimize");
                setTimeout(() => {
                  addMsg("bot", "完成后可到「训练」tab 跟练配套运动，或去「发现」tab 了解科普知识。");
                }, 800);
              }, 800);
            }, 600);
          }, 500);
        }
      }
    }
  }, [hwRemaining, hwTotal, hwState, phase, tab]);

  // 设备开始运行时，推进到治疗阶段并更新节点
  useEffect(() => {
    if (deviceState === "running" && tab === "assistant") {
      if (phase === "day1_recommend" || phase === "day1_therapy") {
        setPhase("day1_therapy");
        setTaskIdx(2);
      } else if (phase === "daily_recommend" || phase === "daily_therapy") {
        setPhase("daily_therapy");
        setTaskIdx(2);
      }
    }
  }, [deviceState, tab, phase]);

  // phase 变化时同步 taskIdx
  useEffect(() => {
    if (phase === "day1_optimize" || phase === "daily_optimize") {
      setTaskIdx(4);
    }
  }, [phase]);

  // 设备倒计时逻辑
  useEffect(() => {
    if (hwState === "running" && hwRemaining > 0) {
      const timer = setInterval(() => {
        setHwRemaining(prev => prev <= 1 ? 0 : prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hwState, hwRemaining]);

  const addMsg = (role: "bot" | "user", html: string, editPhase?: Phase) => {
    let finalHtml = html;
    if (role === "bot" && userData.name) {
      const hasGreeting = /^[👋🎉✅💡📌⚡⚠️👍📊💭🩹]/.test(html.trim());
      if (!hasGreeting && !html.includes(userData.name)) {
        finalHtml = `${userData.name}，${html}`;
      }
    }
    setMsgs(prev => [...prev, { id: msgId.current++, role, html: finalHtml, editPhase }]);
  };

  const simulateThinking = (cb: () => void, delay = 800) => {
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      cb();
    }, delay);
  };

  // Ask DeepSeek and post the reply as a bot message. Falls back to fallback string on error.
  const askBot = async (userText: string, fallback: string, afterCb?: () => void) => {
    chatHistoryRef.current = [...chatHistoryRef.current, { role: "user", content: userText }];
    setThinking(true);
    try {
      const reply = await askDeepSeek(chatHistoryRef.current);
      chatHistoryRef.current = [...chatHistoryRef.current, { role: "assistant", content: reply }];
      setThinking(false);
      addMsg("bot", reply);
    } catch {
      chatHistoryRef.current = [...chatHistoryRef.current, { role: "assistant", content: fallback }];
      setThinking(false);
      addMsg("bot", fallback);
    }
    afterCb?.();
  };

  const handleConnect = () => {
    if (deviceState === "disconnected") setDeviceState("idle");
  };

  const handleStart = () => {
    if (deviceState === "idle") {
      const prm = LEVEL_PARAMS[hwLevel - 1] || LEVEL_PARAMS[1];
      const total = prm.cycles * (prm.work + prm.rest);
      setHwState("running");
      setDeviceState("running");
      setHwRemaining(total);
      setHwTotal(total);
      setHwCycle(1);
      setHwTotalCycles(prm.cycles);
    }
  };

  const handleTogglePause = () => {
    if (hwState === "running") {
      setHwState("paused");
      setDeviceState("paused");
    } else if (hwState === "paused") {
      setHwState("running");
      setDeviceState("running");
    }
  };

  const handleStop = () => {
    if (tab === "assistant" && hwState === "running" && (phase === "day1_therapy" || phase === "daily_therapy")) {
      isEarlyStopRef.current = true;
      setShowStopModal(true);
    }
    setHwState("stopped");
    setDeviceState("stopped");
    setHwRemaining(0);
  };

  const handleReset = () => {
    setHwState("idle");
    setDeviceState("idle");
    setHwRemaining(0);
    setHwTotal(0);
  };

  // 蓝牙配置相关处理
  const handleRequestPermission = async (type: "bluetooth" | "location"): Promise<boolean> => {
    // 模拟权限申请（实际应调用系统API）
    return new Promise((resolve) => {
      setTimeout(() => {
        setPermissionStatus(prev => ({
          ...prev,
          [type === "bluetooth" ? "bluetooth" : "location"]: "granted"
        }));
        resolve(true);
      }, 1500);
    });
  };

  const handleScanDevices = () => {
    setBluetoothConnectState("scanning");
    // 模拟扫描设备
    setTimeout(() => {
      setScannedDevices([
        { name: "膝盖训练器 Pro", address: "00:1A:7D:DA:71:13", rssi: -45, paired: false, connected: false },
        { name: "腿部设备", address: "00:1A:7D:DA:71:14", rssi: -65, paired: true, connected: false },
        { name: "膝盖护理器", address: "00:1A:7D:DA:71:15", rssi: -72, paired: false, connected: false },
      ]);
    }, 2000);
  };

  const handlePairDevice = (device: BluetoothDevice) => {
    setBluetoothConnectState("pairing");
    // 模拟配对过程
    setTimeout(() => {
      setBluetoothConnectState("verifying");
      setTimeout(() => {
        setBluetoothConnectState("connected");
        setDeviceState("idle");
        setUserData(prev => ({
          ...prev,
          connectedDevice: { ...device, paired: true, connected: true, pairedAt: Date.now() },
          pairedDevices: [...(prev.pairedDevices || []), device]
        }));
        setReconnectAttempts(0);
      }, 1500);
    }, 2000);
  };

  const handleCancelBluetoothConfig = () => {
    setBluetoothConnectState("not_configured");
    setScannedDevices([]);
    setScreen("home");
  };

  const tasks = currentDay === 1 ? DAY1_TASKS : currentDay === 7 ? DAY7_TASKS : DAILY_TASKS;
  const showOnboardingBanner = userData.firstTime || !userData.name || !userData.gender || !userData.ageRange;

  return (
    <div style={{
      height: "100vh", width: "100vw",
      display: "flex", flexDirection: "column",
      background: "#F7F8FA",
      fontFamily: "'Noto Sans SC', 'PingFang SC', 'Helvetica Neue', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, width: "calc(100% - 32px)", maxWidth: 360, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => dismissToast(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 12,
              background: t.type === "success" ? "#ecfdf5" : t.type === "error" ? "#fef2f2" : t.type === "warn" ? "#fffbeb" : "#eff6ff",
              border: `1px solid ${t.type === "success" ? "#86efac" : t.type === "error" ? "#fca5a5" : t.type === "warn" ? "#fcd34d" : "#93c5fd"}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              fontSize: 13, fontWeight: 500,
              color: t.type === "success" ? "#15803d" : t.type === "error" ? "#dc2626" : t.type === "warn" ? "#92400e" : "#1e40af",
              pointerEvents: "auto", cursor: "pointer",
            }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : t.type === "warn" ? "⚠️" : "ℹ️"}</span>
            <span style={{ flex: 1 }}>{t.msg}</span>
          </div>
        ))}
      </div>
      {screen === "wechat-login" && (
        <WeChatLogin
          onLogin={(name) => {
            setUserData(prev => ({ ...prev, name }));
            setScreen("onboarding");
          }}
          onSkip={() => setScreen("onboarding")}
        />
      )}
      {screen === "onboarding" && <Onboarding onDone={(smartModeParam, next) => {
        setSmartMode(smartModeParam);
        if (smartModeParam) {
          // 智能模式：跳转到小瑞，直接开始评估
          setScreen("home");
          setTab("assistant");
          setPhase("smart_intro");
          setTimeout(() => {
            addMsg("bot", "你好！我是小瑞，你的护膝助手。先了解一下你的情况，帮你找到最合适的方案。");
            setTimeout(() => {
              // 直接启动评估，无需用户点击确认
              setSurveyStep(userData.name ? "safety" : "new_user");
            }, 1200);
          }, 500);
          return;
        }
        // 非智能模式：根据next路由
        if (next === "assessment") { setScreen("manual-assessment"); return; }
        if (next === "quick-training") { setScreen("quick-training"); return; }
        setScreen("home");
        setTab("home");
      }} />}

      {screen === "bluetooth-config" && (
        <div style={{ padding: "20px", background: "#f5f5f5", height: "100vh", overflow: "auto" }}>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={handleCancelBluetoothConfig}
              style={{
                padding: "8px 16px",
                background: "#f0f0f0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold"
              }}
            >
              ← 返回
            </button>
          </div>
          <BluetoothConfigWizard
            state={bluetoothConnectState}
            permissions={permissionStatus}
            pairedDevices={userData.pairedDevices || []}
            connectedDevice={userData.connectedDevice}
            scannedDevices={scannedDevices}
            onPermissionRequest={(type) => {
              setPendingPermissionType(type);
              setShowPermissionDialog(true);
            }}
            onScan={handleScanDevices}
            onPair={handlePairDevice}
            onConnect={handlePairDevice}
            onCancel={handleCancelBluetoothConfig}
          />
        </div>
      )}

      <PermissionRequest
        show={showPermissionDialog}
        type={pendingPermissionType || "bluetooth"}
        onRequest={handleRequestPermission}
        onCancel={() => {
          setShowPermissionDialog(false);
          setPendingPermissionType(null);
        }}
      />

      {screen === "home" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", position: "relative" }}>
          {tab === "home" && <HomePage
            userName={userData.name || "用户"}
            streak={0}
            weekDone={currentDay - 1}
            weekTotal={7}
            showOnboardingBanner={showOnboardingBanner}
            onShowOnboarding={() => { setTab("profile"); setOpenProfileEdit(true); }}
            onConfigureBluetoothClick={() => {
              setScreen("bluetooth-config");
              setBluetoothConnectState("permission_needed");
            }}
            onAssessmentDone={(result) => {
              // Convert stiffness string to numeric representation if needed
              const stiffnessMap: Record<string, number> = {
                "无": 0,
                "有点紧": 1,
                "很紧": 2,
                "轻微受限": 1
              };
              setUserData((prev: UserData) => ({
                ...prev,
                ...result,
                stiffness: stiffnessMap[result.stiffness] ?? null
              }));
            }}
            onDeviceStart={(level: number, custom?: {pressure:number;work:number;rest:number;cycles:number}) => {
              const params = custom ?? (LEVEL_PARAMS[level - 1] || LEVEL_PARAMS[1]);
              setUserData(prev => ({
                ...prev,
                pressure: params.pressure, workSec: params.work, restSec: params.rest,
                cycles: params.cycles, baseLevel: level, finalLevel: level,
              }));
              const total = (params.work + params.rest) * params.cycles;
              setHwLevel(level); setHwTotal(total); setHwRemaining(total);
              setHwCycle(1); setHwTotalCycles(params.cycles);
              if (deviceState === "disconnected") setDeviceState("idle");
              setTimeout(() => { setHwState("running"); setDeviceState("running"); }, 500);
            }}
            onDeviceMinimize={() => { /* device keeps running via FloatBall */ }}
            deviceState={deviceState}
            hwLevel={hwLevel} hwRemaining={hwRemaining} hwTotal={hwTotal}
            hwCycle={hwCycle} hwTotalCycles={hwTotalCycles}
            onTogglePause={handleTogglePause} onStop={handleStop} onReset={handleReset}
            userGender={userData.gender}
            userAgeRange={userData.ageRange}
            stiffness={typeof userData.stiffness === 'number' ? userData.stiffness : null}
          />}
          {tab === "training" && <TrainingPage />}
          {tab === "assistant" && (
            <AssistantPage
              msgs={msgs}
              phase={phase}
              tasks={tasks}
              taskIdx={taskIdx}
              currentDay={currentDay}
              ud={userData}
              thinking={thinking}
              messagesRef={messagesRef}
              smartMode={smartMode}
              addMsg={addMsg}
              simulateThinking={simulateThinking}
              askBot={askBot}
              setPhase={setPhase}
              onToggleSmartMode={() => {
                const newMode = !smartMode;
                setSmartMode(newMode);
                if (newMode && msgs.length === 0) {
                  setPhase("smart_intro");
                  setTimeout(() => {
                    addMsg("bot", "你好！我是小瑞，你的膝盖训练搭档。先了解一下你的情况，帮你找到最合适的方案。");
                    setTimeout(() => {
                      setPhase("smart_confirm_assessment");
                    }, 1000);
                  }, 500);
                }
              }}
              onSubmitDuration={(d) => {
                setUserData((prev: UserData) => ({ ...prev, duration: d }));
                addMsg("user", d, "day1_duration");
                simulateThinking(() => {
                  addMsg("bot", "明白了。接下来问一下，早上起床或久坐后，膝盖会不会有僵硬、不灵活的感觉？");
                  setPhase("day1_stiffness");
                });
              }}
              onSubmitStiffness={(l) => {
                const base = l === 0 ? 2 : l === 1 ? 3 : 4;
                setUserData((prev: UserData) => ({ ...prev, stiffness: l, baseLevel: base }));
                addMsg("user", l === 0 ? "没有特别感觉" : l === 1 ? "有点紧" : "很紧", "day1_stiffness");
                simulateThinking(() => {
                  addMsg("bot", "好的，记下来了。现在告诉我，哪个动作最容易让你的膝盖不舒服？");
                  setPhase("day1_triggers");
                }, 600);
              }}
              onGoToNextDay={() => {
                const today = new Date().toISOString().split("T")[0];
                const last = userData.lastTrainingDate;
                const dayGap = last ? Math.floor((new Date(today).getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)) : 0;

                setMsgs([]);
                setTaskIdx(0);

                // 特殊场景：同一天第二次使用
                if (last === today && userData.sessionsToday >= 1) {
                  addMsg("bot", `${userData.name}，今天第二次训练，继续使用当前方案！`);
                  setTimeout(() => setPhase("daily_recommend"), 500);
                  return;
                }

                // 特殊场景：中断超过14天，重新评估
                if (dayGap >= 14) {
                  setCurrentDay(1);
                  setPhase("day1_stiffness");
                  setUserData(prev => ({ ...prev, baseLevel: 2, finalLevel: 2 }));
                  simulateThinking(() => {
                    addMsg("bot", `欢迎回来！距上次训练已${dayGap}天，为了安全，建议重新评估。`);
                    setTimeout(() => setPhase("day1_stiffness"), 600);
                  }, 500);
                  return;
                }

                // 特殊场景：中断7-14天，继续日常流程但保持等级
                if (dayGap >= 7) {
                  setCurrentDay(prev => prev + 1);
                  setPhase("daily_feel");
                  simulateThinking(() => {
                    addMsg("bot", `欢迎回来！距上次训练${dayGap}天，继续按当前方案进行。今天膝盖感觉如何？`);
                  }, 500);
                  return;
                }

                // 正常流程
                setCurrentDay((prev: number) => prev + 1);

                if (currentDay === 6) {
                  // Day 7: 先正常使用设备，使用完后再复评
                  setPhase("daily_feel");
                  simulateThinking(() => {
                    addMsg("bot", `${userData.name}，今天是第7天，完成使用后我们一起做阶段回顾！先告诉我今天膝盖感觉如何？`);
                  }, 500);
                } else {
                  setPhase("daily_feel");
                  simulateThinking(() => {
                    addMsg("bot", `${userData.name}，第${currentDay + 1}天开始啦！今天膝盖感觉如何？`);
                  }, 500);
                }
              }}
              onSubmitDailyFeel={(f) => {
                setUserData((prev: UserData) => ({ ...prev, dailyFeel: f }));
                addMsg("user", f === "better" ? "😊 好多了" : f === "same" ? "😐 还行" : "😣 还是不舒服");
                simulateThinking(() => {
                  setTaskIdx(1);
                  setPhase("daily_recommend");
                  const msg = f === "better"
                    ? "🎉 看到进步了！建议继续保持当前方案。"
                    : f === "same"
                    ? "👍 状态稳定。建议继续完成本阶段计划。"
                    : "⚠️ 最近状态有所波动。请留意活动量变化，如持续不适请及时反馈。";
                  addMsg("bot", msg);
                });
              }}
              onReset={() => {
                setScreen("onboarding");
                setTab("home");
                setCurrentDay(1);
                setPhase("day1_survey");
                setMsgs([]);
                setTaskIdx(0);
                setUserData({
                  name: "", gender: "", ageRange: "", duration: "",
                  safety: [], stiffness: null, baseLevel: 2,
                  triggers: [], mainTrigger: "",
                  painLevel: 0, finalLevel: 2,
                  firstTime: true,
                  dailyRecords: {},
                  pressure: 0, workSec: 0, restSec: 0, cycles: 0,
                  dailyFeel: "",
                  postUseFeel: "",
                  earlyStopReason: "",
                  postTrainingPain: 0,
                  postTrainingStrength: 0,
                  day7Trigger: "", day7Pain: 0, day7Feel: "",
                });
              }}
              day1PainRef={day1PainRef}
              onStartAssessment={() => setScreen("manual-assessment")}
              onStartTraining={() => setScreen("quick-training")}
              setUserData={setUserData}
              setSurveyStep={setSurveyStep}
              setTaskIdx={setTaskIdx}
              setMsgs={setMsgs}
              setTab={setTab}
              onStartDevice={(level: number) => {
                const params = LEVEL_PARAMS[level - 1] || LEVEL_PARAMS[1];
                setUserData(prev => ({
                  ...prev,
                  pressure: params.pressure,
                  workSec: params.work,
                  restSec: params.rest,
                  cycles: params.cycles,
                  baseLevel: level,
                  finalLevel: level
                }));
                const total = (params.work + params.rest) * params.cycles;
                setHwLevel(level);
                setHwTotal(total);
                setHwRemaining(total);
                setHwCycle(1);
                setHwTotalCycles(params.cycles);
                if (deviceState === "disconnected") {
                  setDeviceState("idle");
                }
                setTimeout(() => {
                  setHwState("running");
                  setDeviceState("running");
                }, 500);
              }}
              deviceState={deviceState}
            />
          )}
          {tab === "discover" && <DiscoverPage />}
          {tab === "profile" && <ProfilePage
            userName={userData?.name||"用户"}
            onLogout={()=>setScreen("wechat-login")}
            userData={{ name: userData?.name||"", gender: userData?.gender||"", ageRange: userData?.ageRange||"" }}
            onSaveProfile={(d) => setUserData(p => ({ ...p, name: d.name, gender: d.gender, ageRange: d.ageRange }))}
            initialSubView={openProfileEdit ? "edit-profile" : undefined}
            onSubViewEntered={() => setOpenProfileEdit(false)}
          />}

          <FloatBall
            deviceState={deviceState}
            hwLevel={hwLevel}
            hwCycle={hwCycle}
            hwTotalCycles={hwTotalCycles}
            hwRemaining={hwRemaining}
            hwTotal={hwTotal}
            onConnect={handleConnect}
            onStart={handleStart}
            onTogglePause={handleTogglePause}
            onStop={handleStop}
            onReset={handleReset}
          />

          <BottomNav active={tab} onChange={setTab} />
        </div>
      )}

      {screen === "manual-assessment" && <ManualAssessment
        onBack={() => setScreen("home")}
        existingData={{ name: userData.name, gender: userData.gender, ageRange: userData.ageRange }}
        onDone={(result) => {
          setUserData((prev: UserData) => ({...prev, ...result, stiffness: null}));
          setScreen("home");
        }}
      />}
      {screen === "quick-training" && <QuickTraining onBack={() => setScreen("home")} />}

      <SurveyModal
        open={surveyStep !== null}
        onClose={() => setSurveyStep(null)}
        step={surveyStep}
        userData={userData}
        onSubmit={(data) => {
          setUserData((prev: UserData) => ({ ...prev, ...data }));
          setSurveyStep(null);

          // Day 1训练完成后问卷链式触发
          if (surveyStep === "new_user") {
            setTimeout(() => setSurveyStep("safety"), 300);
          } else if (surveyStep === "safety") {
            const hasSevere = data.safety?.includes("显著受损");
            const hasOtherIssues = data.safety?.some((s: string) => ["受伤", "肿胀", "伤口", "医生建议"].includes(s));
            const safe = data.safety?.includes("无");

            if (hasSevere) {
              // 选项5：直接设置L1强度，跳过所有评估，直接进入推荐
              setUserData((prev: UserData) => ({
                ...prev,
                finalLevel: 1,
                baseLevel: 1,
                stiffness: null,
                triggers: [],
                mainTrigger: "",
                painLevel: 0
              }));
              simulateThinking(() => {
                addMsg("bot", "考虑到你的情况，我为你推荐<strong>L1（低）</strong>强度开始。");
                setTaskIdx(1);
                setTimeout(() => setPhase("day1_recommend"), 800);
              }, 500);
            } else if (hasOtherIssues) {
              // 选项1-4：显示警告和科普按钮
              simulateThinking(() => {
                addMsg("bot", "根据你的情况，建议先休息 1-2 天或咨询专业医生。");
                setPhase("safety_warning");
              }, 500);
            } else if (safe) {
              // 选项6：正常继续
              simulateThinking(() => {
                addMsg("bot", "好的！接下来问一下，早上起床或久坐后，膝盖会不会有僵硬的感觉？");
                setPhase("day1_stiffness");
              }, 500);
            }
          } else if (surveyStep === "day1_post_use") {
            const feelLabels: Record<string,string> = {good:"1 — 很好，没有不适",neutral:"2 — 没什么感觉",mild:"3 — 稍为不适应",skin:"4 — 膝盖周围皮肤明显不适"};
            addMsg("user", feelLabels[data.postUseFeel] ?? data.postUseFeel);
            if (data.postUseFeel === "skin") {
              setUserData((prev: UserData) => ({
                ...prev,
                finalLevel: Math.max(1, prev.finalLevel - 1),
              }));
              simulateThinking(() => {
                addMsg("bot", "我已记录你的反馈，已为你降低下次训练强度。");
                setTimeout(() => setPhase("day1_optimize"), 800);
              }, 500);
            } else {
              setTimeout(() => setSurveyStep("day1_strength"), 300);
            }
          } else if (surveyStep === "day1_strength") {
            const strengthLabels: Record<string,string> = {weak:"偏轻 — 我还能承受更强",ok:"刚刚好 — 正合适",strong:"有点强 — 需要降低"};
            addMsg("user", strengthLabels[data.dailyFeel] ?? data.dailyFeel);
            if (data.dailyFeel === "strong") {
              setUserData((prev: UserData) => ({
                ...prev,
                finalLevel: Math.max(1, prev.finalLevel - 1),
              }));
              simulateThinking(() => {
                addMsg("bot", "好的，已为你降低下次训练强度，循序渐进更安全。");
                setTimeout(() => setPhase("day1_optimize"), 800);
              }, 500);
            } else if (data.dailyFeel === "weak") {
              setUserData((prev: UserData) => ({
                ...prev,
                finalLevel: Math.min(6, prev.finalLevel + 1),
              }));
              simulateThinking(() => {
                addMsg("bot", "好的，已为你提高下次训练强度，继续加油！");
                setTimeout(() => setPhase("day1_optimize"), 800);
              }, 500);
            } else {
              simulateThinking(() => {
                addMsg("bot", "强度刚刚好，下次保持这个方案继续！");
                setTimeout(() => setPhase("day1_optimize"), 800);
              }, 500);
            }
          }
          // Day 7复评流程链式触发
          else if (surveyStep === "day7_trigger") {
            if (data.day7Trigger === "") {
              // 用户选择"换了"，需要重新选择触发动作
              setTimeout(() => setSurveyStep("day7_new_trigger"), 300);
            } else {
              // 用户选择"还是这个"，直接评估疼痛程度
              setTimeout(() => setSurveyStep("day7_pain"), 300);
            }
          } else if (surveyStep === "day7_new_trigger") {
            // 新触发动作选择完成，评估疼痛程度
            setTimeout(() => setSurveyStep("day7_pain"), 300);
          } else if (surveyStep === "day7_pain") {
            // 疼痛评估完成，询问整体感受
            setTimeout(() => setSurveyStep("day7_feel"), 300);
          } else if (surveyStep === "day7_feel") {
            // 整体感受完成，询问皮肤状况
            setTimeout(() => setSurveyStep("day7_skin"), 300);
          } else if (surveyStep === "day7_skin") {
            // 所有问卷完成，显示总结
            simulateThinking(() => {
              setTaskIdx(1);
              setPhase("day7_summary");
              addMsg("bot", "感谢你完成回顾！让我为你生成阶段总结报告。");
            }, 500);
          }
        }}
      />
      <StopReasonModal
        open={showStopModal}
        onClose={(reasons) => {
          setShowStopModal(false);
          isEarlyStopRef.current = false;
          addMsg("user", reasons.join("、"));
          const hasEncouragementReasons = reasons.some(r => ["忘记了", "没时间", "效果不明显"].includes(r));
          simulateThinking(() => {
            if (hasEncouragementReasons) {
              addMsg("bot", "我已记录。建议持续使用2周以上，效果会更明显。");
            } else {
              addMsg("bot", "我已记录。");
            }
            if (phase === "day1_therapy") {
              setTaskIdx(3);
              setTimeout(() => {
                addMsg("bot", "用完啦，说说感受吧。");
                setTimeout(() => setSurveyStep("day1_post_use"), 600);
              }, 800);
            } else if (phase === "daily_therapy") {
              setTaskIdx(3);
              simulateThinking(() => {
                addMsg("bot", "今日使用完成！");
                setTimeout(() => {
                  addMsg("bot", "让我为你生成今日总结。");
                  setTimeout(() => {
                    setPhase("daily_optimize");
                    setTimeout(() => {
                      addMsg("bot", "记得查看下方「训练」tab 跟练运动，或者到「发现」tab 了解更多膝盖训练技巧！");
                    }, 800);
                  }, 800);
                }, 600);
              }, 500);
            }
          });
        }}
      />
    </div>
  );
}
