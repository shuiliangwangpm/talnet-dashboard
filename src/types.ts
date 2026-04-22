/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Type } from "@google/genai";

export enum LiveStatus {
  NOT_STARTED = "NOT_STARTED",
  ONGOING = "ONGOING",
  ENDED = "ENDED",
}

export enum CompletionConditionType {
  ENTER_PAGE = "ENTER_PAGE",
  STAY_DURATION = "STAY_DURATION",
}

export enum ViewPermission {
  GUEST = "GUEST",
  REGISTERED = "REGISTERED",
  GUEST_WITH_FORM = "GUEST_WITH_FORM",
  SPECIFIC_STUDENTS = "SPECIFIC_STUDENTS",
}

export interface FormItem {
  id: string;
  name: string;
  bookedCount: number;
  checkInCount: number;
  creator: string;
  status: 'published' | 'draft';
}

export interface UserProfile {
  id: string;
  name: string;
  account: string;
  phone: string;
}

export interface LiveItem {
  id: string;
  title: string;
  cover: string;
  startTime: string; // ISO string
  duration: number; // minutes
  courseware?: string;
  completionCondition: {
    type: CompletionConditionType;
    value?: number; // minutes
  };
  canReplay: boolean;
  introduction: string;
  lecturer: string;
  viewPermission: ViewPermission;
  formFields?: string[]; // ['姓名', '组织', '手机号', '邮箱']
  selectedFormId?: string;
  selectedStudents?: UserProfile[];
  createdAt: string; // ISO string
}

export interface User {
  name: string;
  avatar: string;
  role: 'student' | 'admin';
}

export enum StudyStatus {
  NOT_STARTED = "NOT_STARTED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export interface StudentStudyDetail {
  id: string;
  username: string;
  phone: string;
  idCard: string;
  readNotice: boolean;
  startTime?: string;
  endTime?: string;
  status: StudyStatus;
  totalDuration: number; // minutes
  questions: number;
  notes: number;
}

export interface TenantItem {
  id: string;
  name: string;
  liveCount: number;
  availableDuration: number; // hours
  usedDuration: number; // hours
}

export interface CourseStatItem {
  id: string;
  name: string;
  hours: number;
  taskCount: number;
  viewCount: number;
  studentCount: number;
  joinedCount: number;
}

export interface TaskStatItem {
  id: string;
  name: string;
  type: string;
  videoLength: number; // minutes
  learners: number;
  completers: number;
  cumulativeDuration: number; // minutes
  avgDuration: number; // minutes
  avgScore: number;
}

export interface TaskDetail {
  id: string;
  name: string;
  progress: number; // 0-100
  status: StudyStatus;
}

export interface ClassItem {
  id: string;
  name: string;
  cover: string;
  progress: number;
  studentCount: number;
  price: number; // 0 for free
  viewCount: number;
  lecturer: string;
  category: string;
  direction: string;
  validUntil: string;
  isJoined?: boolean;
  introduction?: string;
  courses: {
    id: string;
    title: string;
    cover: string;
    progress: number;
  }[];
  classTeacher: {
    name: string;
    avatar: string;
    title?: string;
    intro?: string;
  };
  students: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface DiscussionReply {
  id: string;
  author: string;
  avatar: string;
  role?: '班主任' | '老师' | '班长' | '助教';
  content: string;
  time: string;
  likes?: number;
  replies?: DiscussionReply[];
}

export interface DiscussionItem {
  id: string;
  type: 'topic' | 'question';
  title: string;
  author: string;
  avatar: string;
  role?: '班主任' | '老师' | '班长' | '助教';
  org?: string;
  content: string;
  time: string;
  floor?: number;
  likes?: number;
  viewCount?: number;
  source?: string;
  isPinned?: boolean;
  isEssence?: boolean;
  lastReplyBy?: string;
  lastReplyTime?: string;
  replies: DiscussionReply[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

export interface GroupFileItem {
  id: string;
  name: string;
  size: string;
  uploader: string;
  uploaderRole?: '班主任' | '老师' | '学生' | '助教';
  time: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'other';
  isPinned?: boolean;
}

export interface ResourceFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'other';
  size: string;
  uploadTime: string;
}
