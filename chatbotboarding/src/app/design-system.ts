// 设计规范 - 统一的视觉规则

// 建议色板
export const COLORS = {
  // 品牌蓝 - 主按钮、链接、选中态
  brandBlue: "#4A90E2",

  // 深海军蓝 - 标题、关键数据
  deepNavy: "#2C3E50",

  // 雾蓝 - 轻量容器、选中背景
  mistBlue: "#F0F4F8",

  // 中性灰 - 辅助文字、分割线
  neutralGray: "#7F8C9A",

  // 成功绿 - 仅成功状态
  successGreen: "#52C47B",

  // 风险红 - 仅危险/停止
  riskRed: "#E85D5D",

  // 辅助色
  white: "#FFFFFF",
  lightGray: "#F7F8FA",
  borderGray: "#E2E8F0",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  textTertiary: "#A0AEC0",
};

// 必须统一的视觉规则
export const DESIGN = {
  // 圆角
  radius: {
    card: "16px",      // 卡片
    button: "14px",    // 按钮
    input: "14px",     // 输入框
    tag: "999px",      // 标签
  },

  // 阴影 - 只保留一档极浅阴影
  shadow: {
    card: "0 1px 3px rgba(0, 0, 0, 0.08)",
    button: "0 2px 8px rgba(74, 144, 226, 0.2)",
  },

  // 图标 - 24px、2px描边、圆角端点
  icon: {
    size: "24px",
    stroke: "2px",
  },

  // 按钮 - 一屏一个实心主按钮；次按钮用描边
  button: {
    primary: {
      background: COLORS.brandBlue,
      color: COLORS.white,
      height: "48px",
    },
    secondary: {
      background: "transparent",
      border: `1px solid ${COLORS.borderGray}`,
      color: COLORS.textSecondary,
      height: "44px",
    },
  },

  // 字体 - 系统中文字体
  typography: {
    title: { fontSize: "24px", fontWeight: 700 },      // 标题
    subtitle: { fontSize: "20px", fontWeight: 600 },   // 次标题
    body: { fontSize: "17px", fontWeight: 400 },       // 正文
    bodyMedium: { fontSize: "16px", fontWeight: 500 }, // 正文加重
    caption: { fontSize: "14px", fontWeight: 400 },    // 辅助
    small: { fontSize: "12px", fontWeight: 400 },      // 说明文字
  },

  // 间距 - 以 8px 为基准
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
};
