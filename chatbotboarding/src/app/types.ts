export type Tab = "home" | "training" | "assistant" | "discover" | "profile";
export type AppScreen =
  | "wechat-login"
  | "onboarding"
  | "home"
  | "manual-assessment"
  | "quick-training"
  | "bluetooth-config";

export type Role = "bot" | "user";
export interface Msg { id: number; role: Role; html: string; editPhase?: Phase }
export interface Task { title: string; desc: string }

// 蓝牙连接状态
export type BluetoothConnectState = 
  // 初始状态
  | "not_configured"       // 从未配置过
  | "permission_needed"    // 需要申请权限
  
  // 配置过程中的状态
  | "checking_permission"  // 检查权限中
  | "permission_denied"    // 权限被拒绝
  | "scanning"            // 正在扫描设备
  | "pairing"             // 正在配对
  | "connecting"          // 正在连接
  | "verifying"           // 正在验证设备
  
  // 终态
  | "connected"           // 已连接
  | "disconnected"        // 已断开
  | "connection_failed"   // 连接失败（需要重试）
  | "pairing_failed"      // 配对失败
  | "timeout"             // 超时
  | "permission_revoked"; // 权限被撤销

// 权限状态
export interface PermissionStatus {
  bluetooth: "granted" | "denied" | "not_checked";
  location: "granted" | "denied" | "not_checked";
  bluetoothScan?: "granted" | "denied" | "not_checked";
  bluetoothConnect?: "granted" | "denied" | "not_checked";
}

// 蓝牙设备配置
export interface BluetoothDevice {
  name: string;
  address: string;  // MAC地址或UUID
  model?: string;
  paired: boolean;
  connected: boolean;
  pairedAt?: number; // 时间戳
  lastConnectedAt?: number;
  rssi?: number; // 信号强度
  battery?: number; // 电池百分比
}

export interface UserData {
  name: string; gender: string; ageRange: string; duration: string;
  safety: string[]; stiffness: number | null; baseLevel: number;
  triggers: string[]; mainTrigger: string;
  painLevel: number; finalLevel: number;
  firstTime: boolean;
  dailyRecords: Record<number, Record<string, unknown>>;
  pressure: number; workSec: number; restSec: number; cycles: number;
  dailyFeel: string;
  postUseFeel: string;
  earlyStopReason: string;
  postTrainingPain: number;
  postTrainingStrength: number;
  day7Trigger: string; day7Pain: number; day7Feel: string;
  
  // 蓝牙设备相关
  connectedDevice?: BluetoothDevice;
  pairedDevices?: BluetoothDevice[];
  lastErrorMessage?: string;
}

export type HwState = "idle" | "running" | "paused" | "stopped";
export type DeviceState = "disconnected" | "idle" | "running" | "paused" | "stopped";

export type Phase =
  | "smart_intro" | "smart_confirm_assessment"
  | "day1_survey" | "day1_duration" | "day1_safety" | "day1_stiffness"
  | "day1_triggers" | "day1_pain" | "day1_recommend" | "day1_manual_level"
  | "day1_therapy" | "day1_early_stop_reason" | "day1_post_training" | "day1_post_strength" | "day1_optimize"
  | "daily_feel" | "daily_recommend" | "daily_therapy" | "daily_early_stop_reason" | "daily_optimize"
  | "day7_check" | "day7_trigger" | "day7_pain" | "day7_feel" | "day7_summary"
  | "safety_warning"
  | "done";

export type SurveyStep = null
  | "new_user" | "returner" | "safety" | "triggers" | "pain"
  | "day1_post_use" | "day1_strength"
  | "daily_reason"
  | "day7_trigger" | "day7_new_trigger" | "day7_pain" | "day7_feel" | "day7_skin";

export const LEVELS = ["舒缓","温和","标准","增强","强化","高阶"];
export const LEVEL_PARAMS = [
  {pressure:100,work:20,rest:15,cycles:5},
  {pressure:125,work:30,rest:10,cycles:5},
  {pressure:150,work:30,rest:10,cycles:6},
  {pressure:175,work:35,rest:10,cycles:6},
  {pressure:200,work:35,rest:8,cycles:7},
  {pressure:220,work:40,rest:8,cycles:7},
];
export const LEVEL_DESCS: Record<number,string> = {
  1:"初次体验，轻柔舒缓",2:"温和调理，轻松舒适",3:"均衡有效，循序渐进",
  4:"适度增强，进阶提升",5:"高效提升，强化巩固",6:"深度强化，高阶进阶",
};

export function getLevelName(lv: number) {
  const m: Record<number,string> = {1:"L1（低）",2:"L2（中低）",3:"L3（中）",4:"L4（中高）",5:"L5（高）",6:"L6（最高）"};
  return m[lv] || "L2（中低）";
}
export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}
