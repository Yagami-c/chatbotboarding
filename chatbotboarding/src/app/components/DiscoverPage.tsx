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

const DIMENSIONS = [
  { icon: "🏛️", title: "稳定之基", desc: "建立动态核心稳定，提升运动中保护膝盖的抗旋转与协调能力。" },
  { icon: "🔑", title: "激活之钥", desc: "激活臀部肌肉，稳定骨盆，从根源改善力线，预防膝痛。" },
  { icon: "💪", title: "支撑之力", desc: "强化日常功能性力量，直接提升坐下、站起、上下楼时的轻松与稳健。" },
  { icon: "🚀", title: "推进之能", desc: "打造踝关节稳定支点，强化小腿推进力，步履更轻盈，减震更有效。" },
  { icon: "🌿", title: "调节之方", desc: "促进恢复，缓解疲劳，维持肌肉弹性与关节灵活度。" },
];

const TIPS = [
  { emoji: "🦵", title: "膝盖为什么会不舒服？", tag: "基础知识", content: ["膝关节是全身最复杂的关节，每走一步承受体重3-5倍的压力。", "常见原因：软骨磨损、韧带松弛、肌肉力量不足、长期姿势不良。", "年龄增长、久坐少动、体重偏重都会加速不适。"] },
  { emoji: "⚠️", title: "这些动作要特别注意", tag: "注意事项", content: ["下蹲时膝盖不要超过脚尖太多，重心放在臀部。", "上下楼梯：好的腿先上、不舒服的腿先下。", "跑步或长途步行后记得拉伸，不要马上坐下不动。", "某个动作让膝盖很痛，先停下来，不要强撑。"] },
];

export function DiscoverPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#edf2f7] flex-shrink-0">
        <h1 className="text-xl font-bold text-[#1a202c]">✨ 发现</h1>
        <p className="text-xs text-[#718096] mt-0.5">快乐生活，「膝膝」相关</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

        {/* 专家来源 */}
        <div className="bg-[#f0fdf4] border border-[#6ee7b7] rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <div className="font-semibold text-[#065f46] text-sm">香港理工大学武汉研究院</div>
              <div className="text-xs text-[#047857] mt-1 leading-relaxed">
                深耕肌骨关节健康的科研团队，特此分享膝关节训练要点，和大家一起动起来更健康。
              </div>
              <div className="text-xs text-[#16a34a] mt-2 font-semibold">主动练，坚持养，拥抱「膝」悦人生！</div>
              <div className="text-[10px] text-[#6b7280] mt-2 leading-relaxed">
                以下为一般性科普信息，供日常参考。
              </div>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3 text-[11px] text-[#92400e] leading-relaxed">
          💡 <strong>小提示：</strong>内容仅供参考，不构成任何建议；如有持续不适请及时就诊。
        </div>

        {/* 五维体系 */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
          <div className="font-bold text-[#1a202c] mb-1">💪 练出「强壮膝」</div>
          <div className="text-xs text-[#718096] mb-3">五维主动防护体系 · 稳定、激活、支撑、推进、调节</div>
          <div className="flex flex-col gap-2.5">
            {DIMENSIONS.map(d => (
              <div key={d.title} className="flex gap-2.5 items-start">
                <span className="text-lg flex-shrink-0">{d.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-[#1a202c]">{d.title}　</span>
                  <span className="text-xs text-[#4a5568] leading-relaxed">{d.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 动作指南 */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="bg-[#fef3c7] px-4 py-3 border-b border-[#fde68a]">
            <div className="font-bold text-[#92400e]">🔥 一、热身</div>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {[
              { gif: gifZhuanShen, name:"转身摸臀", sets:"10次", desc:"双脚与肩同宽，上身挺直，向后转身，用手去摸对侧臀部，左右交替各10次。" },
              { gif: gifHouTi, name:"后踢臀部", sets:"10次", desc:"双脚与肩同宽，双手叉腰，脚跟向后踢臀部，左右交替各10次。" },
            ].map(ex => (
              <div key={ex.name} className="px-4 py-3">
                <img src={ex.gif} alt={ex.name} className="w-full rounded-xl mb-3 object-cover" style={{maxHeight:180}}/>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-[#1a202c]">{ex.name}</span>
                  <span className="text-xs text-[#92400e] font-medium">{ex.sets}</span>
                </div>
                <p className="text-xs text-[#718096] leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="bg-[#f0fdf4] px-4 py-3 border-b border-[#6ee7b7]">
            <div className="font-bold text-[#065f46]">💪 二、强化运动</div>
            <div className="text-[10px] text-[#047857] mt-0.5">以下4个动作为一个循环，做3个循环</div>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {[
              { gif: gifTiXi, name:"提膝碰肘", sets:"左右各8次", desc:"双脚与肩同宽，左手扶椅，右手搭左肩，吐气收腹提左膝碰右肘，保持身体面向正前方，8次后换另外一侧。" },
              { gif: gifPangXie, name:"螃蟹步", sets:"左右各4步为一组，做2组", desc:"双脚与肩同宽，双手叉腰，微蹲，保持微蹲状态向左侧移4小步，再向右侧移4步，做2组。" },
              { gif: gifTunBu, name:"臀部找椅", sets:"8次", desc:"双脚与肩同宽，双手叉腰，站于椅前半步距离，臀部向后轻触椅子边缘后慢慢起身，做8次。" },
              { gif: gifTiChong, name:"站立提踵", sets:"8次", desc:"双脚与肩同宽，身体直立，双手扶椅，脚尖踮到最高再缓慢放下，做8次。" },
            ].map(ex => (
              <div key={ex.name} className="px-4 py-3">
                <img src={ex.gif} alt={ex.name} className="w-full rounded-xl mb-3 object-cover" style={{maxHeight:180}}/>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-[#1a202c]">{ex.name}</span>
                  <span className="text-xs text-[#065f46] font-medium">{ex.sets}</span>
                </div>
                <p className="text-xs text-[#718096] leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="bg-[#f0f9ff] px-4 py-3 border-b border-[#bae6fd]">
            <div className="font-bold text-[#075985]">🌿 三、调整</div>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {[
              { gif: gifKuaiBu, name:"快走", sets:"快走100步", desc:"用最自然的状态快速走100步。" },
              { gif: gifTunDaJi, name:"拉伸臀部", sets:"左右各维持20秒，做2组", desc:"坐位，身体挺直，右侧脚踝搭在左侧大腿上，身体挺直慢慢向前倾，同时轻轻下压右侧膝盖，感觉右侧臀部被拉紧，保持20秒后换另外一侧。" },
              { gif: gifHamsring, name:"拉伸大腿后侧", sets:"左右各维持20秒，做2组", desc:"坐位，伸直右腿，勾起脚尖，身体挺直慢慢向前倾，保持膝盖伸直，感受到大腿后侧拉紧，20秒后换另外一侧。" },
              { gif: gifQuDan, name:"拉伸躯干", sets:"左右各维持20秒，做2组", desc:"坐位，身体直立，左腿搭在右腿上，身体向左转到最大范围，用左手轻扶椅背保持稳定，右手臂轻轻将大腿向后推，感受到左侧躯干有拉紧的感觉，保持20秒后换另外一侧。" },
            ].map(ex => (
              <div key={ex.name} className="px-4 py-3">
                <img src={ex.gif} alt={ex.name} className="w-full rounded-xl mb-3 object-cover" style={{maxHeight:180}}/>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-[#1a202c]">{ex.name}</span>
                  <span className="text-xs text-[#075985] font-medium">{ex.sets}</span>
                </div>
                <p className="text-xs text-[#718096] leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 小知识卡 */}
        {TIPS.map(t => (
          <div key={t.title} className="bg-[#f7fafc] border border-[#e2e8f0] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{t.emoji}</span>
              <div>
                <span className="text-[10px] bg-[#e0fdf0] text-[#16a34a] px-2 py-0.5 rounded-full font-medium">{t.tag}</span>
                <div className="font-semibold text-[#1a202c] text-sm mt-0.5">{t.title}</div>
              </div>
            </div>
            {t.content.map((line, i) => (
              <div key={i} className="flex gap-2 text-xs text-[#4a5568] leading-relaxed mb-1">
                <span className="text-[#07C160] flex-shrink-0">•</span><span>{line}</span>
              </div>
            ))}
          </div>
        ))}

        {/* 底部免责声明 */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3 text-[11px] text-[#78350f] leading-relaxed mb-2">
          🔔 内容仅供参考；如有持续不适请及时就诊。
        </div>
      </div>
    </div>
  );
}
