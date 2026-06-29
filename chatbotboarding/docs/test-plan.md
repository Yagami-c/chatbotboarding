# test-plan.md — How to Validate

> L3 · QA · Step 6

---

## Testing Approach

This is a prototype — no automated test suite yet. Validation is manual, done in the browser at `http://localhost:5173`. Each flow below should be walked through after any significant change.

---

## Critical Flows

### T-01 · WeChat Login
| Step | Expected |
|------|----------|
| Open app | Login screen shows house+heart SVG logo |
| Tap "微信一键登录" | Profile permission dialog appears with mock avatar + nickname |
| Tap "允许" | Phone permission dialog appears with masked number |
| Tap "允许获取手机号" | Loading overlay shows, then proceeds to Onboarding |
| Repeat with "拒绝" on profile | Skips to Onboarding with no name set |
| Repeat with "暂不授权" on phone | Proceeds to Onboarding without phone |
| Tap "跳过，直接体验" | Skips both dialogs, goes directly to Onboarding |

### T-02 · Onboarding
| Step | Expected |
|------|----------|
| Step 1 | Welcome screen, "下一步" advances |
| Step 2, Smart Mode ON | Toggle shows green, "确认" goes to Home + assistant tab |
| Step 2, Smart Mode OFF | "暂不开启" advances to Step 3 |
| Step 3, "开始分析" | Goes to assessment flow |
| Step 3, "开启设备" | Goes to quick training flow |
| Step 3, "跳过" | Goes to Home tab |

### T-03 · Home — Assessment Flow
| Step | Expected |
|------|----------|
| Tap "开始分析" | Opens page 1 of assessment inline |
| Page 1: fill name, gender, age | Progress bar advances, "下一步" enabled |
| Page 1: leave name empty, tap next | Alert shown, no advance |
| Back button on page 1 | Returns to Home main view |
| Page 2: select risk factor + continue | Page 3 loads |
| Page 3: submit with all fields | Safety warning dialog if risk factors; proceeds to Home |

### T-04 · Home — Device Flow
| Step | Expected |
|------|----------|
| Tap "开启设备" | Opens page 1 with L1–L6 selector |
| Switch to "⚙️ 自定义模式" | Sliders appear; preview updates |
| Page 2 | Wear instructions shown |
| Page 2 "已准备好，开始使用" | Page 3 opens, countdown starts |
| Pause / Resume | Timer pauses and resumes correctly |
| Stop | Timer stops |
| "收起 · 设备继续运行" | Returns to Home main view; FloatBall shows running state |

### T-05 · AI Assistant — Day 1 Full Flow
| Step | Expected |
|------|----------|
| Enter assistant tab (smart mode on) | Bot greeting appears |
| "开始了解" → fill new_user survey | Survey chains: safety → stiffness → triggers → pain |
| Safety: select "以上都没有" | Proceeds to stiffness phase |
| Safety: select a risk factor | Bot advises rest; flow stops |
| Pain answered | Level recommendation card appears |
| "开始首次使用" | Device confirm overlay → device starts → countdown |
| Device completes | Post-use survey chain fires |
| Strength = "偏强" | finalLevel decremented |
| "进入第2天" | Day 2 starts, msgs cleared, greeting appears |

### T-06 · Day 2–6 Daily Flow
| Step | Expected |
|------|----------|
| Select "好多了" | Daily recommendation shows same level |
| Select "还是不舒服" | Level decremented by 1 in recommendation |
| Device completes | Summary card appears |
| Tab "举例" | Shows all 3 outcome examples |
| "进入第3天" | Day 3 starts |
| Repeat to Day 6 "进入阶段回顾" | Day 7 survey chain fires |

### T-07 · Day 7 Review
| Step | Expected |
|------|----------|
| Trigger survey: "还是这个" | Chains to pain survey |
| Trigger survey: "换了" | New trigger picker appears, then pain |
| All 4 surveys complete | Stage summary card appears |
| Summary: pain improved 2+ | Category = 明显改善 |
| "重新开始" | Full reset to Onboarding |

### T-08 · FloatBall
| Step | Expected |
|------|----------|
| Disconnected state | Grey ball, "未连接" |
| Tap ball (no drag) | Slide-out panel opens |
| Drag ball vertically | Ball repositions, panel stays closed |
| Device running | Green pulsing ball with spinning ring |
| Pause via panel | Ball turns amber |
| Stop via panel | Ball turns gold/amber |

---

## Regression Checklist (after any change to App.tsx)

- [ ] Login → Onboarding transition works
- [ ] Smart mode toggle affects starting tab
- [ ] Day counter increments correctly (1→2→...→7)
- [ ] Level adjustments clamp between 1 and 6
- [ ] FloatBall visible on all home sub-tabs
- [ ] SurveyModal closes correctly after each submit
- [ ] Build passes: `npm run build`
