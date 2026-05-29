/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Episode, AssetFile, QCResult } from '../types';
import { mockEpisodes, mockAssetFiles, mockQCResults } from '../mockData';
import { 
  X, Info, FileCode, Clock, ShieldAlert, GitMerge, ListTodo,
  Copy, Check, FileVideo, FileText, CheckCircle2, AlertTriangle, 
  HelpCircle, ChevronRight, HardDrive, ArrowRight, Activity, Zap
} from 'lucide-react';

interface EpisodeDetailsDrawerProps {
  episodeId: string;
  onClose: () => void;
  onAddToDataset: () => void;
  isDraftSelected: boolean;
}

export function EpisodeDetailsDrawer({ 
  episodeId, 
  onClose, 
  onAddToDataset,
  isDraftSelected
}: EpisodeDetailsDrawerProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'task_info' | 'files' | 'alignment' | 'qc' | 'lineage'>('info');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Get active targets from mock datasets
  const episode = useMemo(() => {
    return mockEpisodes.find(e => e.episode_id === episodeId) || null;
  }, [episodeId]);

  const files = useMemo(() => {
    return mockAssetFiles[episodeId] || [];
  }, [episodeId]);

  const qcResult = useMemo(() => {
    return mockQCResults[episodeId] || null;
  }, [episodeId]);

  if (!episode) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 text-sm">找不到对应的 Episode 详情</p>
        <button onClick={onClose} className="mt-4 px-3 py-1 bg-slate-900 text-white rounded">关闭</button>
      </div>
    );
  }

  // Copy helper
  const handleCopyPath = (path: string, key: string) => {
    navigator.clipboard.writeText(path);
    setCopiedFile(key);
    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  return (
    <div 
      className="bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-hidden"
      id="episode-detail-drawer-root"
    >
      
      {/* Drawer Header */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase bg-blue-500/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded">
              EPISODE DETECTOR
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {episode.collect_date}
            </span>
          </div>
          <h3 className="text-base font-bold font-display mt-1 tracking-tight flex items-center">
            {episode.episode_id}
            <span className="text-xs font-normal text-slate-400 font-sans ml-2.5">
              ({episode.duration}秒 / {episode.total_size})
            </span>
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* Add to Draft Cart toggler */}
          <button
            onClick={onAddToDataset}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition ${
              isDraftSelected
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Zap size={13} fill="currentColor" />
            <span>{isDraftSelected ? "已加入草稿" : "加入数据集草稿"}</span>
          </button>

          <button 
            onClick={onClose}
            className="p-1 px-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 text-xs text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('info')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[70px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'info' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          基础信息
        </button>
        <button
          onClick={() => setActiveSubTab('task_info')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[80px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'task_info' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          任务元数据
        </button>
        <button
          onClick={() => setActiveSubTab('files')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[70px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'files' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          文件清单 ({files.length})
        </button>
        <button
          onClick={() => setActiveSubTab('alignment')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[90px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'alignment' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          模态对齐轴
        </button>
        <button
          onClick={() => setActiveSubTab('qc')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[80px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'qc' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          质检结果
        </button>
        <button
          onClick={() => setActiveSubTab('lineage')}
          className={`flex-1 py-3 text-center border-b-2 font-medium min-w-[80px] whitespace-nowrap cursor-pointer transition ${
            activeSubTab === 'lineage' ? 'border-blue-600 text-blue-600 bg-white font-semibold' : 'border-transparent hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          数据血缘
        </button>
      </div>

      {/* Drawer Scroll body */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        
        {/* TAB 1: Basic Stats info */}
        {activeSubTab === 'info' && (
          <div className="space-y-5">
            
            {/* Quick Status banner */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-sans block">训练可用状态</span>
                <span className={`font-semibold inline-flex items-center ${
                  episode.trainable ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  <CheckCircle2 size={13} className="mr-1" />
                  {episode.trainable ? '合格 (Trainable)' : '已剔除/不可训练'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-sans block">商务交付标志</span>
                <span className={`font-semibold inline-flex items-center ${
                  episode.deliverable ? 'text-indigo-700' : 'text-slate-500'
                }`}>
                  <HardDrive size={13} className="mr-1" />
                  {episode.deliverable ? '可交付 (Deliverable)' : '不满足交付标准'}
                </span>
              </div>
            </div>

            {/* NAS path display */}
            <div className="bg-slate-900 rounded-xl p-3 text-white font-mono text-[11px] space-y-1.5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans">
                <span>NAS 存储绝对目录路径</span>
                <button 
                  onClick={() => handleCopyPath(episode.nas_path, 'nas_base')}
                  className="hover:text-blue-400 p-1 bg-slate-800 rounded"
                >
                  {copiedFile === 'nas_base' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
              <p className="break-all pr-8 leading-normal text-slate-200 select-all">
                {episode.nas_path}
              </p>
            </div>

            {/* Properties parameters card Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center">
                <Info size={13} className="text-blue-500 mr-1.5" />
                采集物理参数
              </h4>
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 bg-white">
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500 font-sans">执行演员 (Actor)</span>
                  <span className="font-semibold text-slate-800">{episode.actor}</span>
                </div>
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500 font-sans">采集席位 (Seat ID)</span>
                  <span className="font-semibold text-slate-800 font-mono">{episode.seat_id}</span>
                </div>
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500 font-sans">帧率周期 (Frame rate)</span>
                  <span className="font-semibold text-slate-800 font-mono">{episode.fps} FPS</span>
                </div>
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500 font-sans">图像总帧数 (Frames)</span>
                  <span className="font-semibold text-slate-800 font-mono">{episode.frame_count} 帧</span>
                </div>
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500">设备底盘型号 (Platform)</span>
                  <span className="font-semibold text-slate-800 font-mono">{episode.meta_info?.device_id || "Huan-GR1-V2"}</span>
                </div>
                <div className="flex justify-between p-3 text-xs">
                  <span className="text-slate-500">环境光度 (Ambient Lux)</span>
                  <span className="font-semibold text-slate-800">{episode.meta_info?.ambient_light || "450 Lux"}</span>
                </div>
              </div>
            </div>

            {/* Sub-tags list */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">运动控制分类标签</span>
              <div className="flex flex-wrap gap-1.5">
                {episode.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-slate-100 border border-slate-200/50 rounded-lg text-slate-700 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Task details JSON (task_info.json parsed) */}
        {activeSubTab === 'task_info' && (
          <div className="space-y-4">
            
            <div className="p-4 bg-orange-50/70 rounded-xl space-y-2.5 border border-orange-100">
              <span className="text-xs uppercase bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-md font-mono inline-block">
                task_info.json
              </span>
              <h4 className="text-sm font-bold text-slate-900">{episode.task_name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                {episode.meta_info?.task_description || "利用双手机械臂的力传感器协同，拾取指定位置的物体，完成物体的搬运放置。"}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-slate-800 flex items-center">
                <ListTodo size={14} className="text-orange-500 mr-2" />
                机器人解算分步动作序列 (Macro Action Steps)
              </h5>
              
              <div className="space-y-2 text-xs">
                {(episode.meta_info?.steps || ["开始对齐物体", "夹爪靠近接触", "增加夹持力", "提起并移出", "松开夹抓"]).map((step, id) => (
                  <div key={id} className="flex space-x-3 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-150 transition">
                    <span className="font-mono text-orange-600 font-bold bg-orange-100/50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {id + 1}
                    </span>
                    <span className="text-slate-700 font-medium font-sans leading-normal">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick JSON mock renderer to give realistic business feel */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>RAW 元数据视口</span>
                <span className="font-mono text-[10px] text-slate-400">JSON Format (Read-only)</span>
              </div>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
{`{
  "episode_id": "${episode.episode_id}",
  "task_name": "${episode.task_name}",
  "scene": "${episode.scene}",
  "items": ${JSON.stringify(episode.items)},
  "actions": ${JSON.stringify(episode.actions)},
  "meta": {
    "actor_id": "${episode.actor}",
    "device_platform": "${episode.meta_info?.device_id || "GR1-Bimanual"}",
    "lighting_condition": "${episode.meta_info?.ambient_light || "normal_lux"}"
  }
}`}
              </pre>
            </div>

          </div>
        )}

        {/* TAB 3: Multi-modal File directory tree */}
        {activeSubTab === 'files' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="flex items-center">
                <FileCode size={13} className="text-blue-500 mr-2" />
                <span>包含非结构化文件: <strong className="text-slate-800 font-mono">{files.length}</strong> 个</span>
              </span>
              <span className="text-[10px] text-slate-400">校验规范: MD5 Hash Verified</span>
            </div>

            {/* Tree listing grouped by directory hierarchy */}
            <div className="space-y-5 text-xs">
              
              {/* Folder Block 1: Video camera streaming */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  <ChevronRight size={14} className="text-slate-400 rotate-90" />
                  video / (多目多视角同步传感器)
                </span>
                <div className="pl-4 space-y-1.5 border-l border-slate-200 ml-1.5">
                  {files.filter(f => f.file_type === 'video').map(f => (
                    <div key={f.file_id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <FileVideo size={15} className="text-blue-500 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 font-mono truncate">{f.file_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {f.size} | {f.frame_count} 帧 | {f.duration}s
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopyPath(episode.nas_path + f.file_path, f.file_id)}
                        className="text-[10px] text-slate-400 hover:text-slate-800 p-1 rounded hover:bg-slate-200/50 shrink-0"
                      >
                        {copiedFile === f.file_id ? "已复制" : "复制路径"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Folder Block 2: MoCap and pose */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  <ChevronRight size={14} className="text-slate-400 rotate-90" />
                  mocap_pose / (动捕与动力学参数)
                </span>
                <div className="pl-4 space-y-1.5 border-l border-slate-200 ml-1.5">
                  {files.filter(f => f.file_type === 'mocap' || f.file_type === 'pose' || f.file_type === 'hand_skeleton').map(f => (
                    <div 
                      key={f.file_id} 
                      className={`p-2.5 border rounded-lg flex items-center justify-between group ${
                        f.exists ? 'bg-slate-50 border-slate-100' : 'bg-rose-50/50 border-rose-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <FileText size={15} className={f.exists ? "text-emerald-500 shrink-0" : "text-rose-400 shrink-0"} />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 font-mono truncate">{f.file_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {f.exists ? `${f.size} | ${f.frame_count} 帧 | 校验 verified` : "文件缺失 / Missing in NAS"}
                          </p>
                        </div>
                      </div>
                      {f.exists ? (
                        <button 
                          onClick={() => handleCopyPath(episode.nas_path + f.file_path, f.file_id)}
                          className="text-[10px] text-slate-400 hover:text-slate-800 p-1 rounded hover:bg-slate-200/50 shrink-0"
                        >
                          {copiedFile === f.file_id ? "已复制" : "复制路径"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-rose-500 font-semibold uppercase shrink-0">MISSING 缺失</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Folder Block 3: Settings Metadata */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  <ChevronRight size={14} className="text-slate-400 rotate-90" />
                  meta_qc / (元数据配置与质检日志)
                </span>
                <div className="pl-4 space-y-1.5 border-l border-slate-200 ml-1.5">
                  {files.filter(f => f.file_type === 'json_meta' || f.file_type === 'json_qc').map(f => (
                    <div key={f.file_id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <FileCode size={15} className="text-amber-500 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 font-mono truncate">{f.file_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {f.size} |最后修改: {f.last_modified}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopyPath(episode.nas_path + f.file_path, f.file_id)}
                        className="text-[10px] text-slate-400 hover:text-slate-800 p-1 rounded hover:bg-slate-200/50 shrink-0"
                      >
                        {copiedFile === f.file_id ? "已复制" : "复制路径"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: Multi-modal Timeline Aligned Axis (GORGEOUS SVG TIMELINE!) */}
        {activeSubTab === 'alignment' && (
          <div className="space-y-5">
            <div className="p-3.5 bg-slate-900 rounded-2xl text-slate-300">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-xs font-semibold font-sans flex items-center">
                  <Activity size={14} className="text-emerald-400 mr-2" />
                  多传感器起讫融合时间轴与偏置
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  episode.alignment_status === 'aligned' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {episode.alignment_status === 'aligned' ? '同步完美' : '校验未完全对齐'}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] font-sans">
                <div className="bg-slate-800/40 p-2 rounded-lg">
                  <p className="text-slate-500">主相机时钟源</p>
                  <p className="font-semibold font-mono text-slate-200 mt-0.5">System NTP-Sync</p>
                </div>
                <div className="bg-slate-800/40 p-2 rounded-lg">
                  <p className="text-slate-500">时间防抖阈值</p>
                  <p className="font-semibold font-mono text-slate-200 mt-0.5">&lt; 100ms (3帧偏差)</p>
                </div>
              </div>
            </div>

            {/* Timelines Container utilizing beautiful custom rails with specific times */}
            <div className="space-y-3.5">
              
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-1">
                <span>传感器通轨/时序轨</span>
                <span className="font-mono">采样时段 (0.0s - {episode.duration}s)</span>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-4">
                
                {files.filter(f => ['video', 'mocap', 'pose', 'hand_skeleton'].includes(f.file_type)).map((file, idx) => {
                  
                  // Calculate width of active bars relative to absolute total episode duration
                  const totalEpDuration = episode.duration;
                  const startOffsetPercent = (file.start_time / totalEpDuration) * 100;
                  const durationPercent = (file.duration / totalEpDuration) * 100;

                  // Decide track theme colors
                  let barColor = "bg-gradient-to-r from-blue-400 to-blue-500";
                  let statusLabel = `${file.duration}s (正常对齐)`;
                  
                  if (!file.exists) {
                    barColor = "bg-rose-200/50 border border-dashed border-rose-300";
                    statusLabel = "文件缺失 (Missing)";
                  } else if (file.start_time > 1) {
                    barColor = "bg-gradient-to-r from-orange-400 to-orange-500";
                    statusLabel = `偏置起讫 +${file.start_time}s`;
                  } else if (file.start_time > 0 && file.start_time <= 1) {
                    barColor = "bg-gradient-to-r from-amber-400 to-amber-500";
                    statusLabel = `轻微延时 +${file.start_time}s`;
                  }

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-semibold text-slate-700">{file.file_name}</span>
                        <span className="text-[10px] text-slate-400">{statusLabel}</span>
                      </div>

                      {/* Timeline Rail track container */}
                      <div className="w-full bg-slate-200 h-4 rounded-full relative overflow-hidden">
                        
                        {/* Shimmering offset effect if files are offset */}
                        {file.exists && file.start_time > 0 && (
                          <div 
                            className="absolute top-0 bottom-0 bg-rose-100/60 animate-pulse"
                            style={{ left: 0, width: `${startOffsetPercent}%` }}
                          ></div>
                        )}

                        {/* Solid segment for data stream */}
                        {file.exists ? (
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                            style={{ left: `${startOffsetPercent}%`, width: `${durationPercent}%`, position: 'absolute' }}
                          ></div>
                        ) : (
                          <div className="absolute inset-0 bg-rose-50/20 border border-dashed border-rose-300 rounded-full flex items-center justify-center">
                            <span className="text-[9px] text-rose-500 font-mono font-bold">MISSING / RETREAT</span>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>

              <div className="text-xs text-slate-500 bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start space-x-2">
                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">
                  <strong>时间对焦反馈：</strong>如果某传感器模态对齐发生严重偏移（例如 4.8 秒偏移），会阻断具身模型自回归运动预测。需运行 <code>/src/align_util.py</code> 做帧头对齐插值剪裁补偿。
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: QC Details (QCResult) */}
        {activeSubTab === 'qc' && (
          <div className="space-y-5">
            {qcResult ? (
              <div className="space-y-5">
                
                {/* QC Score Ring */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">自动评分系统级别</p>
                    <h5 className="text-base font-bold text-slate-800 font-sans">
                      状态: {qcResult.overall_status === 'pass' ? '通过 (PASSED)' : qcResult.overall_status === 'fail' ? '不合格 (FAILED)' : '有警告/待人工审核'}
                    </h5>
                    <p className="text-[10px] text-slate-400">检测引擎: {qcResult.checker_version} ({qcResult.checked_at})</p>
                  </div>

                  <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full border border-slate-100 shadow-sm">
                    <span className={`text-sm font-bold font-mono ${
                      qcResult.score >= 90 ? 'text-emerald-600' : qcResult.score >= 70 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {qcResult.score}/100
                    </span>
                  </div>
                </div>

                {/* Sub audit list */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-800 block">模态状态单项检查</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    
                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between">
                      <span className="text-slate-500 select-none">文件结构完备</span>
                      <span className={`font-semibold ${qcResult.file_integrity_check ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {qcResult.file_integrity_check ? 'Passed' : 'Failed'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between">
                      <span className="text-slate-500 select-none">视频多相机可读性</span>
                      <span className={`font-semibold ${qcResult.video_readable_check ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {qcResult.video_readable_check ? 'Passed' : 'Failed'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between">
                      <span className="text-slate-500 select-none">动捕骨骼BVH解析</span>
                      <span className={`font-semibold ${qcResult.mocap_parsable_check ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {qcResult.mocap_parsable_check ? 'Passed' : 'Failed'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between">
                      <span className="text-slate-500 select-none">位姿时空对齐</span>
                      <span className={`font-semibold ${qcResult.multi_modal_aligned ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {qcResult.multi_modal_aligned ? 'Passed' : 'Failed'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Suggestions / Error items */}
                <div className="space-y-2.5 text-xs">
                  <span className="text-xs font-semibold text-slate-700 block">诊断日志 / 后处理建议</span>
                  <div className="p-3.5 bg-slate-900 rounded-xl space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed select-text">
                    {qcResult.suggestions.map((sug, id) => (
                      <p key={id} className="flex items-start">
                        <span className="text-emerald-400 mr-2 shrink-0">&gt;</span>
                        <span>{sug}</span>
                      </p>
                    ))}
                    {qcResult.failed_rules.length > 0 && (
                      <div className="text-rose-400 mt-2 pt-2 border-t border-slate-805">
                        <p className="font-semibold flex items-center text-rose-300">
                          <ShieldAlert size={12} className="mr-1 inline" /> 命中阻断规则:
                        </p>
                        {qcResult.failed_rules.map((f, id) => (
                          <p key={id} className="pl-4 text-[10px]">&bull; {f}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-slate-500 text-xs py-10 text-center select-none">此 Episode 尚未完成自动化质检扫描。</p>
            )}
          </div>
        )}

        {/* TAB 6: Asset Lineage Flow chart (Stunning Visual Flow!) */}
        {activeSubTab === 'lineage' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400">数据全生命周期的血缘抽取追溯视图（扫描采集、算解、质检、归集）</p>

            {/* Simulated Directed acyclic lineage tree */}
            <div className="space-y-5 text-xs">
              
              {/* Step 1: Physical record */}
              <div className="relative pl-7 pb-2.5 border-l border-slate-200">
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>原始采集目录 / Hand-held Mocap</span>
                    <span className="font-mono text-[10px] text-slate-400">100Hz Raw</span>
                  </div>
                  <p className="text-slate-400 text-[10px]">保存于临时固态硬盘，上传到 NAS 盘的备份归档。</p>
                </div>
              </div>

              {/* Step 2: System daemon scan */}
              <div className="relative pl-7 pb-2.5 border-l border-slate-200">
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>自动化文件守护扫描 & 抽取</span>
                    <span className="font-mono text-[10px] text-slate-400">Scan-Sync</span>
                  </div>
                  <p className="text-slate-400 text-[10px]">扫描设备编号：{episode.meta_info?.device_id || "GR1-V2"}。成功校验MD5与生成 meta。</p>
                </div>
              </div>

              {/* Step 3: Robot math resolution */}
              <div className="relative pl-7 pb-2.5 border-l border-slate-200">
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 bg-violet-500 rounded-full border-2 border-white"></div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>动捕与位姿自动标定/对齐算子</span>
                    <span className="font-mono text-[10px] text-slate-400">Align-Engine v2.0</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-sans">
                    对齐状态：<strong>
                      {episode.alignment_status === 'aligned' ? '完全对齐' : '存在细脉冲对齐偏差'}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Step 4: Quality Gate block status */}
              <div className="relative pl-7">
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 bg-slate-800 rounded-full border-2 border-white"></div>
                <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>训练集/交付集交付边界校验</span>
                    <span className="bg-blue-600 px-1.5 py-0.2 rounded font-sans text-[8px] font-bold">READY</span>
                  </div>
                  <p className="text-slate-400 font-sans leading-normal">
                    模型状态：{episode.trainable ? "✅ 允许进入训练流程" : "❌ 被质检阻断禁止训练"}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
