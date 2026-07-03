import { useState } from "react";

interface NotificationsPageProps {
  onBack: () => void;
}

type NotifType = "training" | "achievement" | "expert" | "system" | "reminder";

interface Notif {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  action?: string;
}

const TYPE_META: Record<NotifType, { icon: string; color: string; bg: string; label: string }> = {
  training:    { icon: "🏃", color: "#3B82F6", bg: "#EEF4FF", label: "训练提醒" },
  achievement: { icon: "🏆", color: "#F59E0B", bg: "#FFFBE6", label: "成就徽章" },
  expert:      { icon: "👨‍⚕️", color: "#07C160", bg: "#E8F8EF", label: "专家建议" },
  system:      { icon: "🔔", color: "#6B7280", bg: "#F3F4F6", label: "系统通知" },
  reminder:    { icon: "📅", color: "#8B5CF6", bg: "#F5F3FF", label: "康养提醒" },
};

const INIT_NOTIFS: Notif[] = [
  {
    id: 1, type: "training", read: false,
    title: "今日训练提醒",
    body: "你今天还没有完成训练，剩余时间不多啦！现在开始，保持连续打卡记录 💪",
    time: "09:30", action: "去训练",
  },
  {
    id: 2, type: "achievement", read: false,
    title: "🎉 解锁成就「坚持者」",
    body: "恭喜！你已连续打卡 3 天，获得「坚持者」徽章，积分 +50！",
    time: "昨天 20:15", action: "查看成就",
  },
  {
    id: 3, type: "expert", read: false,
    title: "专家新内容推送",
    body: "「下楼梯时膝盖咔哒声是什么原因？」—— 香港理工大学武汉研究院最新科普，点击查看。",
    time: "昨天 14:00", action: "查看文章",
  },
  {
    id: 4, type: "reminder", read: true,
    title: "第 4 天训练开始啦",
    body: "你的 7 天康复计划第 4 天已解锁，今天的训练内容已为你准备好。",
    time: "1月16日", action: "查看计划",
  },
  {
    id: 5, type: "system", read: true,
    title: "设备固件更新可用",
    body: "你的 PAD 设备有新固件 v2.2.0 可用，包含性能优化和稳定性改进。",
    time: "1月15日", action: "立即更新",
  },
  {
    id: 6, type: "training", read: true,
    title: "本周目标提醒",
    body: "本周你已完成 3/7 次训练，继续加油，你可以的！",
    time: "1月14日",
  },
  {
    id: 7, type: "achievement", read: true,
    title: "解锁成就「初学者」",
    body: "你完成了首次训练，获得「初学者」徽章，积分 +20！",
    time: "1月13日",
  },
];

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [notifs, setNotifs] = useState<Notif[]>(INIT_NOTIFS);
  const [filter, setFilter] = useState<"all" | NotifType>("all");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = notifs.filter(n => filter === "all" || n.type === filter);
  const unread = filtered.filter(n => !n.read);
  const read   = filtered.filter(n => n.read);

  const FILTERS: { v: "all" | NotifType; l: string }[] = [
    { v: "all", l: "全部" },
    { v: "training", l: "训练" },
    { v: "achievement", l: "成就" },
    { v: "expert", l: "专家" },
    { v: "system", l: "系统" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F8FA" }}>
      {/* Header */}
      <div style={{
        background: "white", borderBottom: "1px solid #F0F0F0",
        padding: "48px 16px 12px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} style={{
              background: "none", border: "none", fontSize: 22, color: "#666", cursor: "pointer", lineHeight: 1,
            }}>←</button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#191919" }}>消息通知</div>
              {unreadCount > 0 && (
                <div style={{ fontSize: 12, color: "#07C160", marginTop: 2 }}>{unreadCount} 条未读</div>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: "none", border: "none", fontSize: 13, color: "#07C160",
              cursor: "pointer", fontWeight: 500,
            }}>
              全部已读
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {FILTERS.map(({ v, l }) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: filter === v ? 600 : 400, flexShrink: 0,
              background: filter === v ? "#07C160" : "#F5F5F5",
              color: filter === v ? "white" : "#666",
              transition: "all 0.15s",
            }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#BDBDBD" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔕</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>暂无消息</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>你已看完所有通知</div>
          </div>
        ) : (
          <>
            {/* Unread section */}
            {unread.length > 0 && (
              <>
                <div style={{
                  padding: "10px 16px 6px",
                  fontSize: 12, fontWeight: 600, color: "#9CA3AF",
                  letterSpacing: 0.5,
                }}>
                  未读 · {unread.length} 条
                </div>
                {unread.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={() => markRead(n.id)} />
                ))}
              </>
            )}

            {/* Read section */}
            {read.length > 0 && (
              <>
                <div style={{
                  padding: "10px 16px 6px",
                  fontSize: 12, fontWeight: 600, color: "#9CA3AF",
                  letterSpacing: 0.5,
                }}>
                  {unread.length > 0 ? "已读" : "全部消息"}
                </div>
                {read.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={() => {}} />
                ))}
              </>
            )}

            <div style={{ height: 24 }} />
          </>
        )}
      </div>
    </div>
  );
}

function NotifCard({ notif, onRead }: { notif: Notif; onRead: () => void }) {
  const meta = TYPE_META[notif.type];
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    onRead();
    setExpanded(e => !e);
  };

  return (
    <div onClick={handleClick} style={{
      background: "white",
      borderBottom: "1px solid #F5F5F5",
      padding: "14px 16px",
      cursor: "pointer",
      position: "relative",
      opacity: notif.read ? 0.75 : 1,
    }}>
      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          position: "absolute", top: 18, right: 16,
          width: 8, height: 8, borderRadius: "50%",
          background: "#07C160",
        }} />
      )}

      <div style={{ display: "flex", gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 12, background: meta.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          {meta.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type tag + time */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: meta.color,
              background: meta.bg, borderRadius: 10, padding: "2px 7px",
            }}>
              {meta.label}
            </span>
            <span style={{ fontSize: 11, color: "#BDBDBD" }}>{notif.time}</span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: 14, fontWeight: notif.read ? 400 : 600,
            color: "#191919", marginBottom: 4, lineHeight: 1.4,
          }}>
            {notif.title}
          </div>

          {/* Body */}
          <div style={{
            fontSize: 13, color: "#666", lineHeight: 1.55,
            overflow: expanded ? "visible" : "hidden",
            display: expanded ? "block" : "-webkit-box",
            WebkitLineClamp: expanded ? undefined : 2,
            WebkitBoxOrient: "vertical" as const,
          }}>
            {notif.body}
          </div>

          {/* Action button */}
          {notif.action && expanded && (
            <button onClick={e => { e.stopPropagation(); onRead(); }} style={{
              marginTop: 10, padding: "7px 16px", borderRadius: 20,
              background: meta.color, color: "white",
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            }}>
              {notif.action} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
