import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Exercise {
  name: string;
  reps: string;
  desc: string;
}
interface Section {
  id: string;
  title: string;
  subtitle?: string;
  accentColor: string;
  lightColor: string;
  darkColor: string;
  exercises: Exercise[];
}

// ── Content data ──────────────────────────────────────────────────────────────

const DIMENSIONS = [
  { icon: "🏛️", title: "稳定之基", color: "#EEF4FF", border: "#BFDBFE", text: "#1D4ED8",
    desc: "建立动态核心稳定，提升运动中保护膝盖的抗旋转与协调能力。" },
  { icon: "🔑", title: "激活之钥", color: "#F0FDF4", border: "#86EFAC", text: "#15803D",
    desc: "激活臀部肌肉，稳定骨盆，从根源改善力线，预防膝痛。" },
  { icon: "💪", title: "支撑之力", color: "#FFFBEB", border: "#FCD34D", text: "#B45309",
    desc: "强化日常功能性力量，直接提升坐下、站起、上下楼时的轻松与稳健。" },
  { icon: "🚀", title: "推进之能", color: "#FFF1F2", border: "#FDA4AF", text: "#BE123C",
    desc: "打造踝关节稳定支点，强化小腿推进力，步履更轻盈，减震更有效。" },
  { icon: "🌿", title: "调节之方", color: "#F5F3FF", border: "#C4B5FD", text: "#6D28D9",
    desc: "促进恢复，缓解疲劳，维持肌肉弹性与关节灵活度。" },
];

const SECTIONS: Section[] = [
  {
    id: "warmup",
    title: "一、热身",
    accentColor: "#F97316",
    lightColor: "#FFF7ED",
    darkColor: "#C2410C",
    exercises: [
      { name: "转身摸臀", reps: "左右各 10 次",
        desc: "双脚与肩同宽，上身挺直，向后转身，用手去摸对侧臀部，左右交替各10次。" },
      { name: "后踢臀部", reps: "左右各 10 次",
        desc: "双脚与肩同宽，双手叉腰，脚跟向后踢臀部，左右交替各10次。" },
    ],
  },
  {
    id: "strength",
    title: "二、强化运动",
    subtitle: "以下 4 个动作为一个循环，共做 3 个循环",
    accentColor: "#3B82F6",
    lightColor: "#EFF6FF",
    darkColor: "#1D4ED8",
    exercises: [
      { name: "提膝碰肘", reps: "左右各 8 次",
        desc: "双脚与肩同宽，左手扶椅，右手搭左肩，吐气收腹提左膝碰右肘，保持身体面向正前方，8次后换另外一侧。" },
      { name: "螃蟹步", reps: "左右各 4 步 × 2 组",
        desc: "双脚与肩同宽，双手叉腰，微蹲，保持微蹲状态向左侧移4小步，再向右侧移4步，做2组。" },
      { name: "臀部找椅", reps: "8 次",
        desc: "双脚与肩同宽，双手叉腰，站于椅前半步距离，臀部向后轻触椅子边缘后慢慢起身，做8次。" },
      { name: "站立提踵", reps: "8 次",
        desc: "双脚与肩同宽，身体直立，双手扶椅，脚尖踮到最高再缓慢放下，做8次。" },
    ],
  },
  {
    id: "cooldown",
    title: "三、调整放松",
    accentColor: "#8B5CF6",
    lightColor: "#F5F3FF",
    darkColor: "#5B21B6",
    exercises: [
      { name: "快走", reps: "快走 100 步",
        desc: "用最自然的状态快速走100步。" },
      { name: "拉伸臀部", reps: "左右各 20 秒 × 2 组",
        desc: "坐位，身体挺直，右侧脚踝搭在左侧大腿上，身体挺直慢慢向前倾，同时轻轻下压右侧膝盖，感觉右侧臀部被拉紧，保持20秒后换另外一侧。" },
      { name: "拉伸大腿后侧", reps: "左右各 20 秒 × 2 组",
        desc: "坐位，伸直右腿，勾起脚尖，身体挺直慢慢向前倾，保持膝盖伸直，感受到大腿后侧拉紧，20秒后换另外一侧。" },
      { name: "拉伸躯干", reps: "左右各 20 秒 × 2 组",
        desc: "坐位，身体直立，左腿搭在右腿上，身体向左转到最大范围，用左手轻扶椅背保持稳定，右手臂轻轻将大腿向后推，感受到左侧躯干有拉紧的感觉，保持20秒后换另外一侧。" },
    ],
  },
];

// ── Exercise illustrations (SVG stick figures) ────────────────────────────────

const ILLUS: Record<string, (c: string, bg: string) => React.ReactNode> = {
  "转身摸臀": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="28" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="28" y1="16" x2="28" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="14" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="44" y2="34" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="38" x2="20" y2="56" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="38" x2="38" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="44" cy="36" r="5" fill={bg} stroke={c} strokeWidth="2"/>
      <text x="44" y="40" textAnchor="middle" fontSize="6" fill={c} fontWeight="bold">臀</text>
    </svg>
  ),
  "后踢臀部": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="26" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="26" y1="16" x2="26" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="26" y1="26" x2="12" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="26" x2="40" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="38" x2="20" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M26 38 Q40 46 46 38" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M42 34 L46 38 L40 40" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  "提膝碰肘": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="30" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="30" y1="16" x2="30" y2="36" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="14" y2="32" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="46" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="36" x2="24" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M30 36 Q38 44 42 36" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="34" r="4" fill={bg} stroke={c} strokeWidth="2"/>
      <circle cx="42" cy="38" r="4" fill={bg} stroke={c} strokeWidth="2"/>
    </svg>
  ),
  "螃蟹步": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="28" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="28" y1="16" x2="28" y2="34" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="14" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="42" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="34" x2="18" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="34" x2="38" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="52" x2="40" y2="52" stroke={c} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
      <path d="M8 52 L16 52" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M40 52 L48 52" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  "臀部找椅": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="24" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="24" y1="16" x2="24" y2="34" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="10" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="38" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="34" x2="18" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="34" x2="32" y2="50" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Chair */}
      <rect x="36" y="46" width="16" height="3" rx="1.5" fill={c} opacity="0.5"/>
      <line x1="38" y1="49" x2="38" y2="62" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="50" y1="49" x2="50" y2="62" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  "站立提踵": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="28" cy="7" r="7" fill={c} opacity="0.9"/>
      <line x1="28" y1="14" x2="28" y2="34" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="14" y2="28" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="42" y2="28" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="34" x2="22" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="34" x2="34" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tiptoe feet */}
      <path d="M22 54 Q20 58 22 62" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M34 54 Q36 58 34 62" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Up arrow */}
      <path d="M40 30 L40 16 M37 19 L40 16 L43 19" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  ),
  "快走": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="32" cy="9" r="7" fill={c} opacity="0.9"/>
      <line x1="32" y1="16" x2="30" y2="36" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="16" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="46" y2="28" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="36" x2="22" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="36" x2="42" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Motion lines */}
      <line x1="6" y1="32" x2="14" y2="32" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.45"/>
      <line x1="4" y1="38" x2="12" y2="38" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  ),
  "拉伸臀部": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      {/* Seated */}
      <circle cx="22" cy="14" r="7" fill={c} opacity="0.9"/>
      <line x1="22" y1="21" x2="22" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="28" x2="8" y2="24" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="28" x2="36" y2="32" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Legs crossed */}
      <line x1="22" y1="38" x2="12" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M22 38 Q36 44 30 52" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="10" y1="52" x2="32" y2="52" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      {/* Arrow down-forward */}
      <path d="M40 26 Q46 36 40 46" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M37 43 L40 46 L43 43" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  ),
  "拉伸大腿后侧": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="24" cy="14" r="7" fill={c} opacity="0.9"/>
      <line x1="24" y1="21" x2="24" y2="36" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="27" x2="10" y2="23" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="27" x2="38" y2="29" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Extended leg */}
      <line x1="24" y1="36" x2="18" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="36" x2="44" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="52" x2="44" y2="52" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      {/* Down arrow */}
      <path d="M36 22 L36 36 M33 33 L36 36 L39 33" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  ),
  "拉伸躯干": (c,bg) => (
    <svg width="56" height="72" viewBox="0 0 56 72">
      <circle cx="24" cy="14" r="7" fill={c} opacity="0.9"/>
      <line x1="24" y1="21" x2="24" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="28" x2="10" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="28" x2="40" y2="26" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="16" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="34" y2="52" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Rotation arc */}
      <path d="M38 20 Q46 28 38 38" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M35 36 L38 38 L40 35" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  ),
};

// ── Exercise card ─────────────────────────────────────────────────────────────

function ExerciseCard({ ex, accentColor, lightColor }: {
  ex: Exercise; accentColor: string; lightColor: string;
}) {
  const [open, setOpen] = useState(false);
  const IllusComponent = ILLUS[ex.name];

  return (
    <div style={{ borderBottom: "1px solid #F5F5F5" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }}>
        {/* Illustration */}
        <div style={{
          width: 72, height: 88, borderRadius: 14,
          background: lightColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {IllusComponent ? IllusComponent(accentColor, "white") : (
            <span style={{ fontSize: 32 }}>🏃</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#191919", marginBottom: 6 }}>{ex.name}</div>
          {/* Reps pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: lightColor, borderRadius: 20,
            padding: "4px 10px", marginBottom: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={accentColor} strokeWidth="2.2"/>
              <path d="M12 7v5l3 2.5" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: accentColor }}>{ex.reps}</span>
          </div>
          {/* Description preview */}
          <div style={{
            fontSize: 12, color: "#6B7280", lineHeight: 1.55,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: open ? undefined : 2,
            WebkitBoxOrient: "vertical" as const,
          }}>
            {ex.desc}
          </div>
        </div>

        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
          flexShrink: 0, transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "none",
        }}>
          <path d="M6 9l6 6 6-6" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {open && (
        <div style={{ padding: "0 16px 14px 16px" }}>
          <div style={{
            background: lightColor, borderRadius: 10, padding: "12px 14px",
            fontSize: 13, color: "#374151", lineHeight: 1.7,
          }}>
            {ex.desc}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// ── Forum Section (moved from HomePage) ─────────────────────────────────────

const FORUM_POSTS_D = [
  { id:1, avatar:"李", avatarColor:"#4CAF50", name:"膝盖要好好的", time:"2小时前",
    content:"今天做了第二阶段的下蹲动作，明显感觉比上周轻松了，疼痛感从5降到了2，继续坚持！",
    likes:24 },
  { id:2, avatar:"陈", avatarColor:"#2196F3", name:"健康生活家", time:"5小时前",
    content:"求问各位病友，每次用完设备后需要立刻冰敷吗？医生说可以缓解肿胀...",
    likes:12 },
];

function DiscoverForum({ onShowWx }: { onShowWx: ()=>void }) {
  const [liked, setLiked] = useState<Record<number,boolean>>({});
  const [counts, setCounts] = useState<Record<number,number>>(
    Object.fromEntries(FORUM_POSTS_D.map(p=>[p.id,p.likes]))
  );
  const toggle = (id:number) => {
    setLiked(p=>{const n=!p[id];setCounts(c=>({...c,[id]:c[id]+(n?1:-1)}));return{...p,[id]:n};});
  };

  return (
    <div style={{ margin:"14px 14px 0", background:"white", borderRadius:16,
      overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #F0F0F0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>💬</span>
          <span style={{ fontSize:15, fontWeight:700, color:"#1A3A2A" }}>社区互动</span>
        </div>
        <span style={{ fontSize:12, color:"#07C160", cursor:"pointer", fontWeight:500 }}>查看全部 →</span>
      </div>
      {FORUM_POSTS_D.map((p, i) => (
        <div key={p.id} style={{ padding:"11px 16px", borderTop:`1px solid #F5F5F5`,
          borderBottom: i < FORUM_POSTS_D.length-1 ? "none" : "1px solid #F5F5F5" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:7 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:p.avatarColor,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontWeight:700, fontSize:13, flexShrink:0 }}>{p.avatar}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{p.name}</div>
              <div style={{ fontSize:11, color:"#999" }}>{p.time}</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:"#333", lineHeight:1.55, overflow:"hidden",
            display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>
            {p.content}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:9 }}>
            <button onClick={()=>toggle(p.id)} style={{
              display:"flex", alignItems:"center", gap:5, border:"none",
              cursor:"pointer", padding:"4px 8px", borderRadius:20,
              background:liked[p.id]?"rgba(239,68,68,0.08)":"transparent",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked[p.id]?"#EF4444":"none"}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  stroke={liked[p.id]?"#EF4444":"#bbb"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize:12, color:liked[p.id]?"#EF4444":"#999", fontWeight:liked[p.id]?600:400 }}>
                {counts[p.id]}
              </span>
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize:12, color:"#999" }}>评论</span>
            </div>
          </div>
        </div>
      ))}
      {/* WeChat group CTA */}
      <div onClick={onShowWx} style={{
        display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
        background:"#F0FDF4", cursor:"pointer" }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:"#07C160",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <ellipse cx="7.8" cy="8.5" rx="6" ry="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="5.8" cy="8.5" r="1" fill="white"/>
            <circle cx="9.8" cy="8.5" r="1" fill="white"/>
            <ellipse cx="14.2" cy="12.5" rx="4.5" ry="3.5" stroke="white" strokeWidth="1.4" fill="none"/>
            <circle cx="12.8" cy="12.5" r="0.8" fill="white"/>
            <circle cx="15.6" cy="12.5" r="0.8" fill="white"/>
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#07C160" }}>加入康群微信群</div>
          <div style={{ fontSize:11, color:"#4A6A5A", marginTop:1 }}>与病友交流康养经验</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="#07C160" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 14px 0" }}>
      <div style={{ flex:1, height:1, background:"#E8E8E8" }}/>
      <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, letterSpacing:0.5,
        background:"#F7F8FA", padding:"2px 10px" }}>{label}</span>
      <div style={{ flex:1, height:1, background:"#E8E8E8" }}/>
    </div>
  );
}

export function DiscoverPage() {
  const [openDim, setOpenDim] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("warmup");
  const [showWx, setShowWx] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F7F8FA" }}>

      {/* ── Fixed header ── */}
      <div style={{ background: "white", borderBottom: "1px solid #F0F0F0",
        padding: "44px 16px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#191919" }}>✨ 发现</div>
        <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>快乐生活，「膝膝」相关</div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── Community forum (top) ── */}
        <DiscoverForum onShowWx={()=>setShowWx(true)}/>

        {/* WeChat group modal */}
        {showWx && (
          <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.5)",
            display:"flex", alignItems:"flex-end" }} onClick={()=>setShowWx(false)}>
            <div style={{ background:"white", width:"100%", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px" }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ width:36, height:4, background:"#e2e8f0", borderRadius:2, margin:"0 auto 20px" }}/>
              <div style={{ fontSize:17, fontWeight:700, color:"#1a1a1a", textAlign:"center", marginBottom:10 }}>💬 加入微信群</div>
              <div style={{ fontSize:13, color:"#666", textAlign:"center", marginBottom:20, lineHeight:1.6 }}>
                加入「哎哟爱膝」康复交流群<br/>与病友交流康复经验，获取专家答疑
              </div>
              <div style={{ width:160, height:160, margin:"0 auto 14px", background:"#f5f5f5",
                borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", border:"1px solid #e8e8e8" }}>
                <div style={{ fontSize:36, marginBottom:6 }}>📱</div>
                <div style={{ fontSize:11, color:"#999" }}>长按识别加入群聊</div>
              </div>
              <div style={{ fontSize:13, color:"#07C160", textAlign:"center", fontWeight:600 }}>
                已有 1,284 位病友在群内交流
              </div>
            </div>
          </div>
        )}

        {/* ── Divider separating community from education ── */}
        <SectionDivider label="专家科普 · 膝关节保养"/>

        {/* Expert card */}
        <div style={{
          margin: "14px 14px 0",
          background: "linear-gradient(135deg, #07C160 0%, #059945 100%)",
          borderRadius: 20, padding: "18px 18px 16px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
              }}>🎓</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.3 }}>
                  香港理工大学武汉研究院
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", marginTop: 2 }}>
                  智慧康复与创新老龄健康转化研究中心
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", lineHeight: 1.65, marginBottom: 8 }}>
              副主任符少娥教授团队，深耕肌骨关节疼痛的科研与临床，特此分享膝关节保养要点，与您共筑健康。
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", letterSpacing: 0.3 }}>
              主动练，坚持养，拥抱「膝」悦人生！
            </div>
          </div>
        </div>

        {/* Tip */}
        <div style={{
          margin: "10px 14px 0",
          background: "#FFFBE6", border: "1px solid #FDE68A",
          borderRadius: 12, padding: "10px 14px",
          display: "flex", gap: 8,
        }}>
          <span style={{ flexShrink: 0, fontSize: 13 }}>💡</span>
          <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            <strong>温馨提示：</strong>内容仅用于产品体验与科普参考，不构成医疗建议或诊断依据；如有持续不适请咨询专业人士。
          </div>
        </div>

        {/* ── Five dimensions ── */}
        <div style={{ margin: "16px 14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>💪</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#191919" }}>练出「强壮膝」</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>五维主动防护体系 · 点击展开详情</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, marginBottom: 12 }}>
            膝盖的耐用，源于科学养护。通过「稳定、激活、支撑、推进、调节」，系统强化膝关节的每一环。
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DIMENSIONS.map((d, i) => (
              <div
                key={d.title}
                onClick={() => setOpenDim(openDim === i ? null : i)}
                style={{
                  background: d.color, borderRadius: 14, padding: "14px 12px",
                  cursor: "pointer",
                  border: `1.5px solid ${openDim === i ? d.border : "transparent"}`,
                  transition: "all 0.15s",
                  gridColumn: i === 4 ? "1 / -1" : undefined,
                  boxShadow: openDim === i ? `0 2px 10px ${d.border}55` : "none",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 5 }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: d.text, marginBottom: 4 }}>{d.title}</div>
                {openDim === i
                  ? <div style={{ fontSize: 12, color: d.text, opacity: 0.82, lineHeight: 1.55 }}>{d.desc}</div>
                  : <div style={{ fontSize: 11, color: d.text, opacity: 0.5 }}>点击了解 →</div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── Exercise sections ── */}
        <div style={{ margin: "16px 0 28px" }}>
          <div style={{ padding: "0 14px 10px" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#191919" }}>📋 跟练动作</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>点击动作名查看完整说明</div>
          </div>

          {SECTIONS.map((sec) => {
            const isOpen = openSection === sec.id;
            return (
              <div key={sec.id} style={{ margin: "0 14px 12px" }}>
                {/* Section header — clickable to collapse */}
                <div
                  onClick={() => setOpenSection(isOpen ? null : sec.id)}
                  style={{
                    background: sec.lightColor, borderRadius: isOpen ? "14px 14px 0 0" : 14,
                    padding: "13px 16px", cursor: "pointer",
                    border: `1.5px solid ${sec.accentColor}33`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: sec.darkColor }}>{sec.title}</div>
                    {sec.subtitle && (
                      <div style={{ fontSize: 11, color: sec.accentColor, marginTop: 2 }}>{sec.subtitle}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: sec.accentColor,
                      background: `${sec.accentColor}18`, borderRadius: 20, padding: "3px 9px",
                    }}>
                      {sec.exercises.length} 个动作
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "none",
                    }}>
                      <path d="M6 9l6 6 6-6" stroke={sec.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Exercises list */}
                {isOpen && (
                  <div style={{
                    background: "white",
                    borderRadius: "0 0 14px 14px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}>
                    {sec.exercises.map((ex) => (
                      <ExerciseCard
                        key={ex.name}
                        ex={ex}
                        accentColor={sec.accentColor}
                        lightColor={sec.lightColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          margin: "0 14px 36px",
          background: "white", borderRadius: 14, padding: "14px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
            关于内容来源
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
            以上内容由<strong style={{ color: "#07C160" }}>香港理工大学武汉研究院</strong>智慧康复与创新老龄健康转化研究中心提供，系一般性科普信息，供日常参考，不构成任何医疗建议或诊断依据。
          </div>
        </div>
      </div>
    </div>
  );
}
