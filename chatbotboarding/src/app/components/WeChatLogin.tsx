import { useState } from "react";

interface WeChatLoginProps {
  onLogin: (name: string) => void;
  onSkip: () => void;
}

const MOCK_PROFILES = [
  { name: "微信用户_3721", avatar: "🧑", phone: "138****8823" },
  { name: "微信用户_5590", avatar: "👩", phone: "186****2047" },
  { name: "微信用户_8814", avatar: "🧓", phone: "159****6631" },
];
const MOCK = MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];

type Step = "landing" | "permission" | "phone" | "logging";

export function WeChatLogin({ onLogin, onSkip }: WeChatLoginProps) {
  const [step, setStep] = useState<Step>("landing");
  const [profileGranted, setProfileGranted] = useState(false);
  const [phoneGranted, setPhoneGranted] = useState(false);

  const handleWeChatTap = () => setStep("permission");

  const handleAllowProfile = () => {
    setProfileGranted(true);
    setStep("phone");
  };

  const handleAllowPhone = () => {
    setPhoneGranted(true);
    setStep("logging");
    setTimeout(() => onLogin(MOCK.name), 1200);
  };

  const handleDenyPhone = () => {
    setStep("logging");
    setTimeout(() => onLogin(MOCK.name), 1200);
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: "#F7F8FA" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #07C160 0%, #06AE56 60%, #058f47 100%)",
        padding: "52px 32px 48px",
        display: "flex", flexDirection: "column", alignItems: "center",
        borderRadius: "0 0 40px 40px",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42, marginBottom: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}>🦵</div>
        <div style={{ color: "white", fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>哎哟爱膝之家</div>
        <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 6, textAlign: "center" }}>
          AI 膝盖训练助手 · 每天陪你动起来
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-6">
        <div className="space-y-3 mb-8">
          {[
            { icon: "🤖", text: "AI 智能分析，个性化膝盖训练方案" },
            { icon: "📱", text: "每日打卡，实时追踪训练进度" },
            { icon: "🏅", text: "专家团队研发，安全又有效" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 14, border: "1px solid #edf2f7" }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <button onClick={handleWeChatTap} style={{
          width: "100%", height: 50, borderRadius: 25,
          background: "#07C160", color: "white", border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
          boxShadow: "0 4px 16px rgba(7,193,96,0.38)",
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <ellipse cx="8" cy="9" rx="6.5" ry="5" stroke="white" strokeWidth="1.6" fill="none"/>
            <circle cx="6" cy="9" r="1.2" fill="white"/><circle cx="10" cy="9" r="1.2" fill="white"/>
            <ellipse cx="14.5" cy="13.5" rx="5" ry="3.8" stroke="white" strokeWidth="1.4" fill="none"/>
            <circle cx="13" cy="13.5" r="0.9" fill="white"/><circle cx="16" cy="13.5" r="0.9" fill="white"/>
          </svg>
          微信一键登录
        </button>

        <button onClick={onSkip} style={{ marginTop: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", textAlign: "center", padding: "4px 0" }}>
          跳过，直接体验 →
        </button>
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 10, color: "#c4c9d0", lineHeight: 1.6 }}>
          登录即代表同意《用户协议》和《隐私政策》<br />仅用于个性化服务，不会泄露你的信息
        </div>
      </div>

      {/* Permission Dialog — profile */}
      {step === "permission" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", borderRadius: 28 }}>
          <div style={{ background: "white", width: "100%", borderRadius: "24px 24px 0 0", padding: "28px 24px 36px" }}>
            <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>{MOCK.avatar}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a202c" }}>{MOCK.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>微信号 · 已验证</div>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 10 }}>
                「哎哟爱膝之家」申请获取以下信息：
              </div>
              {[
                { icon: "👤", label: "昵称", value: MOCK.name },
                { icon: "🖼", label: "头像", value: "微信头像" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleAllowProfile} style={{
              width: "100%", padding: "13px 0", borderRadius: 32,
              background: "#07C160", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10,
            }}>允许</button>
            <button onClick={onSkip} style={{
              width: "100%", padding: "12px 0", borderRadius: 32,
              background: "#f7fafc", color: "#4a5568", fontWeight: 600, fontSize: 14, border: "1px solid #e2e8f0", cursor: "pointer",
            }}>拒绝</button>
          </div>
        </div>
      )}

      {/* Permission Dialog — phone */}
      {step === "phone" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", borderRadius: 28 }}>
          <div style={{ background: "white", width: "100%", borderRadius: "24px 24px 0 0", padding: "28px 24px 36px" }}>
            <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a202c" }}>申请获取手机号</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.6 }}>
                用于账号绑定与消息提醒<br />不会用于营销或第三方共享
              </div>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>📞</span>
              <div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>绑定手机号</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1a202c", marginTop: 2 }}>{MOCK.phone}</div>
              </div>
            </div>
            <button onClick={handleAllowPhone} style={{
              width: "100%", padding: "13px 0", borderRadius: 32,
              background: "#07C160", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10,
            }}>允许获取手机号</button>
            <button onClick={handleDenyPhone} style={{
              width: "100%", padding: "12px 0", borderRadius: 32,
              background: "#f7fafc", color: "#4a5568", fontWeight: 600, fontSize: 14, border: "1px solid #e2e8f0", cursor: "pointer",
            }}>暂不授权</button>
          </div>
        </div>
      )}

      {/* Logging in overlay */}
      {step === "logging" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 28 }}>
          <div style={{ background: "white", borderRadius: 20, padding: "32px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#07C160", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>登录中...</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              {profileGranted ? MOCK.name : "游客模式"} · {phoneGranted ? MOCK.phone : "未绑定手机"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
