export function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#edf2f7] flex-shrink-0">
        <h1 className="text-xl font-bold text-[#1a202c]">👤 我的</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4 mb-3">
          <div className="text-base font-semibold text-[#075985] mb-2">👤 个人中心</div>
          <div className="text-sm text-[#0c4a6e]">个人中心功能开发中，敬请期待...</div>
        </div>
      </div>
    </div>
  );
}
