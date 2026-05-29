/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Episode } from '../types';
import { mockEpisodes } from '../mockData';
import { 
  Database, FileCode, CheckCircle, Trash2, Layers3, 
  Settings, ArrowRight, Download, Terminal, CircleCheck, Info
} from 'lucide-react';

interface DatasetViewProps {
  datasetEpisodes: string[];
  onRemoveFromDataset: (episodeId: string) => void;
  onClearDraft: () => void;
  onSelectEpisode: (episodeId: string) => void;
}

export function DatasetView({
  datasetEpisodes,
  onRemoveFromDataset,
  onClearDraft,
  onSelectEpisode
}: DatasetViewProps) {
  
  const [manifestExported, setManifestExported] = useState(false);
  const [manifestFormat, setManifestFormat] = useState<'json' | 'parquet' | 'csv'>('json');

  // Filter actual episodes objects matching draft list
  const selectedEpisodesList = useMemo(() => {
    return mockEpisodes.filter(e => datasetEpisodes.includes(e.episode_id));
  }, [datasetEpisodes]);

  // Aggregate stats dynamically
  const totalDuration = selectedEpisodesList.reduce((acc, curr) => acc + curr.duration, 0);
  const totalMB = selectedEpisodesList.reduce((acc, curr) => {
    const sizeVal = parseFloat(curr.total_size);
    return acc + (isNaN(sizeVal) ? 0 : sizeVal);
  }, 0);

  // Task distribution matching draft list
  const taskCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    selectedEpisodesList.forEach(e => {
      counts[e.task_name] = (counts[e.task_name] || 0) + 1;
    });
    return counts;
  }, [selectedEpisodesList]);

  // Trigger download action
  const handleExportManifest = () => {
    setManifestExported(true);
    setTimeout(() => {
      setManifestExported(false);
    }, 3000);
  };

  return (
    <div className="space-y-6" id="dataset-view-root">
      
      {/* Top action description */}
      <div className="bg-gradient-to-r from-[#170e2b] to-[#0c0c0e]/80 border border-violet-950/40 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg shadow-violet-950/5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded font-bold">
            MODEL TRAINING COMPILER
          </span>
          <h3 className="text-lg font-bold font-display">具身训练物理数据集构建空间</h3>
          <p className="text-xs text-indigo-200 leading-normal max-w-xl font-sans font-medium">
            算法组与训练组可以将 Episode 放入此空间，自动分析多模态时序分布覆盖。支持一键导出适配 TensorFlow Dataset (TFDS)、PyTorch DataLoader 或 HuggingFace Parquet 的 Manifest 索引描述。
          </p>
        </div>

        {datasetEpisodes.length > 0 && (
          <button
            onClick={onClearDraft}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold select-none cursor-pointer flex items-center space-x-1 border border-rose-500/20"
          >
            <Trash2 size={13} />
            <span>清除草稿袋</span>
          </button>
        )}
      </div>

      {datasetEpisodes.length === 0 ? (
        <div className="bg-[#0c0c0e]/60 p-16 rounded-2xl text-center border border-[#1e1e24] max-w-3xl mx-auto space-y-4">
          <Database size={48} className="text-zinc-650 mx-auto" />
          <h4 className="text-base font-bold text-zinc-200">当前没有加入任何 Episode 训练草稿</h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            请进入顶部的『 Episode 数据目录页 』。查找满足特定起迄要求、质检合格的轨迹，点击加号 <b>加为训练草稿</b>，即可在此进行三维时序分布透视。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Selected list and JSON compiler preview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Draft list table */}
            <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] text-zinc-100">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                当前挂载的 Episode 草稿 ({selectedEpisodesList.length})
              </h4>

              <div className="divide-y divide-[#1e1e24] max-h-96 overflow-y-auto pr-1">
                {selectedEpisodesList.map(ep => (
                  <div key={ep.episode_id} className="py-3 flex items-center justify-between text-xs hover:bg-zinc-900/40 rounded-lg px-2 transition">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center space-x-2">
                        <span 
                          onClick={() => onSelectEpisode(ep.episode_id)}
                          className="font-mono font-bold text-blue-400 hover:underline cursor-pointer"
                        >
                          {ep.episode_id}
                        </span>
                        <span className="text-[10px] text-zinc-500">{ep.scene}</span>
                      </div>
                      <p className="text-zinc-300 font-medium truncate mt-0.5 font-sans" title={ep.task_name}>
                        {ep.task_name}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 font-mono">
                      <div className="text-right text-[11px] text-zinc-400">
                        <p>{ep.duration}s</p>
                        <p className="text-[10px] text-zinc-550">{ep.total_size}</p>
                      </div>
                      <button
                        onClick={() => onRemoveFromDataset(ep.episode_id)}
                        className="text-rose-455 hover:text-rose-400 p-1.5 hover:bg-rose-950/20 rounded transition"
                        title="移出"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compiled manifest generator preview */}
            <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] text-zinc-100">
              <div className="flex items-center justify-between border-b border-[#1e1e24] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal size={15} className="text-indigo-400" />
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Manifest 配置自动生成视口
                  </h4>
                </div>
                <div className="flex bg-[#09090b] border border-zinc-900 rounded-lg p-0.5 text-xs font-semibold font-mono">
                  <button 
                    onClick={() => setManifestFormat('json')}
                    className={`px-2.5 py-1 rounded-md transition ${manifestFormat === 'json' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-550 hover:text-zinc-300'}`}
                  >
                    JSON
                  </button>
                  <button 
                    onClick={() => setManifestFormat('parquet')}
                    className={`px-2.5 py-1 rounded-md transition ${manifestFormat === 'parquet' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-550 hover:text-zinc-300'}`}
                  >
                    ParquetSchema
                  </button>
                  <button 
                    onClick={() => setManifestFormat('csv')}
                    className={`px-2.5 py-1 rounded-md transition ${manifestFormat === 'csv' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-550 hover:text-zinc-300'}`}
                  >
                    CSV-List
                  </button>
                </div>
              </div>

              {manifestFormat === 'json' && (
                <pre className="p-3.5 bg-[#050507] text-teal-400 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed border border-zinc-900">
{`{
  "manifest_builder": "RoboDataPlatform-V2",
  "generated_at": "2026-05-29T01:18:13Z",
  "dataset_spec": {
    "total_episodes_included": ${selectedEpisodesList.length},
    "total_training_duration_seconds": ${totalDuration},
    "dynamic_size_aggregated": "${totalMB.toFixed(1)} MB",
    "required_modalities": ["video/head_rgb", "video/left_rgb", "mocap/body", "pose/6dof"]
  },
  "episodes": [
    ${selectedEpisodesList.map(ep => `{ "id": "${ep.episode_id}", "task": "${ep.task_name.slice(0, 10)}...", "path": "${ep.nas_path}" }`).join(',\n    ')}
  ]
}`}
                </pre>
              )}

              {manifestFormat === 'parquet' && (
                <pre className="p-3.5 bg-[#050507] text-yellow-400 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed border border-zinc-900">
{`# Schema generator metadata (Arrow Format)
message schema {
  required binary episode_id (UTF8);
  required binary task_name (UTF8);
  required double sequence_duration;
  required int64 frame_samples_count;
  required group visual_features_paths {
    repeated binary head_rgb_path (UTF8);
    repeated binary left_rgb_path (UTF8);
  }
  required binary mocap_bvh_path (UTF8);
}`}
                </pre>
              )}

              {manifestFormat === 'csv' && (
                <pre className="p-3.5 bg-[#050507] text-slate-300 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed border border-zinc-900">
{`episode_id,task_name,duration_seconds,nas_absolute_path
${selectedEpisodesList.map(ep => `${ep.episode_id},"${ep.task_name}",${ep.duration},"${ep.nas_path}"`).join('\n')}`}
                </pre>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-sans">
                  ⚠️ 编译器状态：文件路径已同 NAS 物理映射规则绑定，生成的绝对 URI 允许直接在集群拉起容器挂载。
                </span>
                
                <button
                  onClick={handleExportManifest}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg border border-blue-700/30 cursor-pointer transition select-none"
                >
                  <Download size={13} />
                  <span>{manifestExported ? "生成并导出完毕 ✅" : "本地导出 Manifest"}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Col 3: Aggregated side-bar metrics & analyzer */}
          <div className="space-y-6 xl:col-span-1">
            
            {/* Aggregate Stats Card */}
            <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] text-zinc-100 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                训练集规模透视 (Aggregates)
              </h4>

              <div className="space-y-4">
                
                <div className="border-b border-[#1e1e24] pb-2">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">EPISODE 总量</p>
                  <p className="text-2xl font-bold text-zinc-100 font-display mt-0.5">
                    {selectedEpisodesList.length} <span className="text-xs font-normal text-zinc-550 font-sans">个</span>
                  </p>
                </div>

                <div className="border-b border-[#1e1e24] pb-2">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">训练总时长 (TRAIN TIME)</p>
                  <p className="text-2xl font-bold text-zinc-100 font-display mt-0.5">
                    {totalDuration.toFixed(1)} <span className="text-xs font-normal text-zinc-550 font-sans">秒</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-sans">预计所需网络读取开销 (EST. SIZE)</p>
                  <p className="text-2xl font-bold text-zinc-100 font-display mt-0.5">
                    {totalMB.toFixed(1)} <span className="text-xs font-normal text-zinc-550 font-sans">MB</span>
                  </p>
                </div>

              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-1 text-xs text-indigo-400 leading-relaxed font-sans">
                <div className="flex items-center text-indigo-300 font-semibold mb-1">
                  <Info size={13} className="mr-1 inline" />
                  <span>质量容错性良好：</span>
                </div>
                <span>当前选定 episode 平均 QC 分数为 <strong>
                  {(selectedEpisodesList.reduce((acc: number, curr: Episode) => {
                    const q = mockEpisodes.find(m => m.episode_id === curr.episode_id)?.qc_status;
                    return acc + (q === 'pass' ? 95 : q === 'review' ? 82 : 45);
                  }, 0) / selectedEpisodesList.length).toFixed(1)}
                </strong>分，属于高等级标准规范结构库。</span>
              </div>
            </div>

            {/* Distribution chart by Task */}
            <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] text-zinc-100">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                训练集任务动作类别覆盖 (Tasks)
              </h4>

              <div className="space-y-3 font-sans">
                {Object.entries(taskCounts).map(([task, count], idx) => {
                  const rate = ((count as number) / selectedEpisodesList.length) * 100;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-450">
                        <span className="font-semibold truncate max-w-[140px]" title={task}>{task}</span>
                        <span className="font-mono">{count} 场 / {rate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800/30">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${rate}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
