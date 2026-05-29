import React, { useState } from 'react';
import { 
  Cpu, HardDrive, RefreshCw, Layers, Shield, Play, Square, 
  Activity, CheckCircle, Database, AlertCircle, Terminal, Network
} from 'lucide-react';

interface DaemonJob {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'warning';
  lastRun: string;
  progress: number;
  speed: string;
}

export function SystemView() {
  const [governanceLogs, setGovernanceLogs] = useState<string[]>([
    "[02:45:10] [INFO] daemon-inspector: 开始扫描 NAS 存储池 A-2 目录...",
    "[02:45:12] [INFO] daemon-inspector: 检测到新近写入 EP-20260529-106 帧，已触发视频对准校验模式",
    "[02:45:18] [SUCCESS] validation-service: EP-20260529-106 RGB-Depth 绝对时间偏差低于 3.4ms, 符合对齐标准",
    "[02:46:01] [INFO] pose-evaluator: BVH 骨骼关键动作抽取。正在读取 Seat-A 的动捕 IMU 传感姿态位姿矩阵...",
    "[02:46:05] [INFO] pose-evaluator: 阻尼系数估算中: 重力姿态拟合度 99.8w%, 计算完成",
    "[02:46:20] [WARNING] daemon-inspector: EP-20260528-095 缺失了 right_rgb.mp4 模态相机镜头。已抛至待审工作台",
    "[02:47:00] [INFO] indexer-daemon: 定时元数据映射已激活。正在持久化 45 个 episode 的特征索引..."
  ]);

  const [daemons, setDaemons] = useState<DaemonJob[]>([
    { id: "D-1", name: "元数据物理轮询扫描服务 (Physical Scanner)", type: "IO / Cron", status: "running", lastRun: "2分钟前", progress: 85, speed: "12,400eps/s" },
    { id: "D-2", name: "多相机 RGB-Depth 时间对准引擎 (Frame Alignment)", type: "Compute", status: "running", lastRun: "刚刚", progress: 42, speed: "2,400 FPS" },
    { id: "D-3", name: "人体/机械手臂位和骨架姿态质量过滤代理 (Filter Daemon)", type: "Filter / PyTorch", status: "running", lastRun: "10分钟前", progress: 100, speed: "150ep/s" },
    { id: "D-4", name: "物理大文件 MD5 校验机制 (File Integrity Checker)", type: "Security", status: "idle", lastRun: "1小时前", progress: 0, speed: "0 GB/s" },
    { id: "D-5", name: "数据集打包与 Web 客户交付分包服务 (Tar Manifest Packager)", type: "Network", status: "idle", lastRun: "4小时前", progress: 0, speed: "0 MB/s" },
  ]);

  const [resynced, setResynced] = useState(false);
  const [calibrating, setCalibrating] = useState(false);

  const handleTriggerResync = () => {
    setResynced(true);
    setGovernanceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [INFO] [SYSTEM] 触发手动扫描 NAS 主存储路径...`,
      `[${new Date().toLocaleTimeString()}] [INFO] [SYSTEM] 遍历节点，检查 12 个挂载共享区`,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] [SYSTEM] 索引重建刷新完成！追加 3 个新增 episode 缓存。`,
      ...prev
    ]);
    setTimeout(() => setResynced(false), 2000);
  };

  const handleTriggerCalibration = () => {
    setCalibrating(true);
    setGovernanceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [INFO] [CALIB] 启动 OptiTrack / Camera RGB-D 第一组空间坐标极线几何标定...`,
      `[${new Date().toLocaleTimeString()}] [INFO] [CALIB] 精准时间差补偿：2.340ms, 相位对齐系数已写入缓存`,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] [CALIB] 标定更新成功。重新标定误差 0.08px。`,
      ...prev
    ]);
    setTimeout(() => setCalibrating(false), 2500);
  };

  return (
    <div className="space-y-6" id="system-governance-module">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#1e1e24] gap-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">系统管理与治理后台</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            NAS 存储卷硬挂载状态监控、采集相机标定配置、数据流自动化治理守护进程管理
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleTriggerResync}
            disabled={resynced}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg hover:bg-zinc-850 hover:text-white transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={resynced ? "animate-spin" : ""} />
            <span>{resynced ? "索引同步中..." : "重新检索 NAS 物理点"}</span>
          </button>
          
          <button 
            onClick={handleTriggerCalibration}
            disabled={calibrating}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-250 hover:bg-zinc-850 hover:text-white font-medium text-xs rounded-lg transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 text-blue-400"
          >
            <Activity size={13} className={calibrating ? "animate-pulse" : ""} />
            <span>{calibrating ? "微补偿精密对准中..." : "极线相机深度标定"}</span>
          </button>
        </div>
      </div>

      {/* Grid status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* NAS mount information */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-902 border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-450 text-[11px] uppercase tracking-wider">
            <span className="font-semibold">NAS 存储总量</span>
            <HardDrive size={14} className="text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">1.85 / 4.00 PB</div>
            <p className="text-[10px] text-zinc-500 mt-1">挂载协议: NFSv4 / 10G 光纤硬直连</p>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '46.2%' }}></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>使用比例</span>
            <span className="font-mono">46.25%</span>
          </div>
        </div>

        {/* Network performance */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-450 text-[11px] uppercase tracking-wider">
            <span className="font-semibold">网络吞吐负载</span>
            <Network size={14} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">7.24 Gbps</div>
            <p className="text-[10px] text-zinc-500 mt-1">瞬时 IOPS: 125,000 / 写队列延迟 4.1ms</p>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '72.4%' }}></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>局域网极限</span>
            <span className="font-mono">10.00 Gbps</span>
          </div>
        </div>

        {/* Governance rate */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-450 text-[11px] uppercase tracking-wider">
            <span className="font-semibold">数据治理对准率</span>
            <CheckCircle size={14} className="text-violet-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">98.4 %</div>
            <p className="text-[10px] text-zinc-500 mt-1">已成功对齐 58,124 个时态 Episode 帧</p>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: '98.4%' }}></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>目标对准偏心率</span>
            <span className="font-mono text-emerald-400">&lt; 1.5ms</span>
          </div>
        </div>

        {/* Mocap live seats */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-450 text-[11px] uppercase tracking-wider">
            <span className="font-semibold">实时动捕机组席位</span>
            <Cpu size={14} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">4 / 4 在线</div>
            <p className="text-[10px] text-zinc-500 mt-1">Seat-A, Seat-B, Seat-C 传感器校准高空</p>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>丢包失锁阻断</span>
            <span className="font-mono text-emerald-400">0.00 % (完好)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Daemons management */}
        <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#22222a]">
            <h3 className="text-sm font-bold text-white flex items-center">
              <Database size={14} className="mr-2 text-indigo-400" />
              <span>数据生命周期自动化管理守护进程 (Governance Daemons)</span>
            </h3>
            <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-1.5 py-0.2 rounded font-mono">
              DAEMONS: 5 ACTIVE
            </span>
          </div>

          <div className="divide-y divide-zinc-900 space-y-3">
            {daemons.map((daemon) => (
              <div key={daemon.id} className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-zinc-200">{daemon.name}</span>
                    <span className="text-[9px] bg-zinc-900 text-zinc-450 px-1 py-0.2 rounded font-mono uppercase">{daemon.type}</span>
                  </div>
                  <div className="flex items-center text-[10px] text-zinc-500 space-x-3">
                    <span>上次活跃: {daemon.lastRun}</span>
                    <span>处理率: <span className="text-zinc-400 font-mono font-bold">{daemon.speed}</span></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {daemon.status === 'running' ? (
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[10px] text-emerald-400 font-medium font-sans">运行中</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-sans">空闲休眠</span>
                  )}

                  {daemon.progress > 0 && (
                    <div className="w-24 bg-zinc-900 h-2.5 rounded-full overflow-hidden relative border border-zinc-800 flex items-center justify-center">
                      <div className="absolute inset-y-0 left-0 bg-blue-605 bg-indigo-600 rounded-full" style={{ width: `${daemon.progress}%` }}></div>
                      <span className="absolute text-[8px] text-zinc-300 scale-90 font-mono font-bold">{daemon.progress}%</span>
                    </div>
                  )}

                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition cursor-pointer">
                      <Square size={10} fill="currentColor" />
                    </button>
                    <button className="p-1 hover:bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition cursor-pointer">
                      <RefreshCw size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Console log terminal */}
        <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-5 flex flex-col h-[380px] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#22222a] shrink-0">
            <h3 className="text-sm font-bold text-white flex items-center">
              <Terminal size={14} className="mr-2 text-zinc-400" />
              <span>智能引擎日志分析控制台</span>
            </h3>
            <button 
              onClick={() => setGovernanceLogs([])}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer font-semibold underline text-right"
            >
              清空控制台
            </button>
          </div>

          <div className="flex-1 bg-black/80 rounded-lg p-3 overflow-y-auto font-mono text-[10.5px] text-zinc-400 space-y-2 select-text border border-zinc-900/60 leading-relaxed scrollbar-thin">
            {governanceLogs.length === 0 ? (
              <p className="text-zinc-650 italic text-center text-xs py-24">无日志输出，控制台就绪</p>
            ) : (
              governanceLogs.map((log, index) => {
                let color = "text-zinc-400";
                if (log.includes("[SUCCESS]")) color = "text-emerald-400";
                if (log.includes("[WARNING]")) color = "text-amber-400";
                if (log.includes("[CALIB]")) color = "text-blue-400";
                return (
                  <div key={index} className={`${color} break-all`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="text-[10px] text-zinc-500 flex items-center leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            <span>物理映射服务正在通过 socket 进行 3Hz 增量扫描检测...</span>
          </div>
        </div>
      </div>

      {/* Network mount directory list table */}
      <div className="bg-zinc-955 bg-zinc-950/30 border border-zinc-800 p-5 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-250">NAS 文件挂载共享命名目录 (SMB/NFS Multi-Channel List)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400 border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-[10.5px] uppercase text-zinc-500 tracking-wider">
                <th className="py-2">存储区挂载点</th>
                <th className="py-2">物理主目录路径</th>
                <th className="py-2">主要针对数据线</th>
                <th className="py-2">映射 Episode 数量</th>
                <th className="py-2">磁盘网络吞吐量速率</th>
                <th className="py-2 text-right">挂载网络健康度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono">
              <tr>
                <td className="py-2.5 text-zinc-300 font-semibold font-sans">/mnt/mocap_rig_seat_a</td>
                <td className="py-2.5">10.15.42.110:/volume1/mocap_rig_seat_a</td>
                <td className="py-2.5 font-sans">MWV (实验室双臂动捕)</td>
                <td className="py-2.5 text-white">24,152</td>
                <td className="py-2.5">3.4 Gbps</td>
                <td className="py-2.5 text-right font-sans text-emerald-400 font-semibold">• 极佳 (2.1ms)</td>
              </tr>
              <tr>
                <td className="py-2.5 text-zinc-300 font-semibold font-sans">/mnt/mocap_rig_seat_b</td>
                <td className="py-2.5">10.15.42.110:/volume1/mocap_rig_seat_b</td>
                <td className="py-2.5 font-sans">MWV (机械臂标定)</td>
                <td className="py-2.5 text-white">12,410</td>
                <td className="py-2.5 font-mono text-zinc-500">0.0 Gbps (闲)</td>
                <td className="py-2.5 text-right font-sans text-emerald-400 font-semibold">• 正常 (1.9ms)</td>
              </tr>
              <tr>
                <td className="py-2.5 text-zinc-300 font-semibold font-sans">/mnt/itw_wild_dataset</td>
                <td className="py-2.5">10.15.42.126:/vol2/itw_wild_dataset</td>
                <td className="py-2.5 font-sans">ITW (真实人机交互)</td>
                <td className="py-2.5 text-white">41,891</td>
                <td className="py-2.5">4.8 Gbps</td>
                <td className="py-2.5 text-right font-sans text-emerald-400 font-semibold">• 极佳 (3.8ms)</td>
              </tr>
              <tr>
                <td className="py-2.5 text-zinc-300 font-semibold font-sans">/mnt/objects_physical_cad</td>
                <td className="py-2.5">10.15.42.130:/shares/cad_database</td>
                <td className="py-2.5 font-sans">3D 物理实物物模</td>
                <td className="py-2.5 text-white">5,120</td>
                <td className="py-2.5 font-mono text-zinc-500">0.0 Gbps</td>
                <td className="py-2.5 text-right font-sans text-amber-400 font-medium font-sans">▲ 正常 (14.2ms)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
