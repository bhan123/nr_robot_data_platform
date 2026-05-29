/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { QARule } from '../types';
import { mockQARules } from '../mockData';
import { 
  ShieldAlert, ShieldCheck, Search, Filter, AlertTriangle, 
  Settings, CheckCircle, Info, Calendar, User 
} from 'lucide-react';

export function RulesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filteredRules = useMemo(() => {
    return mockQARules.filter(rule => {
      // search match
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        if (
          !rule.rule_id.toLowerCase().includes(query) &&
          !rule.name.toLowerCase().includes(query) &&
          !rule.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // level match
      if (levelFilter !== "all") {
        if (levelFilter === "blocking" && !rule.level.startsWith("block")) return false;
        if (levelFilter === "warning" && rule.level !== "warning") return false;
      }

      return true;
    });
  }, [searchTerm, levelFilter]);

  return (
    <div className="space-y-6" id="rules-view-root">
      
      {/* Overview Top bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <ShieldCheck className="text-blue-500 mr-2" size={18} />
            自动化质检规则与质量阻断矩阵 (Policies Register)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            数据目录引擎在扫描 NAS 非结构化文件的第一步，将全自动触发以下校验脚本。根据不同的匹配等级，规则可对训练或交付流程实施自动锁定阻断。
          </p>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
          <button 
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition select-none cursor-pointer ${levelFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            全部等级
          </button>
          <button 
            onClick={() => setLevelFilter('blocking')}
            className={`px-3 py-1.5 rounded-lg transition select-none cursor-pointer ${levelFilter === 'blocking' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            阻断级 (Block)
          </button>
          <button 
            onClick={() => setLevelFilter('warning')}
            className={`px-3 py-1.5 rounded-lg transition select-none cursor-pointer ${levelFilter === 'warning' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            警告/提示级 (Warning)
          </button>
        </div>
      </div>

      {/* Grid listing QARules */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRules.map((rule) => {
          
          let alertLabel = "阻断后续流程 (Block All)";
          let alertColor = "bg-rose-50 border-rose-100 text-rose-700 text-xs";
          
          if (rule.level === 'block_train') {
            alertLabel = "阻断模型训练 (Block Train)";
            alertColor = "bg-orange-50 border-orange-100 text-orange-700 text-xs";
          } else if (rule.level === 'block_delivery') {
            alertLabel = "阻断清单交付 (Block Deliver)";
            alertColor = "bg-amber-50 border-amber-100 text-amber-700 text-xs";
          } else if (rule.level === 'warning') {
            alertLabel = "仅发出轻微警告 (Warning hint)";
            alertColor = "bg-slate-50 border-slate-200 text-slate-600 text-xs";
          }

          return (
            <div 
              key={rule.rule_id} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                      {rule.rule_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold select-none ${alertColor}`}>
                      {alertLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {rule.name}
                  </h4>

                  <p className="text-xs text-slate-500 leading-normal max-w-3xl">
                    {rule.description}
                  </p>
                </div>

                {/* Counter statistics bar */}
                <div className="flex xl:flex-col items-end shrink-0 gap-4 text-xs font-sans">
                  
                  <div className="text-right">
                    <p className="text-slate-400">已触发报警频次</p>
                    <p className="text-sm font-bold text-slate-800 font-mono mt-1">{rule.hit_count} 次</p>
                  </div>

                  <div className="text-right">
                    <p className="text-slate-400">受影响 Episode 数</p>
                    <p className="text-sm font-bold text-slate-800 font-mono mt-1">{rule.affected_episodes} 个</p>
                  </div>

                </div>

              </div>

              {/* Rule registry details footer */}
              <div className="border-t border-slate-50 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center">
                  <Calendar size={12} className="mr-1.5" />
                  <span>更新时间: {rule.last_updated}</span>
                </span>
                
                <span className="inline-flex items-center">
                  <User size={12} className="mr-1.5" />
                  <span>校验人/触发单元: {rule.owner}</span>
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
