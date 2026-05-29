/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Episode {
  episode_id: string;
  task_name: string;
  scene: string;
  items: string[];
  actions: string[];
  actor: string;
  seat_id: string; // 采集席位
  collect_date: string;
  duration: number; // in seconds
  fps: number;
  frame_count: number;
  file_count: number;
  total_size: string; // e.g., "142.5 MB"
  nas_path: string;
  qc_status: 'pass' | 'fail' | 'review'; // 质检等级: 通过, 失败, 待复核
  business_status?: 'draft' | 'pending_audit' | 'initial_approved' | 'initial_rejected' | 'pending_final_audit' | 'published' | 'closed' | 'processing' | 'failed' | 'completed'; // 初始 / 待审核 / 初审通过 / 初审拒绝 / 待终审 / 已发布 / 已关闭 / 处理中 / 失败 / 已完成
  pipeline: 'MWV' | 'ITW'; // 双数据线分流
  collect_mode: string; // 采集模式 (VR遥控 / 外骨骼双臂 / 主动示教 / 真实手套)
  collect_device: string; // 采集设备 (GR-1 V2 / Unitree H1 / Kepler K1)
  skeleton_type?: string; // 骨骼信息 (17点手部骨指 / BVH全身53骨)
  has_video: boolean;
  has_skeleton: boolean;
  has_depth: boolean;
  trainable: boolean;
  deliverable: boolean;
  file_integrity_status: 'complete' | 'incomplete';
  alignment_status: 'aligned' | 'offset_minor' | 'offset_severe' | 'missing_modality';
  data_version: string;
  process_version: string;
  tags: string[];
  meta_info?: {
    task_description: string;
    steps: string[];
    device_id: string;
    ambient_light: string;
  };
}

export interface AssetFile {
  file_id: string;
  episode_id: string;
  file_name: string;
  file_type: 'video' | 'mocap' | 'pose' | 'hand_skeleton' | 'json_meta' | 'json_qc' | 'config';
  file_path: string;
  size: string;
  exists: boolean;
  readable: boolean;
  frame_count: number;
  start_time: number; // relative second
  end_time: number; // relative second
  duration: number;
  checksum_status: 'verified' | 'failed' | 'unchecked';
  last_modified: string;
}

export interface QCResult {
  episode_id: string;
  overall_status: 'pass' | 'fail' | 'review';
  score: number;
  failed_rules: string[];
  warning_rules: string[];
  suggestions: string[];
  checked_at: string;
  checker_version: string;
  file_integrity_check: boolean;
  video_readable_check: boolean;
  mocap_parsable_check: boolean;
  pose_continuity_check: boolean;
  timestamp_continuous: boolean;
  multi_modal_aligned: boolean;
}

export interface DatasetDraft {
  dataset_id: string;
  dataset_name: string;
  selected_episode_count: number;
  total_duration: number; // in seconds
  total_size: string;
  task_distribution: { [key: string]: number };
  scene_distribution: { [key: string]: number };
  item_distribution: { [key: string]: number };
  quality_distribution: { [key: string]: number };
}

export interface DeliveryBatch {
  batch_id: string;
  project_name: string;
  episode_count: number;
  total_size: string;
  qc_pass_rate: number; // e.g., 98.4
  status: 'pending' | 'packaging' | 'ready' | 'delivered' | 'error'; // 待准备 / 打包中 / 可交付 / 已交付 / 交付异常
  manifest_status: 'generated' | 'pending';
  package_status: 'completed' | 'running' | 'pending';
  created_at: string;
  owner: string;
}

export interface ObjectAsset {
  object_id: string;
  object_name: string;
  category: string;
  has_3d_model: boolean;
  model_formats: string[];
  related_episode_count: number;
  related_task_count: number;
  status: 'active' | 'in_storage' | 'damaged' | 'missing';
  note: string;
}

export interface QARule {
  rule_id: string;
  name: string;
  level: 'block_all' | 'block_train' | 'block_delivery' | 'warning';
  description: string;
  hit_count: number;
  affected_episodes: number;
  owner: string;
  last_updated: string;
}
