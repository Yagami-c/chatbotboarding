import gifZhuanShen from "../../../热身GIF/转身摸臀GIF图片.gif";
import gifHouTi from "../../../热身GIF/后踢臀部GIF.gif";
import gifTiXi from "../../../训练GIF/站立抬腿碰肘GIF.gif";
import gifPangXie from "../../../训练GIF/螃蟹步GIF.gif";
import gifTunBu from "../../../训练GIF/臀部找椅GIF.gif";
import gifTiChong from "../../../训练GIF/站立提踵GIF.gif";
import gifKuaiBu from "../../../快步走GIF/快步走GIF.gif";
import gifTunDaJi from "../../../拉伸GIF/臀大肌拉伸GIF.gif";
import gifHamsring from "../../../拉伸GIF/腘绳肌拉伸GIF.gif";
import gifQuDan from "../../../拉伸GIF/坐位躯干拉伸GIF.gif";

const SECTIONS = [
  {
    title: "热身",
    color: "#fef3c7",
    border: "#fde68a",
    text: "#92400e",
    items: [
      { gif: gifZhuanShen, name: "转身摸臀", sets: "左右各10次", desc: "双脚与肩同宽，上身挺直，向后转身用手去摸对侧臀部，左右交替。" },
      { gif: gifHouTi, name: "后踢臀部", sets: "左右各10次", desc: "双脚与肩同宽，双手叉腰，脚跟向后踢臀部，左右交替。" },
    ],
  },
  {
    title: "强化运动",
    subtitle: "以下4个动作为一个循环，共3循环",
    color: "#f0fdf4",
    border: "#6ee7b7",
    text: "#065f46",
    items: [
      { gif: gifTiXi, name: "提膝碰肘", sets: "左右各8次 × 3循环", desc: "左手扶椅，右手搭左肩，吐气收腹提左膝碰右肘，保持身体面向正前方，8次后换边。" },
      { gif: gifPangXie, name: "螃蟹步", sets: "左右各4步 × 2组 × 3循环", desc: "双脚与肩同宽，微蹲，保持微蹲状态向左侧移4小步，再向右侧移4步。" },
      { gif: gifTunBu, name: "臀部找椅", sets: "8次 × 3循环", desc: "站于椅前半步，臀部向后轻触椅子边缘后慢慢起身。膝盖不超过脚尖。" },
      { gif: gifTiChong, name: "站立提踵", sets: "8次 × 3循环", desc: "双手扶椅，脚尖踮到最高，稳住2秒，再缓慢放下。" },
    ],
  },
  {
    title: "调整放松",
    color: "#f0f9ff",
    border: "#bae6fd",
    text: "#075985",
    items: [
      { gif: gifKuaiBu, name: "快步走", sets: "100步", desc: "用最自然的状态快速走100步，保持步伐轻盈。" },
      { gif: gifTunDaJi, name: "拉伸臀部", sets: "左右各20秒 × 2组", desc: "坐位，右脚踝搭左大腿上，身体挺直慢慢前倾，轻轻下压右膝，感觉臀部拉紧，保持20秒换边。" },
      { gif: gifHamsring, name: "拉伸大腿后侧", sets: "左右各20秒 × 2组", desc: "坐位，伸直右腿勾起脚尖，身体前倾保持膝盖伸直，感受大腿后侧拉紧，20秒后换边。" },
      { gif: gifQuDan, name: "拉伸躯干", sets: "左右各20秒 × 2组", desc: "坐位，左腿搭右腿上，身体向左转到最大，左手轻扶椅背，右臂将大腿向后推，感受躯干拉紧，20秒后换边。" },
    ],
  },
];

export function TrainingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#edf2f7] flex-shrink-0">
        <h1 className="text-xl font-bold text-[#1a202c]">🏃 训练</h1>
        <p className="text-xs text-[#718096] mt-0.5">每天跟练，用主动运动换取长久灵活</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {SECTIONS.map(sec => (
          <div key={sec.title}>
            <div className="flex items-center gap-2 mb-2">
              <div className="font-bold text-base text-[#1a202c]">{sec.title}</div>
              {sec.subtitle && <span className="text-[10px] text-[#718096]">{sec.subtitle}</span>}
            </div>
            <div className="flex flex-col gap-3">
              {sec.items.map(ex => (
                <div key={ex.name} style={{background:sec.color,border:`1px solid ${sec.border}`}} className="rounded-2xl overflow-hidden">
                  <img src={ex.gif} alt={ex.name} className="w-full h-44 object-cover" />
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-[#1a202c]">{ex.name}</div>
                      <span style={{color:sec.text}} className="text-xs font-medium">{ex.sets}</span>
                    </div>
                    <p className="text-xs text-[#718096] leading-relaxed">{ex.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
