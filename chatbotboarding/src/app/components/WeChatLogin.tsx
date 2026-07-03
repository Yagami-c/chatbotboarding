import { useState, useEffect } from "react";

interface WeChatLoginProps {
  onLogin: (name: string) => void;
  onSkip: () => void;
}

const MOCK_PROFILES = [
  { name: "微信用户_3721", avatar: "M", phone: "138****8823", color: "#1A7AC7" },
  { name: "微信用户_5590", avatar: "F", phone: "186****2047", color: "#576B95" },
  { name: "微信用户_8814", avatar: "L", phone: "159****6631", color: "#E05C4B" },
];
const MOCK = MOCK_PROFILES[Math.floor(Math.random() * MOCK_PROFILES.length)];

type Step = "landing" | "permission" | "phone" | "logging";

// The authentic WeChat mini-program lock icon
function WeChatLockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1.5" fill="#1A7AC7"/>
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#1A7AC7" strokeWidth="1.4" fill="none"/>
    </svg>
  );
}

export function WeChatLogin({ onLogin, onSkip }: WeChatLoginProps) {
  const [step, setStep] = useState<Step>("landing");
  const [profileGranted, setProfileGranted] = useState(false);
  const [phoneGranted, setPhoneGranted] = useState(false);
  const [dots, setDots] = useState(".");
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementType, setAgreementType] = useState<"user" | "privacy">("user");

  // Animated dots for loading
  useEffect(() => {
    if (step !== "logging") return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(t);
  }, [step]);

  const handleWeChatTap = () => setStep("permission");
  const handleAllowProfile = () => { setProfileGranted(true); setStep("phone"); };
  const handleAllowPhone = () => { setPhoneGranted(true); setStep("logging"); setTimeout(() => onLogin(MOCK.name), 1400); };
  const handleDenyPhone = () => { setStep("logging"); setTimeout(() => onLogin(MOCK.name), 1400); };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#EDEDED", position: "relative" }}>

      {/* ── Top brand area ─────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(175deg, #1A7AC7 0%, #1570B8 55%, #155FA0 100%)",
        paddingTop: 60, paddingBottom: 44,
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* subtle radial overlay */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 60% 20%, rgba(255,255,255,0.12) 0%, transparent 65%)",pointerEvents:"none"}}/>

        {/* App icon — 3D-feel rounded square */}
        <div style={{
          width: 78, height: 78, borderRadius: 20,
          background: "white",
          boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, position: "relative", zIndex: 1,
        }}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            {/* house body */}
            <path d="M25 8L6 23h5v16a2.5 2.5 0 002.5 2.5h23A2.5 2.5 0 0039 39V23h5L25 8z" fill="#1A7AC7"/>
            {/* roof sheen */}
            <path d="M25 8L6 23h5v4L25 15l14 12v-4h5L25 8z" fill="#1570B8" opacity="0.5"/>
            {/* heart */}
            <path d="M25 36s-8-5-8-10.5a5 5 0 0110 0 5 5 0 0110 0C37 31 25 36 25 36z" fill="white"/>
            {/* door */}
            <rect x="21" y="30" width="8" height="10" rx="4" fill="#E8FBF0"/>
          </svg>
        </div>

        <div style={{ color: "white", fontWeight: 700, fontSize: 20, letterSpacing: 0.3, position: "relative", zIndex: 1 }}>
          哎哟爱膝之家
        </div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 5, position: "relative", zIndex: 1 }}>
          AI 膝盖训练助手
        </div>
      </div>

      {/* ── Features list ──────────────────────────────────── */}
      <div style={{ padding: "20px 16px", flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "10vh" }}>
        <div style={{ background: "white", borderRadius: 14, overflow: "hidden", marginBottom: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", width: "100%" }}>
          {[
            { icon: "🏥", color: "#DBEAFE", title: "AI 个性化方案", sub: "根据你的情况智能推荐" },
            { icon: "📊", color: "#EEF4FF", title: "进度追踪", sub: "每天打卡，看见成长" },
            { icon: "🔬", color: "#FFF5E8", title: "专家团队研发", sub: "香港理工大学研究成果" },
          ].map(({ icon, color, title, sub }, i, arr) => (
            <div key={title} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px",
              borderBottom: i < arr.length - 1 ? "1px solid #F5F5F5" : "none",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#191919" }}>{title}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <div style={{ padding: "0 16px 32px" }}>
        {/* WeChat login button — authentic green pill */}
        <button onClick={handleWeChatTap} style={{
          width: "100%", height: 50, borderRadius: 10,
          background: "#1A7AC7", color: "white",
          border: "none", cursor: "pointer",
          fontWeight: 600, fontSize: 17,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 2px 12px rgba(7,193,96,0.35)",
          letterSpacing: 0.5,
        }}>
          {/* Official WeChat icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <ellipse cx="7.8" cy="8.8" rx="6.3" ry="4.8" stroke="white" strokeWidth="1.6" fill="none"/>
            <circle cx="5.8" cy="8.8" r="1.1" fill="white"/>
            <circle cx="9.8" cy="8.8" r="1.1" fill="white"/>
            <ellipse cx="14.5" cy="13" rx="4.8" ry="3.7" stroke="white" strokeWidth="1.4" fill="none"/>
            <circle cx="13" cy="13" r="0.9" fill="white"/>
            <circle cx="16" cy="13" r="0.9" fill="white"/>
          </svg>
          微信一键登录
        </button>

        <button onClick={onSkip} style={{
          width: "100%", marginTop: 12, padding: "11px 0",
          background: "white", border: "1px solid #E8E8E8",
          borderRadius: 10, cursor: "pointer",
          fontSize: 15, color: "#666", fontWeight: 400,
        }}>
          暂不登录，直接体验
        </button>

        {/* WeChat-style legal text */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 5 }}>
          <div style={{ marginTop: 1 }}><WeChatLockIcon/></div>
          <div style={{ fontSize: 11, color: "#B2B2B2", lineHeight: 1.6, textAlign: "center" }}>
            登录即代表同意
            <span
              style={{ color: "#576B95", cursor: "pointer" }}
              onClick={() => { setAgreementType("user"); setShowAgreement(true); }}
            >《用户协议》</span>
            和
            <span
              style={{ color: "#576B95", cursor: "pointer" }}
              onClick={() => { setAgreementType("privacy"); setShowAgreement(true); }}
            >《隐私政策》</span>
            <br/>信息仅用于个性化服务，不会泄露给第三方
          </div>
        </div>
      </div>

      {/* ── Agreement Modal ──────────────────────────────────── */}
      {showAgreement && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 16, margin: "0 24px", maxWidth: 500, width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #E8E8E8" }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#191919" }}>
                {agreementType === "user" ? "用户协议" : "隐私政策"}
              </span>
              <button onClick={() => setShowAgreement(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "2px 6px" }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", fontSize: 14, color: "#333", lineHeight: 1.8 }}>
              {agreementType === "user" ? (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>用户协议</h3>
                  <p style={{ marginBottom: 12 }}>欢迎使用哎哟爱膝之家！在使用本应用前，请仔细阅读并理解本用户协议。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>1. 服务说明</h4>
                  <p style={{ marginBottom: 12 }}>哎哟爱膝之家是一款 AI 驱动的膝关节康复训练应用，为用户提供个性化的训练方案、进度追踪等服务。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>2. 用户责任</h4>
                  <p style={{ marginBottom: 12 }}>• 用户应如实提供个人健康信息，以便获得更准确的训练建议</p>
                  <p style={{ marginBottom: 12 }}>• 用户应在医生或专业人士指导下使用本应用</p>
                  <p style={{ marginBottom: 12 }}>• 用户不得将本应用用于任何非法或未经授权的用途</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>3. 免责声明</h4>
                  <p style={{ marginBottom: 12 }}>本应用提供的训练方案和建议仅供参考，不能替代专业医疗建议。使用过程中如有不适，请立即停止并咨询医生。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>4. 协议变更</h4>
                  <p style={{ marginBottom: 12 }}>我们保留随时修改本协议的权利，修改后的协议将在应用内公布。继续使用本应用即表示您接受修改后的协议。</p>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>隐私政策</h3>
                  <p style={{ marginBottom: 12 }}>我们非常重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>1. 信息收集</h4>
                  <p style={{ marginBottom: 12 }}>我们可能收集以下信息：</p>
                  <p style={{ marginBottom: 12 }}>• 账户信息：微信昵称、头像、手机号（可选）</p>
                  <p style={{ marginBottom: 12 }}>• 健康信息：年龄、性别、膝关节状况评估结果</p>
                  <p style={{ marginBottom: 12 }}>• 使用数据：训练记录、进度数据、设备使用情况</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>2. 信息使用</h4>
                  <p style={{ marginBottom: 12 }}>我们使用收集的信息用于：</p>
                  <p style={{ marginBottom: 12 }}>• 提供个性化的训练方案和建议</p>
                  <p style={{ marginBottom: 12 }}>• 追踪和分析您的康复进度</p>
                  <p style={{ marginBottom: 12 }}>• 改进我们的服务和用户体验</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>3. 信息保护</h4>
                  <p style={{ marginBottom: 12 }}>我们采取适当的安全措施保护您的个人信息，防止未经授权的访问、披露、修改或销毁。您的信息不会在未经您同意的情况下与第三方共享。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>4. 数据存储</h4>
                  <p style={{ marginBottom: 12 }}>您的数据将被安全地存储在我们的服务器上。您可以随时请求访问、更正或删除您的个人信息。</p>

                  <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>5. 联系我们</h4>
                  <p style={{ marginBottom: 12 }}>如果您对本隐私政策有任何疑问，请通过应用内的反馈功能联系我们。</p>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #E8E8E8" }}>
              <button onClick={() => setShowAgreement(false)} style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#1A7AC7", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600 }}>
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permission sheet — profile ──────────────────────── */}
      {step === "permission" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "0 0 40px" }}>
            {/* Handle */}
            <div style={{ textAlign: "center", paddingTop: 12, paddingBottom: 20 }}>
              <span style={{ display: "inline-block", width: 32, height: 4, background: "#E8E8E8", borderRadius: 2 }}/>
            </div>

            {/* App info row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1A7AC7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 50 50" fill="none">
                  <path d="M25 8L6 23h5v16a2.5 2.5 0 002.5 2.5h23A2.5 2.5 0 0039 39V23h5L25 8z" fill="white"/>
                  <path d="M25 36s-8-5-8-10.5a5 5 0 0110 0 5 5 0 0110 0C37 31 25 36 25 36z" fill="#1A7AC7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#191919" }}>哎哟爱膝之家</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>申请获取你的微信信息</div>
              </div>
            </div>

            {/* User preview */}
            <div style={{ margin: "0 16px 20px", background: "#F7F8FA", borderRadius: 14, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar circle */}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: MOCK.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontWeight: 700, fontSize: 20 }}>{MOCK.avatar}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#191919" }}>{MOCK.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>微信号 · 已实名认证</div>
                </div>
              </div>
              <div style={{ margin: "14px 0 0", paddingTop: 12, borderTop: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>将获取以下信息</div>
                {[{ label: "昵称", value: MOCK.name }, { label: "头像", value: "微信头像图片" }].map(({ label, value }, i, arr) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                    <span style={{ fontSize: 14, color: "#666" }}>{label}</span>
                    <span style={{ fontSize: 14, color: "#191919", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ padding: "0 16px", display: "flex", gap: 10 }}>
              <button onClick={onSkip} style={{ flex: 1, padding: "13px 0", borderRadius: 8, background: "#F2F2F2", color: "#666", fontWeight: 500, fontSize: 16, border: "none", cursor: "pointer" }}>
                拒绝
              </button>
              <button onClick={handleAllowProfile} style={{ flex: 1, padding: "13px 0", borderRadius: 8, background: "#1A7AC7", color: "white", fontWeight: 600, fontSize: 16, border: "none", cursor: "pointer" }}>
                允许
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permission sheet — phone ────────────────────────── */}
      {step === "phone" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "0 0 40px" }}>
            <div style={{ textAlign: "center", paddingTop: 12, paddingBottom: 20 }}>
              <span style={{ display: "inline-block", width: 32, height: 4, background: "#E8E8E8", borderRadius: 2 }}/>
            </div>
            <div style={{ textAlign: "center", padding: "0 24px 20px" }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#191919", marginBottom: 6 }}>获取手机号</div>
              <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                用于登录验证与安全保护<br/>不会用于营销或第三方共享
              </div>
            </div>

            {/* Phone number display */}
            <div style={{ margin: "0 16px 20px", background: "#F7F8FA", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#1A7AC7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#999" }}>中国大陆手机号</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#191919", marginTop: 2, letterSpacing: 1 }}>{MOCK.phone}</div>
              </div>
            </div>

            <div style={{ padding: "0 16px", display: "flex", gap: 10 }}>
              <button onClick={handleDenyPhone} style={{ flex: 1, padding: "13px 0", borderRadius: 8, background: "#F2F2F2", color: "#666", fontWeight: 500, fontSize: 16, border: "none", cursor: "pointer" }}>
                暂不授权
              </button>
              <button onClick={handleAllowPhone} style={{ flex: 1, padding: "13px 0", borderRadius: 8, background: "#1A7AC7", color: "white", fontWeight: 600, fontSize: 16, border: "none", cursor: "pointer" }}>
                允许
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logging in overlay ──────────────────────────────── */}
      {step === "logging" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "28px 36px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 160 }}>
            {/* Spinner */}
            <div style={{ width: 40, height: 40, position: "relative" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "spin 0.7s linear infinite" }}>
                <circle cx="20" cy="20" r="16" stroke="#E8E8E8" strokeWidth="3.5" fill="none"/>
                <path d="M20 4 A16 16 0 0 1 36 20" stroke="#1A7AC7" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, color: "#191919", fontWeight: 500 }}>正在登录{dots}</div>
            <div style={{ fontSize: 12, color: "#B2B2B2" }}>{profileGranted ? MOCK.name : "游客模式"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
