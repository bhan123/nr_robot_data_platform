/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, FileSpreadsheet, RotateCcw, Trash2, 
  Play, Pause, AlertCircle, CheckCircle2, RefreshCw, Loader2, Plus, ArrowUpRight
} from 'lucide-react';

interface BackgroundTask {
  id: string;
  name: string;
  type: 'CSV 导出' | 'ZIP 归包下载' | '质检 CSV 导入' | '批量匹配标记';
  status: 'queuing' | 'processing' | 'completed' | 'failed';
  progress: number;
  size: string;
  created_at: string;
  download_url?: string;
  error_message?: string;
}

export function DownloadHubView() {
  const [tasks, setTasks] = useState<BackgroundTask[]>([
    { id: "EXP-20260529-01", name: "EP-20260528 训练可用 Episode 精准姿态 Manifest 清单", type: "CSV 导出", status: "completed", progress: 100, size: "18.2 KB", created_at: "05-29 01:10", download_url: "#" },
    { id: "EXP-20260529-02", name: "双手捡起保温杯等 3 个 Episode 全路径高频视频归包", type: "ZIP 归包下载", status: "processing", progress: 45, size: "484.5 MB", created_at: "05-29 01:15" },
    { id: "EXP-20260529-03", name: "实验室-日常居家 骨骼时间轴 10Hz 抽检对齐检查规则表", type: "质检 CSV 导入", status: "completed", progress: 100, size: "12.4 KB", created_at: "05-29 01:02", download_url: "#" },
    { id: "EXP-20260529-04", name: "批量一键匹配 3D 刚性障碍物网格校验资产同步任务", type: "批量匹配标记", status: "failed", progress: 80, size: "0 B", created_at: "05-28 23:40", error_message: "TCP 连接外部 NAS 源超时，部分 /nas/robot_capture_v2 索引缺失物理映射。" }
  ]);

  // Polling simulation controls
  const [isPolling, setIsPolling] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContentText, setCsvContentText] = useState("");
  const [importedLogs, setImportedLogs] = useState<string[]>([]);

  // Simple interval to simulate progress of background tasks when isPolling is active
  useEffect(() => {
    if (!isPolling) return;

    const timer = setInterval(() => {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.status === 'queuing') {
            // Move from queuing to processing
            return { ...task, status: 'processing', progress: 5 };
          }
          if (task.status === 'processing') {
            const nextProgress = task.progress + Math.floor(Math.random() * 15) + 5;
            if (nextProgress >= 100) {
              return { 
                ...task, 
                status: 'completed', 
                progress: 100, 
                size: task.type === 'ZIP 归包下载' ? '1.1 GB' : '45.1 KB',
                download_url: "#" 
              };
            }
            return { ...task, progress: nextProgress };
          }
          return task;
        });
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isPolling]);

  // Submit new task simulator
  const handleCreateExport = (type: 'CSV' | 'ZIP') => {
    const newId = `EXP-20260529-0${tasks.length + 1}`;
    const newTask: BackgroundTask = {
      id: newId,
      name: type === 'CSV' 
        ? `新建批量导出 Episode_v1.2.0_Metadata_${newId}`
        : `自定义 ZIP 质检包_EP_Video_Assets_${newId}`,
      type: type === 'CSV' ? 'CSV 导出' : 'ZIP 归包下载',
      status: 'queuing',
      progress: 0,
      size: '0 B',
      created_at: "2026-05-29 01:25"
    };

    setTasks(prev => [newTask, ...prev]);
  };

  // Retry failed background task
  const handleRetryTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'queuing', progress: 0, error_message: undefined };
      }
      return t;
    }));
  };

  // Delete background task log
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // CSV drag/drop simulator handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateCSVImport(file.name);
    }
  };

  const simulateCSVImport = (fileName: string) => {
    const newId = `IMP-20260529-10`;
    const newTask: BackgroundTask = {
      id: newId,
      name: `导入外部质检对照单: ${fileName}`,
      type: '质检 CSV 导入',
      status: 'queuing',
      progress: 0,
      size: '14.2 KB',
      created_at: "05-29 01:28"
    };

    setTasks(prev => [newTask, ...prev]);
    setImportedLogs(prev => [
      `[${newId}] 成功挂载本地表格 ${fileName}`,
      `正在嗅探并解算物理 Episode 时间戳匹配度...`,
      `检测到 3 项缺失，已成功配置自动补救。`
    ]);
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6" id="download-hub-container">
      
      {/* Upper action control deck */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center">
            <Download size={15} className="mr-2 text-blue-500 animate-bounce" />
            后台数据导出与下载任务中心
          </h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            监控大型非结构化视频 ZIP 打包和 CSV 数据元导出的运行队列，支持秒级进度轮询、错误重试与删除。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          
          {/* Active Polling toggler */}
          <button 
            onClick={() => setIsPolling(!isPolling)}
            className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition border flex items-center space-x-1.5 cursor-pointer ${
              isPolling 
                ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-805'
            }`}
          >
            {isPolling ? (
              <>
                <Loader2 size={12} className="animate-spin text-blue-400" />
                <span>自动轮询开启中</span>
              </>
            ) : (
              <>
                <Pause size={12} />
                <span>进度轮询已暂停</span>
              </>
            )}
          </button>

          {/* Quick task injectors */}
          <button 
            onClick={() => handleCreateExport('CSV')}
            className="px-3 py-1.5 text-[10px] bg-zinc-900 hover:bg-zinc-855 text-zinc-200 border border-zinc-800 rounded-lg transition flex items-center space-x-1 cursor-pointer"
          >
            <Plus size={11} />
            <span>导出 CSV 清单</span>
          </button>

          <button 
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 text-[10px] bg-blue-600 hover:bg-blue-505 text-white font-semibold rounded-lg transition flex items-center space-x-1 cursor-pointer"
          >
            <Upload size={11} />
            <span>导入质检 CSV/TXT</span>
          </button>

        </div>
      </div>

      {/* Main split work area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 columns: Task Queue Table */}
        <div className="xl:col-span-2 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <span className="text-xs font-bold text-zinc-400 tracking-wider">活跃后台线程任务 ({tasks.length})</span>
            <span className="text-[10px] text-zinc-550 font-mono">存储分配: AWS S3 Temp Bucket</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase font-bold tracking-wider py-2">
                  <th className="py-2.5 px-3">任务流水 ID</th>
                  <th className="py-2.5 px-3">数据内容描述</th>
                  <th className="py-2.5 px-3">任务类型</th>
                  <th className="py-2.5 px-3">任务状态 / 进度</th>
                  <th className="py-2.5 px-3">容量</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs text-zinc-300">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-zinc-900/15 transition-colors group">
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-zinc-400">
                      {task.id}
                    </td>

                    <td className="py-3 px-3 max-w-[220px]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-200 truncate group-hover:text-blue-400 transition" title={task.name}>
                          {task.name}
                        </span>
                        <span className="text-[9px] text-zinc-550 font-mono mt-0.5">创建时间: {task.created_at}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 bg-zinc-900 text-zinc-450 border border-zinc-800 text-[10px] rounded">
                        {task.type}
                      </span>
                    </td>

                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`font-semibold ${
                            task.status === 'completed' ? 'text-emerald-400' :
                            task.status === 'failed' ? 'text-rose-400' :
                            task.status === 'processing' ? 'text-amber-400' : 'text-zinc-500'
                          }`}>
                            {task.status === 'completed' && "已完成"}
                            {task.status === 'failed' && "处理失败"}
                            {task.status === 'processing' && `处理中 (${task.progress}%)`}
                            {task.status === 'queuing' && "正排队中..."}
                          </span>
                        </div>
                        
                        <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              task.status === 'completed' ? 'bg-emerald-500' :
                              task.status === 'failed' ? 'bg-rose-505' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-zinc-400 text-xs">
                      {task.size}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {task.status === 'completed' && task.download_url && (
                          <a 
                            href={task.download_url}
                            className="p-1 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded hover:bg-zinc-800 transition"
                            title="立刻下载表格"
                          >
                            <Download size={12} />
                          </a>
                        )}

                        {task.status === 'failed' && (
                          <button 
                            onClick={() => handleRetryTask(task.id)}
                            className="p-1 bg-rose-950/20 text-rose-400 border border-rose-900/30 rounded hover:bg-rose-900/30 transition text-[10px] flex items-center space-x-0.5"
                            title="重新入网执行"
                          >
                            <RotateCcw size={10} />
                            <span>重试</span>
                          </button>
                        )}

                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-zinc-650 hover:text-rose-400 hover:bg-zinc-900 rounded transition"
                          title="删除删除日志"
                        >
                          <Trash2 size={12} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Tab: drag & drop CSV or logs section */}
        <div className="xl:col-span-1 space-y-4">
          
          {/* Real actioning drag & drop simulation container */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <span className="text-xs font-bold text-zinc-400 tracking-wider block">本地 CSV 与 TXT 对位匹配导入板</span>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-950/10' 
                  : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
              }`}
              onClick={() => setShowImportModal(true)}
            >
              <FileSpreadsheet className="text-zinc-500" size={32} />
              
              <div className="space-y-1">
                <p className="text-xs text-zinc-300 font-semibold font-sans">拖拽 CSV / TXT 对齐文件到此</p>
                <p className="text-[10px] text-zinc-500">此文件用于导入外部质检、修正标定或补齐时间戳</p>
              </div>

              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px] text-zinc-450 leading-none inline-block">
                支持: EP_QC_MAPPING.CSV
              </span>
            </div>
          </div>

          {/* Active Logs panel */}
          {importedLogs.length > 0 && (
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-3 font-mono text-[10.5px]">
              <span className="text-xs font-bold font-sans text-zinc-400 block tracking-wider pb-2 border-b border-zinc-900">
                运行日志同步监听器
              </span>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {importedLogs.map((log, idx) => (
                  <div key={idx} className="text-zinc-450 leading-relaxed flex items-start">
                    <span className="text-blue-500 mr-2 shrink-0">❖</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CSV Import Modal Simulator */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl w-full max-w-lg space-y-4 relative text-zinc-100">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-zinc-300 flex items-center">
                <FileSpreadsheet size={14} className="mr-2 text-blue-400" />
                解析导入结构化质检/匹配文件
              </span>
              <button onClick={() => setShowImportModal(false)} className="text-xs text-zinc-500 hover:text-white font-mono">
                [ 退出 ]
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              外部 CSV 将被映射至 NAS 已经扫描到的 Episode 目录。系统会自动辨识 `episode_id` 及其 `qc_status` 并对齐物理相机的起止时间。
            </p>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                粘贴 CSV 对位内容实施秒速虚拟解析
              </label>
              <textarea 
                value={csvContentText}
                onChange={(e) => setCsvContentText(e.target.value)}
                placeholder="episode_id,qc_status,alignment_offset,remark&#10;EP-20260528-091,pass,0.01s,物理双轨正常&#10;EP-20260527-042,review,0.30s,时间戳微偏移需二审"
                rows={5}
                className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-550 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2 pt-2 text-xs">
              <button 
                onClick={() => simulateCSVImport("Clipboard_Paste.csv")}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-505 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                立即解析并提交任务
              </button>
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-855 text-zinc-300 border border-zinc-800 rounded-lg transition"
              >
                取消
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
