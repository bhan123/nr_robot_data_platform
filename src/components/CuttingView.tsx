/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scissors, PlayCircle, ShieldAlert, Award, 
  CheckCircle2, XCircle, Search, Filter, ClipboardList,
  UserCheck, Loader2, ArrowRightLeft, RefreshCw, Send, AlertTriangle
} from 'lucide-react';

interface CutItem {
  id: string;
  source_episode: string;
  task_name: string;
  frame_range: string;
  operator: string;
  step: '初审' | '终审' | '未分配';
  status: '初始' | '待审核' | '初审通过' | '待终审' | '已发布' | '初审拒绝' | '处理中' | '已关闭';
  reject_reason?: string;
  created_time: string;
  duration: number;
}

export function CuttingView() {
  const [items, setItems] = useState<CutItem[]>([
    { id: "CUT-28091-01", source_episode: "EP-20260528-091", task_name: "双手捡起保温杯并放入纸箱", frame_range: "0 - 150帧 (起止片 0.0-5.0s)", operator: "宋洋 (OP-02)", step: "初审", status: "待审核", created_time: "05-28 17:40", duration: 5.0 },
    { id: "CUT-28091-02", source_episode: "EP-20260528-091", task_name: "双手捡起保温杯并放入纸箱", frame_range: "151 - 462帧 (尾端置放片 5.1-15.4s)", operator: "宋洋 (OP-02)", step: "终审", status: "待终审", created_time: "05-28 18:02", duration: 10.4 },
    { id: "CUT-28092-01", source_episode: "EP-20260528-092", task_name: "使用抹布擦拭木质桌面水渍", frame_range: "0 - 300帧 (前置擦拭段 0.0-10.0s)", operator: "马芳 (OP-04)", step: "初审", status: "已发布", created_time: "05-28 18:30", duration: 10.0 },
    { id: "CUT-28092-02", source_episode: "EP-20260528-092", task_name: "使用抹布擦拭木质桌面水渍", frame_range: "301 - 684帧 (画圈收尾段 10.1-22.8s)", operator: "马芳 (OP-04)", step: "终审", status: "待终审", created_time: "05-28 18:45", duration: 12.8 },
    { id: "CUT-27042-01", source_episode: "EP-20260527-042", task_name: "倾倒果皮箱垃圾进入分类大垃圾桶", frame_range: "0 - 350帧 (提举移动段 0.0-11.6s)", operator: "林建 (OP-11)", step: "初审", status: "初始", created_time: "05-27 15:45", duration: 11.6 },
    { id: "CUT-27043-01", source_episode: "EP-20260527-043", task_name: "操作咖啡机按下启动键及提取咖啡杯", frame_range: "0 - 180帧 (点击启动段 0.0-6.0s)", operator: "陈刚 (OP-01)", step: "初审", status: "初审拒绝", reject_reason: "动捕右手示指骨骼关节严重穿模物理按钮 10px 以上，需重新映射标定。", created_time: "05-27 16:50", duration: 6.0 }
  ]);

  const [filterStep, setFilterStep] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Auditing Modal variables
  const [selectedItem, setSelectedItem] = useState<CutItem | null>(null);
  const [auditReason, setAuditReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Bulk actions simulator states
  const [actioning, setActioning] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    if (filterStep !== "all" && item.step !== filterStep) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleAuditAction = (id: string, decision: 'pass' | 'reject') => {
    if (decision === 'reject' && !auditReason) {
      setShowRejectForm(true);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (decision === 'pass') {
          const nextStatus = item.step === '初审' ? '待终审' : '已发布';
          return { ...item, status: nextStatus, step: item.step === '初审' ? '终审' : item.step, reject_reason: undefined };
        } else {
          return { ...item, status: '初审拒绝', reject_reason: auditReason || "未填写具体拒绝原因。" };
        }
      }
      return item;
    }));

    triggerToast(`任务 ${id} 操作成功: ${decision === 'pass' ? '审核通过 (Pass)' : '审核退回 (Reject)'}`);
    setSelectedItem(null);
    setAuditReason("");
    setShowRejectForm(false);
  };

  const handleClaimNext = () => {
    const unallocated = items.find(i => i.step === '初审' && i.status === '初始');
    if (unallocated) {
      setSelectedItem(unallocated);
      triggerToast(`成功为您自动派单认领切割任务: ${unallocated.id}`);
    } else {
      triggerToast("暂无可认领的初始切割事件。");
    }
  };

  const handleBulkPass = () => {
    setActioning(true);
    setTimeout(() => {
      setItems(prev => prev.map(i => {
        if (i.status === '待审核' || i.status === '待终审') {
          return { ...i, status: i.status === '待审核' ? '待终审' : '已发布', step: i.status === '待审核' ? '终审' : i.step };
        }
        return i;
      }));
      setActioning(false);
      triggerToast("已一键批量审核当前列表中所有就绪的待审核/待终审片段。");
    }, 1200);
  };

  return (
    <div className="space-y-6" id="cutting-workbench">
      
      {/* Dynamic Status Notification banner */}
      {actionToast && (
        <div className="fixed top-4 right-4 bg-zinc-900 border border-emerald-500/40 text-emerald-400 p-3 rounded-xl shadow-2xl flex items-center space-x-2 z-[9999] animate-bounce text-xs font-mono font-medium">
          <CheckCircle2 size={15} />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Grid Headers statistics aligned with internal logic */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-sans tracking-wide">待切割原片 EPs</span>
          <div className="flex items-baseline mt-2 space-x-2">
            <span className="text-xl font-bold font-mono text-zinc-100">12</span>
            <span className="text-[10px] text-amber-500 font-sans font-medium">排队中</span>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-sans tracking-wide">待切割初审片段</span>
          <div className="flex items-baseline mt-2 space-x-2">
            <span className="text-xl font-bold font-mono text-amber-400">
              {items.filter(i => i.step === '初审' && i.status === '待审核').length}
            </span>
            <span className="text-[10px] text-zinc-400 font-sans">个片段</span>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-sans tracking-wide">待切割终审片段</span>
          <div className="flex items-baseline mt-2 space-x-2">
            <span className="text-xl font-bold font-mono text-blue-400">
              {items.filter(i => i.status === '待终审').length}
            </span>
            <span className="text-[10px] text-zinc-400 font-sans">等待放行</span>
          </div>
        </div>
        <div className="p-4 bg-emerald-950/10 rounded-xl border border-emerald-900/30 flex flex-col justify-between">
          <span className="text-[10px] text-emerald-400 font-sans tracking-wide">今日切割已放行</span>
          <div className="flex items-baseline mt-2 space-x-2">
            <span className="text-xl font-bold font-mono text-emerald-400">54</span>
            <span className="text-[10px] text-emerald-500 font-sans font-medium">合格率 98.2%</span>
          </div>
        </div>
        <div className="p-4 bg-rose-950/10 rounded-xl border border-rose-900/30 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] text-rose-400 font-sans tracking-wide">动捕/物理校验阻断</span>
          <div className="flex items-baseline mt-2 space-x-2">
            <span className="text-xl font-semibold font-mono text-rose-400">3</span>
            <span className="text-[10px] text-rose-500 font-sans font-medium">待重构重贴</span>
          </div>
        </div>
      </div>

      {/* Workspace Area split: Left active table, right details mock visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: high density grid list of cutting fragments */}
        <div className="lg:col-span-2 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-900">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center">
                <Scissors size={15} className="mr-2 text-amber-500 animate-pulse" />
                MWV 分相机精确切割与审核工作流
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                对多机位 3D 时间轴实施有效帧切割，提取独立动作基元 (Primitives) 并认证
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleClaimNext}
                className="px-3 py-1.5 text-[10px] bg-zinc-850 hover:bg-zinc-800 text-zinc-350 rounded-lg border border-zinc-800 transition flex items-center space-x-1 cursor-pointer"
              >
                <UserCheck size={12} />
                <span>自动认领任务</span>
              </button>

              <button 
                onClick={handleBulkPass}
                disabled={actioning}
                className="px-3 py-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-505 text-white rounded-lg transition-colors font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {actioning ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                <span>一键批量化通过</span>
              </button>
            </div>
          </div>

          {/* Quick inline filter tools */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] bg-zinc-900/30 p-2 rounded-lg border border-zinc-900">
            <span className="text-zinc-500 font-sans ml-1 text-[10px] uppercase font-bold tracking-wider">过滤器:</span>
            
            <select 
              value={filterStep}
              onChange={(e) => setFilterStep(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">所有工作阶段 (初审/终审)</option>
              <option value="初审">初审阶段</option>
              <option value="终审">终审阶段</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">所有审核状态</option>
              <option value="初始">初始 (Draft)</option>
              <option value="待审核">待一审 (Reviewing)</option>
              <option value="待终审">待终审 (Final-Audit)</option>
              <option value="已发布">已发布 (Published)</option>
              <option value="初审拒绝">已拒绝 (Rejected)</option>
            </select>

            <span className="text-zinc-550 text-[10px] font-mono ml-auto">
              过滤结果: {filteredItems.length} 段
            </span>
          </div>

          {/* Core high frequency table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] font-semibold tracking-wider bg-zinc-950 py-2">
                  <th className="py-2.5 px-3">切割批次ID / EP</th>
                  <th className="py-2.5 px-3">对应物理帧范围</th>
                  <th className="py-2.5 px-3">切割标注员</th>
                  <th className="py-2.5 px-3">当前流程</th>
                  <th className="py-2.5 px-3">状态</th>
                  <th className="py-2.5 px-3 text-right">人工操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs">
                {filteredItems.map(item => (
                  <tr 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`hover:bg-zinc-900/20 transition-all cursor-pointer group ${
                      selectedItem?.id === item.id ? 'bg-zinc-900/40 border-l border-amber-500' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-zinc-200 group-hover:text-amber-400 transition">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]" title={item.source_episode}>
                          {item.source_episode}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="text-zinc-300 font-mono text-[11px]">{item.frame_range}</span>
                        <span className="text-[10px] text-zinc-500">切割时长: {item.duration}s</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-zinc-400 text-xs">{item.operator}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] rounded">
                        {item.step}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium inline-block border ${
                        item.status === '已发布' 
                          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                          : item.status === '待终审'
                          ? 'bg-blue-950/20 text-blue-400 border-blue-900/30 font-bold'
                          : item.status === '待审核'
                          ? 'bg-amber-950/20 text-amber-400 border-amber-900/30'
                          : item.status === '初审拒绝'
                          ? 'bg-rose-950/20 text-rose-400 border-rose-900/30'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-805'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 text-[11px] text-zinc-300 rounded border border-zinc-800 transition"
                      >
                        评鉴审核
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side: Visualizing the chosen Cutting chunk 3D specs & Rejection tools */}
        <div className="lg:col-span-1 space-y-4">
          
          {selectedItem ? (
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-5 text-zinc-100 relative">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <span className="text-xs font-bold font-mono text-zinc-400">切割任务审查核验: {selectedItem.id}</span>
                <span className="text-[10px] text-zinc-500">{selectedItem.created_time} 开标</span>
              </div>

              {/* Episode Header Info */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-zinc-200">{selectedItem.task_name}</h4>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] text-zinc-400 font-mono pt-1">
                  <div>原片 ID: {selectedItem.source_episode}</div>
                  <div>物理帧段: {selectedItem.duration}s</div>
                </div>
              </div>

              {/* Simulated video playback panel */}
              <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden flex flex-col justify-between p-3 relative bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                  <span>多机位对齐流 10 FPS (Preview)</span>
                  <span className="text-amber-500 flex items-center"><PlayCircle size={10} className="mr-1" /> ACTIVE TIME SLICE</span>
                </div>

                <div className="my-auto text-center space-y-1.5 py-4">
                  <Scissors className="mx-auto text-zinc-700 hover:text-amber-500 transition duration-300" size={26} />
                  <p className="text-[10px] text-zinc-400 font-mono">{selectedItem.frame_range}</p>
                  <p className="text-[9px] text-zinc-550">BVH 骨架时间戳与 depth.mp4 全匹配校验中</p>
                </div>

                <div className="flex justify-between text-[9px] text-zinc-400 font-mono bg-zinc-950/90 p-1 px-1.5 rounded border border-zinc-850 leading-none">
                  <span>对齐偏移度: &lt; 0.02s</span>
                  <span className="text-emerald-400 font-bold">对准合格</span>
                </div>
              </div>

              {/* Status Alert for existing Rejections */}
              {selectedItem.reject_reason && (
                <div className="p-3 bg-rose-950/20 text-rose-400 border border-rose-900/30 rounded-lg text-xs space-y-1">
                  <span className="font-bold flex items-center">
                    <ShieldAlert size={13} className="mr-1.5" />
                    已退回拒绝原因:
                  </span>
                  <p className="text-[11px] font-sans leading-relaxed text-rose-300/80">{selectedItem.reject_reason}</p>
                </div>
              )}

              {/* Dialog controls to allow Actionings */}
              <div className="space-y-3">
                
                {showRejectForm ? (
                  <div className="space-y-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 animate-fadeIn">
                    <label className="text-[10px] uppercase font-bold text-rose-400 block tracking-wide">
                      退回/不通过原因评估 (必填)
                    </label>
                    <textarea 
                      placeholder="例: 指骨关节定位漂移、多相机时间偏移、遮挡过大缺失对齐轨迹..."
                      value={auditReason}
                      onChange={(e) => setAuditReason(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-550 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAuditAction(selectedItem.id, 'reject')}
                        disabled={!auditReason}
                        className="flex-1 py-1.5 text-xs bg-rose-600 hover:bg-rose-505 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        确认拒绝并退回
                      </button>
                      <button 
                        onClick={() => setShowRejectForm(false)}
                        className="px-3 py-1.5 text-xs bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-lg transition"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button 
                      onClick={() => handleAuditAction(selectedItem.id, 'pass')}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-505 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-1 shadow-lg shadow-emerald-900/10 cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>通过放行</span>
                    </button>

                    <button 
                      onClick={() => setShowRejectForm(true)}
                      className="py-2.5 bg-[#18181b] hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl border border-zinc-800 transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <XCircle size={13} className="text-rose-500" />
                      <span>拒绝并打回</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Process guide details as real metadata */}
              <div className="text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-900 pt-3">
                <span>审核责任员: yhan (PM)</span>
                <span>标准: 骨动联合偏移度 &lt; 3帧</span>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 text-center py-16 text-zinc-550 space-y-3">
              <ClipboardList className="mx-auto text-zinc-700 animate-pulse" size={28} />
              <p className="text-xs font-medium text-zinc-400">切割批次预览审计</p>
              <p className="text-[10px] text-zinc-550 max-w-[200px] mx-auto">
                点击左侧列表中的任意切割分段，可在此加载动捕对准时间偏移评估，并可进行一键通过或拒绝打回。
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
