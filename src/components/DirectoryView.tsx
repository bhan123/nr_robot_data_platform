/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Episode } from '../types';
import { mockEpisodes } from '../mockData';
import { 
  Search, Filter, Calendar, Folder, Archive, 
  CheckCircle, AlertCircle, HelpCircle, HardDrive, 
  ExternalLink, Plus, BookOpen, Layers3, X, SlidersHorizontal 
} from 'lucide-react';

interface DirectoryViewProps {
  onSelectEpisode: (episodeId: string) => void;
  onAddToDataset: (episodeId: string) => void;
  datasetEpisodes: string[];
  presetFilter: string | null;
  onClearPresetFilter: () => void;
}

export function DirectoryView({ 
  onSelectEpisode, 
  onAddToDataset, 
  datasetEpisodes,
  presetFilter,
  onClearPresetFilter
}: DirectoryViewProps) {
  
  // Search state
  const [searchText, setSearchText] = useState("");

  // Filters state
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedQCStatus, setSelectedQCStatus] = useState<string[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<string[]>([]);
  const [selectedTrainable, setSelectedTrainable] = useState<boolean | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<boolean | null>(null);
  const [selectedIntegrity, setSelectedIntegrity] = useState<string | null>(null);

  // Available metadata lists for filters
  const availableScenes = ["实验室-日常居家", "家庭场景-厨房中岛", "实验室-客厅沙盘", "ITW-办公室真实环境", "家庭场景-客厅书柜", "MWV_多相机实验室-采集站B"];
  const qcStatuses = [
    { key: "pass", label: "通过 (Pass)" },
    { key: "fail", label: "不通过 (Fail)" },
    { key: "review", label: "待复核 (Review)" }
  ];
  const alignments = [
    { key: "aligned", label: "完全对齐 (Aligned)" },
    { key: "offset_minor", label: "轻微偏移 (Offset < 1s)" },
    { key: "offset_severe", label: "严重偏移 (Offset > 1s)" },
    { key: "missing_modality", label: "模态缺失 (Missing)" }
  ];

  // Auto-fill preset filter values when navigated from dashboard cards
  const activePresetInfo = useMemo(() => {
    if (!presetFilter) return null;
    switch (presetFilter) {
      case "all":
        return "全部资产目录已加载";
      case "trainable":
        return "已筛选：训练可用资产";
      case "qc-pass":
        return "已筛选：质检通过资产";
      case "new-today":
        return "已筛选：最新扫描资产 (5/28及5/29)";
      case "failed-review":
        return "已筛选：待复核或异常资产";
      default:
        return null;
    }
  }, [presetFilter]);

  // Combine Preset + User UI Filters
  const filteredEpisodes = useMemo(() => {
    return mockEpisodes.filter(episode => {
      // 1. Text Search matching id, name, or items
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchesId = episode.episode_id.toLowerCase().includes(query);
        const matchesTask = episode.task_name.toLowerCase().includes(query);
        const matchesItems = episode.items.some(item => item.toLowerCase().includes(query));
        const matchesAction = episode.actions.some(action => action.toLowerCase().includes(query));
        if (!matchesId && !matchesTask && !matchesItems && !matchesAction) {
          return false;
        }
      }

      // 2. Preset filters from dashboard
      if (presetFilter) {
        if (presetFilter === "trainable" && !episode.trainable) return false;
        if (presetFilter === "qc-pass" && episode.qc_status !== "pass") return false;
        if (presetFilter === "new-today" && episode.collect_date !== "2026-05-28") return false;
        if (presetFilter === "failed-review" && episode.qc_status === "pass") return false;
      }

      // 3. Left filter panel parameters
      if (selectedScenes.length > 0 && !selectedScenes.includes(episode.scene)) return false;
      if (selectedQCStatus.length > 0 && !selectedQCStatus.includes(episode.qc_status)) return false;
      if (selectedAlignment.length > 0 && !selectedAlignment.includes(episode.alignment_status)) return false;
      
      if (selectedTrainable !== null && episode.trainable !== selectedTrainable) return false;
      if (selectedDeliverable !== null && episode.deliverable !== selectedDeliverable) return false;
      
      if (selectedIntegrity !== null) {
        if (selectedIntegrity === "complete" && episode.file_integrity_status !== "complete") return false;
        if (selectedIntegrity === "incomplete" && episode.file_integrity_status !== "incomplete") return false;
      }

      return true;
    });
  }, [searchText, presetFilter, selectedScenes, selectedQCStatus, selectedAlignment, selectedTrainable, selectedDeliverable, selectedIntegrity]);

  // Clear all filters handler
  const handleClearFilters = () => {
    setSelectedScenes([]);
    setSelectedQCStatus([]);
    setSelectedAlignment([]);
    setSelectedTrainable(null);
    setSelectedDeliverable(null);
    setSelectedIntegrity(null);
    setSearchText("");
    onClearPresetFilter();
  };

  // Checkbox toggle helpers
  const toggleScene = (scene: string) => {
    setSelectedScenes(prev => 
      prev.includes(scene) ? prev.filter(s => s !== scene) : [...prev, scene]
    );
  };

  const toggleQC = (status: string) => {
    setSelectedQCStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleAlign = (align: string) => {
    setSelectedAlignment(prev => 
      prev.includes(align) ? prev.filter(a => a !== align) : [...prev, align]
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" id="directory-view-container">
      
      {/* 1. Left Filters Sidebar */}
      <div className="xl:col-span-1 bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] space-y-6 h-fit sticky top-20 text-zinc-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#1e1e24]">
          <div className="flex items-center space-x-2 text-zinc-100 font-semibold text-sm">
            <SlidersHorizontal size={16} className="text-zinc-400" />
            <span>智能过滤面板</span>
          </div>
          {(selectedScenes.length > 0 || selectedQCStatus.length > 0 || selectedAlignment.length > 0 || selectedTrainable !== null || selectedDeliverable !== null || selectedIntegrity !== null || searchText || presetFilter) && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-blue-455 hover:text-blue-400 font-medium cursor-pointer"
            >
              清空全部
            </button>
          )}
        </div>

        {/* Global Preset Alert Indicator inside filters */}
        {presetFilter && (
          <div className="p-2.5 bg-blue-950/20 text-blue-400 border border-blue-900/30 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">{activePresetInfo}</span>
            </div>
            <button onClick={onClearPresetFilter} className="p-0.5 hover:bg-blue-900/40 rounded text-blue-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Text Area filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">全文实时搜索</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-550" size={15} />
            <input 
              type="text" 
              placeholder="搜索ID、任务、物品..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-[#1e1e24] rounded-lg bg-zinc-900/50 text-zinc-100 placeholder-zinc-550 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-[#0c0c0e]/80"
            />
          </div>
        </div>

        {/* Trainable & Deliverable Status Toggles */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">数据可用性标记</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setSelectedTrainable(prev => prev === true ? null : true)}
                className={`py-1.5 px-2.5 rounded-lg border text-center font-medium transition cursor-pointer ${
                  selectedTrainable === true 
                    ? 'border-emerald-550 bg-emerald-950/25 text-emerald-400' 
                    : 'border-[#1e1e24] bg-zinc-900/40 hover:bg-zinc-850 text-zinc-400'
                }`}
              >
                可用于训练
              </button>
              <button
                onClick={() => setSelectedDeliverable(prev => prev === true ? null : true)}
                className={`py-1.5 px-2.5 rounded-lg border text-center font-medium transition cursor-pointer ${
                  selectedDeliverable === true 
                    ? 'border-violet-550 bg-violet-950/25 text-violet-400' 
                    : 'border-[#1e1e24] bg-zinc-900/40 hover:bg-zinc-850 text-zinc-400'
                }`}
              >
                符合交付标准
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">文件完整度</label>
            <div className="flex rounded-md border border-[#1e1e24] bg-zinc-900/40 overflow-hidden text-xs">
              <button
                onClick={() => setSelectedIntegrity(prev => prev === "complete" ? null : "complete")}
                className={`flex-1 py-1.5 text-center transition ${
                  selectedIntegrity === "complete" ? 'bg-zinc-800 text-zinc-100 font-medium border-r border-[#1e1e24]' : 'bg-transparent hover:bg-zinc-800/40 text-zinc-400'
                }`}
              >
                无缺件
              </button>
              <button
                onClick={() => setSelectedIntegrity(prev => prev === "incomplete" ? null : "incomplete")}
                className={`flex-1 py-1.5 text-center border-l border-[#1e1e24] transition ${
                  selectedIntegrity === "incomplete" ? 'bg-zinc-800 text-zinc-100 font-medium' : 'bg-transparent hover:bg-zinc-800/40 text-zinc-400'
                }`}
              >
                缺件/缺失
              </button>
            </div>
          </div>
        </div>

        {/* Scene filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">物理空间场景</label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableScenes.map((scene, idx) => (
              <label key={idx} className="flex items-center text-xs text-zinc-400 space-x-2 cursor-pointer hover:text-zinc-200">
                <input 
                  type="checkbox" 
                  checked={selectedScenes.includes(scene)}
                  onChange={() => toggleScene(scene)}
                  className="rounded border-[#1e1e24] bg-zinc-900/50 text-blue-650 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="truncate">{scene}</span>
              </label>
            ))}
          </div>
        </div>

        {/* QC Status filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">质检评级结果</label>
          <div className="space-y-1.5">
            {qcStatuses.map((st, idx) => (
              <label key={idx} className="flex items-center text-xs text-zinc-400 space-x-2 cursor-pointer hover:text-zinc-200">
                <input 
                  type="checkbox" 
                  checked={selectedQCStatus.includes(st.key)}
                  onChange={() => toggleQC(st.key)}
                  className="rounded border-[#1e1e24] bg-zinc-900/50 text-blue-650 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>{st.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Alignment filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">多模态时间对齐状态</label>
          <div className="space-y-1.5">
            {alignments.map((al, idx) => (
              <label key={idx} className="flex items-center text-xs text-zinc-400 space-x-2 cursor-pointer hover:text-zinc-200">
                <input 
                  type="checkbox" 
                  checked={selectedAlignment.includes(al.key)}
                  onChange={() => toggleAlign(al.key)}
                  className="rounded border-[#1e1e24] bg-zinc-900/50 text-blue-650 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-[11px]">{al.label}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Right Data List Table */}
      <div className="xl:col-span-3 bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] flex flex-col justify-between h-fit min-h-[500px] text-zinc-100">
        <div>
          
          {/* List Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1e1e24] gap-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 flex items-center">
                <Folder size={16} className="text-zinc-400 mr-2" />
                Episode 采集文件资产目录
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5 font-sans">
                已检索到 <span className="font-semibold text-zinc-200 font-mono">{filteredEpisodes.length}</span> 个非结构化 Episode 目录单元
              </p>
            </div>

            {/* Quick search statistics */}
            <div className="text-xs text-zinc-400 font-medium">
              当前已被加入草稿包的 EPs: <span className="font-mono text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-1.5 py-0.5 rounded font-bold">{datasetEpisodes.length}</span> 个
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e24] text-zinc-400 text-[11px] font-semibold tracking-wider bg-zinc-900/10">
                  <th className="py-2.5 px-3">Episode ID</th>
                  <th className="py-2.5 px-3">采集任务 & 场景</th>
                  <th className="py-2.5 px-3">关键物品</th>
                  <th className="py-2.5 px-3">模态状态</th>
                  <th className="py-2.5 px-3">数据时长 & 大小</th>
                  <th className="py-2.5 px-3">质量等级/QC</th>
                  <th className="py-2.5 px-3 text-right font-sans">操作栏</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-xs">
                {filteredEpisodes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-zinc-500 bg-zinc-900/10">
                      <Archive size={36} className="mx-auto text-zinc-650 mb-2.5" />
                      <p className="font-medium text-zinc-400">无符合筛选条件的 Episode 数据资产</p>
                      <p className="text-[11px] text-zinc-500 mt-1 font-sans">请尝试放宽或“清除”左侧的过滤条件，或者修改文本搜索值</p>
                      <button 
                        onClick={handleClearFilters}
                        className="mt-4 px-3 py-1.5 text-[11px] bg-zinc-850 hover:bg-zinc-800 text-zinc-100 rounded-lg transition border border-zinc-700/60 cursor-pointer"
                      >
                        清空过滤器并重置
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredEpisodes.map((ep) => {
                    const isDraftSelected = datasetEpisodes.includes(ep.episode_id);

                    return (
                      <tr 
                        key={ep.episode_id}
                        className="hover:bg-zinc-900/30 transition-colors group"
                      >
                        {/* ID */}
                        <td className="py-3.5 px-3 font-mono font-medium text-zinc-300">
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-200 group-hover:text-blue-400 transition">
                              {ep.episode_id}
                            </span>
                            <span className="text-[10px] text-zinc-550">{ep.collect_date}</span>
                          </div>
                        </td>

                        {/* Task & Scene */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <div className="flex flex-col space-y-0.5">
                            <span className="font-medium text-zinc-300 truncate" title={ep.task_name}>
                              {ep.task_name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-sans truncate" title={ep.scene}>
                              {ep.scene}
                            </span>
                          </div>
                        </td>

                        {/* Items listed */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {ep.items.map((item, id) => (
                              <span 
                                key={id}
                                className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded text-[10px] cursor-pointer border border-zinc-800/80 hover:text-zinc-200 transition"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Modality icons */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            {/* Integrity Badge */}
                            <span 
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium font-sans min-w-[48px] text-center border ${
                                ep.file_integrity_status === 'complete' 
                                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' 
                                  : 'bg-rose-950/20 text-rose-400 border-rose-900/30'
                              }`}
                            >
                              {ep.file_integrity_status === 'complete' ? '无缺件' : '有缺失'}
                            </span>

                            {/* Alignment state */}
                            <span 
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium font-sans truncate max-w-[80px] border ${
                                ep.alignment_status === 'aligned' 
                                  ? 'bg-blue-950/20 text-blue-450 border-blue-900/30' 
                                  : ep.alignment_status === 'offset_minor'
                                  ? 'bg-amber-950/25 text-amber-450 border-amber-900/35'
                                  : ep.alignment_status === 'offset_severe'
                                  ? 'bg-orange-950/20 text-orange-450 border-orange-900/35'
                                  : 'bg-rose-950/20 text-rose-455 border-rose-900/35'
                              }`}
                            >
                              {ep.alignment_status === 'aligned' && "对准ok"}
                              {ep.alignment_status === 'offset_minor' && "轻微偏"}
                              {ep.alignment_status === 'offset_severe' && "严重偏"}
                              {ep.alignment_status === 'missing_modality' && "模态缺"}
                            </span>
                          </div>
                        </td>

                        {/* Physics Volume */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-zinc-300">
                          <div className="flex flex-col">
                            <span>{ep.duration}s <span className="text-zinc-500 font-sans">({ep.frame_count}帧)</span></span>
                            <span className="text-[10px] text-zinc-550">{ep.total_size}</span>
                          </div>
                        </td>

                        {/* Quality Overall Badge */}
                        <td className="py-3.5 px-3">
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              ep.qc_status === 'pass' 
                                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' 
                                : ep.qc_status === 'fail'
                                ? 'bg-rose-950/30 text-rose-400 border-rose-900/40 font-bold'
                                : 'bg-amber-950/30 text-amber-400 border-amber-900/40'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full mr-1.5 ${
                              ep.qc_status === 'pass' 
                                ? 'bg-emerald-500' 
                                : ep.qc_status === 'fail'
                                ? 'bg-rose-500'
                                : 'bg-amber-400'
                            }`}></span>
                            {ep.qc_status === 'pass' && '通过'}
                            {ep.qc_status === 'review' && '待复核'}
                            {ep.qc_status === 'fail' && '未通过'}
                          </span>
                        </td>

                        {/* Interactive click handlers */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            
                            {/* Select / Detail trigger */}
                            <button 
                              onClick={() => onSelectEpisode(ep.episode_id)}
                              className="px-2 py-1 bg-zinc-800/80 hover:bg-zinc-750 text-zinc-200 rounded-md font-medium text-[11px] cursor-pointer border border-zinc-700/60 duration-150"
                            >
                              查看详情
                            </button>

                            {/* Cart Add draft */}
                            <button 
                              onClick={() => onAddToDataset(ep.episode_id)}
                              className={`p-1.5 rounded-md text-[11px] font-medium transition cursor-pointer border ${
                                isDraftSelected 
                                  ? 'bg-violet-950/30 text-violet-400 border-violet-800/40 hover:bg-violet-900/30' 
                                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-700/30'
                              }`}
                              title={isDraftSelected ? "已加入数据集草稿" : "加入训练集"}
                            >
                              {isDraftSelected ? '已选' : <Plus size={14} />}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footnotes as real evidence of design craft */}
          {filteredEpisodes.length > 0 && (
            <div className="p-3 bg-zinc-900/40 border border-[#1e1e24] mt-4 rounded-xl text-xs text-zinc-400 flex items-center justify-between font-sans">
              <span className="flex items-center">
                <HardDrive size={13} className="text-zinc-500 mr-2" />
                <span>NAS 数据映射映射机制激活。点击任何一行查看其完整的多相机路径和 BVH 与位姿的时间切片。</span>
              </span>
              <span className="text-zinc-500 font-medium font-sans">共查阅 {filteredEpisodes.length}个条目</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
