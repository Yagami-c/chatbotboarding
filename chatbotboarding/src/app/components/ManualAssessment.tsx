import { useState } from "react";
import { COLORS, DESIGN } from "../design-system";

interface ManualAssessmentProps {
  onBack: () => void;
  onDone: (result: AssessmentResult) => void;
  existingData?: { name?: string; gender?: string; ageRange?: string };
}

export interface AssessmentResult {
  name: string;
  gender: string;
  ageRange: string;
  recommendedLevel: number; // 1-6 for L1-L6
  baseLevel: number;
  painAdjust: number;
  safety: string[];
  stiffness: string;
  triggers: string[];
  painLevel: number;
}

const SAFETY_LIST = [
  {v:"受伤",l:"最近2周内有明显膝盖受伤", risk: true},
  {v:"肿胀",l:"膝盖明显肿胀/发炎", risk: true},
  {v:"伤口",l:"膝盖周围有伤口或皮肤问题", risk: true},
  {v:"医生建议",l:"医生建议避免使用此类设备", risk: true},
  {v:"轻微受限",l:"2-4周前有过膝关节受伤，目前仍有轻微肿胀", risk: false, directL1: true},
  {v:"无",l:"以上都没有", risk: false},
];

const STIFFNESS_OPTIONS = [
  {v:"无",l:"没有特别感觉", base: 2},
  {v:"有点紧",l:"有点紧", base: 3},
  {v:"很紧",l:"很紧", base: 4},
];

const TRIGGERS_LIST = ["下蹲","上楼梯/斜坡","下楼梯/斜坡","久坐后站起来","长时间走路","跑步/运动","没有明显诱因"];

const PAIN_LEVELS = [
  {v:0, l:"0 无不适", adjust: -1},
  {v:1, l:"1 轻微不适（不影响完成）", adjust: 0},
  {v:2, l:"2 中等不适（明显不舒服）", adjust: 0},
  {v:3, l:"3 较重不适（需要减慢速度或减少幅度）", adjust: 1},
  {v:4, l:"4 非常不适（难以完成）", adjust: 1},
];

const STEPS = [
  { label: "安全筛查", sub: "Q1: 请问目前是否有以下情况" },
  { label: "膝盖紧度", sub: "Q2: 你最近有没有感觉膝盖紧" },
  { label: "触发动作", sub: "Q3: 什么动作最容易不舒服" },
  { label: "不适程度", sub: "Q4: 做这个动作时的不适程度" },
];

export function ManualAssessment({ onBack, onDone, existingData }: ManualAssessmentProps) {
  // Always start from Q1 (safety screening), no skipping
  const [step, setStep] = useState(0);
  const [name] = useState(existingData?.name || "");
  const [gender] = useState(existingData?.gender || "");
  const [ageRange] = useState(existingData?.ageRange || "");

  const [safety, setSafety] = useState<Record<string,boolean>>({});
  const [stiffness, setStiffness] = useState("");
  const [triggers, setTriggers] = useState<Record<string,boolean>>({});
  const [painLevel, setPainLevel] = useState<number|null>(null);

  const [showSafetyWarning, setShowSafetyWarning] = useState(false);
  const [showL1Result, setShowL1Result] = useState(false);

  const safetyVals = Object.entries(safety).filter(([,v])=>v).map(([k])=>k);
  const triggerVals = Object.entries(triggers).filter(([,v])=>v).map(([k])=>k);

  const canNext0 = safetyVals.length > 0;
  const canNext1 = !!stiffness;
  const canNext2 = triggerVals.length > 0;
  const canSubmit = painLevel !== null;

  const handleNext = () => {
    if (step === 0) {
      if (!canNext0) return;

      // Check for high-risk items (1-4)
      const hasHighRisk = safetyVals.some(v =>
        SAFETY_LIST.find(s => s.v === v)?.risk
      );

      if (hasHighRisk) {
        setShowSafetyWarning(true);
        return;
      }

      // Check for "轻微受限" -> direct to L1
      if (safetyVals.includes("轻微受限")) {
        setShowL1Result(true);
        return;
      }

      // Otherwise continue to Q2
      setStep(1);
      return;
    }

    if (step === 1 && !canNext1) return;
    if (step === 2 && !canNext2) return;

    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Calculate recommended level
    const selectedStiffness = STIFFNESS_OPTIONS.find(s => s.v === stiffness);
    const baseLevel = selectedStiffness?.base || 2;

    const selectedPain = PAIN_LEVELS.find(p => p.v === painLevel);
    const painAdjust = selectedPain?.adjust || 0;

    let recommendedLevel = baseLevel + painAdjust;
    // Clamp to 1-6
    recommendedLevel = Math.max(1, Math.min(6, recommendedLevel));

    onDone({
      name: name.trim(),
      gender,
      ageRange,
      recommendedLevel,
      baseLevel,
      painAdjust,
      safety: safetyVals,
      stiffness,
      triggers: triggerVals,
      painLevel: painLevel!
    });
  };

  const goToDiscover = () => {
    // TODO: Navigate to discover tab
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f0f6ff] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={handleBack} className="text-2xl bg-transparent border-0 cursor-pointer text-[#4a5568]" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div className="flex-1">
            <div className="font-bold text-[#1a202c]">了解你的情况</div>
            <div className="text-xs text-[#718096]">{STEPS[step].sub}</div>
          </div>
          <div className="text-xs text-[#718096] font-medium">{step+1} / {STEPS.length}</div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center mb-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-all`}
                style={{
                  background: i <= step ? COLORS.brandBlue : COLORS.borderGray,
                  color: i <= step ? "white" : COLORS.textTertiary,
                  boxShadow: i === step ? `0 0 0 2px ${COLORS.mistBlue}` : "none"
                }}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 transition-all duration-300`} style={{ background: i < step ? COLORS.brandBlue : COLORS.borderGray }}/>
              )}
            </div>
          ))}
        </div>
        <div className="flex">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex-1 text-center text-[10px] font-medium transition-colors`}
              style={{ color: i <= step ? COLORS.brandBlue : COLORS.textTertiary }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0: Q1 安全筛查 */}
      {step === 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-2">Q1. 请问目前是否有以下情况？（可多选）</div>
            <div className="text-xs text-[#718096] mb-3">选择适合你的选项，若不确定：</div>
            {SAFETY_LIST.map(({v,l})=>(
              <label key={v} className="flex items-center gap-2 py-2 cursor-pointer text-sm text-[#2d3748]" style={{ minHeight: 44 }}>
                <input type="checkbox" checked={!!safety[v]}
                  onChange={e=>setSafety(p=>({...p,[v]:e.target.checked}))}
                  style={{ accentColor: COLORS.brandBlue, width: 20, height: 20 }}/>
                {l}
              </label>
            ))}
          </div>
          <button onClick={handleNext}
            style={{
              width: "100%", padding: "14px", borderRadius: DESIGN.radius.button,
              fontWeight: 600, fontSize: 16, border: 0, cursor: canNext0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              background: canNext0 ? COLORS.brandBlue : COLORS.borderGray,
              color: canNext0 ? "white" : COLORS.textTertiary,
              minHeight: 48,
            }}>
            下一步 →
          </button>
        </div>
      )}

      {/* Step 1: Q2 膝盖紧度 */}
      {step === 1 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-2">Q2. 你最近有没有感觉膝盖紧？</div>
            {STIFFNESS_OPTIONS.map(({v,l})=>(
              <label key={v} className="flex items-center gap-2 py-2.5 cursor-pointer text-sm text-[#2d3748]" style={{ minHeight: 44 }}>
                <input type="radio" name="stiffness" checked={stiffness===v} onChange={()=>setStiffness(v)}
                  style={{ accentColor: COLORS.brandBlue, width: 20, height: 20 }}/>
                {l}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={handleBack}
              style={{
                flex: 1, padding: "14px", borderRadius: DESIGN.radius.button,
                background: COLORS.white, color: COLORS.textSecondary, fontWeight: 500, fontSize: 14,
                border: `1px solid ${COLORS.borderGray}`, cursor: "pointer", minHeight: 48,
              }}>
              ← 上一步
            </button>
            <button onClick={handleNext}
              style={{
                flex: 2, padding: "14px", borderRadius: DESIGN.radius.button, fontWeight: 600, fontSize: 16,
                border: 0, cursor: canNext1 ? "pointer" : "not-allowed", transition: "all 0.2s",
                background: canNext1 ? COLORS.brandBlue : COLORS.borderGray,
                color: canNext1 ? "white" : COLORS.textTertiary, minHeight: 48,
              }}>
              下一步 →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Q3 触发动作 */}
      {step === 2 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-2">Q3. 最近什么动作最容易让膝盖不舒服？（可多选）</div>
            {TRIGGERS_LIST.map(v=>(
              <label key={v} className="flex items-center gap-2 py-2 cursor-pointer text-sm text-[#2d3748]" style={{ minHeight: 44 }}>
                <input type="checkbox" checked={!!triggers[v]}
                  onChange={e=>setTriggers(p=>({...p,[v]:e.target.checked}))}
                  style={{ accentColor: COLORS.brandBlue, width: 20, height: 20 }}/>
                {v}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={handleBack}
              style={{
                flex: 1, padding: "14px", borderRadius: DESIGN.radius.button,
                background: COLORS.white, color: COLORS.textSecondary, fontWeight: 500, fontSize: 14,
                border: `1px solid ${COLORS.borderGray}`, cursor: "pointer", minHeight: 48,
              }}>
              ← 上一步
            </button>
            <button onClick={handleNext}
              style={{
                flex: 2, padding: "14px", borderRadius: DESIGN.radius.button, fontWeight: 600, fontSize: 16,
                border: 0, cursor: canNext2 ? "pointer" : "not-allowed", transition: "all 0.2s",
                background: canNext2 ? COLORS.brandBlue : COLORS.borderGray,
                color: canNext2 ? "white" : COLORS.textTertiary, minHeight: 48,
              }}>
              下一步 →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Q4 不适程度 */}
      {step === 3 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]">
            <div className="font-semibold text-[#1a202c] text-sm mb-2">Q4. 做这个动作时，你的不适程度是多少？</div>
            <div className="text-xs text-[#718096] mb-3">针对最困扰的动作：</div>
            {PAIN_LEVELS.map(({v,l})=>(
              <label key={v} className="flex items-center gap-2 py-2.5 cursor-pointer text-sm text-[#2d3748]" style={{ minHeight: 44 }}>
                <input type="radio" name="painLevel" checked={painLevel===v} onChange={()=>setPainLevel(v)}
                  style={{ accentColor: COLORS.brandBlue, width: 20, height: 20 }}/>
                {l}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pb-4">
            <button onClick={handleBack}
              style={{
                flex: 1, padding: "14px", borderRadius: DESIGN.radius.button,
                background: COLORS.white, color: COLORS.textSecondary, fontWeight: 500, fontSize: 14,
                border: `1px solid ${COLORS.borderGray}`, cursor: "pointer", minHeight: 48,
              }}>
              ← 上一步
            </button>
            <button onClick={handleSubmit}
              style={{
                flex: 2, padding: "14px", borderRadius: DESIGN.radius.button, fontWeight: 600, fontSize: 16,
                border: 0, cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.2s",
                background: canSubmit ? COLORS.brandBlue : COLORS.borderGray,
                color: canSubmit ? "white" : COLORS.textTertiary, minHeight: 48,
              }}>
              查看推荐强度 →
            </button>
          </div>
        </div>
      )}

      {/* High Risk Warning Modal - Navigate to Discover */}
      {showSafetyWarning && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",borderRadius:28}}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-2xl text-center mb-3">⚠️</div>
            <div className="font-bold text-[#1a202c] text-center text-base mb-2">安全提示</div>
            <p className="text-sm text-[#4a5568] text-center mb-3">检测到您存在以下情况：</p>
            <div style={{ background: COLORS.mistBlue, border: `1px solid ${COLORS.brandBlue}`, borderRadius: DESIGN.radius.card, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: COLORS.deepNavy }}>
                {safetyVals.filter(v=>SAFETY_LIST.find(s=>s.v===v)?.risk).map(v=><div key={v}>• {SAFETY_LIST.find(s=>s.v===v)?.l||v}</div>)}
              </div>
            </div>
            <p className="text-sm text-[#4a5568] text-center mb-4">建议先休息 1-2 天，或咨询专业医务人员后再继续。</p>
            <div className="flex gap-3">
              <button onClick={()=>setShowSafetyWarning(false)}
                style={{
                  flex: 1, padding: "12px", borderRadius: DESIGN.radius.button,
                  background: COLORS.white, color: COLORS.textSecondary, fontWeight: 500, fontSize: 14,
                  border: `1px solid ${COLORS.borderGray}`, cursor: "pointer", minHeight: 44,
                }}>
                返回修改
              </button>
              <button onClick={goToDiscover}
                style={{
                  flex: 1, padding: "12px", borderRadius: DESIGN.radius.button,
                  background: COLORS.brandBlue, color: "white", fontWeight: 600, fontSize: 14,
                  border: 0, cursor: "pointer", minHeight: 44,
                }}>
                引至科普查看 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* L1 Direct Recommendation Modal */}
      {showL1Result && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",borderRadius:28}}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-2xl text-center mb-3">✅</div>
            <div className="font-bold text-[#1a202c] text-center text-base mb-2">评估完成</div>
            <p className="text-sm text-[#4a5568] text-center mb-4">根据你的情况，为你推荐以下强度：</p>
            <div style={{ background: COLORS.mistBlue, border: `1px solid ${COLORS.brandBlue}`, borderRadius: DESIGN.radius.card, padding: "16px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.brandBlue, marginBottom: 8 }}>L1</div>
              <div style={{ fontSize: 14, color: COLORS.deepNavy, fontWeight: 600 }}>轻柔模式</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>均衡有效，循序渐进</div>
            </div>
            <p className="text-xs text-[#718096] text-center mb-4">建议从此强度开始使用受感器调整。</p>
            <button onClick={()=>onDone({
              name: name.trim(),
              gender,
              ageRange,
              recommendedLevel: 1,
              baseLevel: 1,
              painAdjust: 0,
              safety: safetyVals,
              stiffness: "轻微受限",
              triggers: [],
              painLevel: 0
            })}
              style={{
                width: "100%", padding: "12px", borderRadius: DESIGN.radius.button,
                background: COLORS.brandBlue, color: "white", fontWeight: 600, fontSize: 14,
                border: 0, cursor: "pointer", minHeight: 44,
              }}>
              确认并开始使用 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
