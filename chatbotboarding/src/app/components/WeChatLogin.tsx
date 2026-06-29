import { useState } from "react";

interface WeChatLoginProps {
  onLogin: (name: string) => void;
  onSkip: () => void;
}

export function WeChatLogin({ onLogin, onSkip }: WeChatLoginProps) {
  const [loading, setLoading] = useState(false);

  const handleWeChatLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin("用户");
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: "#F7F8FA" }}>
      {/* Top hero area */}
      <div style={{
        background: "linear-gradient(160deg, #07C160 0%, #06AE56 60%, #058f47 100%)",
        padding: "52px 32px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "0 0 40px 40px",
      }}>
        {/* Logo circle */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.22)",
          border: "2px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42, marginBottom: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}>🦵</div>
        <div style={{ color: "white", fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>
          哎哟爱膝之家
        </div>
        <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 6, textAlign: "center" }}>
          AI 护膝助手 · 智能陪你恢复
        </div>
      </div>

      {/* Login card */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-6">
        {/* Feature highlights */}
        <div className="space-y-3 mb-8">
          {[
            { icon: "🤖", text: "AI 智能评估，个性化护膝方案" },
            { icon: "📱", text: "每日陪伴，实时追踪恢复进度" },
            { icon: "🏥", text: "专业团队背书，安全有效" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 14, border: "1px solid #edf2f7" }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* WeChat login button */}
        <button
          onClick={handleWeChatLogin}
          disabled={loading}
          style={{
            width: "100%", height: 50, borderRadius: 25,
            background: loading ? "#86efac" : "#07C160",
            color: "white", border: "none", cursor: loading ? "default" : "pointer",
            fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10,
            boxShadow: "0 4px 16px rgba(7,193,96,0.38)",
            transition: "background 0.2s, transform 0.1s",
          }}
        >
          {loading ? (
            <>
              <span style={{ width: 20, height: 20, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              登录中...
            </>
          ) : (
            <>
              {/* WeChat logo */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <ellipse cx="8" cy="9" rx="6.5" ry="5" stroke="white" strokeWidth="1.6" fill="none"/>
                <circle cx="6" cy="9" r="1.2" fill="white"/>
                <circle cx="10" cy="9" r="1.2" fill="white"/>
                <ellipse cx="14.5" cy="13.5" rx="5" ry="3.8" stroke="white" strokeWidth="1.4" fill="none"/>
                <circle cx="13" cy="13.5" r="0.9" fill="white"/>
                <circle cx="16" cy="13.5" r="0.9" fill="white"/>
              </svg>
              微信一键登录
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          style={{ marginTop: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", textAlign: "center", padding: "4px 0" }}
        >
          跳过，直接体验 →
        </button>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 10, color: "#c4c9d0", lineHeight: 1.6 }}>
          登录即代表同意《用户协议》和《隐私政策》<br />
          仅用于个性化服务，不会泄露你的信息
        </div>
      </div>
    </div>
  );
}
