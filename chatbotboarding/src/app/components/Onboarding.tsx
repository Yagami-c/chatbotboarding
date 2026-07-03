import { useState } from "react";

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
          background: i === current ? "#07C160" : "#E0E0E0",
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
      {/* Illustrated hero — full top half */}
      <div style={{
        flex: "0 0 55%",
        background: "linear-gradient(160deg, #07C160 0%, #06AE56 55%, #04783D 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {/* Background circles */}
        <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",top:40,left:20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>

        {/* App icon */}
        <div style={{
          width: 90, height: 90, borderRadius: 26,
          background: "white",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, position: "relative", zIndex: 1,
        }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path d="M28 7L5 24h6v19a3 3 0 003 3h28a3 3 0 003-3V24h6L28 7z" fill="#07C160"/>
            <path d="M28 7L5 24h6v5L28 17l17 12v-5h6L28 7z" fill="#06AE56" opacity="0.5"/>
            <path d="M28 40s-9-5.5-9-12a6.5 6.5 0 0113 0 6.5 6.5 0 0113 0C45 34.5 28 40 28 40z" fill="white"/>
            <rect x="23" y="33" width="10" height="12" rx="5" fill="#E8FBF0"/>
          </svg>
        </div>

        <div style={{ color: "white", fontWeight: 800, fontSize: 24, letterSpacing: 0.5, position: "relative", zIndex: 1 }}>
          哎哟爱膝之家
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6, position: "relative", zIndex: 1 }}>
          AI 驱动 · 香港理工大学武汉研究院
        </div>

        {/* Wave separator */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 375 40" preserveAspectRatio="none" style={{ width: "100%", height: 40, display: "block" }}>
            <path d="M0 40 Q93 0 187 20 Q281 40 375 10 L375 40 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 28px 36px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#191919", marginBottom: 12, lineHeight: 1.3 }}>
          欢迎来到<br/>您的专属膝盖管家
        </h1>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: "auto" }}>
          科学评估、智能训练、专家陪伴——<br/>
          每天几分钟，让膝盖越来越好。
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>
          {[
            { icon: "🤖", text: "AI 个性化" },
            { icon: "📊", text: "进度追踪" },
            { icon: "🔬", text: "专家研发" },
            { icon: "🦵", text: "智能设备" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 12, color: "#065F46", fontWeight: 500,
            }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext} style={{
          width: "100%", padding: "16px", borderRadius: 14,
          background: "linear-gradient(135deg, #07C160, #059945)",
          color: "white", fontWeight: 700, fontSize: 17,
          border: "none", cursor: "pointer",
          boxShadow: "0 6px 20px rgba(7,193,96,0.4)",
          letterSpacing: 0.3,
        }}>
          开始体验 →
        </button>
        <button onClick={onSkip} style={{
          marginTop: 12, background: "none", border: "none",
          color: "#BDBDBD", fontSize: 13, cursor: "pointer", padding: "4px 0",
        }}>
          跳过引导
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
    { icon: "📅", title: "每日评估", desc: "追踪你的膝盖状态变化", color: "#EEF4FF" },
    { icon: "🔔", title: "训练提醒", desc: "按时推送，不落一次", color: "#FEF3C7" },
    { icon: "📈", title: "强度优化", desc: "实时调整训练方案", color: "#E8F8EF" },
    { icon: "💡", title: "科普推送", desc: "专家知识随时获取", color: "#F3E8FF" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", padding: "0 0 32px" }}>
      {/* Header */}
      <div style={{
        padding: "52px 24px 24px",
        background: "linear-gradient(160deg, #F0FDF4, white)",
        borderBottom: "1px solid #F0F0F0",
      }}>
        <div style={{ fontSize: 44, marginBottom: 12, textAlign: "center" }}>🤖</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#191919", textAlign: "center", marginBottom: 6 }}>
          开启智能模式
        </h2>
        <p style={{ fontSize: 13, color: "#666", textAlign: "center", lineHeight: 1.6 }}>
          让小瑞全程陪伴你的康复之旅
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
        {/* Feature grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {features.map(({ icon, title, desc, color }) => (
            <div key={title} style={{
              background: color, borderRadius: 14, padding: "14px 12px",
              opacity: smartMode ? 1 : 0.5, transition: "opacity 0.2s",
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#191919", marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Toggle row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: smartMode ? "#F0FDF4" : "#F7F8FA",
          border: `1.5px solid ${smartMode ? "#BBF7D0" : "#E8E8E8"}`,
          borderRadius: 14, padding: "14px 16px",
          transition: "all 0.25s", marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#191919" }}>
              {smartMode ? "✅ 智能模式已开启" : "智能模式"}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              {smartMode ? "小瑞将全程主动引导你" : "开启后小瑞将主动引导你"}
            </div>
          </div>
          <button onClick={() => setSmartMode(!smartMode)} style={{
            width: 48, height: 28, borderRadius: 14, border: "none",
            background: smartMode ? "#07C160" : "#D1D5DB",
            cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
          }}>
            <span style={{
              position: "absolute", top: 4, left: smartMode ? 23 : 4,
              width: 20, height: 20, borderRadius: "50%", background: "white",
              transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#BDBDBD", textAlign: "center", marginBottom: 20 }}>
          💡 可在「我的 - 设置」中随时切换
        </p>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button onClick={onConfirm} style={{
          width: "100%", padding: "15px", borderRadius: 14,
          background: "linear-gradient(135deg, #07C160, #059945)",
          color: "white", fontWeight: 700, fontSize: 16,
          border: "none", cursor: "pointer",
          boxShadow: "0 5px 18px rgba(7,193,96,0.38)",
        }}>
          确认
        </button>
        <button onClick={onSkip} style={{
          width: "100%", marginTop: 10, padding: "12px", background: "none",
          border: "none", color: "#BDBDBD", fontSize: 13, cursor: "pointer",
        }}>
          暂不开启 →
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
        <div style={{ fontSize: 44, marginBottom: 10 }}>🚀</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#191919", marginBottom: 6 }}>准备好了吗？</h2>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
          选择你想要的开始方式
        </p>
      </div>

      <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Card 1: Assessment (recommended) */}
        <button onClick={onAssess} style={{
          width: "100%", background: "linear-gradient(135deg, #07C160, #059945)",
          borderRadius: 18, padding: "22px 20px",
          border: "none", cursor: "pointer", textAlign: "left",
          position: "relative", overflow: "hidden",
          boxShadow: "0 6px 20px rgba(7,193,96,0.35)",
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100,
            borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>📋</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>先做个评估</div>
                <span style={{ fontSize: 10, background: "rgba(255,255,255,0.25)", color: "white",
                  borderRadius: 20, padding: "2px 8px", fontWeight: 600 }}>推荐</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              7 个问题 · 约 2 分钟<br/>获取你的专属 PAD 训练方案
            </div>
          </div>
        </button>

        {/* Card 2: Quick training */}
        <button onClick={onQuick} style={{
          width: "100%", background: "white",
          borderRadius: 18, padding: "22px 20px",
          border: "1.5px solid #E8E8E8", cursor: "pointer", textAlign: "left",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#191919", marginBottom: 6 }}>直接开启设备</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                跳过评估，立刻体验训练<br/>
                完成评估后可获得个性化方案
              </div>
            </div>
          </div>
        </button>

        {/* Tip */}
        <div style={{
          background: "#FFFBE6", border: "1px solid #FDE68A",
          borderRadius: 12, padding: "12px 14px",
          fontSize: 12, color: "#92400E", lineHeight: 1.5,
          display: "flex", gap: 8,
        }}>
          <span style={{ flexShrink: 0 }}>💡</span>
          <span>建议先评估，效果提升 40%。评估结果将永久保存，随时可查。</span>
        </div>
      </div>

      <div style={{ padding: "16px 20px 36px" }}>
        <button onClick={onSkip} style={{
          width: "100%", background: "none", border: "none",
          color: "#BDBDBD", fontSize: 13, cursor: "pointer", padding: "8px",
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
  const [smartMode, setSmartMode] = useState(true);

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
