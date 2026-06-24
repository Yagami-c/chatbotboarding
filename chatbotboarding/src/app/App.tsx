import { useState, useEffect, useRef } from "react";
import { AppScreen, Tab, UserData, Msg, Task, Phase, SurveyStep, HwState, DeviceState, LEVEL_PARAMS, LEVELS, getLevelName, formatTime, LEVEL_DESCS } from "./types";
import { FloatBall, BtnRow, Pill, FormCard, FormGroup, StyledInput, SubmitBtn, ResultCard, InfoBox, ThinkingDots, Stars, BottomNav } from "./components/shared";
import { Onboarding } from "./components/Onboarding";
import { HomePage } from "./components/HomePage";
import { ManualAssessment } from "./components/ManualAssessment";
import { QuickTraining } from "./components/QuickTraining";
import { Day7Intro } from "./components/Day7Intro";
import { TrainingPage } from "./components/TrainingPage";
import { DiscoverPage } from "./components/DiscoverPage";
import { ProfilePage } from "./components/ProfilePage";

// ── Constants ─────────────────────────────────────────────────────────────────

const LEVEL_NAMES: Record<number,string> = {1:"L1（低）",2:"L2（中低）",3:"L3（中）",4:"L4（中高）",5:"L5（高）",6:"L6（最高）"};

const DAY1_TASKS: Task[] = [
  {title:"小瑞了解你",desc:"基本信息 & 评估"},{title:"推荐方案",desc:"生成初始强度"},
  {title:"陪伴治疗",desc:"设备控制"},{title:"记录变化",desc:"使用反馈"},{title:"持续优化",desc:"调整下次强度"},
];
const DAILY_TASKS: Task[] = [
  {title:"小瑞了解你",desc:"今日感觉"},{title:"推荐方案",desc:"基于反馈调整"},
  {title:"陪伴治疗",desc:"设备控制"},{title:"记录变化",desc:"完成情况"},{title:"持续优化",desc:"调整下次"},
];
const DAY7_TASKS: Task[] = [
  {title:"阶段复评",desc:"触发动作 & 不适程度"},{title:"7天总结",desc:"与开始时对比"},
  {title:"下阶段方案",desc:"优化推荐"},
];

// ── Task breakdown ─────────────────────────────────────────────────────────────

function TaskBreakdown({tasks,current}: {tasks:Task[];current:number}) {
  if(!tasks.length) return null;
  return (
    <div className="bg-[#f8fafc] px-4 py-3 border-b border-[#edf2f7] max-h-40 overflow-y-auto flex-shrink-0">
      {tasks.map((t,i)=>{
        const done=i<current, active=i===current;
        return (
          <div key={i} className="relative flex items-start gap-3 py-1.5">
            {i<tasks.length-1&&<span className={`absolute left-[10px] top-7 bottom-0 w-0.5 ${done?"bg-[#48bb78]":"bg-[#e2e8f0]"}`}/>}
            <span className={`relative z-10 w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold
              ${done?"bg-[#48bb78] text-white":active?"bg-[#2ECC71] text-white shadow-[0_0_0_4px_rgba(46,204,113,0.2)]":"bg-[#e2e8f0] text-[#a0aec0]"}`}>
              {done?"✅":active?"⏳":"⏸"}
            </span>
            <div className="flex-1 text-sm text-[#4a5568] pt-0.5">
              <strong className="text-[#1a202c] font-semibold">{t.title}</strong>
              <span className="block text-xs text-[#a0aec0] mt-0.5">{t.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Survey forms ───────────────────────────────────────────────────────────────

function NewUserSurvey({onDone}:{onDone:(n:string,g:string,a:string)=>void}) {
  const [name,setName]=useState("");const [g,setG]=useState("");const [a,setA]=useState("");
  return (
    <div>
      <FormGroup label="你希望我怎么称呼你呢？"><StyledInput value={name} onChange={e=>setName(e.target.value)} placeholder="输入昵称"/></FormGroup>
      <FormGroup label="性别"><BtnRow><Pill label="👨 男" primary={g==="男"} onClick={()=>setG("男")}/><Pill label="👩 女" primary={g==="女"} onClick={()=>setG("女")}/><Pill label="其他" primary={g==="其他"} onClick={()=>setG("其他")}/></BtnRow></FormGroup>
      <FormGroup label="年龄范围"><BtnRow>{["20岁以下","20-40岁","40-60岁","60岁以上"].map(v=><Pill key={v} label={v} primary={a===v} onClick={()=>setA(v)}/>)}</BtnRow></FormGroup>
      <SubmitBtn label="确定" onClick={()=>{if(!name.trim()){alert("请先输入昵称");return;}if(!g){alert("请选择性别");return;}if(!a){alert("请选择年龄范围");return;}onDone(name.trim(),g,a);}}/>
    </div>
  );
}
function ReturnerSurvey({onDone}:{onDone:(g:string,a:string)=>void}) {
  const [g,setG]=useState("");const [a,setA]=useState("");
  return (
    <div>
      <FormGroup label="性别"><BtnRow><Pill label="👨 男" primary={g==="男"} onClick={()=>setG("男")}/><Pill label="👩 女" primary={g==="女"} onClick={()=>setG("女")}/><Pill label="其他" primary={g==="其他"} onClick={()=>setG("其他")}/></BtnRow></FormGroup>
      <FormGroup label="年龄范围"><BtnRow>{["20岁以下","20-40岁","40-60岁","60岁以上"].map(v=><Pill key={v} label={v} primary={a===v} onClick={()=>setA(v)}/>)}</BtnRow></FormGroup>
      <SubmitBtn label="确定" onClick={()=>{if(!g||!a){alert("请完整填写");return;}onDone(g,a);}}/>
    </div>
  );
}
function SafetySurvey({onSubmit}:{onSubmit:(v:string[])=>void}) {
  const [local,setLocal]=useState<Record<string,boolean>>({});
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">请问目前是否有以下情况？（可多选）</p>
      <FormCard>
        {[{v:"受伤",l:"最近2周内有明显膝盖受伤"},{v:"肿胀",l:"膝盖明显肿胀/发烫"},{v:"伤口",l:"膝盖周围有伤口或皮肤问题"},{v:"医生建议",l:"医生建议避免使用类似设备"},{v:"无",l:"以上都没有"}].map(({v,l})=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="checkbox" checked={!!local[v]} onChange={e=>setLocal(p=>({...p,[v]:e.target.checked}))}/>{l}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{const vals=Object.entries(local).filter(([,v])=>v).map(([k])=>k);if(!vals.length){alert("请至少选择一项");return;}onSubmit(vals);}}/>
    </div>
  );
}
function TriggerSurvey({onSubmit}:{onSubmit:(v:string[])=>void}) {
  const [local,setLocal]=useState<Record<string,boolean>>({});
  const items=["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","其他","无"];
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-2">可多选</p>
      <FormCard>
        {items.map(v=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="checkbox" checked={!!local[v]} onChange={e=>setLocal(p=>({...p,[v]:e.target.checked}))}/>{v}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{const vals=Object.entries(local).filter(([,v])=>v).map(([k])=>k);if(!vals.length){alert("请至少选择一项");return;}onSubmit(vals);}}/>
    </div>
  );
}
function PainSurvey({trigger,onSubmit}:{trigger:string;onSubmit:(v:number)=>void}) {
  const [val,setVal]=useState<number|null>(null);
  const opts=["0 — 无不适","1 — 轻微不适（不影响完成）","2 — 中等不适（明显不舒服）","3 — 较重不适（需减慢速度）","4 — 非常不适（难以完成）"];
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">触发动作：{trigger}，不适程度是？</p>
      <FormCard>
        {opts.map((l,i)=>(
          <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="radio" name="pain_q" checked={val===i} onChange={()=>setVal(i)}/>{l}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{if(val===null){alert("请选择不适程度");return;}onSubmit(val);}}/>
    </div>
  );
}
function PostUseSurvey({onDone}:{onDone:(feel:string)=>void}) {
  const [val,setVal]=useState("");
  const opts=[{v:"good",l:"1 — 很好，没有不适"},{v:"neutral",l:"2 — 没什么感觉"},{v:"mild",l:"3 — 稍为不适应"},{v:"skin",l:"4 — 膝盖周围皮肤明显不适"}];
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">今天整体感觉如何？</p>
      <FormCard>
        {opts.map(({v,l})=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="radio" name="post_use" checked={val===v} onChange={()=>setVal(v)}/>{l}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function StrengthSurvey({onDone}:{onDone:(strength:string)=>void}) {
  const [val,setVal]=useState("");
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">当前模式强度感觉如何？</p>
      <BtnRow>
        <Pill label="偏轻" primary={val==="weak"} onClick={()=>setVal("weak")}/>
        <Pill label="合适" primary={val==="ok"} onClick={()=>setVal("ok")}/>
        <Pill label="偏强" primary={val==="strong"} onClick={()=>setVal("strong")}/>
      </BtnRow>
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function DailyReasonSurvey({onDone}:{onDone:(r:string)=>void}) {
  const [reason,setReason]=useState("");
  const opts=[{v:"forgot",l:"忘记了"},{v:"no_time",l:"没有时间"},{v:"no_effect",l:"效果不明显"},{v:"discomfort",l:"使用不舒服"},{v:"other",l:"其他"}];
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">今天养护未完成，主要原因是？</p>
      <FormCard>
        {opts.map(({v,l})=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="radio" name="daily_reason" checked={reason===v} onChange={()=>setReason(v)}/>{l}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{if(!reason){alert("请选择");return;}onDone(reason);}}/>
    </div>
  );
}
function Day7TriggerSurvey({mainTrigger,onDone}:{mainTrigger:string;onDone:(same:boolean)=>void}) {
  return (
    <div>
      <div className="bg-[#f0f9ff] rounded-xl p-3 mb-4 text-sm">
        <div className="text-[#0369a1] font-medium mb-1">📍 7天前记录</div>
        <div className="text-[#1a202c]">最困扰的动作：<strong>{mainTrigger}</strong></div>
      </div>
      <p className="text-sm text-[#4a5568] mb-3">现在最容易让你膝盖不舒服的动作<br/>还是「{mainTrigger}」吗？</p>
      <BtnRow>
        <Pill label="✅ 还是这个" primary onClick={()=>onDone(true)}/>
        <Pill label="🔄 换了" onClick={()=>onDone(false)}/>
      </BtnRow>
    </div>
  );
}
function Day7NewTriggerSurvey({onDone}:{onDone:(trigger:string)=>void}) {
  const [val,setVal]=useState("");
  const items=["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","没有明显诱因"];
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">今天最容易让膝盖不舒服的动作是？</p>
      <FormCard>
        {items.map(v=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="radio" name="day7_trigger" checked={val===v} onChange={()=>setVal(v)}/>{v}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function Day7FeelSurvey({onDone}:{onDone:(feel:string)=>void}) {
  const [val,setVal]=useState("");
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">这7天整体感觉如何？</p>
      <FormCard>
        {[{v:"better",l:"改善了"},{v:"same",l:"差不多"},{v:"worse",l:"变差了"}].map(({v,l})=>(
          <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
            <input type="radio" name="day7_feel" checked={val===v} onChange={()=>setVal(v)}/>{l}
          </label>
        ))}
      </FormCard>
      <SubmitBtn label="确定" onClick={()=>{if(!val){alert("请选择");return;}onDone(val);}}/>
    </div>
  );
}
function Day7SkinSurvey({onDone}:{onDone:(hasSkin:boolean)=>void}) {
  return (
    <div>
      <p className="text-sm text-[#4a5568] mb-3">是否出现膝盖周围皮肤明显不适？</p>
      <BtnRow>
        <Pill label="是，皮肤有不适" onClick={()=>onDone(true)}/>
        <Pill label="否" primary onClick={()=>onDone(false)}/>
      </BtnRow>
    </div>
  );
}

// ── Mid-session stop modal (AI mode) ─────────────────────────────────────────

function StopReasonModal({open,onClose}:{open:boolean;onClose:(reasons:string[])=>void}) {
  const [local,setLocal]=useState<Record<string,boolean>>({});
  const OPTS=["忘记了","没时间","效果不明显","使用不舒服","其他"];
  if(!open) return null;
  return (
    <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
      <div className="bg-white w-full rounded-t-3xl p-6">
        <div className="text-lg font-bold text-[#1a202c] mb-1">⏹ 训练已结束</div>
        <p className="text-sm text-[#4a5568] mb-4">今天没有完成预定治疗，主要原因是什么？（可多选）</p>
        {OPTS.map(r=>(
          <label key={r} className="flex items-center gap-2 py-2 cursor-pointer text-sm text-[#2d3748]">
            <input type="checkbox" checked={!!local[r]} onChange={e=>setLocal(p=>({...p,[r]:e.target.checked}))} className="accent-[#2ECC71]"/>
            {r}
          </label>
        ))}
        <div className="bg-[#ecfdf5] border border-[#6ee7b7] rounded-xl p-3 my-3 text-sm text-[#065f46]">
          💪 持之以恒，有助康复！明天记得继续哦～
        </div>
        <button onClick={()=>{onClose(Object.entries(local).filter(([,v])=>v).map(([k])=>k));setLocal({});}}
          className="w-full py-3 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer">
          确定
        </button>
      </div>
    </div>
  );
}

// ── Survey Modal ──────────────────────────────────────────────────────────────

function SurveyModal({open,onClose,step,userData,onSubmit}:{
  open:boolean;onClose:()=>void;step:SurveyStep;userData:UserData;onSubmit:(data:Partial<UserData>)=>void;
}) {
  if(!open||!step) return null;
  return (
    <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",borderRadius:28}}>
      <div className="bg-white w-full rounded-t-3xl p-5 max-h-[85%] overflow-y-auto">
        <div className="text-lg font-bold text-[#1a202c] mb-4">
          {step==="new_user"?"👋 初次见面"
          :step==="returner"?"👋 欢迎回来"
          :step==="safety"?"⚠️ 安全评估"
          :step==="triggers"?"🤔 触发动作"
          :step==="pain"?"📊 不适程度"
          :step==="day1_post_use"?"💭 使用感受"
          :step==="day1_strength"?"💪 强度感受"
          :step==="daily_reason"?"📝 未完成原因"
          :step==="day7_trigger"?"🔄 触发动作复评"
          :step==="day7_new_trigger"?"🔄 新触发动作"
          :step==="day7_pain"?"📊 不适程度"
          :step==="day7_feel"?"💭 整体感受"
          :step==="day7_skin"?"🩹 皮肤状况"
          :"问卷"}
        </div>
        {step==="new_user"&&<NewUserSurvey onDone={(n,g,a)=>{onSubmit({name:n,gender:g,ageRange:a,firstTime:true});onClose();}}/>}
        {step==="returner"&&<ReturnerSurvey onDone={(g,a)=>{onSubmit({gender:g,ageRange:a,firstTime:false});onClose();}}/>}
        {step==="safety"&&<SafetySurvey onSubmit={v=>{onSubmit({safety:v});onClose();}}/>}
        {step==="triggers"&&<TriggerSurvey onSubmit={v=>{onSubmit({triggers:v});onClose();}}/>}
        {step==="pain"&&<PainSurvey trigger={userData.mainTrigger||"触发动作"} onSubmit={v=>{onSubmit({painLevel:v});onClose();}}/>}
        {step==="day1_post_use"&&<PostUseSurvey onDone={f=>{onSubmit({dailyFeel:f});onClose();}}/>}
        {step==="day1_strength"&&<StrengthSurvey onDone={s=>{onSubmit({dailyFeel:s});onClose();}}/>}
        {step==="daily_reason"&&<DailyReasonSurvey onDone={r=>{onSubmit({dailyFeel:r});onClose();}}/>}
        {step==="day7_trigger"&&<Day7TriggerSurvey mainTrigger={userData.mainTrigger} onDone={same=>{onSubmit({day7Trigger:same?userData.mainTrigger:""});onClose();}}/>}
        {step==="day7_new_trigger"&&<Day7NewTriggerSurvey onDone={t=>{onSubmit({day7Trigger:t});onClose();}}/>}
        {step==="day7_pain"&&<PainSurvey trigger={userData.day7Trigger||userData.mainTrigger||"触发动作"} onSubmit={v=>{onSubmit({day7Pain:v});onClose();}}/>}
        {step==="day7_feel"&&<Day7FeelSurvey onDone={f=>{onSubmit({day7Feel:f});onClose();}}/>}
        {step==="day7_skin"&&<Day7SkinSurvey onDone={hasSkin=>{onSubmit({dailyFeel:hasSkin?"skin":"no_skin"});onClose();}}/>}
      </div>
    </div>
  );
}

// ── AssistantPage ─────────────────────────────────────────────────────────────

function AssistantPage({msgs,phase,tasks,taskIdx,currentDay,ud,thinking,messagesRef,
  onSubmitDuration,onSubmitStiffness,onGoToNextDay,onSubmitDailyFeel,onReset,
  day1PainRef,onStartAssessment,onStartTraining,smartMode,onToggleSmartMode}:{
  msgs:Msg[];phase:Phase;tasks:Task[];taskIdx:number;currentDay:number;ud:UserData;
  thinking:boolean;messagesRef:React.RefObject<HTMLDivElement|null>;
  onSubmitDuration:(d:string)=>void;onSubmitStiffness:(l:number)=>void;
  onGoToNextDay:()=>void;onSubmitDailyFeel:(f:string)=>void;onReset:()=>void;
  day1PainRef:React.RefObject<number>;
  onStartAssessment:()=>void;onStartTraining:()=>void;
  smartMode:boolean;onToggleSmartMode:()=>void;
}) {
  const lv=ud.finalLevel;
  const prm=LEVEL_PARAMS[lv-1]||LEVEL_PARAMS[1];
  const total=prm.cycles*(prm.work+prm.rest);
  const day1Pain=day1PainRef.current||0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{minHeight:0}}>
      <div className="px-4 pt-3 pb-1.5 bg-[#fafcff] border-b border-[#e9ecf0] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧑‍⚕️</span>
            <div>
              <div className="font-bold text-base text-[#1a202c]">小瑞 · <span className="text-[#2ECC71]">AI 康复助手</span></div>
              <div className="text-[11px] text-[#48bb78] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] inline-block"/>
                在线 · 7天疗程
                <span className="bg-[#2ECC71] text-white px-3 py-0.5 rounded-full ml-2 text-[11px] font-medium">第{currentDay}天</span>
              </div>
            </div>
          </div>
          {/* Smart mode toggle - top right */}
          <button onClick={onToggleSmartMode}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-0 cursor-pointer flex-shrink-0
              ${smartMode?"bg-[#2ECC71]":"bg-[#cbd5e0]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
              ${smartMode?"translate-x-5":"translate-x-0.5"}`}/>
          </button>
        </div>
      </div>
      <TaskBreakdown tasks={tasks} current={taskIdx}/>
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 bg-[#fafcff]
        [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#cbd5e0] [&::-webkit-scrollbar-thumb]:rounded-full">

        {msgs.map(m=>(
          <div key={m.id}
            className={`max-w-[92%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl animate-[fadeUp_0.3s_ease]
              ${m.role==="bot"?"self-start bg-white border border-[#e8ecf0] rounded-bl-[3px] text-[#1a202c]":"self-end bg-[#2ECC71] text-white rounded-br-[3px]"}`}
            dangerouslySetInnerHTML={{__html:m.html}}/>
        ))}
        {thinking&&<div className="self-start bg-white border border-[#e8ecf0] rounded-2xl rounded-bl-[3px] px-3.5 py-2.5"><ThinkingDots/></div>}

        {phase==="smart_confirm_assessment"&&(
          <div className="self-start max-w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
            <button onClick={onStartAssessment}
              className="bg-[#2ECC71] text-white px-4 py-3 rounded-xl text-sm font-semibold border-0 cursor-pointer active:bg-[#27AE60] transition-colors">
              📋 开始评估
            </button>
            <button onClick={onStartTraining}
              className="bg-white border border-[#e8ecf0] text-[#2d3748] px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer active:bg-[#f7fafc] transition-colors">
              ⚡ 跳过评估，直接训练
            </button>
          </div>
        )}

        {phase==="day1_duration"&&(
          <div className="self-start max-w-[92%] animate-[fadeUp_0.3s_ease]">
            <BtnRow>
              {["不到1个月","1-3个月","3-6个月","6个月-1年","1年以上","无特别不适"].map(d=>(
                <Pill key={d} label={d} onClick={()=>onSubmitDuration(d)}/>
              ))}
            </BtnRow>
          </div>
        )}
        {phase==="day1_stiffness"&&(
          <div className="self-start max-w-[92%] animate-[fadeUp_0.3s_ease]">
            <BtnRow>
              <Pill label="没有特别感觉" onClick={()=>onSubmitStiffness(0)}/>
              <Pill label="有点紧" onClick={()=>onSubmitStiffness(1)}/>
              <Pill label="很紧" onClick={()=>onSubmitStiffness(2)}/>
            </BtnRow>
          </div>
        )}
        {phase==="day1_recommend"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease] flex flex-col gap-2">
            <ResultCard>
              <div className="text-[19px] font-bold text-[#2ECC71]">🌸 推荐：{LEVELS[lv-1]||"温和"}模式</div>
              <div className="text-sm text-[#2d3748] mt-1">强度 <strong>{getLevelName(lv)}</strong></div>
              <div className="flex gap-2 flex-wrap mt-2 text-[13px] text-[#4a5568]">
                {[`💨 ${prm.pressure} mmHg`,`⏱ 工作${prm.work}s`,`🔄 休息${prm.rest}s`,`🔁 ${prm.cycles}轮`].map(t=>(
                  <span key={t} className="bg-white px-3 py-1 rounded-full border border-[#e8ecf0]">{t}</span>
                ))}
              </div>
              <div className="mt-1.5 text-[13px] text-[#4a5568]">📅 每天1-2次，约{Math.floor(total/60)}分{total%60}秒</div>
            </ResultCard>
            <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-3 text-sm text-[#075985]">
              <div className="font-semibold mb-2">⚙️ 穿戴须知</div>
              <div className="space-y-1 text-xs leading-relaxed text-[#0c4a6e]">
                <div>• 使用前请保持治疗部位清爽干燥</div>
                <div>• 设备运行时请保持静止放松</div>
                <div>• 可能出现吸附感或皮肤紧绷感，属正常现象</div>
                <div>• 使用后皮肤轻微发红属正常，4-48小时消退</div>
              </div>
            </div>
            <div className="bg-[#ecfdf5] border border-[#6ee7b7] rounded-2xl px-3 py-2.5 flex items-center gap-2 text-sm text-[#065f46]">
              <span className="text-lg">⚙️</span>
              <span>请点击屏幕右侧<strong>遥控器</strong>，先连接设备，再点击「开始」启动养护。</span>
            </div>
          </div>
        )}
        {phase==="day1_optimize"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease]">
            <ResultCard>
              <div className="font-bold">🌸 持续优化完成</div>
              <div className="text-sm mt-1">下一次强度：<strong>{getLevelName(ud.finalLevel)}</strong></div>
            </ResultCard>
            <button onClick={onGoToNextDay} className="mt-2.5 w-full py-3 rounded-full bg-[#2ECC71] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#27AE60] transition-all">
              📅 进入第2天
            </button>
          </div>
        )}
        {phase==="daily_feel"&&(
          <div className="self-start max-w-[92%] animate-[fadeUp_0.3s_ease]">
            <BtnRow>
              <Pill label="😊 比之前舒服" primary onClick={()=>onSubmitDailyFeel("better")}/>
              <Pill label="😐 没什么变化" onClick={()=>onSubmitDailyFeel("same")}/>
              <Pill label="😣 比之前更不舒服" onClick={()=>onSubmitDailyFeel("worse")}/>
            </BtnRow>
          </div>
        )}
        {phase==="daily_recommend"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease]">
            <ResultCard>
              <div className="text-lg font-bold text-[#2ECC71]">📌 今日推荐</div>
              <div className="text-sm mt-1">强度 <strong>{getLevelName(ud.finalLevel)}</strong></div>
              <div className="text-xs text-[#718096] mt-1">{ud.dailyFeel==="worse"?"感觉变差，已降低一级":"保持当前强度"}</div>
            </ResultCard>
            <div className="bg-[#ecfdf5] border border-[#6ee7b7] rounded-2xl px-3 py-2.5 flex items-center gap-2 text-sm text-[#065f46] mt-2">
              <span className="text-lg">⚙️</span>
              <span>请使用右侧<strong>遥控器</strong>连接设备并开始今日养护。</span>
            </div>
          </div>
        )}
        {phase==="daily_optimize"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease]">
            <button onClick={onGoToNextDay} className="w-full py-3 rounded-full bg-[#2ECC71] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#27AE60] transition-all">
              📅 {currentDay<6?`进入第${currentDay+1}天`:currentDay===6?"进入第7天复评":"完成"}
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
                <div className="mt-2 bg-[#f0fdf4] rounded-lg px-3 py-2 text-xs text-[#166534] leading-relaxed">{catMsg[cat]}</div>
              </ResultCard>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5">
                <div className="font-semibold text-[#1a202c] mb-1">📋 下一阶段</div>
                <div className="text-sm text-[#4a5568]">我们已根据你的最新反馈优化下一阶段方案。</div>
                <div className="flex gap-2 mt-3">
                  <button onClick={onGoToNextDay} className="flex-1 py-2.5 rounded-full bg-[#2ECC71] text-white font-semibold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">查看下一阶段</button>
                  <button onClick={onReset} className="flex-1 py-2.5 rounded-full bg-[#edf2f7] text-[#4a5568] font-medium text-sm border-0 cursor-pointer active:bg-[#e2e8f0] transition-all">重新开始</button>
                </div>
              </div>
            </div>
          );
        })()}
        {phase==="done"&&(
          <div className="self-start w-[92%] animate-[fadeUp_0.3s_ease]">
            <button onClick={onReset} className="w-full py-3 rounded-full bg-[#48bb78] text-white font-semibold text-base border-0 cursor-pointer active:bg-[#38a169] transition-all">
              🔄 重新开始
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [tab, setTab] = useState<Tab>("home");
  const [currentDay, setCurrentDay] = useState(1);
  const [phase, setPhase] = useState<Phase>("smart_intro");
  const [surveyStep, setSurveyStep] = useState<SurveyStep>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [taskIdx, setTaskIdx] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);
  const [smartMode, setSmartMode] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: "", gender: "", ageRange: "", duration: "",
    safety: [], stiffness: null, baseLevel: 2,
    triggers: [], mainTrigger: "",
    painLevel: 0, finalLevel: 2,
    firstTime: true,
    dailyRecords: {},
    pressure: 0, workSec: 0, restSec: 0, cycles: 0,
    dailyFeel: "",
    day7Trigger: "", day7Pain: 0, day7Feel: "",
  });

  const [deviceState, setDeviceState] = useState<DeviceState>("disconnected");
  const [hwState, setHwState] = useState<HwState>("idle");
  const [hwLevel, setHwLevel] = useState(2);
  const [hwCycle, setHwCycle] = useState(1);
  const [hwTotalCycles, setHwTotalCycles] = useState(5);
  const [hwRemaining, setHwRemaining] = useState(0);
  const [hwTotal, setHwTotal] = useState(0);

  const messagesRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);
  const day1PainRef = useRef<number>(0);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [msgs, thinking]);

  const addMsg = (role: "bot" | "user", html: string) => {
    setMsgs(prev => [...prev, { id: msgId.current++, role, html }]);
  };

  const simulateThinking = (cb: () => void, delay = 800) => {
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      cb();
    }, delay);
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
    if (screen === "assistant" && hwState === "running" && phase === "day1_therapy") {
      setShowStopModal(true);
    }
    setHwState("stopped");
    setDeviceState("idle");
    setHwRemaining(0);
  };

  const handleReset = () => {
    setHwState("idle");
    setDeviceState("idle");
    setHwRemaining(0);
    setHwTotal(0);
  };

  const tasks = currentDay === 1 ? DAY1_TASKS : currentDay === 7 ? DAY7_TASKS : DAILY_TASKS;

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      {/* iPhone 16 Pro Max device frame */}
      <div style={{
        width: "430px",
        height: "932px",
        background: "#1a1a1a",
        borderRadius: "60px",
        padding: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        position: "relative"
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: "absolute",
          top: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "126px",
          height: "37px",
          background: "#000",
          borderRadius: "30px",
          zIndex: 9999
        }}/>

        {/* Screen content */}
        <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#fafcff",
          borderRadius: "48px",
          overflow: "hidden"
        }}>
      {screen === "onboarding" && <Onboarding onDone={(smartMode, next) => {
        if (next === "assessment") setScreen("manual-assessment");
        else if (next === "quick-training") setScreen("quick-training");
        else setScreen("home");
      }} />}

      {screen === "home" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", position: "relative" }}>
          {tab === "home" && <HomePage
            userName={userData.name || "用户"}
            streak={0}
            weekDone={currentDay - 1}
            weekTotal={7}
            onStartAssessment={() => setScreen("manual-assessment")}
            onStartTraining={() => setScreen("quick-training")}
            showOnboardingBanner={false}
            onShowOnboarding={() => setScreen("onboarding")}
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
              onToggleSmartMode={() => {
                const newMode = !smartMode;
                setSmartMode(newMode);
                if (newMode && msgs.length === 0) {
                  setPhase("smart_intro");
                  setTimeout(() => {
                    addMsg("bot", "👋 你好！我是小瑞，你的康复助手。我注意到你还没有开始评估，建议先做个评估，我会根据你的情况推荐最合适的方案。");
                    setTimeout(() => {
                      setPhase("smart_confirm_assessment");
                    }, 1000);
                  }, 500);
                }
              }}
              onSubmitDuration={(d) => {
                setUserData((prev: UserData) => ({ ...prev, duration: d }));
                addMsg("user", d);
                simulateThinking(() => {
                  addMsg("bot", "明白了。接下来问一下，早上起床或久坐后，膝盖会不会有僵硬、不灵活的感觉？");
                  setPhase("day1_stiffness");
                });
              }}
              onSubmitStiffness={(l) => {
                setUserData((prev: UserData) => ({ ...prev, stiffness: l }));
                addMsg("user", l === 0 ? "没有特别感觉" : l === 1 ? "有点紧" : "很紧");
                simulateThinking(() => {
                  addMsg("bot", "好的，我会记录下来。现在让我们来看看<strong>哪些动作</strong>最容易让你的膝盖不舒服。（可多选）");
                  setSurveyStep("triggers");
                }, 600);
              }}
              onGoToNextDay={() => {
                setCurrentDay((prev: number) => prev + 1);
                setTaskIdx(0);
                setPhase("daily_feel");
                setMsgs([]);
                simulateThinking(() => {
                  addMsg("bot", `👋 ${userData.name}，第${currentDay + 1}天开始啦！今天感觉如何？`);
                }, 500);
              }}
              onSubmitDailyFeel={(f) => {
                setUserData((prev: UserData) => ({ ...prev, dailyFeel: f }));
                addMsg("user", f === "better" ? "😊 比之前舒服" : f === "same" ? "😐 没什么变化" : "😣 比之前更不舒服");
                simulateThinking(() => {
                  setTaskIdx(1);
                  setPhase("daily_recommend");
                  addMsg("bot", "收到！我已根据你的反馈调整今日方案。");
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
                  day7Trigger: "", day7Pain: 0, day7Feel: "",
                });
              }}
              day1PainRef={day1PainRef}
              onStartAssessment={() => setScreen("manual-assessment")}
              onStartTraining={() => setScreen("quick-training")}
            />
          )}
          {tab === "discover" && <DiscoverPage />}
          {tab === "profile" && <ProfilePage />}

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
        onDone={(result) => {
          setUserData((prev: UserData) => ({...prev, ...result}));
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
        }}
      />
      <StopReasonModal
        open={showStopModal}
        onClose={(reasons) => {
          setShowStopModal(false);
          addMsg("user", reasons.join("、"));
          simulateThinking(() => {
            addMsg("bot", "我已记录。持之以恒很重要，明天继续加油！💪");
          });
        }}
      />
        </div>
      </div>
    </div>
  );
}
