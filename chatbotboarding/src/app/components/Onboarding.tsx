import { useState } from "react";
import { COLORS, DESIGN } from "../design-system";

interface OnboardingProps {
  onDone: (smartMode: boolean, next: "assessment" | "quick-training" | "home") => void;
}

// Shared progress bar
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, borderRadius: 4,
          width: i === current ? 24 : 8,
          background: i === current ? COLORS.brandBlue : "#E0E0E0",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ── Step 1: Welcome ────────────────────────────────────────────────────────────
function Step1({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", overflow: "hidden" }}>
      {/* Compressed brand area — 28-32% of screen height */}
      <div style={{
        flex: "0 0 30vh",
        background: `linear-gradient(160deg, ${COLORS.brandBlue} 0%, #3A7BC8 100%)`,
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}>
        {/* Subtle background circle */}
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>

        {/* Aiyovita logo */}
        <div style={{
          width: 240, height: 100, borderRadius: 20,
          background: "white",
          boxShadow: DESIGN.shadow.card,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, position: "relative", zIndex: 1,
          overflow: "hidden",
          padding: "16px 20px",
        }}>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 150'%3E%3Cg transform='translate(15,20)'%3E%3Cpath d='M30,15 L35,20 L30,25 M25,20 h10 M22,15 v10 M33,15 v10' stroke='%234A90E2' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M10,35 Q15,28 20,35 T30,35' stroke='%2370C244' stroke-width='2' fill='none'/%3E%3Cellipse cx='12' cy='33' rx='1.5' ry='2' fill='%23DC2626'/%3E%3C/g%3E%3Cg transform='translate(65,35)'%3E%3Ctext x='0' y='30' font-family='Arial,sans-serif' font-size='38' font-weight='700' fill='%234A90E2'%3EAiyovita%3C/text%3E%3Ctext x='0' y='65' font-family='Microsoft YaHei,SimHei,sans-serif' font-size='24' font-weight='700' fill='%234A90E2' letter-spacing='2'%3E光年瑞康%3C/text%3E%3C/g%3E%3C/svg%3E"
            alt="光年瑞康 Aiyovita"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <div style={{ color: "white", fontWeight: 700, fontSize: 18, letterSpacing: 0.3, position: "relative", zIndex: 1, marginBottom: 4 }}>
          科学康养，守护膝关节健康
        </div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, position: "relative", zIndex: 1 }}>
          让膝盖越来越好
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 24px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.deepNavy, marginBottom: 12, lineHeight: 1.3 }}>
          欢迎来到您的专属膝盖管家
        </h1>
        <p style={{ fontSize: 16, color: COLORS.neutralGray, lineHeight: 1.6, marginBottom: 24 }}>
          科学评估、智能训练、专家陪伴<br/>
          每天几分钟，让膝盖越来越好
        </p>

        {/* Feature list with 2px linear icons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "auto" }}>
          {[
            { title: "AI 个性化", desc: "根据你的情况定制方案" },
            { title: "进度追踪", desc: "可视化康复进展" },
            { title: "专家研发", desc: "香港理工大学武汉研究院" },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: COLORS.mistBlue, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.deepNavy }}>{title}</div>
                <div style={{ fontSize: 12, color: COLORS.neutralGray }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Single solid primary button */}
        <button onClick={onNext} style={{
          width: "100%", height: 48, borderRadius: DESIGN.radius.button,
          background: COLORS.brandBlue,
          color: "white", fontWeight: 600, fontSize: 17,
          border: "none", cursor: "pointer",
          boxShadow: DESIGN.shadow.button,
          marginBottom: 12,
        }}>
          开始体验 →
        </button>

        {/* Text button for skip */}
        <button onClick={onSkip} style={{
          background: "none", border: "none",
          color: COLORS.neutralGray, fontSize: 14, cursor: "pointer", padding: "8px 0",
          fontWeight: 500,
        }}>
          游客体验
        </button>

        <div style={{ marginTop: 20 }}><ProgressDots current={0} total={3}/></div>
      </div>
    </div>
  );
}

// ── Step 2: Smart Mode ─────────────────────────────────────────────────────────
function Step2({
  smartMode, setSmartMode, onConfirm, onSkip,
}: {
  smartMode: boolean;
  setSmartMode: (v: boolean) => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const features = [
    { title: "每日评估", desc: "追踪你的膝盖状态变化" },
    { title: "训练提醒", desc: "按时推送，不落一次" },
    { title: "强度优化", desc: "实时调整训练方案" },
    { title: "科普推送", desc: "专家知识随时获取" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", padding: "0 0 32px" }}>
      {/* Header with AI icon */}
      <div style={{
        padding: "52px 24px 24px",
        background: COLORS.mistBlue,
        borderBottom: `1px solid ${COLORS.borderGray}`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "white",
          boxShadow: DESIGN.shadow.card,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="12" r="5" stroke={COLORS.brandBlue} strokeWidth="2"/>
            <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 6v2M10 8l1.5 1.5M6 14h2M10 20l1.5-1.5" stroke={COLORS.neutralGray} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.deepNavy, textAlign: "center", marginBottom: 6 }}>
          开启智能模式
        </h2>
        <p style={{ fontSize: 14, color: COLORS.neutralGray, textAlign: "center", lineHeight: 1.6 }}>
          让小瑞全程陪伴你的康复之旅
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
        {/* Feature list with white cards and blue-gray linear icons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {features.map(({ title, desc }) => (
            <div key={title} style={{
              background: "white",
              border: `1px solid ${COLORS.borderGray}`,
              borderRadius: DESIGN.radius.card,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: COLORS.mistBlue,
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke={COLORS.brandBlue} strokeWidth="2"/>
                  <path d="M7 10l2 2 4-4" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.deepNavy, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 12, color: COLORS.neutralGray, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle - default OFF before confirmation */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: smartMode ? COLORS.mistBlue : COLORS.lightGray,
          border: `1px solid ${smartMode ? COLORS.brandBlue : COLORS.borderGray}`,
          borderRadius: DESIGN.radius.button,
          padding: "14px 16px",
          transition: "all 0.25s", marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.deepNavy }}>
              智能模式
            </div>
            <div style={{ fontSize: 12, color: COLORS.neutralGray, marginTop: 2 }}>
              {smartMode ? "小瑞将全程主动引导你" : "开启后小瑞将主动引导你"}
            </div>
          </div>
          <button onClick={() => setSmartMode(!smartMode)} style={{
            width: 48, height: 28, borderRadius: 14, border: "none",
            background: smartMode ? COLORS.brandBlue : "#D1D5DB",
            cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
          }}>
            <span style={{
              position: "absolute", top: 4, left: smartMode ? 23 : 4,
              width: 20, height: 20, borderRadius: "50%", background: "white",
              transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>

        <p style={{ fontSize: 12, color: COLORS.neutralGray, textAlign: "center", marginBottom: 20 }}>
          可在「我的 - 设置」中随时切换
        </p>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button onClick={onConfirm} style={{
          width: "100%", height: 48, borderRadius: DESIGN.radius.button,
          background: COLORS.brandBlue,
          color: "white", fontWeight: 600, fontSize: 16,
          border: "none", cursor: "pointer",
          boxShadow: DESIGN.shadow.button,
        }}>
          开启智能模式
        </button>
        <button onClick={onSkip} style={{
          width: "100%", marginTop: 10, padding: "12px", background: "none",
          border: "none", color: COLORS.neutralGray, fontSize: 14, cursor: "pointer", fontWeight: 500,
        }}>
          稍后设置
        </button>
        <div style={{ marginTop: 16 }}><ProgressDots current={1} total={3}/></div>
      </div>
    </div>
  );
}

// ── Step 3: Choose path ────────────────────────────────────────────────────────
function Step3({
  smartMode, onAssess, onQuick, onSkip,
}: {
  smartMode: boolean;
  onAssess: () => void;
  onQuick: () => void;
  onSkip: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white" }}>
      {/* Header */}
      <div style={{ padding: "52px 24px 20px", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: COLORS.mistBlue,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16l6 6 10-10" stroke={COLORS.brandBlue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.deepNavy, marginBottom: 6 }}>准备好了吗？</h2>
        <p style={{ fontSize: 14, color: COLORS.neutralGray, lineHeight: 1.6 }}>
          选择你想要的开始方式
        </p>
      </div>

      <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Card 1: Assessment (recommended) */}
        <button onClick={onAssess} style={{
          width: "100%", background: COLORS.brandBlue,
          borderRadius: DESIGN.radius.card, padding: "20px",
          border: "none", cursor: "pointer", textAlign: "left",
          position: "relative", overflow: "hidden",
          boxShadow: DESIGN.shadow.button,
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100,
            borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="3" width="12" height="12" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>先做个评估</div>
                <span style={{ fontSize: 11, background: "rgba(255,255,255,0.25)", color: "white",
                  borderRadius: 20, padding: "2px 8px", fontWeight: 500 }}>推荐</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
              7 个问题 · 约 2 分钟<br/>获取你的专属 PAD 训练方案
            </div>
          </div>
        </button>

        {/* Card 2: Quick training */}
        <button onClick={onQuick} style={{
          width: "100%", background: "white",
          borderRadius: DESIGN.radius.card, padding: "20px",
          border: `1px solid ${COLORS.borderGray}`, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: COLORS.mistBlue,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 3l9 6-9 6V3z" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.deepNavy, marginBottom: 6 }}>直接开启设备</div>
              <div style={{ fontSize: 13, color: COLORS.neutralGray, lineHeight: 1.5 }}>
                跳过评估，立刻体验训练<br/>
                完成评估后可获得个性化方案
              </div>
            </div>
          </div>
        </button>

        {/* Tip */}
        <div style={{
          background: COLORS.mistBlue, border: `1px solid ${COLORS.brandBlue}`,
          borderRadius: DESIGN.radius.card, padding: "14px 16px",
          fontSize: 13, color: COLORS.deepNavy, lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: COLORS.brandBlue }}>推荐先评估</div>
          <div>效果提升 40%。评估结果将永久保存，随时可查。</div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 36px" }}>
        <button onClick={onSkip} style={{
          width: "100%", background: "none", border: "none",
          color: COLORS.neutralGray, fontSize: 14, cursor: "pointer", padding: "8px", fontWeight: 500,
        }}>
          跳过，稍后再说
        </button>
        <div style={{ marginTop: 12 }}><ProgressDots current={2} total={3}/></div>
      </div>
    </div>
  );
}

// ── Main Onboarding ────────────────────────────────────────────────────────────
export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [smartMode, setSmartMode] = useState(false); // Default OFF before confirmation

  const skip = () => onDone(false, "home");

  if (step === 1) return (
    <Step1 onNext={() => setStep(2)} onSkip={skip} />
  );
  if (step === 2) return (
    <Step2
      smartMode={smartMode}
      setSmartMode={setSmartMode}
      onConfirm={() => smartMode ? setStep(3) : setStep(3)}
      onSkip={() => { setSmartMode(false); setStep(3); }}
    />
  );
  return (
    <Step3
      smartMode={smartMode}
      onAssess={() => onDone(smartMode, "assessment")}
      onQuick={() => onDone(smartMode, "quick-training")}
      onSkip={skip}
    />
  );
}
