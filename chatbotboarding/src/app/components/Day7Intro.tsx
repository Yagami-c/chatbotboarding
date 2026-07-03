interface Day7IntroProps {
  onStart: () => void;
}

export function Day7Intro({ onStart }: Day7IntroProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f0f6ff]">
      <div className="bg-white rounded-3xl p-6 w-full shadow-sm border border-[#e2e8f0]">
        <div className="text-4xl text-center mb-3">📊</div>
        <h2 className="text-lg font-bold text-[#1a202c] text-center mb-2">阶段评估提醒</h2>
        <p className="text-sm text-[#4a5568] text-center leading-relaxed mb-4">
          你已经完成了 6 天的康复训练，今天将进行第 7 天复评，以对比你的进步情况。
        </p>
        <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-xl p-4 mb-4 space-y-2 text-sm text-[#1E3A5F]">
          <div className="font-semibold mb-2">复评内容：</div>
          {["重新评估最困扰动作的不适程度","整体感受反馈","7 天前后对比总结"].map(t=>(
            <div key={t} className="flex items-start gap-2"><span>•</span>{t}</div>
          ))}
        </div>
        <div className="text-center text-xs text-[#718096] mb-5">⏱ 预计耗时：3-5 分钟</div>
        <button onClick={onStart}
          className="w-full py-3.5 rounded-full bg-[#2ECC71] text-white font-bold text-base border-0 cursor-pointer active:bg-[#27AE60] transition-all shadow-[0_4px_16px_rgba(46,204,113,0.3)]">
          开始复评 →
        </button>
      </div>
    </div>
  );
}
