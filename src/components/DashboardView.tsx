/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Episode, QCResult } from '../types';
import { mockEpisodes, mockQCResults } from '../mockData';
import { 
  Database, CheckCircle2, AlertTriangle, Clock, 
  HardDrive, Monitor, LayoutGrid, Award, ShieldAlert, TrendingUp 
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToDirectory: (presetFilter?: string) => void;
}

export function DashboardView({ onNavigateToDirectory }: DashboardViewProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Statistics calculation from live mock data
  const totalEpisodes = mockEpisodes.length;
  const trainableEpisodes = mockEpisodes.filter(e => e.trainable).length;
  const reviewEpisodes = mockEpisodes.filter(e => e.qc_status === 'review').length;
  const failedEpisodes = mockEpisodes.filter(e => e.qc_status === 'fail').length;
  const passedEpisodes = mockEpisodes.filter(e => e.qc_status === 'pass').length;
  
  const totalDurationSeconds = mockEpisodes.reduce((acc, curr) => acc + curr.duration, 0);
  const totalDurationFormatted = (totalDurationSeconds / 60).toFixed(1); // minutes

  // Today is defined as 5-28 and 5-29 in metadata
  const newToday = mockEpisodes.filter(e => e.collect_date === '2026-05-28' || e.collect_date === '2026-05-29').length;

  // Pie chart calculation for data modality files
  // head_rgb, left_rgb, right_rgb, depth (Video: 4), mocap (1), pose (1), hand_skeleton (1), json_meta/qc (2)
  const modalityDistribution = [
    { label: "多路RGB视频 (mp4)", value: 34, color: "#3b82f6" },
    { label: "动捕骨骼轨迹 (bvh)", value: 16, color: "#10b981" },
    { label: "位姿控制序列 (6DoF)", value: 18, color: "#8b5cf6" },
    { label: "手指关键点轨迹 (txt)", value: 12, color: "#f59e0b" },
    { label: "任务描述与配置 (json)", value: 20, color: "#ec4899" },
  ];

  // 7 Days Trend (May 23 - May 29, 2026)
  const trendData = [
    { date: "05-23", count: 18, size: "3.2 GB", trainable: 16 },
    { date: "05-24", count: 24, size: "4.8 GB", trainable: 22 },
    { date: "05-25", count: 32, size: "6.5 GB", trainable: 30 },
    { date: "05-26", count: 45, size: "9.2 GB", trainable: 41 },
    { date: "05-27", count: 52, size: "11.1 GB", trainable: 48 },
    { date: "05-28", count: 68, size: "15.4 GB", trainable: 62 },
    { date: "05-29", count: 75, size: "17.1 GB", trainable: 69 },
  ];

  // Top QC Rules hit frequency
  const topFailures = [
    { code: "RULE_LIGHTING_DARK", label: "场景平均照度不足 (Dark)", count: 65, rate: 45, level: "提示/Warning" },
    { code: "RULE_MODAL_OFFSET_MINOR", label: "传感器时间戳轻微偏移 (<1s)", count: 38, rate: 26, level: "警告/Warning" },
    { code: "RULE_TIMESTAMP_CONTINUOUS_FAILED", label: "时间戳不连续/抖动", count: 15, rate: 10, level: "阻断/Block" },
    { code: "RULE_VIDEO_LACK", label: "多摄像头视频缺失", count: 14, rate: 9, level: "阻断/Block" },
    { code: "RULE_TASK_INFO_INCOMPLETE", label: "task_info结构化元数据不完整", count: 12, rate: 8, level: "阻断/Block" },
  ];

  // Scenarios distribution
  const scenesCount = {
    "家庭场景": mockEpisodes.filter(e => e.scene.includes("家庭")).length,
    "实验室环境": mockEpisodes.filter(e => e.scene.includes("实验室") || e.scene.includes("LAB") || e.scene.includes("MWV")).length,
    "真实办公室(ITW)": mockEpisodes.filter(e => e.scene.includes("办公室") || e.scene.includes("ITW")).length,
  };

  return (
    <div className="space-y-6" id="dashboard-view-root">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div 
          onClick={() => onNavigateToDirectory("all")}
          className="bg-zinc-900/50 p-4 rounded-xl border border-[#1e1e24] hover:border-blue-500/80 hover:shadow-lg hover:shadow-blue-500/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Episode 资产总量</p>
              <h3 className="text-2xl font-bold text-zinc-100 font-display mt-1">4,285 <span className="text-xs font-normal text-zinc-500">个</span></h3>
            </div>
            <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/15">
              <Database size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-blue-450 font-medium">
            <span>在线存储 (NAS): 5.4 TB</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateToDirectory("trainable")}
          className="bg-zinc-900/50 p-4 rounded-xl border border-[#1e1e24] hover:border-emerald-550 hover:shadow-lg hover:shadow-emerald-500/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">可训练 Episode</p>
              <h3 className="text-2xl font-bold text-zinc-100 font-display mt-1">3,952 <span className="text-xs font-normal text-zinc-500">个</span></h3>
            </div>
            <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-500/15">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-450 font-medium">
            <span>可用比例: 92.2%</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateToDirectory("qc-pass")}
          className="bg-zinc-900/50 p-4 rounded-xl border border-[#1e1e24] hover:border-teal-550 hover:shadow-lg hover:shadow-teal-500/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium font-sans">自动化质检通过率</p>
              <h3 className="text-2xl font-bold text-zinc-100 font-display mt-1">94.8%</h3>
            </div>
            <div className="p-2.5 bg-teal-600/10 text-teal-400 rounded-lg border border-teal-500/15">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-zinc-500">
            <span className="text-teal-450 font-semibold mr-1">98.2%</span> 本周静态解析通过
          </div>
        </div>

        <div 
          onClick={() => onNavigateToDirectory("new-today")}
          className="bg-zinc-900/50 p-4 rounded-xl border border-[#1e1e24] hover:border-violet-550 hover:shadow-lg hover:shadow-violet-500/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">今日扫描新增</p>
              <h3 className="text-2xl font-bold text-zinc-100 font-display mt-1">+125 <span className="text-xs font-normal text-zinc-500 font-sans">个</span></h3>
            </div>
            <div className="p-2.5 bg-violet-600/10 text-violet-400 rounded-lg border border-violet-500/15">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-violet-450 font-medium font-mono">
            最后更新: 2026-05-29 01:15
          </div>
        </div>

        <div 
          onClick={() => onNavigateToDirectory("failed-review")}
          className="bg-zinc-900/50 p-4 rounded-xl border border-[#1e1e24] hover:border-rose-550 hover:shadow-lg hover:shadow-rose-500/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">待复核 / 质检不通过</p>
              <h3 className="text-2xl font-bold text-rose-500 font-display mt-1">
                {reviewEpisodes + failedEpisodes} <span className="text-xs font-normal text-zinc-500 font-sans">个</span>
              </h3>
            </div>
            <div className="p-2.5 bg-rose-600/10 text-rose-455 rounded-lg border border-rose-500/15">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-rose-450 font-medium">
            <span>异常比率: 7.8% (急需后处理)</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (SVG) */}
        <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">最近 7 天数据增长与可训练率趋势</h4>
              <p className="text-xs text-zinc-500 mt-0.5">每日新增 Episode 数与自动化标记为 Trainable 的比率</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center text-blue-400">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-1.5"></span>
                新增扫描数
              </div>
              <div className="flex items-center text-emerald-400">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1.5"></span>
                可交付数
              </div>
            </div>
          </div>

          <div className="relative h-64 w-full">
            <svg viewBox="0 0 600 240" className="w-full h-full text-zinc-700">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#1e1e24" strokeWidth="1" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#1e1e24" strokeWidth="1" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#1e1e24" strokeWidth="1" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#1e1e24" strokeWidth="1" />
              <line x1="40" y1="210" x2="580" y2="210" stroke="#27272a" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="15" y="25" className="text-[10px] font-mono fill-zinc-500">80</text>
              <text x="15" y="75" className="text-[10px] font-mono fill-zinc-500">60</text>
              <text x="15" y="125" className="text-[10px] font-mono fill-zinc-500">40</text>
              <text x="15" y="175" className="text-[10px] font-mono fill-zinc-500">20</text>
              <text x="20" y="214" className="text-[10px] font-mono fill-zinc-500">0</text>

              {/* Day Points mapping: (date index * 78) + 60 */}
              {/* Trend Area path for total count */}
              <path
                d="M 60 210 L 60 164 L 138 148 L 216 128 L 294 95 L 372 80 L 450 38 L 528 20 L 528 210 Z"
                fill="url(#blue-gradient)"
                className="opacity-15"
              />

              {/* Curved Lines */}
              {/* Total count Line */}
              <path
                d="M 60 164 C 99 156, 99 150, 138 148 C 177 146, 177 134, 216 128 C 255 122, 255 101, 294 95 C 333 89, 333 83, 372 80 C 411 77, 411 44, 450 38 C 489 32, 489 22, 528 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Trainable Line */}
              <path
                d="M 60 170 C 99 160, 99 154, 138 152 C 177 150, 177 138, 216 132 C 255 126, 255 105, 294 99 C 333 93, 333 87, 372 84 C 411 81, 411 48, 450 42 C 489 36, 489 25, 528 22"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />

              {/* Interaction Circles and Text */}
              {trendData.map((d, index) => {
                const x = 60 + index * 78;
                // mapping values
                const totalY = 210 - (d.count / 80) * 190;
                const trainY = 210 - (d.trainable / 80) * 190;
                const isHovered = hoveredDay === index;

                return (
                  <g key={index} className="cursor-pointer" onMouseEnter={() => setHoveredDay(index)} onMouseLeave={() => setHoveredDay(null)}>
                    {/* Vertical guideline */}
                    {isHovered && (
                      <line x1={x} y1="20" x2={x} y2="210" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                    )}

                    {/* Dots for Total */}
                    <circle cx={x} cy={totalY} r={isHovered ? 6 : 4} fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
                    {/* Dots for Trainable */}
                    <circle cx={x} cy={trainY} r={isHovered ? 5 : 3.5} fill="#10b981" stroke="#09090b" strokeWidth="1" />

                    {/* X Axis Date labels */}
                    <text x={x - 15} y="228" className="text-[10px] font-medium fill-zinc-500 font-sans">{d.date}</text>

                    {/* Tooltip Overlay */}
                    {isHovered && (
                      <g>
                        <rect x={x > 300 ? x - 125 : x + 15} y="30" width="110" height="66" rx="6" fill="#09090b" stroke="#1e1e24" strokeWidth="1" className="opacity-95 shadow-lg" />
                        <text x={x > 300 ? x - 115 : x + 25} y="46" className="text-[10px] fill-zinc-300 font-semibold">{d.date} 数据批次</text>
                        <text x={x > 300 ? x - 115 : x + 25} y="62" className="text-[10px] fill-emerald-450 font-mono font-medium">总计: {d.count} EPs</text>
                        <text x={x > 300 ? x - 115 : x + 25} y="76" className="text-[10px] fill-blue-450 font-mono font-medium">容量: {d.size}</text>
                        <text x={x > 300 ? x - 110 : x + 25} y="90" className="text-[10px] fill-amber-400 font-mono font-medium">合格率: {((d.trainable/d.count)*100).toFixed(0)}%</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Define Gradient */}
              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500 font-sans border-t border-[#1e1e24] pt-3">
            <span>💡 提示：将滑块悬停于日期节点，可预览当日的资产存储容量与合格率统计明细。</span>
            <span className="font-semibold text-zinc-400">2026年5月最新周期</span>
          </div>
        </div>

        {/* Data Types Breakdown Donut (SVG) */}
        <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">NAS 存储多模态文件分布</h4>
            <p className="text-xs text-zinc-500 mt-0.5">各类传感器、图像模型非结构化文件数量占比</p>
          </div>

          <div className="relative flex justify-center py-4">
            {/* Simple SVGs Donut Chart */}
            <svg width="180" height="180" viewBox="0 0 36 36" className="transform -rotate-90">
              {/* Outer stroke or base */}
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e1e24" strokeWidth="3" />
              
              {/* Slices: stroke-dasharray="length space" stroke-dashoffset="offset" */}
              {/* RGB Video: 34% */}
              <circle 
                cx="18" cy="18" r="15.915" fill="transparent" 
                stroke="#3b82f6" strokeWidth="4" 
                strokeDasharray="34 66" strokeDashoffset="100"
                className="transition duration-300 transform origin-center hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredSlice("video")}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              {/* BVH: 16% */}
              <circle 
                cx="18" cy="18" r="15.915" fill="transparent" 
                stroke="#10b981" strokeWidth="4" 
                strokeDasharray="16 84" strokeDashoffset="66" // 100 - 34 = 66
                className="transition duration-300 transform origin-center hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredSlice("mocap")}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              {/* 6DoF Pose: 18% */}
              <circle 
                cx="18" cy="18" r="15.915" fill="transparent" 
                stroke="#8b5cf6" strokeWidth="4" 
                strokeDasharray="18 82" strokeDashoffset="50" // 66 - 16 = 50
                className="transition duration-300 transform origin-center hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredSlice("pose")}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              {/* Finger txt: 12% */}
              <circle 
                cx="18" cy="18" r="15.915" fill="transparent" 
                stroke="#f59e0b" strokeWidth="4" 
                strokeDasharray="12 88" strokeDashoffset="32" // 50 - 18 = 32
                className="transition duration-300 transform origin-center hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredSlice("hand")}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              {/* Config & task json: 20% */}
              <circle 
                cx="18" cy="18" r="15.915" fill="transparent" 
                stroke="#ec4899" strokeWidth="4" 
                strokeDasharray="20 80" strokeDashoffset="20" // 32 - 12 = 20
                className="transition duration-300 transform origin-center hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredSlice("meta")}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            </svg>

            {/* Total Indicator in the Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block"> modalities</span>
              <span className="text-xl font-bold text-zinc-100 font-display">
                {hoveredSlice === "video" && "34%"}
                {hoveredSlice === "mocap" && "16%"}
                {hoveredSlice === "pose" && "18%"}
                {hoveredSlice === "hand" && "12%"}
                {hoveredSlice === "meta" && "20%"}
                {!hoveredSlice && "5模态"}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                {hoveredSlice === "video" && "RGB 视频"}
                {hoveredSlice === "mocap" && "BVH 骨骼"}
                {hoveredSlice === "pose" && "6DoF 位姿"}
                {hoveredSlice === "hand" && "手指文本"}
                {hoveredSlice === "meta" && "JSON 元数据"}
                {!hoveredSlice && "完整数据"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {modalityDistribution.map((item, id) => (
              <div key={id} className="flex items-center justify-between p-1 hover:bg-zinc-800/40 rounded transition duration-150 text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-zinc-300 font-sans">{item.label}</span>
                </div>
                <span className="font-mono font-semibold text-zinc-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Failed Rules rank & Scene coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QC Rules Hit Ranking */}
        <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 flex items-center">
                <ShieldAlert size={16} className="text-amber-500 mr-2" />
                质检错误规则触发频次排行 (Top 5)
              </h4>
              <p className="text-xs text-zinc-500">通过自动化筛校验出的历史异常命中，用于快速回溯和物理采集补偿。</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-950/20 text-amber-400 border border-amber-900/30 rounded-full">
              规则监控中 (7条)
            </span>
          </div>

          <div className="space-y-3.5">
            {topFailures.map((rule, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-zinc-900 text-zinc-300 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border border-zinc-800">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-zinc-450">{rule.code}</span>
                    <span className="font-normal text-zinc-300">— {rule.label}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-zinc-450">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium bg-zinc-900 font-sans border border-zinc-800">
                      {rule.level}
                    </span>
                    <span className="font-mono font-bold text-zinc-200">{rule.count}次</span>
                  </div>
                </div>

                {/* Progress bar background */}
                <div className="w-full bg-[#09090b] h-2 rounded-full overflow-hidden border border-zinc-900">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      rule.level.includes("阻断") 
                        ? 'bg-gradient-to-r from-rose-550 to-red-650' 
                        : 'bg-gradient-to-r from-amber-440 to-amber-550'
                    }`}
                    style={{ width: `${rule.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#1e1e24] flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-sans">💡 提示：命中“阻断/Block”类型的质量规则的 Episode 将自动置为“不可训练”与“禁止交付”。</span>
            <span className="text-blue-455 hover:text-blue-400 hover:underline cursor-pointer flex items-center">
              查看全部质检规则 →
            </span>
          </div>
        </div>

        {/* Scene Coverages */}
        <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 flex items-center">
              <LayoutGrid size={16} className="text-blue-405 mr-2" />
              场景分布比例
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5">采集机器人部署物理空间的多样性覆盖</p>
          </div>

          <div className="space-y-4 py-4">
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="font-medium">实验室 & 多相机工位 (MWV)</span>
                <span className="font-mono font-bold text-zinc-200">48% <span className="font-normal text-zinc-550">(2,056)</span></span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800/50">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="font-medium">日常居家空间 (厨房/客厅/卧室)</span>
                <span className="font-mono font-bold text-zinc-200">35% <span className="font-normal text-zinc-550">(1,500)</span></span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800/50">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="font-medium">办公室真实环境 (In the Wild)</span>
                <span className="font-mono font-bold text-zinc-200">17% <span className="font-normal text-zinc-550">(729)</span></span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-[#1e1e24] ">
                <div className="bg-gradient-to-r from-indigo-400 to-violet-500 h-full rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>

          </div>

          <div className="p-3 bg-zinc-900/40 rounded-xl space-y-1.5 border border-zinc-800/50">
            <div className="flex items-center text-xs text-zinc-400">
              <TrendingUp size={14} className="text-emerald-500 mr-1.5" />
              <span>具身模型泛化性评估：</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-normal font-sans">
              目前「家庭场景」由于近3天增加了多模态厨房擦拭等双手任务，其资产占比上升了 2.4%，泛化特征完整。
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
