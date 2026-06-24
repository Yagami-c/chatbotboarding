export type Tab = "home" | "training" | "assistant" | "discover" | "profile";
export type AppScreen =
  | "onboarding"
  | "home"
  | "manual-assessment"
  | "quick-training";

export type Role = "bot" | "user";
export interface Msg { id: number; role: Role; html: string }
export interface Task { title: string; desc: string }

export interface UserData {
  name: string; gender: string; ageRange: string; duration: string;
  safety: string[]; stiffness: number | null; baseLevel: number;
  triggers: string[]; mainTrigger: string;
  painLevel: number; finalLevel: number;
  firstTime: boolean;
  dailyRecords: Record<number, Record<string, unknown>>;
  pressure: number; workSec: number; restSec: number; cycles: number;
  dailyFeel: string;
  day7Trigger: string; day7Pain: number; day7Feel: string;
}

export type HwState = "idle" | "running" | "paused" | "stopped";
export type DeviceState = "disconnected" | "idle" | "running" | "paused";

export type Phase =
  | "smart_intro" | "smart_confirm_assessment"
  | "day1_survey" | "day1_duration" | "day1_safety" | "day1_stiffness"
  | "day1_triggers" | "day1_pain" | "day1_recommend"
  | "day1_therapy" | "day1_optimize"
  | "daily_feel" | "daily_recommend" | "daily_therapy" | "daily_optimize"
  | "day7_check" | "day7_pain" | "day7_feel" | "day7_summary"
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
  1:"适合初次体验，轻柔舒缓",2:"温和调理，轻松舒适",3:"平衡有效，标准康复",
  4:"适度增强，加速恢复",5:"高效提升，强化训练",6:"深度康复，高阶专业",
};

export function getLevelName(lv: number) {
  const m: Record<number,string> = {1:"L1（低）",2:"L2（中低）",3:"L3（中）",4:"L4（中高）",5:"L5（高）",6:"L6（最高）"};
  return m[lv] || "L2（中低）";
}
export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}
