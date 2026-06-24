import { useState } from "react";
import { SubmitBtn } from "./shared";

interface ManualAssessmentProps {
  onBack: () => void;
  onDone: (result: AssessmentResult) => void;
}

export interface AssessmentResult {
  name: string;
  gender: string;
  ageRange: string;
  duration: string;
  safety: string[];
  stiffness: string;
  triggers: string[];
  painLevel: number;
}

const DURATIONS = ["不到1个月","1-3个月","3-6个月","6个月-1年","1年以上","无特别不适"];
const TRIGGERS_LIST = ["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","其他","无"];
const SAFETY_LIST = [
  {v:"受伤",l:"最近2周内有明显膝盖受伤"},
  {v:"肿胀",l:"膝盖明显肿胀/发烫"},
  {v:"伤口",l:"膝盖周围有伤口或皮肤问题"},
  {v:"医生建议",l:"医生建议避免使用类似设备"},
  {v:"无",l:"以上都没有"},
];

export function ManualAssessment({ onBack, onDone }: ManualAssessmentProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [duration, setDuration] = useState("");
  const [safety, setSafety] = useState<Record<string,boolean>>({});
  const [stiffness, setStiffness] = useState("");
  const [triggers, setTriggers] = useState<Record<string,boolean>>({});
  const [painLevel, setPainLevel] = useState<number|null>(null);
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);

  const safetyVals = Object.entries(safety).filter(([,v])=>v).map(([k])=>k);
  const triggerVals = Object.entries(triggers).filter(([,v])=>v).map(([k])=>k);
  const filled = !!(name.trim() && gender && ageRange && duration && safetyVals.length && stiffness && triggerVals.length && painLevel !== null);

  const totalQ = 7;
  const answered = [name.trim(),gender,ageRange,duration,safetyVals.length>0,stiffness,triggerVals.length>0&&painLevel!==null].filter(Boolean).length;
  const progress = Math.round((answered/totalQ)*100);

  const handleSubmit = () => {
    if (!filled) { alert("请完整填写所有问题"); return; }
    const hasRisk = ["受伤","肿胀","伤口","医生建议"].some(r=>safetyVals.includes(r));
    if (hasRisk) { setShowSafetyWarning(true); return; }
    submit();
  };

  const submit = () => {
    setShowSafetyWarning(false);
    onDone({name:name.trim(),gender,ageRange,duration,safety:safetyVals,stiffness,triggers:triggerVals,painLevel:painLevel!});
  };

  const RadioRow = ({label,value,current,set}:{label:string;value:string;current:string;set:(v:string)=>void}) => (
    <label className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
      <input type="radio" checked={current===value} onChange={()=>set(value)} className="accent-[#2ECC71]"/>
      {label}
    </label>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f5f9f5] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-2xl bg-transparent border-0 cursor-pointer text-[#4a5568]">←</button>
          <div>
            <div className="font-bold text-[#1a202c]">📋 手动评估</div>
            <div className="text-xs text-[#718096]">共 {totalQ} 个问题 · 约 3 分钟</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div className="h-full bg-[#2ECC71] rounded-full transition-all duration-300" style={{width:`${progress}%`}}/>
          </div>
          <span className="text-xs text-[#718096] font-medium">{answered}/{totalQ}</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Q1 */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q1. 你的称呼？</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="输入昵称"
            className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-[#fafcff] outline-none focus:border-[#2ECC71]"/>
        </div>

        {/* Q2 */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q2. 你的性别？</div>
          <div className="flex gap-2">
            {["男","女","其他"].map(g=>(
              <button key={g} onClick={()=>setGender(g)}
                className={`flex-1 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                  ${gender===g?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                {g==="男"?"👨 男":g==="女"?"👩 女":"其他"}
              </button>
            ))}
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q3. 你的年龄范围？</div>
          <div className="grid grid-cols-2 gap-2">
            {["20岁以下","20-40岁","40-60岁","60岁以上"].map(a=>(
              <button key={a} onClick={()=>setAgeRange(a)}
                className={`py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                  ${ageRange===a?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Q4 */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q4. 膝盖不适有多久了？</div>
          <div className="grid grid-cols-2 gap-2">
            {DURATIONS.map(d=>(
              <button key={d} onClick={()=>setDuration(d)}
                className={`py-2 rounded-full text-sm font-medium border cursor-pointer transition-all text-center
                  ${duration===d?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Q5 Safety */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q5. 安全筛查（可多选）</div>
          {SAFETY_LIST.map(({v,l})=>(
            <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
              <input type="checkbox" checked={!!safety[v]}
                onChange={e=>setSafety(p=>({...p,[v]:e.target.checked}))}
                className="accent-[#2ECC71]"/>
              {l}
            </label>
          ))}
        </div>

        {/* Q6 Stiffness */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q6. 膝盖紧度？</div>
          {["没有特别感觉","有点紧","很紧"].map(s=>(
            <RadioRow key={s} label={s} value={s} current={stiffness} set={setStiffness}/>
          ))}
        </div>

        {/* Q7 Triggers + Pain */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
          <div className="font-semibold text-[#1a202c] text-sm mb-2">Q7. 触发动作与疼痛程度</div>
          <div className="text-xs text-[#718096] mb-2">最近什么动作容易不舒服？（可多选）</div>
          {TRIGGERS_LIST.map(v=>(
            <label key={v} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#2d3748]">
              <input type="checkbox" checked={!!triggers[v]}
                onChange={e=>setTriggers(p=>({...p,[v]:e.target.checked}))}
                className="accent-[#2ECC71]"/>
              {v}
            </label>
          ))}
          <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
            <div className="text-xs text-[#718096] mb-2">不适程度（针对最困扰动作）：</div>
            <div className="flex gap-1.5">
              {[0,1,2,3,4].map(n=>(
                <button key={n} onClick={()=>setPainLevel(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-all
                    ${painLevel===n?"bg-[#2ECC71] text-white border-[#2ECC71]":"bg-[#f7fafc] text-[#4a5568] border-[#e2e8f0]"}`}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#a0aec0] mt-1 px-1">
              <span>无不适</span><span>非常不适</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <button onClick={()=>{setName("");setGender("");setAgeRange("");setDuration("");setSafety({});setStiffness("");setTriggers({});setPainLevel(null);}}
            className="flex-1 py-3 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
            重置
          </button>
          <button onClick={handleSubmit}
            className="flex-[2] py-3 rounded-full bg-[#2ECC71] text-white font-bold text-sm border-0 cursor-pointer active:bg-[#27AE60] transition-all">
            提交并查看方案 →
          </button>
        </div>
      </div>

      {/* Safety Warning Modal */}
      {showSafetyWarning && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",borderRadius:28}}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-2xl text-center mb-3">⚠️</div>
            <div className="font-bold text-[#1a202c] text-center text-base mb-2">安全提示</div>
            <p className="text-sm text-[#4a5568] text-center mb-3">检测到您存在以下情况：</p>
            <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-3 mb-4 text-sm text-[#c2410c] space-y-1">
              {safetyVals.filter(v=>v!=="无").map(v=><div key={v}>• {SAFETY_LIST.find(s=>s.v===v)?.l||v}</div>)}
            </div>
            <p className="text-sm text-[#4a5568] text-center mb-4">建议先休息 1-2 天，或咨询专业医务人员后再继续。</p>
            <div className="flex gap-3">
              <button onClick={()=>setShowSafetyWarning(false)}
                className="flex-1 py-2.5 rounded-full bg-[#f7fafc] text-[#4a5568] font-medium text-sm border border-[#e2e8f0] cursor-pointer">
                我知道了，返回修改
              </button>
              <button onClick={submit}
                className="flex-1 py-2.5 rounded-full bg-[#2ECC71] text-white font-semibold text-sm border-0 cursor-pointer">
                仍要继续 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
