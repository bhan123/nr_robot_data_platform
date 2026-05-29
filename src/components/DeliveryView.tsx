/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeliveryBatch } from '../types';
import { mockDeliveryBatches } from '../mockData';
import { 
  Briefcase, Truck, CheckCircle2, Sliders, AlertCircle, 
  RefreshCw, Package, ExternalLink, Calendar, Plus, Play 
} from 'lucide-react';

export function DeliveryView() {
  const [batches, setBatches] = useState<DeliveryBatch[]>(mockDeliveryBatches);
  const [isSimulatingId, setIsSimulatingId] = useState<string | null>(null);

  // Status Action handler
  const handleTriggerPackage = (batchId: string) => {
    setIsSimulatingId(batchId);
    
    // Simulate compilation packaging cycle
    setTimeout(() => {
      setBatches(prev => prev.map(b => {
        if (b.batch_id === batchId) {
          return {
            ...b,
            status: "ready", // 可交付
            package_status: "completed",
            manifest_status: "generated"
          };
        }
        return b;
      }));
      setIsSimulatingId(null);
    }, 2000);
  };

  // Change batch status simulation
  const handleShipBatch = (batchId: string) => {
    setBatches(prev => prev.map(b => {
      if (b.batch_id === batchId) {
        return {
          ...b,
          status: "delivered" // 已交付
        };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-6" id="delivery-view-root">
      
      {/* Top action description */}
      <div className="bg-[#0c0c0e]/60 p-5 rounded-2xl border border-[#1e1e24] flex flex-col md:flex-row md:items-center justify-between gap-4 text-zinc-100">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center">
            <Truck className="text-blue-400 mr-2 animate-pulse" size={18} />
            商务客户数据交付管理面板
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            对不同具身智能商业客户或学术机构购买的数据集订单（Batch）进行全流程状态流转：打包部署、Manifest审查、和分发交付。
          </p>
        </div>

        <button 
          onClick={() => alert("功能演示：添加新的交付批次，需要软开组绑定存储桶 bucket 配置。")}
          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-250 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-zinc-700/60 transition select-none cursor-pointer duration-155"
        >
          <Plus size={14} />
          <span>新建交付批次</span>
        </button>
      </div>

      {/* Grid of Delivery List */}
      <div className="grid grid-cols-1 gap-4">
        {batches.map((batch) => {
          const isCompiling = isSimulatingId === batch.batch_id;

          return (
            <div 
              key={batch.batch_id} 
              className={`border p-5 rounded-2xl shadow-sm hover:border-zinc-700 transition duration-200 text-zinc-100 ${
                batch.status === 'delivered' 
                  ? 'border-[#15151a]/80 bg-[#0c0c0e]/30 opacity-80' 
                  : 'border-[#1e1e24] bg-[#0c0c0e]/60'
              }`}
            >
              
              {/* Box header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1e1e24] gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold font-mono tracking-tight text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded border border-indigo-900/30">
                      {batch.batch_id}
                    </span>
                    <span className="text-xs text-zinc-500 font-sans">
                      扫描归档于 {batch.created_at}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 mt-1.5 font-sans">
                    {batch.project_name}
                  </h4>
                </div>

                {/* Overall status badge */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-400 mr-1 font-sans">基础质检通过率: <strong className="font-mono text-zinc-200">{batch.qc_pass_rate}%</strong></span>
                  
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-center border ${
                    batch.status === 'pending' 
                      ? 'bg-zinc-900 text-zinc-400 border-zinc-800' 
                      : batch.status === 'packaging'
                      ? 'bg-amber-950/20 text-amber-450 border-amber-900/40'
                      : batch.status === 'ready'
                      ? 'bg-blue-950/20 text-blue-450 border-blue-900/40'
                      : batch.status === 'delivered'
                      ? 'bg-emerald-950/20 text-emerald-455 border-emerald-900/40'
                      : 'bg-rose-950/20 text-rose-455 border-rose-900/40 font-bold'
                  }`}>
                    {batch.status === 'pending' && "待打包准备"}
                    {batch.status === 'packaging' && "多模态数据打包中..."}
                    {batch.status === 'ready' && "可供交付"}
                    {batch.status === 'delivered' && "已全量交付完成"}
                    {batch.status === 'error' && "交付异常"}
                  </span>
                </div>
              </div>

              {/* Box metadata body */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs font-sans text-zinc-300">
                
                <div>
                  <p className="text-zinc-500">Episode 集合规模</p>
                  <p className="text-sm font-semibold text-zinc-200 font-mono mt-1">
                    {batch.episode_count} <span className="text-xs font-normal text-zinc-500">个序列</span>
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">已压缩数据总容量</p>
                  <p className="text-sm font-semibold text-zinc-200 font-mono mt-1">
                    {batch.total_size}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">交付清单/Manifest</p>
                  <p className="text-sm font-semibold text-zinc-200 mt-1">
                    {batch.manifest_status === 'generated' ? '✅ 已生成导出' : '⏳ 待审核生成'}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">对接交付负责人</p>
                  <p className="text-sm font-semibold text-zinc-200 mt-1">
                    {batch.owner}
                  </p>
                </div>

              </div>

              {/* Flow state steps representation */}
              <div className="bg-zinc-950/45 p-3 rounded-xl flex items-center justify-between text-xs text-zinc-400 border border-[#1e1e24] mb-4 overflow-x-auto gap-4">
                
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                  <span className="font-medium text-zinc-350">数据质检通过审查</span>
                </div>
                
                <span className="text-zinc-700 select-none">&rarr;</span>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    batch.status !== 'pending' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60'
                  }`}>2</span>
                  <span className={`font-medium ${batch.status !== 'pending' ? 'text-zinc-350' : 'text-zinc-550'}`}>
                    NAS 归并打包
                  </span>
                </div>

                <span className="text-zinc-700 select-none">&rarr;</span>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    ['ready', 'delivered'].includes(batch.status) ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60'
                  }`}>3</span>
                  <span className={`font-medium ${['ready', 'delivered'].includes(batch.status) ? 'text-zinc-350' : 'text-zinc-550'}`}>
                    Manifest 生成
                  </span>
                </div>

                <span className="text-zinc-700 select-none">&rarr;</span>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    batch.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60'
                  }`}>4</span>
                  <span className={`font-medium ${batch.status === 'delivered' ? 'text-zinc-350' : 'text-zinc-550'}`}>
                    安全交付到指定OSS
                  </span>
                </div>

              </div>

              {/* Action buttons with interactive simulation logic */}
              <div className="flex justify-end items-center text-xs gap-3">
                
                {batch.status === 'packaging' && (
                  <button
                    onClick={() => handleTriggerPackage(batch.batch_id)}
                    disabled={isCompiling}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg flex items-center space-x-1.5 border border-amber-700/40 transition select-none disabled:opacity-50 cursor-pointer duration-150"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>数据清洗打包中...</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} fill="currentColor" />
                        <span>点击模拟一键完成打包</span>
                      </>
                    )}
                  </button>
                )}

                {batch.status === 'ready' && (
                  <button
                    onClick={() => handleShipBatch(batch.batch_id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center space-x-1.5 border border-blue-700/40 transition select-none cursor-pointer duration-150"
                  >
                    <span>确认全量交运 (Ship Batch)</span>
                  </button>
                )}

                {batch.status === 'delivered' && (
                  <p className="text-emerald-450 font-semibold flex items-center bg-emerald-950/20 py-1.5 px-3.5 rounded-lg border border-emerald-900/40">
                    <CheckCircle2 size={13} className="mr-1.5 inline text-emerald-455" />
                    交付管道畅通 · 已投递到目标 Bucket
                  </p>
                )}

                {batch.status === 'error' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-455 font-medium flex items-center mr-2">
                      <AlertCircle size={13} className="mr-1" />
                      质检不通过：低于 80% 安全限
                    </span>
                    <button 
                      onClick={() => alert("正在通过 RoboQC 深度洗练重新计算剔除不完备 Episode 文件...")}
                      className="px-2.5 py-1 text-zinc-350 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 font-semibold cursor-pointer duration-150"
                    >
                      重新后处理清洗
                    </button>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
