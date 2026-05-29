/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ObjectAsset } from '../types';
import { mockObjectAssets } from '../mockData';
import { 
  Box, Search, Filter, Layers, FileCode, CheckCircle2, HelpCircle 
} from 'lucide-react';

export function ObjectsView() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "厨房器具", "包装容器", "家居清洁", "电子设备", "文化用品"];

  const filteredObjects = useMemo(() => {
    return mockObjectAssets.filter(item => {
      if (searchText) {
        const query = searchText.toLowerCase();
        if (!item.object_name.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (selectedCategory !== "all") {
        if (!item.category.includes(selectedCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [searchText, selectedCategory]);

  return (
    <div className="space-y-6" id="objects-view-root">
      
      {/* Top Banner section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Box className="text-emerald-500 mr-2" size={18} />
            具身智能训练物品资产台账
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            机器人抓取放置或长序列任务皆围绕具体物品（Objects）展开。此处聚合记录了其CAD数模支持、标定状态、及关联Episode数。
          </p>
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-medium select-none cursor-pointer transition ${
                (cat === "all" && selectedCategory === "all") || (cat !== "all" && selectedCategory.includes(cat))
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {cat === "all" ? "全部类型" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Objects list search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
        <input 
          type="text" 
          placeholder="搜索物品名称，例如 '保温杯'、'抹布' ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Grid displaying cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredObjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl">
            <p className="font-semibold text-slate-500">未找到匹配的物理物品资产</p>
            <p className="text-xs mt-1">请重新输入查找关键字</p>
          </div>
        ) : (
          filteredObjects.map((obj) => (
            <div 
              key={obj.object_id} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                      {obj.object_id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5 font-sans">
                      {obj.object_name}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    obj.has_3d_model 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {obj.has_3d_model ? "3D CAD 模型OK" : "无 3D 网格模型"}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 font-sans">
                  <p><span className="text-slate-400">资产类目:</span> {obj.category}</p>
                  <p className="text-[11px] text-slate-500 italic mt-1 leading-normal">
                    {obj.note}
                  </p>
                </div>
              </div>

              {/* Counts mapping and format */}
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">关联 Episode</p>
                  <p className="font-semibold font-mono text-slate-800 mt-0.5">{obj.related_episode_count} 场</p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase text-right">支持文件格式</p>
                  <p className="font-semibold font-mono text-slate-700 mt-0.5 text-right">
                    {obj.model_formats.length > 0 ? obj.model_formats.join('/') : '—'}
                  </p>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
