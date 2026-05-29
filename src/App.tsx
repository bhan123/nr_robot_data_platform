/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { mockEpisodes } from './mockData';
import { DashboardView } from './components/DashboardView';
import { DirectoryView } from './components/DirectoryView';
import { EpisodeDetailsDrawer } from './components/EpisodeDetailsDrawer';
import { DatasetView } from './components/DatasetView';
import { DeliveryView } from './components/DeliveryView';
import { ObjectsView } from './components/ObjectsView';
import { RulesView } from './components/RulesView';

import { 
  LayoutDashboard, FolderOpen, Cpu, Truck, Box, ShieldCheck, 
  Search, Bell, HardDrive, Clock, HelpCircle, HardDriveDownload 
} from 'lucide-react';

export default function App() {
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'datasets' | 'delivery' | 'objects' | 'rules'>('dashboard');
  
  // Selection details state
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  
  // Preset Filter (used when navigating from dashboard quick-cards directly to catalog)
  const [presetFilter, setPresetFilter] = useState<string | null>(null);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState("");

  // Dataset builder compilation (array of active episode IDS in selection draft)
  const [datasetEpisodes, setDatasetEpisodes] = useState<string[]>([
    "EP-20260528-091", "EP-20260528-092", "EP-20260527-043"
  ]);

  // Alert bar state
  const [alertOpen, setAlertOpen] = useState(true);

  // Handlers
  const handleSelectEpisode = (id: string) => {
    setSelectedEpisodeId(id);
  };

  const handleToggleAddToDataset = (id: string) => {
    setDatasetEpisodes(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRemoveFromDataset = (id: string) => {
    setDatasetEpisodes(prev => prev.filter(x => x !== id));
  };

  const handleClearDraft = () => {
    setDatasetEpisodes([]);
  };

  const handleNavigateFromDashboard = (preset: string | undefined) => {
    if (preset) {
      setPresetFilter(preset);
    } else {
      setPresetFilter(null);
    }
    setActiveTab("directory");
  };

  return (
    <div className="min-h-screen flex text-zinc-100 bg-[#09090b] font-sans" id="robot-assets-app-container">
      
      {/* 1. Left Dark Sidebar Navigator */}
      <aside className="w-64 bg-[#0c0c0e] text-zinc-300 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-[#1e1e24] select-none">
        
        <div>
          {/* Platform Branding */}
          <div className="p-5 border-b border-[#1e1e24]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <Cpu size={16} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight font-display">具身智能数据资产</h1>
                <p className="text-[10px] text-zinc-500 tracking-wider font-sans leading-none uppercase">ROBO-DATA PLATFORM</p>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedEpisodeId(null); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>总览 Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('directory'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'directory' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <FolderOpen size={14} />
              <span className="flex-1 text-left">Episode 数据目录</span>
              {presetFilter && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('datasets'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'datasets' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <Cpu size={14} />
              <span className="flex-1 text-left">训练数据集编译</span>
              {datasetEpisodes.length > 0 && (
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.2 rounded-full font-mono font-bold">
                  {datasetEpisodes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('delivery'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'delivery' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <Truck size={14} />
              <span>数据交付分发</span>
            </button>

            <button
              onClick={() => { setActiveTab('objects'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'objects' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <Box size={14} />
              <span>3D物理物品资产</span>
            </button>

            <button
              onClick={() => { setActiveTab('rules'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
                activeTab === 'rules' 
                  ? 'bg-blue-600/10 text-blue-450 border border-blue-650/40' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
              }`}
            >
              <ShieldCheck size={14} />
              <span>非结构化质检规则</span>
            </button>

          </nav>
        </div>

        {/* System Footprint */}
        <div className="p-4 border-t border-[#1e1e24] space-y-2 text-[10px] text-zinc-500">
          <div className="flex items-center text-zinc-400">
            <HardDrive size={12} className="mr-1.5 text-blue-500" />
            <span className="font-semibold">NAS 挂载网络: 10Gbps</span>
          </div>
          <p className="font-mono">VER: v2.4.15-build2026</p>
          <p className="leading-snug select-text">
            将 NAS 面分散的文件抽象为可训练、可交付、可追溯的机器人数字资产。
          </p>
        </div>

      </aside>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        
        {/* Top Navbar */}
        <header className="bg-[#09090b] border-b border-[#1e1e24] h-16 flex items-center justify-between px-6 z-10">
          
          {/* Header Title with Subtitle */}
          <div className="flex items-center space-x-4 min-w-0">
            <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-zinc-100 font-display">机器人数据资产管理平台</h2>
              <p className="text-[10px] text-zinc-500 truncate max-w-[450px] uppercase tracking-wider">
                Robot Data Asset Management System · NAS 非结构化采集数据资产化
              </p>
            </div>
          </div>

          {/* Quick Metrics display */}
          <div className="flex items-center space-x-4">
            
            {/* System Time indicator */}
            <div className="hidden xl:flex items-center text-[10px] bg-zinc-900/60 border border-[#1e1e24] rounded-lg p-1.5 px-2.5 text-zinc-400 space-x-2 font-mono">
              <Clock size={12} className="text-blue-500" />
              <span>2026-05-29 01:18 UTC</span>
            </div>

            {/* Notification Badge */}
            <button 
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-lg relative cursor-pointer"
              onClick={() => alert("自动化监控未检测到新的报错。下午14时将对 Seat-A 区域启动深度动捕物理标定。")}
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>

            {/* Active compiler status indicator */}
            <div 
              onClick={() => setActiveTab('datasets')}
              className="bg-blue-600/10 border border-blue-600/20 text-blue-405 hover:bg-blue-600/20 text-xs font-semibold rounded-lg p-1.5 px-3 flex items-center space-x-2 cursor-pointer transition select-none"
            >
              <Cpu size={13} fill="currentColor" />
              <span>训练草稿袋 ({datasetEpisodes.length})</span>
            </div>

            {/* User profile identifier block */}
            <div className="flex items-center space-x-2 border-l border-zinc-800 pl-4 select-none">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center uppercase font-bold text-[10px] font-mono">
                PM
              </div>
              <span className="text-xs font-bold text-zinc-300 hidden sm:inline">yhan (Product Team)</span>
            </div>

          </div>

        </header>

        {/* Global Warning Alert about unstructured data mapping */}
        {alertOpen && (
          <div className="bg-blue-950/40 text-blue-350 p-3 px-6 flex items-center justify-between text-xs font-sans border-b border-blue-900/35">
            <span className="flex items-center leading-normal">
              <LayersDashboardIndicator />
              <span className="font-semibold text-blue-300">具身数据治理已就绪：</span>
              <span>数据目录已自 NAS 物理存储池挂载。您已加入 {datasetEpisodes.length} 个 Episode 用于构建三维轨迹。点击右上角“训练草稿袋”可完成 Manifest 生成。</span>
            </span>
            <button onClick={() => setAlertOpen(false)} className="hover:text-white font-bold cursor-pointer shrink-0 ml-4 font-mono select-none">
              [ 隐藏 ]
            </button>
          </div>
        )}

        {/* Content body container */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* Active View conditional routing */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigateToDirectory={(preset) => handleNavigateFromDashboard(preset)} 
            />
          )}

          {activeTab === 'directory' && (
            <DirectoryView 
              onSelectEpisode={(id) => handleSelectEpisode(id)}
              onAddToDataset={(id) => handleToggleAddToDataset(id)}
              datasetEpisodes={datasetEpisodes}
              presetFilter={presetFilter}
              onClearPresetFilter={() => setPresetFilter(null)}
            />
          )}

          {activeTab === 'datasets' && (
            <DatasetView 
              datasetEpisodes={datasetEpisodes}
              onRemoveFromDataset={(id) => handleRemoveFromDataset(id)}
              onClearDraft={handleClearDraft}
              onSelectEpisode={(id) => handleSelectEpisode(id)}
            />
          )}

          {activeTab === 'delivery' && (
            <DeliveryView />
          )}

          {activeTab === 'objects' && (
            <ObjectsView />
          )}

          {activeTab === 'rules' && (
            <RulesView />
          )}

        </main>

        {/* Dynamic Dual-pane Details DRAWER layout on right side */}
        {selectedEpisodeId && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[580px] z-50">
            {/* Backdrop cover overlay */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedEpisodeId(null)}
            ></div>

            {/* Actual Drawer Body Panel */}
            <div className="absolute inset-y-0 right-0 w-full h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl relative text-zinc-100">
              <EpisodeDetailsDrawer 
                episodeId={selectedEpisodeId}
                onClose={() => setSelectedEpisodeId(null)}
                onAddToDataset={() => handleToggleAddToDataset(selectedEpisodeId)}
                isDraftSelected={datasetEpisodes.includes(selectedEpisodeId)}
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// Minimal sub-indicator component to keep layout neat
function LayersDashboardIndicator() {
  return (
    <span className="hidden sm:inline-flex items-center py-0.5 px-1.5 bg-blue-500/50 rounded-md mr-2.5 text-[9px] font-bold uppercase tracking-widest font-mono shrink-0">
      governance alert
    </span>
  );
}
