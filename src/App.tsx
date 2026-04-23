/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Share2, 
  Edit, 
  Trash2, 
  Eye,
  Menu,
  Copy, 
  Download, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Settings,
  Image as ImageIcon,
  User as UserIcon,
  Heart,
  Calendar,
  Clock,
  FileText,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Users,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  BookOpen,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Radio,
  ExternalLink,
  LogOut,
  EyeOff,
  Smartphone,
  Lock,
  Mail,
  Building2,
  ShieldCheck,
  Pin,
  PinOff,
  RotateCcw,
  RefreshCw,
  UserPlus,
  Layout,
  UserMinus,
  PlusCircle,
  Award,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isAfter, isBefore, addMinutes, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { LiveItem, LiveStatus, CompletionConditionType, User, StudyStatus, StudentStudyDetail, TaskDetail, ViewPermission, TenantItem, CourseStatItem, TaskStatItem, UserProfile, FormItem, ClassItem, DiscussionItem, DiscussionReply, AnnouncementItem, GroupFileItem, ResourceFile } from './types';
import { 
  MOCK_LIVES, 
  getLiveStatus, 
  MOCK_STUDENT_DETAILS, 
  MOCK_TASKS,
  MOCK_TENANTS,
  MOCK_COURSE_STATS,
  MOCK_TASK_STATS,
  MOCK_USERS,
  MOCK_FORMS,
  MOCK_CLASSES,
  MOCK_DISCUSSIONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_GROUP_FILES,
  MOCK_RESOURCES,
  MOCK_DASHBOARD_OVERVIEW,
  MOCK_USER_STATS,
  MOCK_COURSE_DASHBOARD,
  MOCK_CERT_DASHBOARD,
  MOCK_CLASS_DASHBOARD,
  MOCK_QUESTION_DASHBOARD,
  MOCK_LEARNING_DASHBOARD,
  MOCK_ORG_USERS,
  DASHBOARD_FILTER_OPTIONS,
  CERTIFICATION_CATEGORIES
} from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOGO_URL = "https://gd-hbimg-edge.huaban.com/small/9b88df26e21baf48454721af367212203a8fd57d48215-g5gx5B_fw480webp?auth_key=1773216000-ca1d8b8d906a4f85ba12265d3d2d1186-0-752c92745aee936b4f1e0f1ef6dbbede";

function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#7DC16A] animate-pulse" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

function DashboardInlineFilters({ 
  filters, 
  activeFilters, 
  onFilterChange 
}: { 
  filters: { id: string, label: string, options: string[] }[],
  activeFilters: Record<string, string>,
  onFilterChange: (id: string, value: string) => void
}) {
  return (
    <div className="hidden lg:flex flex-wrap items-center gap-8 mx-8">
      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <select
              value={activeFilters[filter.id] || '不限'}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              className="appearance-none bg-transparent border-b-2 border-transparent hover:border-blue-500 text-base font-bold text-gray-800 focus:outline-none cursor-pointer py-1 pr-6 relative z-10"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '1rem' }}
            >
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold -mt-0.5">{filter.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'student-list' | 'student-detail' | 'admin-list' | 'admin-form' | 'admin-stats' | 'admin-course-mgmt' | 'admin-form-mgmt' | 'my-lives' | 'admin-live-stats' | 'admin-course-stats' | 'admin-course-stat-detail' | 'admin-tenant-mgmt' | 'admin-dashboard' | 'my-favorites' | 'prd' | 'login' | 'register' | 'class-list' | 'class-detail' | 'teaching-center'>('admin-dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedCourseStat, setSelectedCourseStat] = useState<CourseStatItem | null>(null);
  const [lives, setLives] = useState<LiveItem[]>(MOCK_LIVES);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedLive, setSelectedLive] = useState<LiveItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentTab, setStudentTab] = useState<'all' | LiveStatus>('all');
  const [showLivePopup, setShowLivePopup] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeDashboardModule, setActiveDashboardModule] = useState('overview');

  // Mock current user
  const currentUser: User = {
    name: "王水亮",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    role: 'admin'
  };

  // Check for upcoming/ongoing lives for popup
  useEffect(() => {
    if (view === 'student-list') {
      const now = new Date();
      const hasUrgentLive = lives.some(live => {
        const start = parseISO(live.startTime);
        const status = getLiveStatus(live);
        const isSoon = isBefore(now, start) && isAfter(now, addMinutes(start, -5));
        return status === LiveStatus.ONGOING || isSoon;
      });
      if (hasUrgentLive) setShowLivePopup(true);
    }
  }, [view, lives]);

  const filteredLives = useMemo(() => {
    let result = lives.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (view === 'student-list' && studentTab !== 'all') {
      result = result.filter(l => getLiveStatus(l) === studentTab);
    }
    return result;
  }, [lives, searchQuery, studentTab, view]);

  const handleSaveLive = (live: LiveItem) => {
    if (lives.find(l => l.id === live.id)) {
      setLives(lives.map(l => l.id === live.id ? live : l));
    } else {
      setLives([...lives, live]);
    }
    setView('admin-list');
  };

  const handleDeleteLive = (id: string) => {
    if (window.confirm('确定要删除该直播吗？')) {
      setLives(lives.filter(l => l.id !== id));
    }
  };

  if (!isLoggedIn) {
    if (view === 'register') {
      return <RegisterPage onLogin={() => setView('login')} onRegister={() => { setIsLoggedIn(true); setView('home'); }} />;
    }
    return <LoginPage onRegister={() => setView('register')} onLogin={() => { setIsLoggedIn(true); setView('home'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#333]">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 h-16 bg-white border-b border-gray-100 px-4 md:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setIsAdminMode(false); setIsMobileMenuOpen(false); }}>
            <div className="w-8 h-8 bg-[#7DC16A] rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">Logo</span>
          </div>
          {!isAdminMode && (
            <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">
              <span 
                className={cn("cursor-pointer transition-colors", view === 'home' ? "text-[#7DC16A]" : "hover:text-[#7DC16A]")}
                onClick={() => setView('home')}
              >
                首页
              </span>
              <span className="cursor-pointer hover:text-[#7DC16A]">热门认证</span>
              <span className="cursor-pointer hover:text-[#7DC16A]">课程学习</span>
              <span 
                className={cn("cursor-pointer transition-colors", view === 'class-list' ? "text-[#7DC16A]" : "hover:text-[#7DC16A]")}
                onClick={() => setView('class-list')}
              >
                班级研修
              </span>
              <span 
                className={cn("cursor-pointer px-2 py-1 rounded-md transition-colors", view.startsWith('student') ? "text-[#7DC16A] bg-[#7DC16A]/5" : "hover:text-[#7DC16A]")}
                onClick={() => setView('student-list')}
              >
                直播中心
              </span>
              <span className="cursor-pointer hover:text-[#7DC16A]">培训公告</span>
              <span className="cursor-pointer hover:text-[#7DC16A]">师资风采</span>
              <span 
                className={cn("cursor-pointer px-2 py-1 rounded-md transition-colors", view === 'prd' ? "text-[#7DC16A] bg-[#7DC16A]/5" : "hover:text-[#7DC16A]")}
                onClick={() => setView('prd')}
              >
                产品需求说明
              </span>
            </div>
          )}
          {isAdminMode && (
             <div className="flex items-center gap-2 text-gray-500 text-sm">
                <ChevronRight size={16} />
                <span className="font-semibold text-gray-800">管理后台</span>
             </div>
          )}
        </div>

        <div className="relative" onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
          <div className="flex items-center gap-2 cursor-pointer py-2" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
            <span className="text-sm font-medium hidden sm:inline">{currentUser.name}</span>
          </div>
          {showProfileMenu && (
            <div className="absolute right-0 top-full w-40 bg-white border border-gray-100 shadow-xl rounded-lg py-2 animate-in fade-in slide-in-from-top-2 z-[60]">
              <div 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2"
                onClick={() => { setIsAdminMode(false); setView('student-list'); setShowProfileMenu(false); }}
              >
                <UserIcon size={14} /> 学习中心
              </div>
              <div 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2"
                onClick={() => { setIsAdminMode(false); setView('teaching-center'); setShowProfileMenu(false); }}
              >
                <BookOpen size={14} /> 教学中心
              </div>
              <div 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 text-[#7DC16A]"
                onClick={() => { setIsAdminMode(true); setView('admin-list'); setShowProfileMenu(false); }}
              >
                <Edit size={14} /> 管理后台
              </div>
              <div 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 text-red-500 border-t border-gray-50 mt-1"
                onClick={() => { setIsLoggedIn(false); setView('login'); setShowProfileMenu(false); setIsAdminMode(false); }}
              >
                <LogOut size={14} /> 退出登录
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed top-16 left-0 bottom-0 w-64 bg-white z-40 md:hidden border-r border-gray-100 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {!isAdminMode ? (
                  <>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all", view === 'home' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}
                    >
                      首页
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all", view === 'class-list' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('class-list'); setIsMobileMenuOpen(false); }}
                    >
                      班级研修
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all", view === 'student-list' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('student-list'); setIsMobileMenuOpen(false); }}
                    >
                      直播中心
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all", view === 'prd' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('prd'); setIsMobileMenuOpen(false); }}
                    >
                      产品需求说明
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-50">
                      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">个人中心</div>
                      <div 
                        className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'my-lives' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                        onClick={() => { setView('my-lives'); setIsMobileMenuOpen(false); }}
                      >
                        我的直播
                      </div>
                      <div 
                        className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'my-favorites' ? "bg-[#7DC16A]/10 text-[#7DC16A] font-bold" : "text-gray-600 hover:bg-gray-50")}
                        onClick={() => { setView('my-favorites'); setIsMobileMenuOpen(false); }}
                      >
                        我的收藏
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">管理菜单</div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-course-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-course-mgmt'); setIsMobileMenuOpen(false); }}
                    >
                      课程管理
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-form-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-form-mgmt'); setIsMobileMenuOpen(false); }}
                    >
                      表单管理
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-list' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-list'); setIsMobileMenuOpen(false); }}
                    >
                      直播管理
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-live-stats' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-live-stats'); setIsMobileMenuOpen(false); }}
                    >
                      直播统计
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-course-stats' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-course-stats'); setIsMobileMenuOpen(false); }}
                    >
                      课程统计
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-tenant-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-tenant-mgmt'); setIsMobileMenuOpen(false); }}
                    >
                      租户直播
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'overview' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('overview'); setIsMobileMenuOpen(false); }}
                    >
                      数据统计
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'user' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('user'); setIsMobileMenuOpen(false); }}
                    >
                      用户数据
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'course' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('course'); setIsMobileMenuOpen(false); }}
                    >
                      课程数据
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'class' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('class'); setIsMobileMenuOpen(false); }}
                    >
                      班级数据
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'cert' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('cert'); setIsMobileMenuOpen(false); }}
                    >
                      证书数据
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-dashboard' && activeDashboardModule === 'question' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('question'); setIsMobileMenuOpen(false); }}
                    >
                      试题数据
                    </div>
                    <div 
                      className={cn("px-4 py-3 rounded-xl cursor-pointer transition-all mt-1", view === 'admin-org-user-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50")}
                      onClick={() => { setView('admin-org-user-mgmt'); setIsMobileMenuOpen(false); }}
                    >
                      机构用户管理
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Admin Sidebar */}
        {isAdminMode && (
          <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-100 p-4 hidden md:block">
            <div className="space-y-1">
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-course-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-course-mgmt')}
              >
                <BookOpen size={18} />
                <span className="font-medium">课程管理</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-form-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-form-mgmt')}
              >
                <FileText size={18} />
                <span className="font-medium">表单管理</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-list' || view === 'admin-form' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-list')}
              >
                <PlayCircle size={18} />
                <span className="font-medium">直播管理</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-live-stats' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-live-stats')}
              >
                <BarChart3 size={18} />
                <span className="font-medium">直播统计</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-course-stats' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-course-stats')}
              >
                <TrendingUp size={18} />
                <span className="font-medium">课程统计</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-tenant-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-tenant-mgmt')}
              >
                <Users size={18} />
                <span className="font-medium">租户直播</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-dashboard' && activeDashboardModule === 'overview' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('overview'); }}
              >
                <BarChart3 size={18} />
                <span className="font-medium">数据统计</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ml-4",
                  view === 'admin-dashboard' && activeDashboardModule === 'user' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('user'); }}
              >
                <Users size={18} />
                <span className="font-medium">用户数据</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ml-4",
                  view === 'admin-dashboard' && activeDashboardModule === 'course' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('course'); }}
              >
                <BookOpen size={18} />
                <span className="font-medium">课程数据</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ml-4",
                  view === 'admin-dashboard' && activeDashboardModule === 'class' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('class'); }}
              >
                <Layout size={18} />
                <span className="font-medium">班级数据</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ml-4",
                  view === 'admin-dashboard' && activeDashboardModule === 'cert' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('cert'); }}
              >
                <ShieldCheck size={18} />
                <span className="font-medium">证书数据</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ml-4",
                  view === 'admin-dashboard' && activeDashboardModule === 'question' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => { setView('admin-dashboard'); setActiveDashboardModule('question'); }}
              >
                <HelpCircle size={18} />
                <span className="font-medium">试题数据</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'admin-org-user-mgmt' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('admin-org-user-mgmt')}
              >
                <Users size={18} />
                <span className="font-medium">机构用户管理</span>
              </div>
            </div>
          </aside>
        )}

        {!isAdminMode && (view === 'student-list' || view === 'my-lives' || view === 'my-favorites') && (
          <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-100 p-4 hidden md:block">
            <div className="space-y-1">
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'student-list' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('student-list')}
              >
                <BookOpen size={18} />
                <span className="font-medium">我的课程</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'my-lives' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('my-lives')}
              >
                <PlayCircle size={18} />
                <span className="font-medium">我的直播</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-all">
                <FileText size={18} />
                <span className="font-medium">我的考试</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-all">
                <Users size={18} />
                <span className="font-medium">我的班级</span>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                  view === 'my-favorites' ? "bg-[#7DC16A] text-white shadow-lg shadow-[#7DC16A]/20" : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setView('my-favorites')}
              >
                <Heart size={18} />
                <span className="font-medium">我的收藏</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn("flex-1 p-6 md:p-8", isAdminMode || view === 'home' ? "bg-gray-50" : "max-w-7xl mx-auto w-full")}>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          {view === 'home' && (
            <HomePage lives={lives} onSelect={(l) => { setSelectedLive(l); setView('student-detail'); }} />
          )}
          {view === 'my-favorites' && (
            <MyFavoritesPage lives={lives} favoriteIds={favoriteIds} onSelect={(l) => { setSelectedLive(l); setView('student-detail'); }} />
          )}
          {view === 'student-list' && (
            <StudentListPage 
              lives={lives} 
              tab={studentTab} 
              setTab={setStudentTab} 
              onSelect={(l) => { setSelectedLive(l); setView('student-detail'); }}
              showPopup={showLivePopup}
              onClosePopup={() => setShowLivePopup(false)}
            />
          )}
          {view === 'student-detail' && selectedLive && (
            <StudentDetailPage 
              live={selectedLive} 
              isFavorited={favoriteIds.includes(selectedLive.id)}
              onToggleFavorite={() => {
                if (favoriteIds.includes(selectedLive.id)) {
                  setFavoriteIds(favoriteIds.filter(id => id !== selectedLive.id));
                  setToast('已取消收藏');
                } else {
                  setFavoriteIds([...favoriteIds, selectedLive.id]);
                  setToast('已加入收藏');
                }
              }}
              onBack={() => setView(isAdminMode ? 'admin-list' : 'student-list')} 
              onBook={() => setView('my-lives')}
              onToast={setToast}
            />
          )}
          {view === 'admin-list' && (
            <AdminListPage 
              lives={lives} 
              onAdd={() => { setSelectedLive(null); setView('admin-form'); }}
              onEdit={(l) => { setSelectedLive(l); setView('admin-form'); }}
              onDelete={handleDeleteLive}
              onPreview={(l) => { setSelectedLive(l); setView('student-detail'); }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToast={setToast}
            />
          )}
          {view === 'admin-form' && (
            <AdminFormPage 
              live={selectedLive} 
              onSave={handleSaveLive} 
              onCancel={() => setView('admin-list')} 
            />
          )}
          {view === 'admin-stats' && (
            <AdminStatsPage />
          )}
          {view === 'admin-live-stats' && (
            <LiveStatsPage lives={lives} />
          )}
          {view === 'admin-course-stats' && (
            <CourseStatsPage onViewDetail={(course) => { setSelectedCourseStat(course); setView('admin-course-stat-detail'); }} />
          )}
          {view === 'admin-course-stat-detail' && selectedCourseStat && (
            <CourseStatDetailPage course={selectedCourseStat} onBack={() => setView('admin-course-stats')} />
          )}
          {view === 'admin-tenant-mgmt' && (
            <TenantMgmtPage />
          )}
          {view === 'admin-dashboard' && (
            <AdminDashboardPage 
              activeModule={activeDashboardModule} 
              setActiveModule={setActiveDashboardModule} 
            />
          )}
          {view === 'admin-org-user-mgmt' && (
            <OrgUserManagementPage />
          )}
          {view === 'admin-form-mgmt' && (
            <FormMgmtPage onToast={setToast} />
          )}
          {view === 'admin-course-mgmt' && (
            <AdminCourseMgmtPage onViewStats={() => setView('admin-stats')} />
          )}
          {view === 'class-list' && (
            <ClassListPage onSelect={(c) => { setSelectedClassId(c.id); setView('class-detail'); }} />
          )}
          {view === 'class-detail' && selectedClassId && (
            <ClassDetailPage classId={selectedClassId} onBack={() => setView('class-list')} onToast={setToast} />
          )}
          {view === 'teaching-center' && (
            <TeachingCenterPage />
          )}
          {view === 'my-lives' && (
            <MyLivesPage lives={lives} onSelectLive={(l) => { setSelectedLive(l); setView('student-detail'); }} />
          )}
          {view === 'prd' && (
            <PRDPage />
          )}
        </main>
      </div>
    </div>
  );
}

// --- Auth Pages ---

function LoginPage({ onRegister, onLogin }: { onRegister: () => void, onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-4 md:p-8 py-12 md:py-0">
      <div className="bg-white rounded-2xl md:rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[600px]">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-[#F8FAFF] p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7DC16A] rounded-lg flex items-center justify-center text-white font-bold">L</div>
              <span className="text-xl font-bold text-gray-800">Logo</span>
            </div>
          </div>
          <img 
            src="https://img.freepik.com/free-vector/data-network-concept-illustration_114360-654.jpg" 
            alt="Illustration" 
            className="w-full max-w-sm object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">远大才华组织</h2>
            <p className="text-gray-500">数字化人才培养专家</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 md:p-16 flex flex-col justify-center relative">
          <div className="absolute top-6 right-6 md:top-8 md:right-8 text-blue-500 cursor-pointer hover:scale-110 transition-transform">
            <QRCodeSVG value="https://example.com" size={24} />
          </div>
          
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              欢迎登录 <span className="animate-bounce">👋</span>
            </h1>
          </div>

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">登录账号</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  placeholder="请输入登录账号"
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">登录密码</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-12 py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">找回密码?</button>
            </div>

            <button 
              onClick={onLogin}
              className="w-full py-3.5 md:py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              立即登录
            </button>

            <div className="text-center text-sm text-gray-500">
              还没有注册账号? <button onClick={onRegister} className="text-blue-500 font-bold hover:underline">立即注册</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 md:fixed md:bottom-4 text-xs text-gray-400 text-center">北京新大陆时代科技有限公司 © 2022-2026</div>
    </div>
  );
}

function RegisterPage({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-4 md:p-8 py-12 md:py-0">
      <div className="bg-white rounded-2xl md:rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[700px]">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-[#F8FAFF] p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7DC16A] rounded-lg flex items-center justify-center text-white font-bold">L</div>
              <span className="text-xl font-bold text-gray-800">Logo</span>
            </div>
          </div>
          <img 
            src="https://img.freepik.com/free-vector/security-concept-illustration_114360-1541.jpg" 
            alt="Illustration" 
            className="w-full max-w-sm object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">加入远大才华</h2>
            <p className="text-gray-500">开启您的数字化学习之旅</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">欢迎注册</h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 ml-1">手机号码</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Smartphone size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="请输入手机号码"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 ml-1">设置账号</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="请输入登录账号"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">设置密码</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">确认密码</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                  <button 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 ml-1">短信验证码</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="请输入短信验证码"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <button className="px-6 py-3 bg-gray-100 text-blue-600 rounded-2xl font-medium hover:bg-gray-200 transition-colors whitespace-nowrap text-sm">
                  获取验证码
                </button>
              </div>
            </div>

            <button 
              onClick={onRegister}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 mt-4 active:scale-[0.98]"
            >
              立即注册
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">或</span></div>
            </div>

            <div className="text-center">
              <button onClick={onLogin} className="text-blue-500 font-bold hover:underline text-sm">使用已有账户登录</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 md:fixed md:bottom-4 text-xs text-gray-400 text-center">北京新大陆时代科技有限公司 © 2022-2026</div>
    </div>
  );
}

// --- Components ---

function HomePage({ lives, onSelect }: { lives: LiveItem[], onSelect: (l: LiveItem) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter for ongoing or upcoming lives for the hero section
  const heroLives = useMemo(() => {
    return [...lives]
      .filter(l => getLiveStatus(l) !== LiveStatus.ENDED)
      .sort((a, b) => {
        const statusA = getLiveStatus(a);
        const statusB = getLiveStatus(b);
        if (statusA === LiveStatus.ONGOING && statusB !== LiveStatus.ONGOING) return -1;
        if (statusA !== LiveStatus.ONGOING && statusB === LiveStatus.ONGOING) return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      })
      .slice(0, 5);
  }, [lives]);

  useEffect(() => {
    if (heroLives.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heroLives.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroLives]);

  const currentHero = heroLives[activeIndex];

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8 px-4 md:px-0">
      {/* Hero Carousel Section */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[560px] rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl">
        <AnimatePresence mode="wait">
          {currentHero && (
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => onSelect(currentHero)}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={currentHero.cover} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 space-y-4 md:space-y-6 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2",
                    getLiveStatus(currentHero) === LiveStatus.ONGOING 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-[#7DC16A] text-white"
                  )}>
                    {getLiveStatus(currentHero) === LiveStatus.ONGOING && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {getLiveStatus(currentHero) === LiveStatus.ONGOING ? '正在直播' : '即将开播'}
                  </div>
                  <span className="text-white/70 text-[10px] md:text-sm font-medium">热门推荐</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"
                >
                  {currentHero.title}
                </motion.h1>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80"
                >
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="text-[#7DC16A]" size={16} />
                    <span className="text-sm md:text-lg">{format(parseISO(currentHero.startTime), 'MM月dd日 HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <UserIcon className="text-[#7DC16A]" size={16} />
                    <span className="text-sm md:text-lg">{currentHero.lecturer}</span>
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/60 text-sm md:text-lg line-clamp-2 max-w-xl leading-relaxed hidden sm:block"
                >
                  {currentHero.introduction.replace(/<[^>]*>/g, '')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-2 md:pt-4"
                >
                  <button className="px-6 md:px-10 py-3 md:py-4 bg-[#7DC16A] text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:bg-[#69A159] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#7DC16A]/30 flex items-center gap-2 md:gap-3">
                    {getLiveStatus(currentHero) === LiveStatus.ONGOING ? '立即进入' : '预约直播'}
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 right-10 flex items-center gap-3">
          {heroLives.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                activeIndex === idx ? "w-8 bg-[#7DC16A]" : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => (prev - 1 + heroLives.length) % heroLives.length); }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#7DC16A] transition-all pointer-events-auto"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => (prev + 1) % heroLives.length); }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#7DC16A] transition-all pointer-events-auto"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Secondary Section - Other Upcoming Lives */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">精彩预告</h2>
            <div className="h-6 w-[1px] bg-gray-300" />
            <p className="text-gray-500 text-sm">锁定时间，精彩不容错过</p>
          </div>
          <button className="text-gray-400 hover:text-[#7DC16A] text-sm font-medium flex items-center gap-1 transition-colors">
            查看更多 <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {lives.filter(l => getLiveStatus(l) === LiveStatus.NOT_STARTED).slice(0, 4).map((live) => (
            <div 
              key={live.id}
              onClick={() => onSelect(live)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={live.cover} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <div className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    即将开播
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#7DC16A] transition-colors">
                  {live.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{format(parseISO(live.startTime), 'MM-dd HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon size={12} />
                    <span>{live.lecturer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StudentListPage({ lives, tab, setTab, onSelect, showPopup, onClosePopup }: { 
  lives: LiveItem[], 
  tab: string, 
  setTab: (t: any) => void, 
  onSelect: (l: LiveItem) => void,
  showPopup: boolean,
  onClosePopup: () => void
}) {
  const filtered = useMemo(() => {
    let list = [...lives];
    if (tab !== 'all') {
      list = list.filter(l => getLiveStatus(l) === tab);
    }
    
    // Sorting: Ongoing > Not Started > Ended
    // Within same priority, closest to current time first
    list.sort((a, b) => {
      const statusA = getLiveStatus(a);
      const statusB = getLiveStatus(b);
      
      const priority = {
        [LiveStatus.ONGOING]: 0,
        [LiveStatus.NOT_STARTED]: 1,
        [LiveStatus.ENDED]: 2,
      };
      
      if (priority[statusA] !== priority[statusB]) {
        return priority[statusA] - priority[statusB];
      }
      
      const now = new Date().getTime();
      const diffA = Math.abs(new Date(a.startTime).getTime() - now);
      const diffB = Math.abs(new Date(b.startTime).getTime() - now);
      return diffA - diffB;
    });
    
    return list;
  }, [lives, tab]);

  const ongoingLive = useMemo(() => lives.find(l => getLiveStatus(l) === LiveStatus.ONGOING), [lives]);

  return (
    <div className="space-y-8">
      {/* Banner/Header */}
      <div className="relative h-32 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#7DC16A] to-[#9BE088] flex items-center px-6 sm:px-12 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">直播中心</h1>
          <p className="opacity-90 text-xs sm:text-base">实时互动，名师在线，开启你的学习之旅</p>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-20 pointer-events-none">
          <PlayCircle size={160} className="translate-x-1/4 translate-y-1/4 sm:w-[200px] sm:h-[200px]" />
        </div>
      </div>


      {/* Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'all', label: '全部' },
          { id: LiveStatus.ONGOING, label: '正在直播' },
          { id: LiveStatus.NOT_STARTED, label: '未开始' },
          { id: LiveStatus.ENDED, label: '已结束' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "pb-4 text-base font-medium transition-all relative",
              tab === t.id ? "text-[#7DC16A]" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
            {tab === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#7DC16A] rounded-full" />}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(live => (
          <div 
            key={live.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => onSelect(live)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={live.cover} alt={live.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3">
                 <StatusBadge status={getLiveStatus(live)} />
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#7DC16A] transition-colors">{live.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: live.introduction }} />
            </div>
          </div>
        ))}
      </div>

      {/* Live Popup */}
      {showPopup && ongoingLive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="relative aspect-video">
              <img src={ongoingLive.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold line-clamp-1">{ongoingLive.title}</h2>
                </div>
              </div>
              <button onClick={onClosePopup} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <button 
                onClick={() => { onSelect(ongoingLive); onClosePopup(); }}
                className="w-full py-4 bg-[#7DC16A] text-white rounded-2xl font-bold text-lg hover:bg-[#69A159] transition-colors shadow-lg shadow-[#7DC16A]/20"
              >
                立即进入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2">
      {[
        { label: '天', value: timeLeft.d },
        { label: '时', value: timeLeft.h },
        { label: '分', value: timeLeft.m },
        { label: '秒', value: timeLeft.s },
      ].map((item, i) => (
        <React.Fragment key={item.label}>
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
              {String(item.value).padStart(2, '0')}
            </div>
            <span className="text-[10px] mt-1 opacity-70 font-bold">{item.label}</span>
          </div>
          {i < 3 && <span className="text-xl font-bold mb-5">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function LiveEntryForm({ onConfirm, onCancel, onToast }: { onConfirm: () => void, onCancel: () => void, onToast: (m: string) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    code: '',
    email: '',
    org: ''
  });
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      onToast('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    onToast('验证码已发送');
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.code || !formData.email || !formData.org) {
      onToast('请完善个人信息后进入直播');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      onToast('请输入正确的手机号');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 animate-in zoom-in duration-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">完善个人信息</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">姓名</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="请输入姓名"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">手机号</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="请输入大陆手机号"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">验证码</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                placeholder="请输入验证码"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20" 
              />
              <button 
                disabled={countdown > 0}
                onClick={handleSendCode}
                className="px-4 py-2 bg-gray-100 text-[#7DC16A] rounded-xl text-sm font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors shrink-0"
              >
                {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">邮箱</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="请输入邮箱"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">组织</label>
            <input 
              type="text" 
              value={formData.org}
              onChange={e => setFormData({...formData, org: e.target.value})}
              placeholder="请输入所属组织"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20" 
            />
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full mt-8 py-3 bg-[#7DC16A] text-white rounded-xl font-bold hover:bg-[#69A159] transition-colors shadow-lg shadow-[#7DC16A]/20"
        >
          确定并进入直播
        </button>
      </div>
    </div>
  );
}

function StudentDetailPage({ live, isFavorited, onToggleFavorite, onBack, onBook, onToast }: { live: LiveItem, isFavorited: boolean, onToggleFavorite: () => void, onBack: () => void, onBook: () => void, onToast: (m: string) => void }) {
  const status = getLiveStatus(live);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleEnterLive = () => {
    if (!formSubmitted) {
      setShowForm(true);
    } else {
      if (status === LiveStatus.ONGOING) {
        onToast('正在进入直播间...');
      } else if (status === LiveStatus.ENDED && live.canReplay) {
        onToast('正在进入回放页面...');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-[#7DC16A] transition-colors font-medium text-sm md:text-base">
          <ArrowLeft size={18} /> 返回列表
        </button>
        <button 
          onClick={onToggleFavorite}
          className={cn(
            "flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-bold transition-all border shadow-sm text-sm md:text-base",
            isFavorited ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
          )}
        >
          <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
          <span className="hidden xs:inline">{isFavorited ? '已收藏' : '收藏直播'}</span>
          <span className="xs:hidden">{isFavorited ? '已收' : '收藏'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div 
          className="relative aspect-video bg-black flex items-center justify-center group cursor-pointer"
          onClick={handleEnterLive}
        >
          <img src={live.cover} alt="" className="w-full h-full object-contain opacity-80" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 p-4">
             {status === LiveStatus.ONGOING ? (
               <div className="flex flex-col items-center gap-4 md:gap-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#7DC16A] flex items-center justify-center animate-pulse shadow-lg shadow-[#7DC16A]/40">
                    <PlayCircle className="w-10 h-10 md:w-14 md:h-14" fill="white" />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEnterLive(); }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-[#7DC16A] text-white rounded-full font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20 flex items-center justify-center group"
                    title="立即进入直播"
                  >
                    <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
             ) : status === LiveStatus.NOT_STARTED ? (
               <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <Clock className="w-8 h-8 md:w-12 md:h-12 opacity-50" />
                    <p className="text-lg md:text-xl font-bold">开播倒计时</p>
                  </div>
                  <CountdownTimer targetDate={live.startTime} />
                  <p className="opacity-70 text-xs md:text-sm">{format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')} 准时开播</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onBook(); }}
                    className="mt-2 px-8 md:px-10 py-2.5 md:py-3 bg-[#7DC16A] text-white rounded-full font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20 text-sm md:text-base"
                  >
                    预约直播
                  </button>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-600/50 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 md:w-12 md:h-12 opacity-50" />
                  </div>
                  <p className="text-lg md:text-xl font-bold">直播已结束</p>
                  {live.canReplay ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEnterLive(); }}
                      className="px-6 md:px-8 py-2.5 md:py-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors font-bold border border-white/30 text-sm md:text-base"
                    >
                      观看回放
                    </button>
                  ) : (
                    <p className="text-sm opacity-50">暂无回放</p>
                  )}
               </div>
             )}
          </div>
        </div>

        {/* Form Popup for Guest */}
        {showForm && (
          <LiveEntryForm 
            onConfirm={() => { setShowForm(false); setFormSubmitted(true); handleEnterLive(); }}
            onCancel={() => setShowForm(false)}
            onToast={onToast}
          />
        )}

        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="shrink-0 self-start sm:self-auto">
                  <StatusBadge status={status} />
                </div>
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{live.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 text-xs md:text-sm">
                <div className="flex items-center gap-2"><Calendar size={16} className="shrink-0" /> {format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')}</div>
                <div className="flex items-center gap-2"><Clock size={16} className="shrink-0" /> 时长: {live.duration}分钟</div>
              </div>
            </div>
            {status === LiveStatus.NOT_STARTED && (
              <button 
                onClick={onBook}
                className="w-full md:w-auto px-8 py-3 bg-[#7DC16A] text-white rounded-2xl font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20 text-sm md:text-base"
              >
                预约直播
              </button>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
              <FileText size={20} className="text-[#7DC16A] shrink-0" /> 直播介绍
            </h3>
            <div className="prose prose-green max-w-none text-gray-600 leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: live.introduction }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCourseMgmtPage({ onViewStats }: { onViewStats: () => void }) {
  const [activeDomain, setActiveDomain] = useState('不限');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('综合排序');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const domains = ['不限', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '数字商科', '孪生元宇宙', '软件与信息技术', '双创'];
  const sorts = ['综合排序', '推荐', '浏览数', '学习人数'];

  const courses = [
    { id: '1', title: '测试', domain: '物联网', status: '未发布', author: '王水亮', users: 0, views: 0, cover: 'https://picsum.photos/seed/course1/400/225' },
    { id: '2', title: '人工智能训练师', domain: '人工智能', status: '未发布', author: '林妹', users: 0, views: 5, cover: 'https://picsum.photos/seed/course2/400/225' },
    { id: '3', title: '人工智能训练师', domain: '人工智能', status: '已发布', author: '林妹', users: 1, views: 12, cover: 'https://picsum.photos/seed/course3/400/225' },
    { id: '4', title: '物联网安装调试员', domain: '物联网', status: '已发布', author: '林妹', users: 1, views: 10, cover: 'https://picsum.photos/seed/course4/400/225' },
    { id: '5', title: '物联网工程技术', domain: '物联网', status: '已发布', author: '林妹', users: 1, views: 15, cover: 'https://picsum.photos/seed/course5/400/225' },
    { id: '6', title: 'OpenHarmony', domain: '物联网', status: '已发布', author: '林妹', users: 0, views: 8, cover: 'https://picsum.photos/seed/course6/400/225' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>教学管理</span>
          <ChevronRight size={12} />
          <span className="text-gray-600">课程管理</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">课程管理</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-6">
        <div className="flex items-start gap-4">
          <span className="text-sm font-medium text-gray-500 mt-1.5 shrink-0">领域</span>
          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-all",
                  activeDomain === d ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 shrink-0">课程名称:</span>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="请输入关键词"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sorting & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {sorts.map(s => (
            <button
              key={s}
              onClick={() => setActiveSort(s)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                activeSort === s ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
              )}
            >
              {s}
              {(s === '浏览数' || s === '学习人数') && <ArrowUpDown size={12} />}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} /> 新建课程
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            {/* Cover */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img src={course.cover} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="bg-[#7DC16A]/10 text-[#7DC16A] text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm border border-[#7DC16A]/20">{course.domain}</span>
                {course.status === '未发布' && (
                  <span className="bg-gray-500/80 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">未发布</span>
                )}
              </div>
              
              {/* More Menu Trigger */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === course.id ? null : course.id);
                  }}
                  className="p-1.5 bg-black/40 text-white rounded-lg hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Popup Menu */}
              {openMenuId === course.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute top-10 right-2 w-36 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {[
                      { label: '推荐课程', icon: <TrendingUp size={14} className="text-green-500" /> },
                      { label: '发布课程', icon: <CheckCircle2 size={14} className="text-green-500" /> },
                      { label: '复制课程', icon: <Copy size={14} className="text-blue-500" /> },
                      { label: '查看课程', icon: <BarChart3 size={14} className="text-blue-500" />, onClick: onViewStats },
                      { label: '编辑课程', icon: <Edit size={14} className="text-[#7DC16A]" /> },
                      { label: '删除课程', icon: <Trash2 size={14} className="text-red-500" />, isDanger: true },
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          item.onClick?.();
                          setOpenMenuId(null);
                        }}
                        className={cn(
                          "px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs flex items-center gap-2 transition-colors",
                          item.isDanger ? "text-red-500 hover:bg-red-50" : "text-gray-600"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                    {course.author[0]}
                  </div>
                  <span className="text-xs text-gray-500">{course.author}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users size={12} /> {course.users}
                  </div>
                  <div className="flex items-center gap-1">
                    <PlayCircle size={12} /> {course.views}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                <button 
                  onClick={() => window.alert('进入编辑课程页面...')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  编辑课程
                </button>
                <span className="text-gray-200">|</span>
                <button 
                  onClick={onViewStats}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  查看课程
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TenantMgmtPage() {
  const [search, setSearch] = useState('');
  const [editingTenant, setEditingTenant] = useState<TenantItem | null>(null);
  const [editValue, setEditValue] = useState(0);

  const filtered = MOCK_TENANTS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">租户直播管理</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索租户名称" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">租户名称</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播数量</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">可用直播时长 (小时)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">已用直播时长 (小时)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(tenant => (
              <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{tenant.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{tenant.liveCount}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{tenant.availableDuration}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{tenant.usedDuration}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => {
                      setEditingTenant(tenant);
                      setEditValue(tenant.availableDuration);
                    }}
                    className="text-gray-400 hover:text-blue-500 transition-colors" 
                    title="编辑"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTenant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">编辑可用时长</h3>
              <button onClick={() => setEditingTenant(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">租户名称</label>
                <p className="text-lg font-bold text-gray-800">{editingTenant.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">可用直播时长 (小时)</label>
                <input 
                  type="number" 
                  value={editValue}
                  onChange={(e) => setEditValue(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setEditingTenant(null);
                  }}
                  className="flex-1 py-3 bg-[#7DC16A] text-white rounded-xl font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseStatsPage({ onViewDetail }: { onViewDetail: (course: CourseStatItem) => void }) {
  const [search, setSearch] = useState('');

  const filtered = MOCK_COURSE_STATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">课程统计</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索课程名称" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">课程名称</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">课程学时</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">任务数量</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">浏览人数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">学员数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">加入学习人数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(course => (
              <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{course.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{course.hours}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{course.taskCount}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{course.viewCount}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{course.studentCount}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{course.joinedCount}</td>
                <td className="px-6 py-4">
                  <button onClick={() => onViewDetail(course)} className="text-blue-600 hover:underline text-sm font-bold">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseStatDetailPage({ course, onBack }: { course: CourseStatItem, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'student' | 'task'>('student');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">课程统计详情 - {course.name}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('student')}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'student' ? "text-[#7DC16A] border-[#7DC16A]" : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            学员详情
          </button>
          <button 
            onClick={() => setActiveTab('task')}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'task' ? "text-[#7DC16A] border-[#7DC16A]" : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            任务详情
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'student' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <input type="text" placeholder="搜索学员姓名/手机号" className="max-w-xs w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A]" />
                  <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none">
                    <option>全部状态</option>
                    <option>已完成</option>
                    <option>进行中</option>
                    <option>未开始</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                  <Download size={16} /> 导出
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 px-4 whitespace-nowrap">用户名</th>
                      <th className="pb-4 px-4 whitespace-nowrap">手机号</th>
                      <th className="pb-4 px-4 whitespace-nowrap">身份证号</th>
                      <th className="pb-4 px-4 whitespace-nowrap">是否阅读学员须知</th>
                      <th className="pb-4 px-4 whitespace-nowrap">开始时间</th>
                      <th className="pb-4 px-4 whitespace-nowrap">完成时间</th>
                      <th className="pb-4 px-4 whitespace-nowrap">状态</th>
                      <th className="pb-4 px-4 whitespace-nowrap">累计学习时长 (分)</th>
                      <th className="pb-4 px-4 whitespace-nowrap">提问</th>
                      <th className="pb-4 px-4 whitespace-nowrap">笔记</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_STUDENT_DETAILS.map(s => (
                      <tr key={s.id} className="text-sm">
                        <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">{s.username}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.phone}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.idCard}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.readNotice ? '是' : '否'}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.startTime || '-'}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.endTime || '-'}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            s.status === StudyStatus.COMPLETED ? "bg-green-100 text-green-600" :
                            s.status === StudyStatus.ONGOING ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                          )}>
                            {s.status === StudyStatus.COMPLETED ? '已完成' : s.status === StudyStatus.ONGOING ? '进行中' : '未开始'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.totalDuration}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.questions}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{s.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                  <Download size={16} /> 导出
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 px-4">任务名称</th>
                      <th className="pb-4 px-4">任务类型</th>
                      <th className="pb-4 px-4">视频长度(分)</th>
                      <th className="pb-4 px-4">学习人数</th>
                      <th className="pb-4 px-4">完成人数</th>
                      <th className="pb-4 px-4">累加学习时长(分)</th>
                      <th className="pb-4 px-4">人均学习时长(分)</th>
                      <th className="pb-4 px-4">考试平均得分</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_TASK_STATS.map(t => (
                      <tr key={t.id} className="text-sm">
                        <td className="py-4 px-4 font-medium text-gray-800">{t.name}</td>
                        <td className="py-4 px-4 text-gray-500">{t.type}</td>
                        <td className="py-4 px-4 text-gray-500">{t.videoLength || '-'}</td>
                        <td className="py-4 px-4 text-gray-500">{t.learners}</td>
                        <td className="py-4 px-4 text-gray-500">{t.completers}</td>
                        <td className="py-4 px-4 text-gray-500">{t.cumulativeDuration}</td>
                        <td className="py-4 px-4 text-gray-500">{t.avgDuration}</td>
                        <td className="py-4 px-4 text-gray-500 font-bold text-blue-600">{t.avgScore || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveStatsPage({ lives }: { lives: LiveItem[] }) {
  const [search, setSearch] = useState('');
  
  const filtered = lives.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">直播统计</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索直播标题" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">已用直播时长</p>
            <p className="text-3xl font-bold text-gray-800">2000.00 <span className="text-sm font-normal">小时</span></p>
          </div>
          <div className="group relative">
            <HelpCircle size={20} className="text-gray-300 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              直播时长按每场直播每个用户参加直播时长之和
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">可用直播时长</p>
          <p className="text-3xl font-bold text-green-600">102.25 <span className="text-sm font-normal text-gray-800">小时</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播标题</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播开始时间</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">时长 (分)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">参与人数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播人时</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">进行状态</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length > 0 ? (
              filtered.map(live => {
                const participants = Math.floor(Math.random() * 500) + 50;
                const personHours = (participants * live.duration / 60).toFixed(2);
                const status = getLiveStatus(live);
                return (
                  <tr key={live.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{live.title}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{live.duration}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{participants}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{personHours}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline text-sm font-bold">查看详情</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={40} className="opacity-20" />
                    <p>未找到匹配的直播标题</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminStatsPage() {
  const [activeTab, setActiveTab] = useState('default-plan');
  const [activeSidebar, setActiveSidebar] = useState('data-overview');
  const [bottomTab, setBottomTab] = useState('student-detail');

  return (
    <div className="space-y-6 -m-6 md:-m-8">
      {/* Course Header */}
      <div className="bg-white p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-gray-100">
            <img src="https://picsum.photos/seed/bigdata/400/225" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">已发布</div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-800">大数据工程技术人员（初级）基础方向实操</h1>
            <div className="text-[#7DC16A] font-bold">¥10.00</div>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">课程计划</div>
            <div className="text-xl font-bold">1</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">课程学员</div>
            <div className="text-xl font-bold">1</div>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">查看课程</button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white px-6 border-b border-gray-100">
        <div className="flex items-center gap-12">
          {[
            { id: 'course-info', label: '课程信息' },
            { id: 'default-plan', label: '默认计划设置' },
            { id: 'all-plans', label: '全部计划' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "py-4 text-sm font-medium relative transition-colors",
                activeTab === t.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
              {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex bg-white min-h-[800px]">
        {/* Inner Sidebar */}
        <aside className="w-48 border-r border-gray-100 py-4">
          {[
            { id: 'lesson-mgmt', label: '课时管理' },
            { id: 'base-settings', label: '基础设置' },
            { id: 'notice-mgmt', label: '公告管理' },
            { id: 'teacher-mgmt', label: '教师管理' },
            { id: 'student-mgmt', label: '学员管理' },
            { id: 'exam-review', label: '试卷批阅' },
            { id: 'homework-review', label: '作业批阅' },
            { id: 'student-errors', label: '学员错题' },
            { id: 'data-overview', label: '数据概览' },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setActiveSidebar(item.id)}
              className={cn(
                "px-6 py-3 text-sm cursor-pointer transition-all relative",
                activeSidebar === item.id ? "text-blue-600 bg-blue-50/50 font-medium" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {item.label}
              {activeSidebar === item.id && <div className="absolute left-0 top-0 w-1 h-full bg-blue-600" />}
            </div>
          ))}
        </aside>

        {/* Inner Content */}
        <div className="flex-1 p-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">数据概览</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 border border-gray-100 rounded-xl overflow-hidden">
            {[
              { label: '计划学员数', value: '1', icon: <Users size={16} /> },
              { label: '完成人数', value: '0', icon: <CheckCircle2 size={16} /> },
              { label: '免费试看数', value: '0', icon: <PlayCircle size={16} />, hasHelp: true },
              { label: '笔记数', value: '0', icon: <BookOpen size={16} /> },
              { label: '提问数', value: '0', icon: <HelpCircle size={16} /> },
              { label: '话题数', value: '0', icon: <MessageSquare size={16} /> },
            ].map((stat, i) => (
              <div key={i} className={cn("p-8 text-center border-gray-100", i < 3 ? "border-b" : "", i % 3 !== 2 ? "border-r" : "")}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="flex items-center justify-center gap-1 text-gray-400 text-xs">
                  {stat.label}
                  {stat.hasHelp && <HelpCircle size={12} />}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-700">学员趋势</h3>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1">
                    <span>2026/03/05-2026/03/11</span>
                    <Calendar size={12} />
                  </div>
                  <span className="hover:text-blue-600 cursor-pointer">7天</span>
                  <span className="hover:text-blue-600 cursor-pointer">30天</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: '2026-03-05', value: 0 },
                    { name: '2026-03-06', value: 0 },
                    { name: '2026-03-07', value: 0 },
                    { name: '2026-03-08', value: 0 },
                    { name: '2026-03-09', value: 0 },
                    { name: '2026-03-10', value: 0 },
                    { name: '2026-03-11', value: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#7DC16A" fill="#7DC16A" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-700 flex items-center gap-1">完课率 <HelpCircle size={14} className="text-gray-300" /></h3>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1">
                    <span>2026/03/05-2026/03/11</span>
                    <Calendar size={12} />
                  </div>
                  <span className="hover:text-blue-600 cursor-pointer">7天</span>
                  <span className="hover:text-blue-600 cursor-pointer">30天</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: '2026-03-05', rate: 0 },
                    { name: '2026-03-06', rate: 0 },
                    { name: '2026-03-07', rate: 0 },
                    { name: '2026-03-08', rate: 0 },
                    { name: '2026-03-09', rate: 0 },
                    { name: '2026-03-10', rate: 0 },
                    { name: '2026-03-11', rate: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#7DC16A" strokeWidth={2} dot={{ r: 4, fill: '#7DC16A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section */}
          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-12 border-b border-gray-100">
              {[
                { id: 'student-detail', label: '学员详情' },
                { id: 'study-detail', label: '学习明细' },
                { id: 'task-detail', label: '任务详情' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setBottomTab(t.id)}
                  className={cn(
                    "pb-4 text-sm font-medium relative transition-colors",
                    bottomTab === t.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t.label}
                  {bottomTab === t.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                </button>
              ))}
            </div>

            {bottomTab === 'student-detail' && <StudentDetailTab />}
            {bottomTab === 'study-detail' && <StudyDetailTab />}
            {bottomTab === 'task-detail' && <TaskDetailTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDetailTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'startTime' | 'endTime'>('startTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    return MOCK_STUDENT_DETAILS.filter(s => {
      const matchesSearch = s.username.includes(search) || s.phone.includes(search);
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [search, statusFilter, sortField, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="用户名/手机号" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-64 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          >
            <option value="all">全部学习状态</option>
            <option value={StudyStatus.NOT_STARTED}>未开始</option>
            <option value={StudyStatus.ONGOING}>进行中</option>
            <option value={StudyStatus.COMPLETED}>已完成</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>排序:</span>
            <button 
              onClick={() => {
                if (sortField === 'startTime') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('startTime'); setSortOrder('desc'); }
              }}
              className={cn("flex items-center gap-1 hover:text-blue-600", sortField === 'startTime' && "text-blue-600 font-medium")}
            >
              开始时间 <ArrowUpDown size={12} />
            </button>
            <button 
              onClick={() => {
                if (sortField === 'endTime') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('endTime'); setSortOrder('desc'); }
              }}
              className={cn("flex items-center gap-1 hover:text-blue-600", sortField === 'endTime' && "text-blue-600 font-medium")}
            >
              结束时间 <ArrowUpDown size={12} />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <Download size={16} /> 导出
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">用户名</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">手机号</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">身份证号</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">是否阅读学员须知</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">开始时间</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">完成时间</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">状态</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">累计学习时长（分）</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">提问</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">笔记</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.username}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.idCard}</td>
                <td className="px-6 py-4">
                  {s.readNotice ? <span className="text-green-500 text-xs font-bold">已读</span> : <span className="text-gray-400 text-xs">未读</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.startTime || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.endTime || '-'}</td>
                <td className="px-6 py-4">
                  <StudyStatusBadge status={s.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.totalDuration}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.questions}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudyDetailTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all">
            <option>加入时间 ↓</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all">
            <option>全部</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="用户名/手机号" className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-64 transition-all" />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <Download size={16} /> 导出
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-4">
          <div className="w-48">学员</div>
          <div className="flex-1 px-12 flex items-center gap-8">
            <span>任务进度</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> 已学完</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> 学习中</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> 未学</div>
            </div>
          </div>
          <div className="w-24 text-right">完成率</div>
        </div>

        <div className="space-y-4">
          {MOCK_STUDENT_DETAILS.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl hover:shadow-sm transition-all">
              <div className="w-48 font-medium text-gray-800">{s.username}</div>
              <div className="flex-1 px-12 flex items-center gap-2">
                {/* Progress Blocks */}
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-3 flex-1 rounded-sm",
                      s.status === StudyStatus.COMPLETED ? "bg-green-500" : 
                      s.status === StudyStatus.ONGOING && i < 3 ? "bg-yellow-500" : "bg-gray-100"
                    )} 
                  />
                ))}
              </div>
              <div className="w-24 text-right text-sm font-bold text-gray-600">
                {s.status === StudyStatus.COMPLETED ? '100%' : s.status === StudyStatus.ONGOING ? '50%' : '0%'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskDetailTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="任务名" className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-64 transition-all" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <Download size={16} /> 导出
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-4">
          <div className="w-48">任务</div>
          <div className="flex-1 px-12 flex items-center gap-8">
            <span>任务进度</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> 已学完</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> 学习中</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> 未学</div>
            </div>
          </div>
          <div className="w-24 text-right">完成率</div>
        </div>

        <div className="space-y-4">
          {MOCK_TASKS.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl hover:shadow-sm transition-all">
              <div className="w-48 font-medium text-gray-800">{task.name}</div>
              <div className="flex-1 px-12">
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      task.status === StudyStatus.COMPLETED ? "bg-green-500" : "bg-yellow-500"
                    )} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
              </div>
              <div className="w-24 text-right text-sm font-bold text-gray-600">{task.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyStatusBadge({ status }: { status: StudyStatus }) {
  const config = {
    [StudyStatus.NOT_STARTED]: { label: '未开始', class: 'bg-gray-100 text-gray-500' },
    [StudyStatus.ONGOING]: { label: '进行中', class: 'bg-yellow-100 text-yellow-600' },
    [StudyStatus.COMPLETED]: { label: '已完成', class: 'bg-green-100 text-green-600' },
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", config[status].class)}>
      {config[status].label}
    </span>
  );
}

function AdminListPage({ lives, onAdd, onEdit, onDelete, onPreview, searchQuery, setSearchQuery, onToast }: { 
  lives: LiveItem[], 
  onAdd: () => void, 
  onEdit: (l: LiveItem) => void, 
  onDelete: (id: string) => void,
  onPreview: (l: LiveItem) => void,
  searchQuery: string,
  setSearchQuery: (s: string) => void,
  onToast: (m: string) => void
}) {
  const [shareLive, setShareLive] = useState<LiveItem | null>(null);
  const [viewFormDetails, setViewFormDetails] = useState<LiveItem | null>(null);
  const [showDetailAlert, setShowDetailAlert] = useState(false);

  const filtered = useMemo(() => {
    return lives
      .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [lives, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">直播管理</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索直播名称" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] w-64 transition-all"
            />
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-2 bg-[#7DC16A] text-white rounded-xl font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20"
          >
            <Plus size={18} /> 新增直播
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播封面</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播标题</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">直播时间</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">时长</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(live => (
              <tr key={live.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <img src={live.cover} alt="" className="w-24 aspect-video object-cover rounded-lg border border-gray-100" referrerPolicy="no-referrer" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{live.title}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{live.duration}分钟</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onToast('直播已开始，正在进入直播控制台...')} 
                      className="text-gray-400 hover:text-[#7DC16A] transition-colors" 
                      title="开播"
                    >
                      <Radio size={18} />
                    </button>
                    <button 
                      onClick={() => onToast('已推荐至首页')} 
                      className="text-gray-400 hover:text-amber-500 transition-colors" 
                      title="推荐至首页"
                    >
                      <TrendingUp size={18} />
                    </button>
                    <button onClick={() => onPreview(live)} className="text-gray-400 hover:text-blue-600 transition-colors" title="预览"><Eye size={18} /></button>
                    <button onClick={() => setShareLive(live)} className="text-gray-400 hover:text-[#7DC16A] transition-colors" title="分享"><Share2 size={18} /></button>
                    <button onClick={() => onEdit(live)} className="text-gray-400 hover:text-blue-500 transition-colors" title="编辑"><Edit size={18} /></button>
                    {live.viewPermission === ViewPermission.GUEST_WITH_FORM && (
                      <button 
                        onClick={() => setViewFormDetails(live)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="查看表单详情"
                      >
                        <FileText size={18} />
                      </button>
                    )}
                    <button onClick={() => onDelete(live.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="删除"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无直播数据</p>
          </div>
        )}
      </div>

      {showDetailAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/20">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <ExternalLink size={40} className="text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">提示</h3>
                <p className="text-gray-500 font-medium">进入EduSoho 直播详情页面</p>
              </div>
              <button 
                onClick={() => setShowDetailAlert(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {shareLive && (
        <ShareModal live={shareLive} onClose={() => setShareLive(null)} />
      )}

      {viewFormDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">表单填写详情 - {viewFormDetails.title}</h3>
              <button onClick={() => setViewFormDetails(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    {viewFormDetails.formFields?.map(f => <th key={f} className="pb-4 px-4">{f}</th>)}
                    <th className="pb-4 px-4">填写时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="text-sm text-gray-600">
                      {viewFormDetails.formFields?.map(f => <td key={f} className="py-4 px-4">测试数据{i}</td>)}
                      <td className="py-4 px-4 text-gray-400">2026-03-11 10:00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareModal({ live, onClose }: { live: LiveItem, onClose: () => void }) {
  const shareUrl = `${window.location.origin}/live/${live.id}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `直播二维码-${live.title}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold">分享直播</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <QRCodeSVG id="qr-code-svg" value={shareUrl} size={160} level="H" includeMargin />
            </div>
            <button 
              onClick={downloadQR}
              className="flex items-center gap-2 text-[#7DC16A] font-bold text-sm hover:underline"
            >
              <Download size={16} /> 下载二维码
            </button>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">直播链接</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <input type="text" readOnly value={shareUrl} className="bg-transparent flex-1 text-sm text-gray-600 focus:outline-none" />
              <button 
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold transition-all",
                  copied ? "bg-green-500 text-white" : "bg-[#7DC16A] text-white hover:bg-[#69A159]"
                )}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Modals ---

function StudentSelectionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialSelected = [] 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (selected: UserProfile[]) => void,
  initialSelected?: UserProfile[]
}) {
  const [selected, setSelected] = useState<UserProfile[]>(initialSelected);
  const [tempChecked, setTempChecked] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearchTerm, setSelectedSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredAvailable = MOCK_USERS.filter(u => 
    !selected.find(s => s.id === u.id) && 
    (u.name.includes(searchTerm) || u.account.includes(searchTerm) || u.phone.includes(searchTerm))
  );

  const filteredSelected = selected.filter(u => 
    u.name.includes(selectedSearchTerm) || u.account.includes(selectedSearchTerm) || u.phone.includes(selectedSearchTerm)
  );

  const handleMoveRight = () => {
    const toAdd = MOCK_USERS.filter(u => tempChecked.includes(u.id));
    setSelected([...selected, ...toAdd]);
    setTempChecked([]);
  };

  const handleMoveLeft = () => {
    // For simplicity, we'll just clear selected for now or implement left transfer
    // In the image, there are arrows for both directions.
  };

  const toggleCheck = (id: string) => {
    setTempChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleCheckAll = () => {
    if (tempChecked.length === filteredAvailable.length) {
      setTempChecked([]);
    } else {
      setTempChecked(filteredAvailable.map(u => u.id));
    }
  };

  const removeSelected = (id: string) => {
    setSelected(selected.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">添加学生</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Left Panel: Available */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b text-sm font-bold">待选用户</div>
            <div className="p-3 border-b flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="请输入搜索内容"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-1.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <div className="absolute right-0 top-0 h-full w-10 bg-blue-500 rounded-r flex items-center justify-center text-white cursor-pointer">
                  <Search size={14} />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 w-10">
                      <input type="checkbox" checked={tempChecked.length > 0 && tempChecked.length === filteredAvailable.length} onChange={toggleCheckAll} />
                    </th>
                    <th className="p-3 font-medium text-gray-500">真实姓名</th>
                    <th className="p-3 font-medium text-gray-500">登录账号</th>
                    <th className="p-3 font-medium text-gray-500">手机号</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAvailable.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" checked={tempChecked.includes(user.id)} onChange={() => toggleCheck(user.id)} />
                      </td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.account}</td>
                      <td className="p-3">{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-center gap-2 text-xs">
              <button className="p-1 hover:bg-gray-200 rounded"><ChevronLeft size={14} /></button>
              <span className="flex items-center px-2 border bg-white rounded">1</span>
              <span className="flex items-center">/ 2</span>
              <button className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={14} /></button>
            </div>
          </div>

          {/* Middle Buttons */}
          <div className="flex flex-col justify-center gap-4">
            <button 
              onClick={handleMoveRight}
              disabled={tempChecked.length === 0}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
            <button 
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Right Panel: Selected */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b text-sm font-bold">已选用户(已选择{selected.length}个)</div>
            <div className="p-3 border-b flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="请输入搜索内容"
                  value={selectedSearchTerm}
                  onChange={e => setSelectedSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-1.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <div className="absolute right-0 top-0 h-full w-10 bg-blue-500 rounded-r flex items-center justify-center text-white cursor-pointer">
                  <Search size={14} />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {selected.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                    <FileText size={32} className="opacity-20" />
                  </div>
                  <p className="text-sm">暂无数据</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-3 w-10"><input type="checkbox" disabled /></th>
                      <th className="p-3 font-medium text-gray-500">真实姓名</th>
                      <th className="p-3 font-medium text-gray-500">登录账号</th>
                      <th className="p-3 font-medium text-gray-500">手机号</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredSelected.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3"><input type="checkbox" disabled /></td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.account}</td>
                        <td className="p-3">{user.phone}</td>
                        <td className="p-3">
                          <button onClick={() => removeSelected(user.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-center gap-4">
          <button onClick={onClose} className="px-8 py-2 border rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button 
            onClick={() => { onSave(selected); onClose(); }} 
            className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function FormSelectionModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialSelectedId
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (formId: string) => void,
  initialSelectedId?: string
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">选择表单</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {MOCK_FORMS.map(form => (
              <div 
                key={form.id}
                onClick={() => setSelectedId(form.id)}
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between group",
                  selectedId === form.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    selectedId === form.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  )}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{form.name}</p>
                    <p className="text-xs text-gray-500">创建人: {form.creator}</p>
                  </div>
                </div>
                {selectedId === form.id && <CheckCircle2 className="text-blue-500" size={20} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button 
            onClick={() => { if (selectedId) { onSave(selectedId); onClose(); } }} 
            disabled={!selectedId}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            确定
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminFormPage({ live, onSave, onCancel }: { live: LiveItem | null, onSave: (l: LiveItem) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<LiveItem>>(live || {
    title: '',
    cover: '',
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: 60,
    canReplay: false,
    completionCondition: { type: CompletionConditionType.ENTER_PAGE },
    introduction: '',
    viewPermission: ViewPermission.GUEST,
    formFields: [],
    studentList: [],
    selectedStudents: []
  });

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedForm = MOCK_FORMS.find(f => f.id === formData.selectedFormId);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title || formData.title.length > 50) newErrors.title = '标题必填且不超过50字';
    if (!formData.cover) newErrors.cover = '请上传封面图';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.duration || formData.duration <= 0 || formData.duration > 999) newErrors.duration = '时长需在1-999分钟之间';
    if (!formData.introduction) newErrors.introduction = '请输入直播介绍';
    if (!formData.viewPermission) newErrors.viewPermission = '请选择观看权限';
    if (formData.viewPermission === ViewPermission.GUEST_WITH_FORM && (!formData.formFields || formData.formFields.length === 0)) {
      newErrors.formFields = '请至少选择一个表单字段';
    }
    if (formData.viewPermission === ViewPermission.SPECIFIC_STUDENTS && !uploadedFileName) {
      newErrors.studentList = '请上传学员名单';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: formData.id || Math.random().toString(36).substr(2, 9),
      } as LiveItem);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{live ? '编辑直播' : '新建直播'}</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium">取消</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">直播标题 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="请输入直播标题 (50字以内)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all",
              errors.title ? "border-red-300 ring-red-100" : "border-gray-200 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A]"
            )}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Cover */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">直播封面 <span className="text-red-500">*</span></label>
          <div className="flex items-start gap-6">
            <div className="w-48 aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative group">
              {formData.cover ? (
                <>
                  <img src={formData.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setFormData({ ...formData, cover: '' })} className="text-white hover:text-red-400"><Trash2 size={24} /></button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 cursor-pointer" onClick={() => setFormData({ ...formData, cover: `https://picsum.photos/seed/${Date.now()}/800/450` })}>
                  <Plus className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-400">点击上传封面 (支持图片/动图)</p>
                </div>
              )}
            </div>
            <div className="flex-1 text-xs text-gray-400 space-y-1 py-2">
              <p>• 建议比例 16:9</p>
              <p>• 支持 JPG, PNG, GIF 格式</p>
              <p>• 文件大小不超过 5MB</p>
            </div>
          </div>
          {errors.cover && <p className="text-xs text-red-500">{errors.cover}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">直播开始时间 <span className="text-red-500">*</span></label>
            <input 
              type="datetime-local" 
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={cn(
                "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all",
                errors.startTime ? "border-red-300 ring-red-100" : "border-gray-200 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A]"
              )}
            />
            {errors.startTime && <p className="text-xs text-red-500">{errors.startTime}</p>}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">直播时长 (分钟) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              min="1"
              max="999"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className={cn(
                "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all",
                errors.duration ? "border-red-300 ring-red-100" : "border-gray-200 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A]"
              )}
            />
            {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
          </div>
        </div>

        {/* Courseware */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">选择课件</label>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <FileText size={20} />
              <span className="text-sm">支持 pdf, ppt文件格式，文件大小100M内</span>
            </div>
            <button type="button" className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">上传文件</button>
          </div>
        </div>

        {/* Completion Condition */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700">完成条件</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <select 
              value={formData.completionCondition?.type}
              onChange={(e) => setFormData({ 
                ...formData, 
                completionCondition: { 
                  type: e.target.value as CompletionConditionType,
                  value: e.target.value === CompletionConditionType.STAY_DURATION ? 10 : undefined
                } 
              })}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] focus:outline-none"
            >
              <option value={CompletionConditionType.ENTER_PAGE}>进入页面</option>
              <option value={CompletionConditionType.STAY_DURATION}>页面停留时长达标</option>
            </select>
            {formData.completionCondition?.type === CompletionConditionType.STAY_DURATION && (
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1"
                  value={formData.completionCondition.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    completionCondition: { ...formData.completionCondition!, value: parseInt(e.target.value) }
                  })}
                  className="w-24 px-4 py-3 rounded-xl border border-gray-200 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] focus:outline-none"
                />
                <span className="text-sm text-gray-500">分钟</span>
              </div>
            )}
          </div>
        </div>

        {/* Watching Permission */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700">观看权限 <span className="text-red-500">*</span></label>
          <div className="space-y-4">
            {[
              { label: '允许游客', value: ViewPermission.GUEST },
              { label: '需注册后观看', value: ViewPermission.REGISTERED },
              { label: '允许游客但需填写表单', value: ViewPermission.GUEST_WITH_FORM },
              { label: '指定学员范围', value: ViewPermission.SPECIFIC_STUDENTS },
            ].map(opt => (
              <div key={opt.value} className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div 
                    onClick={() => setFormData({ ...formData, viewPermission: opt.value })}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.viewPermission === opt.value ? "border-[#7DC16A] bg-[#7DC16A]" : "border-gray-300 group-hover:border-gray-400"
                    )}
                  >
                    {formData.viewPermission === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>

                {opt.value === ViewPermission.GUEST_WITH_FORM && formData.viewPermission === ViewPermission.GUEST_WITH_FORM && (
                  <div className="ml-7 p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">选择填写表单</span>
                      <button 
                        type="button"
                        onClick={() => setIsFormModalOpen(true)}
                        className="text-sm text-blue-500 hover:underline font-medium"
                      >
                        {formData.selectedFormId ? '重新选择' : '点击选择'}
                      </button>
                    </div>
                    
                    {selectedForm ? (
                      <div className="p-4 bg-white border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{selectedForm.name}</p>
                            <p className="text-xs text-gray-500">创建人: {selectedForm.creator}</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedFormId: undefined })}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsFormModalOpen(true)}
                        className="py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white transition-all"
                      >
                        <Plus size={24} className="mb-2" />
                        <p className="text-sm">暂未选择表单</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-3">或者快捷选择字段：</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['姓名', '组织', '手机号', '邮箱'].map(field => (
                          <label key={field} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              checked={formData.formFields?.includes(field)}
                              onChange={(e) => {
                                const currentFields = formData.formFields || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, formFields: [...currentFields, field] });
                                } else {
                                  setFormData({ ...formData, formFields: currentFields.filter(f => f !== field) });
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-[#7DC16A] focus:ring-[#7DC16A]/20"
                            />
                            <span className="text-sm text-gray-600">{field}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {opt.value === ViewPermission.SPECIFIC_STUDENTS && formData.viewPermission === ViewPermission.SPECIFIC_STUDENTS && (
                  <div className="ml-7 p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">指定学员名单</span>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsStudentModalOpen(true)}
                          className="flex items-center gap-1.5 text-sm text-blue-500 hover:underline font-medium"
                        >
                          <Plus size={14} />
                          选择学员
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <button 
                          type="button"
                          onClick={() => {
                            // Simulate file upload
                            setUploadedFileName('学员名单_2024.xlsx');
                            setFormData({ ...formData, selectedStudents: MOCK_USERS.slice(0, 3) });
                          }}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                          <Download size={14} className="rotate-180" />
                          导入名单
                        </button>
                      </div>
                    </div>

                    {formData.selectedStudents && formData.selectedStudents.length > 0 ? (
                      <div className="space-y-2">
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                <th className="px-4 py-2 font-medium text-gray-500">姓名</th>
                                <th className="px-4 py-2 font-medium text-gray-500">账号</th>
                                <th className="px-4 py-2 font-medium text-gray-500 text-right">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {formData.selectedStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-2 text-gray-700">{student.name}</td>
                                  <td className="px-4 py-2 text-gray-500">{student.account}</td>
                                  <td className="px-4 py-2 text-right">
                                    <button 
                                      type="button"
                                      onClick={() => setFormData({
                                        ...formData,
                                        selectedStudents: formData.selectedStudents?.filter(s => s.id !== student.id)
                                      })}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-gray-400">已选择 {formData.selectedStudents.length} 名学员</p>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsStudentModalOpen(true)}
                        className="py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white transition-all"
                      >
                        <Users size={24} className="mb-2" />
                        <p className="text-sm">暂未指定学员</p>
                      </div>
                    )}

                    {uploadedFileName && (
                      <div className="flex items-center gap-2 text-xs text-[#7DC16A] bg-[#7DC16A]/10 px-3 py-2 rounded-lg w-fit">
                        <FileText size={14} />
                        <span>{uploadedFileName}</span>
                        <button type="button" onClick={() => setUploadedFileName(null)} className="hover:text-red-500 ml-1"><X size={14} /></button>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400">支持弹窗手动选择学员，或上传包含学员手机号/身份证号的 Excel 文件进行导入。</p>
                    {errors.studentList && <p className="text-xs text-red-500">{errors.studentList}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.viewPermission && <p className="text-xs text-red-500">{errors.viewPermission}</p>}
          {errors.formFields && <p className="text-xs text-red-500">{errors.formFields}</p>}
        </div>

        {/* Introduction */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">直播介绍 <span className="text-red-500">*</span></label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
              <button type="button" className="p-1.5 hover:bg-white rounded transition-colors text-gray-600 font-bold">B</button>
              <button type="button" className="p-1.5 hover:bg-white rounded transition-colors text-gray-600 italic">I</button>
              <button type="button" className="p-1.5 hover:bg-white rounded transition-colors text-gray-600 underline">U</button>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button type="button" className="p-1.5 hover:bg-white rounded transition-colors text-gray-600">图片</button>
            </div>
            <textarea 
              rows={6}
              placeholder="请输入详细的直播介绍内容..."
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className="w-full p-4 focus:outline-none resize-none text-gray-600 leading-relaxed"
            />
          </div>
          {errors.introduction && <p className="text-xs text-red-500">{errors.introduction}</p>}
        </div>

        <div className="pt-6 flex items-center justify-end gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            className="px-12 py-3 bg-[#7DC16A] text-white rounded-2xl font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20"
          >
            保存直播
          </button>
        </div>
      </form>

      <StudentSelectionModal 
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        initialSelected={formData.selectedStudents}
        onSave={(selected) => setFormData({ ...formData, selectedStudents: selected })}
      />

      <FormSelectionModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialSelectedId={formData.selectedFormId}
        onSave={(formId) => setFormData({ ...formData, selectedFormId: formId })}
      />
    </div>
  );
}

function MyFavoritesPage({ lives, favoriteIds, onSelect }: { lives: LiveItem[], favoriteIds: string[], onSelect: (l: LiveItem) => void }) {
  const [activeTab, setActiveTab] = useState('直播收藏');
  const tabs = ['课程收藏', '班级收藏', '考试收藏', '直播收藏'];

  const favoritedLives = useMemo(() => {
    return lives.filter(l => favoriteIds.includes(l.id));
  }, [lives, favoriteIds]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-8">
          {tabs.map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-5 text-sm font-bold cursor-pointer transition-all relative",
                activeTab === tab ? "text-[#7DC16A]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7DC16A]" />}
            </div>
          ))}
        </div>

        <div className="p-8">
          {activeTab === '直播收藏' ? (
            favoritedLives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoritedLives.map(live => (
                  <div 
                    key={live.id}
                    onClick={() => onSelect(live)}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img src={live.cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={getLiveStatus(live)} />
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-[#7DC16A] transition-colors">{live.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{format(parseISO(live.startTime), 'MM-dd HH:mm')}</span>
                        </div>
                        <span className="text-green-500 font-bold">免费</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Heart size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-medium">暂无收藏的直播</p>
              </div>
            )
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-medium">暂无收藏的{activeTab.replace('收藏', '')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LiveStatus }) {
  const config = {
    [LiveStatus.ONGOING]: { label: '正在直播', class: 'bg-red-500 text-white' },
    [LiveStatus.NOT_STARTED]: { label: '未开始', class: 'bg-[#7DC16A] text-white' },
    [LiveStatus.ENDED]: { label: '已结束', class: 'bg-gray-400 text-white' },
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm", config[status].class)}>
      {config[status].label}
    </span>
  );
}

function MyLivesPage({ lives, onSelectLive }: { lives: LiveItem[], onSelectLive: (l: LiveItem) => void }) {
  const [activeTab, setActiveTab] = useState('全部');
  
  const myLives = useMemo(() => {
    // In a real app, this would filter by joined/scheduled lives
    if (activeTab === '全部') return lives;
    if (activeTab === '已预约') return lives.filter(l => getLiveStatus(l) === LiveStatus.NOT_STARTED);
    if (activeTab === '已结束') return lives.filter(l => getLiveStatus(l) === LiveStatus.ENDED);
    return lives;
  }, [lives, activeTab]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">我的直播</h1>
      </div>

      <div className="flex items-center gap-4">
        {['全部', '已预约', '已结束'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myLives.map(live => (
          <div 
            key={live.id} 
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onSelectLive(live)}
          >
            <div className="relative aspect-video">
              <img src={live.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3">
                <StatusBadge status={getLiveStatus(live)} />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{live.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{format(parseISO(live.startTime), 'yyyy-MM-dd HH:mm')}</span>
              </div>
            </div>
          </div>
        ))}
        {myLives.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无直播数据</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormMgmtPage({ onToast }: { onToast: (m: string) => void }) {
  const [forms, setForms] = useState<FormItem[]>(MOCK_FORMS);

  const togglePublish = (id: string) => {
    setForms(forms.map(f => f.id === id ? { ...f, status: f.status === 'published' ? 'draft' : 'published' } : f));
    onToast('操作成功');
  };

  const deleteForm = (id: string) => {
    if (window.confirm('确定要删除该表单吗？')) {
      setForms(forms.filter(f => f.id !== id));
      onToast('已删除');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button 
          className="bg-[#1890ff] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#40a9ff] transition-colors shadow-sm"
          onClick={() => onToast('功能开发中')}
        >
          <Plus size={18} />
          新增活动预约
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">预约名称</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">已预约人数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">签到人数</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">创建人</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">状态</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {forms.map(form => (
              <tr key={form.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{form.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">{form.bookedCount}</td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">{form.checkInCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{form.creator}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={cn(
                    "font-medium",
                    form.status === 'published' ? "text-green-500" : "text-red-400"
                  )}>
                    {form.status === 'published' ? '已发布' : '未发布'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-4">
                    <button 
                      className={cn(form.status === 'published' ? "text-blue-600 hover:underline" : "text-gray-300 cursor-not-allowed")}
                      disabled={form.status === 'draft'}
                      onClick={() => onToast('查看二维码')}
                    >
                      查看二维码
                    </button>
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => togglePublish(form.id)}
                    >
                      {form.status === 'published' ? '取消发布' : '发布'}
                    </button>
                    <button className="text-blue-600 hover:underline" onClick={() => onToast('已复制')}>复制</button>
                    <button 
                      className="text-gray-300 cursor-not-allowed"
                      disabled
                    >
                      导出
                    </button>
                    <button 
                      className={cn(form.status === 'draft' ? "text-blue-600 hover:underline" : "text-gray-300 cursor-not-allowed")}
                      disabled={form.status === 'published'}
                    >
                      编辑
                    </button>
                    <button 
                      className={cn(form.status === 'draft' ? "text-red-500 hover:underline" : "text-gray-300 cursor-not-allowed")}
                      disabled={form.status === 'published'}
                      onClick={() => deleteForm(form.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-4 text-sm text-gray-500">
          <span>共{forms.length}条</span>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
            <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded">1</span>
            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled><ChevronRight size={16} /></button>
          </div>
          <select className="bg-white border border-gray-200 rounded px-2 py-1 outline-none">
            <option>10 条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ClassListPage({ onSelect }: { onSelect: (c: ClassItem) => void }) {
  const [activeCategory, setActiveCategory] = useState('不限');
  const [activeDirection, setActiveDirection] = useState('不限');
  const [activePrice, setActivePrice] = useState('不限');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['不限', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '数字商科', '孪生元宇宙', '软件与信息技术', '双创', '11'];
  const directions = ['不限', 'AI技术', '语音识别', '计算机视觉', 'RPA', 'OCR', '对话机器人', '人脸与人体识别', '视频分析', '图像分类'];
  const prices = ['不限', '收费', '免费'];

  const filteredClasses = MOCK_CLASSES.filter(c => {
    const matchCategory = activeCategory === '不限' || c.category === activeCategory;
    const matchDirection = activeDirection === '不限' || c.direction === activeDirection;
    const matchPrice = activePrice === '不限' || (activePrice === '免费' ? c.price === 0 : c.price > 0);
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchDirection && matchPrice && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 flex items-center px-8 md:px-16">
        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">打造定制化线上学习班级</h1>
          <p className="text-blue-50 text-lg md:text-xl">研修班 / 协作学习 / 交流互动</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <img src="https://picsum.photos/seed/banner/800/400" alt="Banner" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-start gap-4">
          <span className="text-sm font-bold text-gray-400 py-1.5 w-12 shrink-0">领域</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all",
                  activeCategory === cat ? "bg-[#7DC16A] text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-sm font-bold text-gray-400 py-1.5 w-12 shrink-0">方向</span>
          <div className="flex flex-wrap gap-2">
            {directions.map(dir => (
              <button 
                key={dir}
                onClick={() => setActiveDirection(dir)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all",
                  activeDirection === dir ? "bg-[#7DC16A] text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-sm font-bold text-gray-400 py-1.5 w-12 shrink-0">价格</span>
          <div className="flex flex-wrap gap-2">
            {prices.map(p => (
              <button 
                key={p}
                onClick={() => setActivePrice(p)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all",
                  activePrice === p ? "bg-[#7DC16A] text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {['最热', '最新', '推荐'].map(tab => (
            <button key={tab} className={cn("px-4 py-1.5 rounded-lg text-sm font-bold", tab === '最热' ? "bg-[#7DC16A]/10 text-[#7DC16A]" : "text-gray-500 hover:bg-gray-50")}>
              {tab}
            </button>
          ))}
          <label className="flex items-center gap-2 cursor-pointer ml-4">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7DC16A] focus:ring-[#7DC16A]/20" />
            <span className="text-sm text-gray-600">已入班级</span>
          </label>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="请输入关键词"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 focus:border-[#7DC16A] transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#7DC16A] text-white rounded-lg hover:bg-[#69A159] transition-colors">
              <Search size={16} />
            </button>
          </div>
          <button className="px-6 py-2 bg-[#7DC16A] text-white rounded-full font-bold hover:bg-[#69A159] transition-all shadow-lg shadow-[#7DC16A]/20 flex items-center gap-2">
            我的班级 <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredClasses.map(c => (
          <div 
            key={c.id} 
            onClick={() => onSelect(c)}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={c.cover} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[3rem]">{c.name}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye size={14} /> {c.viewCount}
                </div>
                <div className={cn("font-bold", c.price === 0 ? "text-[#7DC16A]" : "text-red-500")}>
                  {c.price === 0 ? '免费' : `${c.price.toFixed(2)}元`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassDetailPage({ classId, onBack, onToast }: { classId: string, onBack: () => void, onToast: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'course' | 'announcement' | 'discussion' | 'files'>('course');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(MOCK_ANNOUNCEMENTS);
  const [discussions, setDiscussions] = useState<DiscussionItem[]>(MOCK_DISCUSSIONS);
  const [discussionFilter, setDiscussionFilter] = useState<'all' | 'topic' | 'question'>('all');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [groupFiles, setGroupFiles] = useState<GroupFileItem[]>(MOCK_GROUP_FILES);
  const [previewFile, setPreviewFile] = useState<GroupFileItem | null>(null);

  const classItem = MOCK_CLASSES.find(c => c.id === classId) || MOCK_CLASSES[0];

  const handleAnnouncementClick = (ann: AnnouncementItem) => {
    setSelectedAnnouncement(ann);
    setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, isRead: true } : a));
  };

  const handlePostDiscussion = (title: string, content: string, type: 'topic' | 'question') => {
    const newItem: DiscussionItem = {
      id: Date.now().toString(),
      type,
      title,
      author: '普通用户',
      avatar: 'https://i.pravatar.cc/150?u=user',
      content,
      time: new Date().toLocaleString(),
      floor: discussions.length + 1,
      likes: 0,
      viewCount: 0,
      source: '来源: 班级研修 - 讨论区',
      replies: []
    };
    setDiscussions([newItem, ...discussions]);
    setIsAddModalOpen(false);
    onToast('发布成功');
  };

  const handlePostReply = (discussionId: string, content: string, parentReplyId?: string) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        const newReply: DiscussionReply = {
          id: Date.now().toString(),
          author: '普通用户',
          avatar: 'https://i.pravatar.cc/150?u=user',
          content,
          time: new Date().toLocaleString(),
          likes: 0,
          replies: []
        };

        if (!parentReplyId) {
          return { ...d, replies: [...d.replies, newReply] };
        } else {
          // Recursive update for nested replies
          const updateReplies = (replies: DiscussionReply[]): DiscussionReply[] => {
            return replies.map(r => {
              if (r.id === parentReplyId) {
                return { ...r, replies: [...(r.replies || []), newReply] };
              }
              if (r.replies && r.replies.length > 0) {
                return { ...r, replies: updateReplies(r.replies) };
              }
              return r;
            });
          };
          return { ...d, replies: updateReplies(d.replies) };
        }
      }
      return d;
    }));
  };

  const handlePinDiscussion = (id: string) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d));
  };

  const handleDeleteDiscussion = (id: string) => {
    if (window.confirm('确定要删除该讨论吗？')) {
      setDiscussions(prev => prev.filter(d => d.id !== id));
    }
  };

  const handlePinFile = (id: string) => {
    setGroupFiles(prev => prev.map(f => f.id === id ? { ...f, isPinned: !f.isPinned } : f));
  };

  const handleDeleteFile = (id: string) => {
    if (window.confirm('确定要删除该文件吗？')) {
      setGroupFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleResourceSelect = (files: ResourceFile[]) => {
    const newFiles: GroupFileItem[] = files.map(f => ({
      id: Date.now().toString() + f.id,
      name: f.name,
      size: f.size,
      uploader: '王水亮',
      uploaderRole: '老师',
      time: new Date().toLocaleString(),
      type: f.type as any
    }));
    setGroupFiles([...newFiles, ...groupFiles]);
  };

  const sortedFiles = [...groupFiles].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const roles = ['班主任', '老师', '助教', '学生'];
    const roleA = roles.indexOf(a.uploaderRole || '学生');
    const roleB = roles.indexOf(b.uploaderRole || '学生');
    return roleA - roleB;
  });

  const currentUserRole = isManagementMode ? '班主任' : '学生';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span className="hover:text-[#7DC16A] cursor-pointer" onClick={onBack}>班级研修</span>
        <ChevronRight size={14} />
        <span className="text-gray-600 font-medium">{classItem.name}</span>
      </div>

      {/* Class Header Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden bg-gray-100 relative group">
          <img src={classItem.cover} alt={classItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <ImageIcon size={24} />
             </div>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{classItem.name}</h1>
            <div className="flex items-center gap-3 text-gray-400">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Share2 size={20} /></button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Settings size={20} /></button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">学习进度</span>
              <span className="font-bold text-[#7DC16A]">{classItem.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#7DC16A] transition-all duration-500" style={{ width: `${classItem.progress}%` }} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-48 border-l border-gray-100 pl-8 flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <UserIcon size={24} />
          </div>
          <p className="text-sm font-bold text-gray-800">学员({classItem.studentCount})</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {[
                { id: 'course', label: `课程 (${classItem.courses.length})` },
                { id: 'announcement', label: '班级公告' },
                { id: 'discussion', label: '讨论区' },
                { id: 'files', label: '班级文件' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  onDoubleClick={() => {
                    if (tab.id === 'discussion' || tab.id === 'files') {
                      setIsManagementMode(!isManagementMode);
                      onToast(isManagementMode ? '已切换为普通用户角色' : '已切换为班主任角色');
                    }
                  }}
                  className={cn(
                    "px-8 py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                    activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-blue-600" />}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'course' && (
                <div className="space-y-8">
                  {/* Courses Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-600 rounded-full" />
                      课程列表
                    </h3>
                    <div className="space-y-4">
                      {classItem.courses.map(course => (
                        <div key={course.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                          <div className="w-40 aspect-video rounded-xl overflow-hidden bg-gray-200">
                            <img src={course.cover} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <h3 className="font-bold text-gray-800">{course.title}</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${course.progress}%` }} />
                              </div>
                              <span className="text-xs font-bold text-gray-400">{course.progress}%</span>
                            </div>
                          </div>
                          <ChevronDown className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-8">
                  {selectedDiscussionId ? (
                    <DiscussionDetailView 
                      discussion={discussions.find(d => d.id === selectedDiscussionId)!}
                      onBack={() => setSelectedDiscussionId(null)}
                      onReply={(content, parentReplyId) => handlePostReply(selectedDiscussionId, content, parentReplyId)}
                      isManagementMode={isManagementMode}
                      onDelete={handleDeleteDiscussion}
                      onPin={handlePinDiscussion}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {[
                            { id: 'all', label: '全部' },
                            { id: 'topic', label: '话题' },
                            { id: 'question', label: '问答' }
                          ].map(filter => (
                            <button 
                              key={filter.id}
                              onClick={() => setDiscussionFilter(filter.id as any)}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                discussionFilter === filter.id ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"
                              )}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                        >
                          <Plus size={18} /> 新增讨论
                        </button>
                      </div>

                      <div className="space-y-8">
                        {discussions
                          .filter(d => discussionFilter === 'all' || d.type === discussionFilter)
                          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                          .map(disc => (
                            <div 
                              key={disc.id} 
                              onClick={() => setSelectedDiscussionId(disc.id)}
                              className="group space-y-4 border-b border-gray-50 pb-8 last:border-0 cursor-pointer hover:bg-gray-50/50 p-4 -mx-4 rounded-2xl transition-all"
                            >
                              <div className="flex gap-4 relative">
                                <img src={disc.avatar} alt={disc.author} className="w-12 h-12 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800">{disc.author}</span>
                                    {disc.role && (
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                                        disc.role === '班主任' ? "bg-red-500" : disc.role === '老师' ? "bg-blue-500" : "bg-orange-500"
                                      )}>
                                        {disc.role}
                                      </span>
                                    )}
                                    {disc.isPinned && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">置顶</span>
                                    )}
                                    {disc.isEssence && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">精华</span>
                                    )}
                                    {isManagementMode && (
                                      <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                          onClick={() => handlePinDiscussion(disc.id)}
                                          className="text-xs text-blue-500 hover:underline font-bold"
                                        >
                                          {disc.isPinned ? '取消置顶' : '置顶'}
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteDiscussion(disc.id)}
                                          className="text-xs text-red-500 hover:underline font-bold"
                                        >
                                          删除
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                    {disc.type === 'question' ? (
                                      <HelpCircle size={16} className="text-orange-500" />
                                    ) : (
                                      <MessageCircle size={16} className="text-blue-500" />
                                    )}
                                    {disc.title}
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-2">{disc.content}</p>
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center gap-3">
                                      <span>{disc.floor}楼</span>
                                      <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{disc.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Eye size={12} />
                                        <span>{disc.viewCount || 0}</span>
                                      </div>
                                      {disc.source && <span>{disc.source}</span>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-1">
                                        <ThumbsUp size={14} />
                                        <span>{disc.likes || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MessageCircle size={14} />
                                        <span>{disc.replies.length}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'announcement' && (
                <div className="space-y-4">
                  {selectedAnnouncement ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <button 
                        onClick={() => setSelectedAnnouncement(null)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <ChevronLeft size={16} /> 返回列表
                      </button>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">{selectedAnnouncement.title}</h2>
                        <p className="text-xs text-gray-400">{selectedAnnouncement.time}</p>
                        <div className="h-px bg-gray-100" />
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {announcements.map(ann => (
                        <div 
                          key={ann.id} 
                          onClick={() => handleAnnouncementClick(ann)}
                          className="py-4 flex items-center justify-between group cursor-pointer hover:bg-gray-50 px-4 -mx-4 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {!ann.isRead && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                            <span className={cn("font-medium", ann.isRead ? "text-gray-500" : "text-gray-800")}>{ann.title}</span>
                          </div>
                          <span className="text-xs text-gray-400">{ann.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">共 {sortedFiles.length} 个文件</span>
                    <button 
                      onClick={() => setShowResourceModal(true)}
                      className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> 上传文件
                    </button>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-400 font-bold">
                        <tr>
                          <th className="px-6 py-3">文件名</th>
                          <th className="px-6 py-3">大小</th>
                          <th className="px-6 py-3">上传者</th>
                          <th className="px-6 py-3">时间</th>
                          <th className="px-6 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sortedFiles.map(file => (
                          <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-8 h-8 rounded flex items-center justify-center text-white",
                                  file.type === 'pdf' ? "bg-red-400" : file.type === 'doc' ? "bg-blue-400" : "bg-gray-400"
                                )}>
                                  <FileText size={16} />
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">{file.name}</span>
                                    {file.isPinned && <span className="text-[10px] bg-blue-50 text-blue-500 px-1 rounded">置顶</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{file.size}</td>
                            <td className="px-6 py-4 text-gray-500">{file.uploader}</td>
                            <td className="px-6 py-4 text-gray-500">{format(parseISO(file.time.includes(':') ? file.time.replace(' ', 'T') : file.time), 'yy-MM-dd HH:mm')}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-4">
                                {(file.type === 'pdf' || file.type === 'doc') && (
                                  <button 
                                    onClick={() => setPreviewFile(file)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors" 
                                    title="预览"
                                  >
                                    <Eye size={18} />
                                  </button>
                                )}
                                {isManagementMode && (
                                  <>
                                    <button 
                                      onClick={() => handlePinFile(file.id)}
                                      className="text-gray-400 hover:text-blue-500 transition-colors"
                                      title={file.isPinned ? '取消置顶' : '置顶'}
                                    >
                                      {file.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteFile(file.id)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                      title="删除"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </>
                                )}
                                <button className="text-gray-400 hover:text-blue-500 transition-colors" title="下载">
                                  <Download size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Sign In Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={24} />
                <span className="text-lg font-bold text-gray-800">04月14日</span>
             </div>
             <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">签到</button>
          </div>

          {/* Teacher Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-3">班主任</h3>
            <div className="flex flex-col items-center py-4 space-y-3 text-center">
              <img src={classItem.classTeacher.avatar} alt={classItem.classTeacher.name} className="w-16 h-16 rounded-full border-2 border-blue-50" referrerPolicy="no-referrer" />
              <div>
                <p className="font-bold text-gray-800">{classItem.classTeacher.name}</p>
                {classItem.classTeacher.title && <p className="text-xs text-gray-400 mt-1">{classItem.classTeacher.title}</p>}
              </div>
              {classItem.classTeacher.intro && <p className="text-xs text-gray-500 line-clamp-2 px-4">{classItem.classTeacher.intro}</p>}
            </div>
          </div>

          {/* Students Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-3">班级学员 ({classItem.studentCount})</h3>
            <div className="grid grid-cols-4 gap-4 py-2">
              {classItem.students.map(student => (
                <div key={student.id} className="flex flex-col items-center gap-1">
                  <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                  <p className="text-[10px] text-gray-500 truncate w-full text-center">{student.name}</p>
                </div>
              ))}
              <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResourceSelectionModal 
        isOpen={showResourceModal} 
        onClose={() => setShowResourceModal(false)} 
        onSelect={handleResourceSelect} 
      />

      <DiscussionAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handlePostDiscussion}
      />

      <FilePreviewModal 
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}

function FilePreviewModal({ file, onClose }: { file: GroupFileItem | null, onClose: () => void }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
              file.type === 'pdf' ? "bg-red-500 shadow-red-500/20" : "bg-blue-500 shadow-blue-500/20"
            )}>
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{file.name}</h3>
              <p className="text-xs text-gray-400">文件预览 · {file.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center">
          {/* Simulating a document preview */}
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-12 space-y-8 min-h-[1000px]">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-5/6" />
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-4/5" />
            </div>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 italic">
              [ 此处为 {file.type.toUpperCase()} 内容预览区域 ]
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-2/3" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-32 bg-gray-50 rounded-xl" />
              <div className="h-32 bg-gray-50 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-50 rounded w-full" />
              <div className="h-4 bg-gray-50 rounded w-5/6" />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-white flex items-center justify-center gap-8 text-sm text-gray-400">
          <span>第 1 / 12 页</span>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-30" disabled><ChevronLeft size={20} /></button>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
          </div>
          <div className="flex items-center gap-4 border-l pl-8">
            <button className="hover:text-gray-600">缩小</button>
            <span className="text-gray-300">100%</span>
            <button className="hover:text-gray-600">放大</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DiscussionAddModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (title: string, content: string, type: 'topic' | 'question') => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'topic' | 'question'>('topic');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">新增讨论</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">选择类型</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setType('topic')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  type === 'topic' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-50 text-gray-500 border border-gray-100"
                )}
              >
                话题讨论
              </button>
              <button 
                onClick={() => setType('question')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  type === 'question' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-gray-50 text-gray-500 border border-gray-100"
                )}
              >
                提问
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">标题</label>
            <input 
              type="text" 
              placeholder="请输入标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">内容</label>
            <textarea 
              placeholder="请输入内容..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-50 resize-none"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-8 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">取消</button>
          <button 
            disabled={!title.trim() || !content.trim()}
            onClick={() => onSave(title, content, type)}
            className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发布
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DiscussionDetailView({ 
  discussion, 
  onBack, 
  onReply, 
  isManagementMode, 
  onDelete, 
  onPin 
}: { 
  discussion: DiscussionItem, 
  onBack: () => void, 
  onReply: (content: string, parentReplyId?: string) => void,
  isManagementMode: boolean,
  onDelete: (id: string) => void,
  onPin: (id: string) => void
}) {
  const [replyContent, setReplyContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyToName, setReplyToName] = useState<string | null>(null);

  const handleReply = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent, replyToId || undefined);
    setReplyContent('');
    setReplyToId(null);
    setReplyToName(null);
  };

  const renderReplies = (replies: DiscussionReply[], depth = 0) => {
    return (
      <div className={cn("space-y-6", depth > 0 && "mt-4 ml-12 border-l-2 border-gray-50 pl-6")}>
        {replies.map(reply => (
          <div key={reply.id} className="space-y-3">
            <div className="flex gap-3">
              <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800">{reply.author}</span>
                  {reply.role && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[8px] font-bold text-white",
                      reply.role === '班主任' ? "bg-red-500" : reply.role === '老师' ? "bg-blue-500" : "bg-orange-500"
                    )}>
                      {reply.role}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">{reply.time}</span>
                </div>
                <p className="text-sm text-gray-600">{reply.content}</p>
                <div className="flex items-center gap-4 text-[10px] text-gray-400">
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <ThumbsUp size={10} />
                    <span>{reply.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setReplyToId(reply.id);
                      setReplyToName(reply.author);
                    }}
                    className="hover:text-blue-500 transition-colors"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
            {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors font-bold"
        >
          <ChevronLeft size={18} /> 返回列表
        </button>
        {isManagementMode && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onPin(discussion.id)}
              className="text-sm text-blue-500 hover:underline font-bold"
            >
              {discussion.isPinned ? '取消置顶' : '置顶'}
            </button>
            <button 
              onClick={() => {
                onDelete(discussion.id);
                onBack();
              }}
              className="text-sm text-red-500 hover:underline font-bold"
            >
              删除
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex gap-4">
          <img src={discussion.avatar} alt={discussion.author} className="w-14 h-14 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 text-lg">{discussion.author}</span>
              {discussion.role && (
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                  discussion.role === '班主任' ? "bg-red-500" : discussion.role === '老师' ? "bg-blue-500" : "bg-orange-500"
                )}>
                  {discussion.role}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{discussion.time}</span>
            </div>
                                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    {discussion.type === 'question' ? (
                                      <HelpCircle size={24} className="text-orange-500" />
                                    ) : (
                                      <MessageCircle size={24} className="text-blue-500" />
                                    )}
                                    {discussion.title}
                                  </h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{discussion.content}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>{discussion.viewCount || 0} 阅读</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={16} />
                  <span>{discussion.replies.length} 回复</span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all font-bold">
                <ThumbsUp size={18} />
                <span>赞 ({discussion.likes || 0})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          全部回复 ({discussion.replies.length})
        </h3>
        
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          {discussion.replies.length > 0 ? renderReplies(discussion.replies) : (
            <div className="py-12 text-center text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>暂无回复，快来抢沙发吧~</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Reply Bar */}
      <div className="sticky bottom-6 left-0 right-0 z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-100 shadow-2xl flex items-center gap-4">
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 px-4 py-2 flex items-center gap-2">
            {replyToName && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">
                回复 @{replyToName}
                <button onClick={() => { setReplyToId(null); setReplyToName(null); }}><X size={12} /></button>
              </div>
            )}
            <input 
              type="text" 
              placeholder="说点什么吧..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm py-1"
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            />
          </div>
          <button 
            onClick={handleReply}
            disabled={!replyContent.trim()}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            发表
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (files: ResourceFile[]) => void 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [localFiles, setLocalFiles] = useState<ResourceFile[]>([]);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

  const handleLocalUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newItem: ResourceFile = {
          id: 'local-' + Date.now(),
          name: file.name,
          type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' : 'other',
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          uploadTime: new Date().toLocaleString()
        };
        setLocalFiles([...localFiles, newItem]);
        setSelectedIds([...selectedIds, newItem.id]);
      }
    };
    input.click();
  };

  const startEditing = (file: ResourceFile) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const saveRename = () => {
    if (!editingName.trim()) return;
    setLocalFiles(localFiles.map(f => f.id === editingFileId ? { ...f, name: editingName } : f));
    setEditingFileId(null);
  };

  const allFiles = [...MOCK_RESOURCES, ...localFiles];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[80vh]"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold">选择文件</h3>
            <button 
              onClick={handleLocalUpload}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-1"
            >
              <Plus size={14} /> 本地上传
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-3 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === allFiles.length && allFiles.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(allFiles.map(r => r.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="p-3 font-medium text-gray-500">文件名</th>
                <th className="p-3 font-medium text-gray-500">大小</th>
                <th className="p-3 font-medium text-gray-500">上传时间</th>
                <th className="p-3 font-medium text-gray-500 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allFiles.map(file => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(file.id)}
                      onChange={() => {
                        if (selectedIds.includes(file.id)) {
                          setSelectedIds(selectedIds.filter(id => id !== file.id));
                        } else {
                          setSelectedIds([...selectedIds, file.id]);
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      {editingFileId === file.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="border rounded px-2 py-0.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                          />
                          <button onClick={saveRename} className="text-blue-500 text-xs font-bold">保存</button>
                        </div>
                      ) : (
                        <span>{file.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">{file.size}</td>
                  <td className="p-3 text-gray-500">{file.uploadTime}</td>
                  <td className="p-3 text-right">
                    {file.id.startsWith('local-') && !editingFileId && (
                      <button 
                        onClick={() => startEditing(file)}
                        className="text-blue-500 hover:underline text-xs"
                      >
                        重命名
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button 
            onClick={() => {
              const selectedFiles = allFiles.filter(r => selectedIds.includes(r.id));
              onSelect(selectedFiles);
              onClose();
            }} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            确定 ({selectedIds.length})
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function UploadMaterialModal({ isOpen, onClose, onUpload }: { isOpen: boolean, onClose: () => void, onUpload: (title: string, file: File) => void }) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.split('.')[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile && title) {
      onUpload(title, selectedFile);
      setTitle('');
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">上传教学资料</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Title Input */}
          <div className="flex gap-4">
            <div className="w-24 pt-2 text-right">
              <span className="text-red-500 mr-1">*</span>
              <span className="text-gray-600 font-medium">标题名称</span>
            </div>
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="请输入标题名称"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <p className="text-xs text-gray-400">建议标题字数控制在15字以内</p>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="flex gap-4">
            <div className="w-24 pt-2 text-right">
              <span className="text-red-500 mr-1">*</span>
              <span className="text-gray-600 font-medium">文档</span>
            </div>
            <div className="flex-1">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4",
                  selectedFile ? "border-blue-500 bg-blue-50/30" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                    <span className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>将文件拖拽至此，或</span>
                      <button className="px-4 py-1.5 bg-[#10B981] text-white rounded font-medium hover:bg-[#0E9E6E] transition-all">
                        上传文件
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-8 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-white transition-all">取消</button>
          <button 
            onClick={handleSubmit}
            disabled={!selectedFile || !title}
            className={cn(
              "px-8 py-2.5 rounded-xl font-bold transition-all",
              selectedFile && title ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            确定
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TeachingCenterPage() {
  const [activeNav, setActiveNav] = useState('materials');
  const [materials, setMaterials] = useState<ResourceFile[]>(MOCK_RESOURCES);
  const [editingFile, setEditingFile] = useState<ResourceFile | null>(null);
  const [newName, setNewName] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || m.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [materials, searchQuery, filterType]);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该文件吗？')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const handleRename = () => {
    if (!newName.trim() || !editingFile) return;
    setMaterials(materials.map(m => m.id === editingFile.id ? { ...m, name: newName } : m));
    setEditingFile(null);
    setNewName('');
  };

  const handleUpload = (title: string, file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'other' = 'other';
    if (ext === 'pdf') fileType = 'pdf';
    else if (['doc', 'docx'].includes(ext)) fileType = 'doc';
    else if (['xls', 'xlsx'].includes(ext)) fileType = 'xls';
    else if (['ppt', 'pptx'].includes(ext)) fileType = 'ppt';

    const newItem: ResourceFile = {
      id: Date.now().toString(),
      name: title + (file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : ''),
      type: fileType,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      uploadTime: new Date().toLocaleString()
    };
    setMaterials([newItem, ...materials]);
  };

  const handleResourceSelect = (files: ResourceFile[]) => {
    // In TeachingCenterPage, selecting from library might mean copying or just adding
    // For now, we just add them to the list (simulating a copy)
    const newFiles = files.map(f => ({
      ...f,
      id: Date.now().toString() + f.id,
      uploadTime: new Date().toLocaleString()
    }));
    setMaterials([...newFiles, ...materials]);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 shrink-0 space-y-2">
        {[
          { id: 'materials', label: '教学资料', icon: FileText },
          { id: 'courses', label: '在教课程', icon: BookOpen },
          { id: 'classes', label: '在授班级', icon: Users },
          { id: 'qa', label: '学员问答', icon: HelpCircle },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeNav === item.id ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[600px]">
        {activeNav === 'materials' && (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">教学资料</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="按文件名称搜索"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                      <option value="all">全部类型</option>
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                      <option value="ppt">PPT</option>
                      <option value="xls">XLS</option>
                      <option value="other">其他</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Plus size={18} /> 本地上传
                  </button>
                </div>
              </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">文件名称</th>
                    <th className="px-6 py-4">文件类型</th>
                    <th className="px-6 py-4">上传时间</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMaterials.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <span className="font-medium text-gray-700">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 uppercase">{file.type}</td>
                      <td className="px-6 py-4 text-gray-500">{file.uploadTime}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => { setEditingFile(file); setNewName(file.name); }}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(file.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeNav !== 'materials' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <BookOpen size={40} className="opacity-20" />
            </div>
            <p>该板块正在开发中...</p>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <AnimatePresence>
        {editingFile && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-800">重命名文件</h3>
              <input 
                type="text" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="请输入新文件名"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditingFile(null)} className="px-6 py-2 border rounded-xl hover:bg-gray-50 transition-all">取消</button>
                <button onClick={handleRename} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">确定</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ResourceSelectionModal 
        isOpen={showResourceModal} 
        onClose={() => setShowResourceModal(false)} 
        onSelect={handleResourceSelect} 
      />

      <UploadMaterialModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

function PRDPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="space-y-4 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold text-gray-900">产品需求说明书 (PRD)</h1>
        <p className="text-gray-500 text-lg">版本：v1.0 | 状态：迭代开发中 | 最后更新：2026-03-14</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-[#7DC16A] rounded-full" />
          1. 项目概述
        </h2>
        <p className="text-gray-600 leading-relaxed">
          本项目是一个在线教育直播平台，旨在为学员提供高质量的直播课程学习体验，并为管理员提供便捷的课程与直播管理后台。本次迭代重点在于构建核心的直播展示、详情查看及后台管理链路。
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-[#7DC16A] rounded-full" />
          2. 迭代开发范围
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: '学员端首页', desc: '展示热门直播及平台概况' },
            { title: '直播中心', desc: '列表展示所有直播，支持分类筛选' },
            { title: '直播详情页', desc: '展示直播内容、讲师信息及预约入口' },
            { title: '管理后台-直播管理', desc: '直播课程的增删改查与预览' },
            { title: '管理后台-直播统计', desc: '直播观看人数、时长等实时数据分析' },
            { title: '管理后台-课程统计', desc: '课程学员数、完成率及学习进度概览' },
            { title: '管理后台-租户直播管理', desc: '多租户模式下的直播资源调度与管理' },
            { title: '个人中心-我的收藏', desc: '学员收藏的直播课程列表' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-[#7DC16A] rounded-full" />
          3. 详细功能说明
        </h2>

        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.1 首页 (Home)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>热门直播卡片：</strong> 采用大卡片设计，展示直播封面、标题、开始时间。</li>
              <li><strong>状态标识：</strong> 实时显示“直播中”、“未开始”或“已结束”状态。</li>
              <li><strong>交互跳转：</strong> 点击卡片进入直播详情页。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.2 直播中心 (Live Center)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>分类切换：</strong> 支持“全部”、“正在直播”、“未开始”、“已结束”四种状态筛选。</li>
              <li><strong>智能排序：</strong> 正在直播优先展示，其次按开始时间排序。</li>
              <li><strong>强提醒弹窗：</strong> 当有正在进行的直播时，进入页面自动弹出提醒。</li>
              <li><strong>布局优化：</strong> 响应式网格布局，在不同屏幕下自动调整列数。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.3 直播详情 (Live Detail)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>核心信息：</strong> 展示直播标题、倒计时（未开始时）、简介。</li>
              <li><strong>预约/进入：</strong> 根据直播状态显示“立即进入”或“预约直播”。</li>
              <li><strong>收藏功能：</strong> 支持学员收藏/取消收藏，状态实时反馈。</li>
              <li><strong>信息补全：</strong> 首次进入直播需填写个人信息（姓名、手机号、组织等）。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.4 直播管理 (Live Management)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>列表展示：</strong> 分页展示所有直播课程，支持按标题、讲师、状态进行搜索与筛选。</li>
              <li><strong>创建与编辑：</strong> 支持设置直播标题、封面图、开始/结束时间、讲师介绍、直播简介及推流地址。</li>
              <li><strong>预览功能：</strong> 管理员可直接跳转至学员端详情页预览直播展示效果。</li>
              <li><strong>状态控制：</strong> 支持手动开启/关闭直播，或设置定时自动发布。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.5 直播统计 (Live Statistics)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>实时监控：</strong> 实时展示当前在线人数、累计观看人次、峰值人数。</li>
              <li><strong>互动分析：</strong> 统计直播间的点赞数、评论数及收藏数。</li>
              <li><strong>用户留存：</strong> 通过图表展示用户进入与离开的时间分布，分析内容吸引力。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.6 课程统计 (Course Statistics)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>学员概览：</strong> 统计课程总学员数、新增学员数及活跃学员比例。</li>
              <li><strong>进度追踪：</strong> 展示学员的平均学习进度、课程完成人数及未完成人数分布。</li>
              <li><strong>考核反馈：</strong> 统计课程关联的作业、考试的提交率及平均分。</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">3.7 租户直播管理 (Tenant Live Management)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>租户隔离：</strong> 支持多租户架构，不同租户仅能管理属于自身的直播资源。</li>
              <li><strong>资源分配：</strong> 超级管理员可查看各租户的直播并发数、存储空间使用情况。</li>
              <li><strong>统一调度：</strong> 支持跨租户的直播内容分发或推荐设置。</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-[#7DC16A] rounded-full" />
          4. 设计规范
        </h2>
        <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7DC16A] rounded-lg" />
            <div>
              <p className="font-bold text-gray-800">主色调：#7DC16A</p>
              <p className="text-sm text-gray-500">用于主按钮、激活状态、品牌标识</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5F7FA] border border-gray-200 rounded-lg" />
            <div>
              <p className="font-bold text-gray-800">背景色：#F5F7FA</p>
              <p className="text-sm text-gray-500">用于页面大背景，营造干净清爽的视觉感</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
            <strong>字体：</strong> 优先使用系统默认无衬线字体 (Inter, system-ui)，标题加粗，正文行高 1.6。
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-8 bg-[#7DC16A] rounded-full" />
          5. 交互要求
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-600">
          <li><strong>加载反馈：</strong> 页面切换及数据提交时应有明确的加载状态或 Toast 提示。</li>
          <li><strong>空状态处理：</strong> 当列表无数据时，展示统一的空状态插画及文字提示。</li>
          <li><strong>响应式适配：</strong> 兼容移动端浏览，侧边栏在移动端自动隐藏，导航栏支持横向滚动或折叠。</li>
          <li><strong>动画效果：</strong> 弹窗、菜单切换应带有平滑的淡入淡出或位移动画。</li>
        </ul>
      </section>
    </div>
  );
}

// --- Admin Dashboard Components ---

function OrgUserManagementPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredUsers = MOCK_ORG_USERS.filter(user => {
    const matchesKeyword = user.realName.includes(searchKeyword) || user.loginAccount.includes(searchKeyword) || user.phone.includes(searchKeyword);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesKeyword && matchesRole;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">机构用户管理</h2>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 shrink-0">关键词：</span>
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="请输入关键词"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 shrink-0">所属角色：</span>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-64 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
            >
              <option value="">请选择所属角色</option>
              <option value="学员">学员</option>
              <option value="教师">教师</option>
              <option value="管理员">管理员</option>
            </select>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Search size={18} />
              搜索
            </button>
            <button 
              onClick={() => { setSearchKeyword(''); setRoleFilter(''); }}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              <RotateCcw size={18} />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all text-sm">
          <Plus size={16} />
          添加用户
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-all text-sm">
          <Plus size={16} />
          批量添加用户
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-all text-sm">
          <RefreshCw size={16} />
          批量修改用户角色
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-all text-sm">
          <Trash2 size={16} />
          批量删除用户
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-all text-sm">
          <Download size={16} />
          导出用户
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0 z-10">
              <tr className="whitespace-nowrap">
                <th className="px-6 py-4 w-12 sticky left-0 bg-gray-50 z-20">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4">序号</th>
                <th className="px-6 py-4">真实姓名</th>
                <th className="px-6 py-4">登录账号</th>
                <th className="px-6 py-4">手机号码</th>
                <th className="px-6 py-4">所属角色</th>
                <th className="px-6 py-4">微信openID</th>
                <th className="px-6 py-4">微信昵称</th>
                <th className="px-6 py-4">性别</th>
                <th className="px-6 py-4">身份证号</th>
                <th className="px-6 py-4">学校</th>
                <th className="px-6 py-4">学历</th>
                <th className="px-6 py-4">职位</th>
                <th className="px-6 py-4">创建时间</th>
                <th className="px-6 py-4">账户状态</th>
                <th className="px-6 py-4 text-right sticky right-0 bg-gray-50 z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group whitespace-nowrap">
                  <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{user.realName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.loginAccount}</td>
                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{user.role}</td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{user.wechatOpenId}</td>
                  <td className="px-6 py-4 text-gray-600">{user.wechatNickname}</td>
                  <td className="px-6 py-4 text-gray-600">{user.gender}</td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{user.idCard}</td>
                  <td className="px-6 py-4 text-gray-600">{user.school}</td>
                  <td className="px-6 py-4 text-gray-600">{user.education}</td>
                  <td className="px-6 py-4 text-gray-600">{user.position}</td>
                  <td className="px-6 py-4 text-gray-500">{user.createTime}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-medium">{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50 z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-blue-500 hover:text-blue-700 font-medium">编辑</button>
                      <button className="text-blue-500 hover:text-blue-700 font-medium">禁用</button>
                      <button className="text-blue-500 hover:text-blue-700 font-medium">重置密码</button>
                      <button className="text-red-500 hover:text-red-700 font-medium">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TimeRangeSelector({ 
  range, 
  onChange, 
  color = "blue",
  showCustom = true 
}: { 
  range: string, 
  onChange: (r: any) => void, 
  color?: string,
  showCustom?: boolean
}) {
  const [showPicker, setShowPicker] = useState(false);
  const ranges = [
    { id: 'day', label: '日' },
    { id: 'week', label: '周' },
    { id: 'month', label: '月' }
  ];
  if (showCustom) ranges.push({ id: 'custom', label: '自定义' });

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600"
  };

  return (
    <div className="relative flex bg-gray-50 p-1 rounded-xl border border-gray-100">
      {ranges.map(r => (
        <button 
          key={r.id}
          onClick={() => {
            if (r.id === 'custom') {
              setShowPicker(!showPicker);
            } else {
              onChange(r.id);
              setShowPicker(false);
            }
          }}
          className={cn(
            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
            range === r.id ? `bg-white ${colorClasses[color as keyof typeof colorClasses]} shadow-sm` : "text-gray-400 hover:text-gray-600"
          )}
        >
          {r.label}
        </button>
      ))}
      {showPicker && (
        <CustomDatePicker 
          onSelect={(start, end) => {
            onChange('custom');
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

function CustomDatePicker({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (start: string, end: string) => void, 
  onClose: () => void 
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = () => {
    if (start && end) {
      onSelect(start, end);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 space-y-4 min-w-[240px]">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400">开始日期 (60天内)</label>
        <input 
          type="date" 
          value={start}
          onChange={e => setStart(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400">结束日期</label>
        <input 
          type="date" 
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 py-2 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-all">取消</button>
        <button onClick={handleSubmit} className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">确定</button>
      </div>
    </div>
  );
}

function DataViewModal({ 
  isOpen, 
  onClose, 
  title, 
  data, 
  columns 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  data: any[], 
  columns: { key: string, label: string, format?: (val: any) => string }[] 
}) {
  if (!isOpen) return null;

  const handleExport = () => {
    const csv = [
      columns.map(c => c.label).join(','),
      ...data.map(row => columns.map(c => {
        const val = row[c.key];
        return c.format ? c.format(val) : val;
      }).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[32px] w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}明细</h3>
              <p className="text-xs text-gray-400 mt-1">共 {data.length} 条统计记录</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#7DC16A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7DC16A]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Download size={16} />
                导出CSV
              </button>
              <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-50">
                  {columns.map(c => (
                    <th key={c.key} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    {columns.map(c => (
                      <td key={c.key} className="px-6 py-4 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                        {c.format ? c.format(row[c.key]) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AdminDashboardPage({ 
  activeModule
}: { 
  activeModule: string; 
  setActiveModule: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Module Content */}
      <div className="min-w-0">
        {activeModule === 'overview' && <DashboardOverview />}
        {activeModule === 'user' && <UserDashboard />}
        {activeModule === 'course' && <CourseDashboard />}
        {activeModule === 'class' && <ClassDashboard />}
        {activeModule === 'cert' && <CertDashboard />}
        {activeModule === 'question' && <QuestionDashboard />}
        {activeModule === 'learning' && <LearningDashboard />}
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [globalRange, setGlobalRange] = useState<'day' | 'week' | 'month'>('month');
  const [selectedSubValue, setSelectedSubValue] = useState('2023-04');

  // Update sub-value when range changes
  useEffect(() => {
    if (globalRange === 'day') setSelectedSubValue('2023-04-21');
    else if (globalRange === 'week') setSelectedSubValue('2023-W16');
    else if (globalRange === 'month') setSelectedSubValue('2023-04');
  }, [globalRange]);
  const [trendRange, setTrendRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [salesRange, setSalesRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [courseSort, setCourseSort] = useState<'sales' | 'revenue' | 'views' | 'joined' | 'consultation'>('sales');
  const [courseRankingType, setCourseRankingType] = useState<'paid' | 'free'>('paid');

  useEffect(() => {
    if (courseRankingType === 'paid') {
      if (!['sales', 'revenue', 'views', 'consultation'].includes(courseSort as any)) {
        setCourseSort('sales');
      }
    } else {
      if (!['views', 'joined'].includes(courseSort as any)) {
        setCourseSort('views');
      }
    }
  }, [courseRankingType]);
  const [classSort, setClassSort] = useState<'sales' | 'revenue' | 'views' | 'joined' | 'consultation'>('sales');
  const [certSort, setCertSort] = useState<'sales' | 'revenue' | 'views' | 'joined' | 'consultation'>('sales');
  const [showTrendData, setShowTrendData] = useState(false);
  const [showSalesData, setShowSalesData] = useState(false);

  const rangeLabel = globalRange === 'day' ? '本日' : globalRange === 'week' ? '本周' : '本月';

  const stats = [
    { label: '累计注册', value: MOCK_DASHBOARD_OVERVIEW.totalRegistered.toLocaleString(), icon: <Users className="text-blue-500" /> },
    { label: `${rangeLabel}注册量`, value: MOCK_DASHBOARD_OVERVIEW.monthlyRegistered.toLocaleString(), icon: <UserPlus className="text-cyan-500" /> },
    { label: `${rangeLabel}活跃`, value: MOCK_DASHBOARD_OVERVIEW.monthlyActive.toLocaleString(), icon: <Activity className="text-green-500" /> },
    { label: '累计销售额', value: `¥${MOCK_DASHBOARD_OVERVIEW.totalSales.toLocaleString()}`, icon: <TrendingUp className="text-red-500" /> },
    { label: '累计销售量', value: MOCK_DASHBOARD_OVERVIEW.totalSalesVolume.toLocaleString(), icon: <FileText className="text-blue-600" /> },
    { label: `${rangeLabel}销售额`, value: `¥${MOCK_DASHBOARD_OVERVIEW.monthlySalesRevenue.toLocaleString()}`, icon: <CheckCircle2 className="text-purple-500" /> },
    { label: `${rangeLabel}销售量`, value: MOCK_DASHBOARD_OVERVIEW.monthlySalesVolume.toLocaleString(), icon: <FileText className="text-orange-500" /> },
  ];

  const getSortValue = (item: any, sort: string) => {
    const val = item[sort];
    if (sort === 'revenue') return `¥${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Overall Data Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-gray-800">整体数据</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'day', name: '日' },
                { id: 'week', name: '周' },
                { id: 'month', name: '月' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setGlobalRange(r.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    globalRange === r.id ? "bg-white text-[#7DC16A] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <select 
              value={selectedSubValue}
              onChange={(e) => setSelectedSubValue(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 min-w-[140px]"
            >
              {globalRange === 'day' && (
                <>
                  <option value="2023-04-21">2023-04-21</option>
                  <option value="2023-04-20">2023-04-20</option>
                  <option value="2023-04-19">2023-04-19</option>
                </>
              )}
              {globalRange === 'week' && (
                <>
                  <option value="2023-W16">2023年 第16周</option>
                  <option value="2023-W15">2023年 第15周</option>
                  <option value="2023-W14">2023年 第14周</option>
                </>
              )}
              {globalRange === 'month' && (
                <>
                  <option value="2023-04">2023年 04月</option>
                  <option value="2023-03">2023年 03月</option>
                  <option value="2023-02">2023年 02月</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3 transition-all hover:bg-white hover:shadow-md group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">用户增长情况</h3>
              <button 
                onClick={() => setShowTrendData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={trendRange} onChange={setTrendRange} color="blue" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_OVERVIEW.trends[trendRange === 'week' || trendRange === 'month' ? 'month' : trendRange === 'custom' ? 'day' : trendRange]}>
                <defs>
                  <linearGradient id="colorRegTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="registered" name="全部渠道" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRegTotal)" />
                <Area type="monotone" dataKey="reg_pc" name="PC端" stroke="#60A5FA" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="reg_h5" name="H5端" stroke="#93C5FD" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">用户活跃情况</h3>
              <button 
                onClick={() => setShowTrendData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={trendRange} onChange={setTrendRange} color="green" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_OVERVIEW.trends[trendRange === 'week' || trendRange === 'month' ? 'month' : trendRange === 'custom' ? 'day' : trendRange]}>
                <defs>
                  <linearGradient id="colorActTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="active" name="全部渠道" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorActTotal)" />
                <Area type="monotone" dataKey="act_pc" name="PC端" stroke="#34D399" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="act_h5" name="H5端" stroke="#6EE7B7" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Volume Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">销售量情况</h3>
              <button 
                onClick={() => setShowSalesData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={salesRange} onChange={setSalesRange} color="green" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_OVERVIEW.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}>
                <defs>
                  <linearGradient id="colorSalesTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="sales" name="全部渠道" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSalesTotal)" />
                <Area type="monotone" dataKey="sales_pc" name="PC端" stroke="#34D399" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="sales_h5" name="H5端" stroke="#6EE7B7" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Revenue Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">销售额情况</h3>
              <button 
                onClick={() => setShowSalesData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={salesRange} onChange={setSalesRange} color="blue" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_OVERVIEW.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}>
                <defs>
                  <linearGradient id="colorRevenueTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: any) => `¥${Number(value).toLocaleString()}`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="全部渠道" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueTotal)" />
                <Area type="monotone" dataKey="revenue_pc" name="PC端" stroke="#60A5FA" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="revenue_h5" name="H5端" stroke="#93C5FD" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Funnels */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-8">销售转化漏斗</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {(MOCK_DASHBOARD_OVERVIEW as any).funnels.map((f: any, idx: number) => (
            <div key={idx} className="space-y-6">
              <div className="text-center">
                <span className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-1 rounded-full">{f.title}</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Visual Funnel */}
                <div className="w-full space-y-1">
                  {/* Browsing */}
                  <div className="group relative">
                    <div className="bg-blue-500/10 border border-blue-500/20 py-3 px-4 rounded-xl flex items-center justify-between transition-all hover:bg-blue-500/15">
                      <span className="text-xs font-bold text-blue-600">浏览信息</span>
                      <span className="text-sm font-bold text-blue-700">{f.browsing.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center py-1">
                    <ChevronDown size={14} className="text-gray-300" />
                  </div>
                  {/* Consultation */}
                  <div className="group relative mx-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 py-3 px-4 rounded-xl flex items-center justify-between transition-all hover:bg-indigo-500/15">
                      <span className="text-xs font-bold text-indigo-600">咨询人数</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-indigo-700">{f.consultation.toLocaleString()}</span>
                        <span className="text-[10px] text-indigo-400">转化率: {((f.consultation/f.browsing)*100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center py-1">
                    <ChevronDown size={14} className="text-gray-300" />
                  </div>
                  {/* Purchase */}
                  <div className="group relative mx-8">
                    <div className="bg-[#7DC16A]/10 border border-[#7DC16A]/20 py-3 px-4 rounded-xl flex items-center justify-between transition-all hover:bg-[#7DC16A]/15">
                      <span className="text-xs font-bold text-[#7DC16A]">购买人数</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-[#7DC16A]">{f.purchase.toLocaleString()}</span>
                        <span className="text-[10px] text-[#7DC16A]/60">转化率: {((f.purchase/f.consultation)*100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center py-1">
                    <ChevronDown size={14} className="text-gray-300" />
                  </div>
                  {/* Repurchase */}
                  <div className="group relative mx-12">
                    <div className="bg-orange-500/10 border border-orange-500/20 py-3 px-4 rounded-xl flex items-center justify-between transition-all hover:bg-orange-500/15">
                      <span className="text-xs font-bold text-orange-600">复购人数</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-orange-700">{f.repurchase.toLocaleString()}</span>
                        <span className="text-[10px] text-orange-400">复购率: {((f.repurchase/f.purchase)*100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Overall Rate */}
                <div className="mt-4 pt-4 border-t border-gray-50 w-full text-center">
                   <p className="text-xs text-gray-400">总转化率: <span className="text-[#7DC16A] font-bold">{((f.purchase/f.browsing)*100).toFixed(1)}%</span></p>
                   {f.repurchase && <p className="text-[10px] text-gray-300 mt-1">复购贡献率: {((f.repurchase/f.browsing)*100).toFixed(2)}%</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Ranking */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">课程排行榜</h3>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  { id: 'paid', label: '付费' },
                  { id: 'free', label: '免费' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setCourseRankingType(type.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                      courseRankingType === type.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <select 
              value={courseSort}
              onChange={(e) => setCourseSort(e.target.value as any)}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg outline-none self-end sm:self-auto"
            >
              {courseRankingType === 'paid' ? (
                <>
                  <option value="sales">按销量</option>
                  <option value="revenue">按销售额</option>
                  <option value="views">按浏览量</option>
                  <option value="consultation">按咨询人数</option>
                </>
              ) : (
                <>
                  <option value="views">按浏览量</option>
                  <option value="joined">按加入人数</option>
                </>
              )}
            </select>
          </div>
          <div className="space-y-6">
            {[...MOCK_DASHBOARD_OVERVIEW.topCourses]
              .filter(c => courseRankingType === 'paid' ? (c as any).isPaid : !(c as any).isPaid)
              .sort((a: any, b: any) => b[courseSort] - a[courseSort]).map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                    i < 3 ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{c.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{getSortValue(c, courseSort)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Class Ranking (Domains & Directions) */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">班级排行榜</h3>
            <select 
              value={classSort}
              onChange={(e) => setClassSort(e.target.value as any)}
              className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg outline-none"
            >
              <option value="sales">按销量</option>
              <option value="revenue">按销售额</option>
              <option value="views">按浏览量</option>
              <option value="joined">按加入人数</option>
              <option value="consultation">按咨询人数</option>
            </select>
          </div>
          <div className="space-y-6">
            {[...MOCK_DASHBOARD_OVERVIEW.topClasses].sort((a: any, b: any) => b[classSort] - a[classSort]).map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                    i < 3 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{c.type === 'domain' ? '领域' : '方向'}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-800">{getSortValue(c, classSort)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Ranking */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">证书排行榜</h3>
            <select 
              value={certSort}
              onChange={(e) => setCertSort(e.target.value as any)}
              className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg outline-none"
            >
              <option value="sales">按销量</option>
              <option value="revenue">按销售额</option>
              <option value="views">按浏览量</option>
              <option value="joined">按加入人数</option>
              <option value="consultation">按咨询人数</option>
            </select>
          </div>
          <div className="space-y-6">
            {[...MOCK_DASHBOARD_OVERVIEW.topCerts].sort((a: any, b: any) => b[certSort] - a[certSort]).map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                    i < 3 ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{c.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{getSortValue(c, certSort)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Bank Ranking */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">题库排行榜</h3>
            <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              按题目数量
            </div>
          </div>
          <div className="space-y-6">
            {MOCK_DASHBOARD_OVERVIEW.topQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                    i < 3 ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{q.type}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{q.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataViewModal 
        isOpen={showTrendData}
        onClose={() => setShowTrendData(false)}
        title="用户增长活跃数据"
        data={MOCK_DASHBOARD_OVERVIEW.trends[trendRange === 'week' || trendRange === 'month' ? 'month' : trendRange === 'custom' ? 'day' : trendRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'registered', label: '注册用户' },
          { key: 'dau', label: '活跃用户' },
          { key: 'pc', label: 'PC端' },
          { key: 'h5', label: 'H5端' }
        ]}
      />

      <DataViewModal 
        isOpen={showSalesData}
        onClose={() => setShowSalesData(false)}
        title="销售增长数据"
        data={MOCK_DASHBOARD_OVERVIEW.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'sales', label: '销售量' },
          { key: 'revenue', label: '销售额' }
        ]}
      />
    </div>
  );
}

function UserDashboard() {
  const [globalRange, setGlobalRange] = useState<'day' | 'week' | 'month'>('month');
  const [selectedSubValue, setSelectedSubValue] = useState('2023-04');

  // Update sub-value when range changes
  useEffect(() => {
    if (globalRange === 'day') setSelectedSubValue('2023-04-21');
    else if (globalRange === 'week') setSelectedSubValue('2023-W16');
    else if (globalRange === 'month') setSelectedSubValue('2023-04');
  }, [globalRange]);

  const [growthRange, setGrowthRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [activityRange, setActivityRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [churnRange, setChurnRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [durationRange, setDurationRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [retentionRange, setRetentionRange] = useState<'day' | 'week' | 'month'>('day');
  const [freqRange, setFreqRange] = useState<'week' | 'month' | 'year'>('week');
  const [logPage, setLogPage] = useState(1);
  const [showGrowthData, setShowGrowthData] = useState(false);
  const [showActivityData, setShowActivityData] = useState(false);
  const logsPerPage = 10;
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const paginatedLogs = MOCK_USER_STATS.loginLogs.slice((logPage - 1) * logsPerPage, logPage * logsPerPage);
  const totalLogPages = Math.ceil(MOCK_USER_STATS.loginLogs.length / logsPerPage);

  const renderRetentionMatrix = () => {
    const data = MOCK_USER_STATS.retentionMatrix[retentionRange];
    const maxCols = retentionRange === 'month' ? 12 : 15;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border border-gray-100 text-left sticky left-0 bg-gray-50 z-10">首次购买日期</th>
              <th className="p-2 border border-gray-100">总用户数</th>
              {Array.from({ length: maxCols }).map((_, i) => (
                <th key={i} className="p-2 border border-gray-100">{i}{retentionRange === 'month' ? '月' : retentionRange === 'week' ? '周' : '天'}后</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-gray-100 font-medium sticky left-0 bg-white z-10">{row.date}</td>
                <td className="p-2 border border-gray-100 text-center bg-blue-50 font-bold">{row.total}</td>
                {row.values.map((val, j) => (
                  <td 
                    key={j} 
                    className="p-2 border border-gray-100 text-center"
                    style={{ 
                      backgroundColor: `rgba(59, 130, 246, ${val / 100})`,
                      color: val > 50 ? 'white' : 'inherit'
                    }}
                  >
                    {val}%
                  </td>
                ))}
                {Array.from({ length: maxCols - row.values.length }).map((_, j) => (
                  <td key={j} className="p-2 border border-gray-100 bg-gray-50/30"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const rangeLabel = globalRange === 'day' ? '本日' : globalRange === 'week' ? '本周' : '本月';
  const activeValue = globalRange === 'day' ? MOCK_USER_STATS.dau : globalRange === 'week' ? MOCK_USER_STATS.wau : MOCK_USER_STATS.mau;

  const stats = [
    { label: '累计注册', value: MOCK_USER_STATS.totalRegistered.toLocaleString(), icon: <Users className="text-blue-500" /> },
    { label: '累计付费用户数', value: MOCK_USER_STATS.paidUsers.toLocaleString(), icon: <TrendingUp className="text-cyan-500" /> },
    { label: `${rangeLabel}新增付费`, value: Math.floor(activeValue * 0.15).toLocaleString(), icon: <PlusCircle className="text-indigo-500" /> },
    { label: `${rangeLabel}活跃`, value: activeValue.toLocaleString(), icon: <Activity className="text-green-500" /> },
    { label: '新增流失用户', value: MOCK_USER_STATS.newChurnCount.toLocaleString(), icon: <UserMinus className="text-red-500" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Integrated Overall Data Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-gray-800">整体数据</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'day', name: '日' },
                { id: 'week', name: '周' },
                { id: 'month', name: '月' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setGlobalRange(r.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    globalRange === r.id ? "bg-white text-[#7DC16A] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <select 
              value={selectedSubValue}
              onChange={(e) => setSelectedSubValue(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 min-w-[140px]"
            >
              {globalRange === 'day' && (
                <>
                  <option value="2023-04-21">2023-04-21</option>
                  <option value="2023-04-20">2023-04-20</option>
                  <option value="2023-04-19">2023-04-19</option>
                </>
              )}
              {globalRange === 'week' && (
                <>
                  <option value="2023-W16">2023年 第16周</option>
                   <option value="2023-W15">2023年 第15周</option>
                  <option value="2023-W14">2023年 第14周</option>
                </>
              )}
              {globalRange === 'month' && (
                <>
                  <option value="2023-04">2023年 04月</option>
                  <option value="2023-03">2023年 03月</option>
                  <option value="2023-02">2023年 02月</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Stats Cards Inside Same Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 space-y-3 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">用户新增情况</h3>
            <button 
              onClick={() => setShowGrowthData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={growthRange} onChange={setGrowthRange} color="blue" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_USER_STATS.growthTrend[growthRange === 'week' || growthRange === 'month' ? 'month' : growthRange === 'custom' ? 'day' : growthRange]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="value" name="全部渠道" stroke="#3B82F6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="pc" name="PC端" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="h5" name="H5端" stroke="#93C5FD" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Activity */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">用户活跃情况</h3>
            <button 
              onClick={() => setShowActivityData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={activityRange} onChange={setActivityRange} color="green" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_USER_STATS.activityTrend[activityRange === 'week' || activityRange === 'month' ? 'month' : activityRange === 'custom' ? 'day' : activityRange]}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="value" name="全部渠道" stroke="#10B981" fill="url(#colorActivity)" strokeWidth={3} />
              <Area type="monotone" dataKey="pc" name="PC端" stroke="#34D399" fill="none" strokeDasharray="5 5" strokeWidth={2} />
              <Area type="monotone" dataKey="h5" name="H5端" stroke="#6EE7B7" fill="none" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Churn & Recall */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">用户召回与流失情况</h3>
            <button 
              onClick={() => setShowActivityData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={churnRange} onChange={setChurnRange} color="emerald" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={churnRange === 'week' || churnRange === 'month' ? 
              MOCK_USER_STATS.recallTrend.month.map((item, idx) => {
                const churnItem = (MOCK_USER_STATS.churnTrend.month[idx] || {}) as any;
                return {
                  date: item.date,
                  r_total: item.value,
                  r_pc: item.pc,
                  r_h5: item.h5,
                  c_total: churnItem.value,
                  c_pc: churnItem.pc,
                  c_h5: churnItem.h5
                };
              }) : 
              MOCK_USER_STATS.recallTrend.day.map((item, idx) => {
                const churnItem = (MOCK_USER_STATS.churnTrend.day[idx] || {}) as any;
                return {
                  date: item.date,
                  r_total: item.value,
                  r_pc: item.pc,
                  r_h5: item.h5,
                  c_total: churnItem.value,
                  c_pc: churnItem.pc,
                  c_h5: churnItem.h5
                };
              })
            }>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              {/* Recall Lines (Green) */}
              <Line type="monotone" dataKey="r_total" name="总召回" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
              <Line type="monotone" dataKey="r_pc" name="召回-PC端" stroke="#34D399" strokeWidth={1} strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="r_h5" name="召回-H5端" stroke="#6EE7B7" strokeWidth={1} strokeDasharray="3 3" dot={false} />
              {/* Churn Lines (Red) */}
              <Line type="monotone" dataKey="c_total" name="总流失" stroke="#EF4444" strokeWidth={2} dot={false} strokeOpacity={0.6} />
              <Line type="monotone" dataKey="c_pc" name="流失-PC端" stroke="#F87171" strokeWidth={1} strokeDasharray="5 5" dot={false} strokeOpacity={0.5} />
              <Line type="monotone" dataKey="c_h5" name="流失-H5端" stroke="#FCA5A5" strokeWidth={1} strokeDasharray="5 5" dot={false} strokeOpacity={0.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Online Duration */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">用户在线时长 (分钟)</h3>
          </div>
          <TimeRangeSelector range={durationRange} onChange={setDurationRange} color="orange" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_USER_STATS.durationTrend[durationRange === 'week' || durationRange === 'month' ? 'month' : durationRange === 'custom' ? 'day' : durationRange]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="value" name="全部渠道" stroke="#F59E0B" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="pc" name="PC端" stroke="#FBBF24" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="h5" name="H5端" stroke="#FCD34D" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Distributions: Online Duration and Login Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Online Duration Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">用户在线时长分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(MOCK_USER_STATS as any).distribution.onlineDurationDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" name="用户数" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Login Frequency Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">登录次数分布</h3>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'week', label: '周' },
                { id: 'month', label: '月' },
                { id: 'year', label: '年' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setFreqRange(r.id as any)}
                  className={cn(
                    "px-4 py-1 text-xs font-bold rounded-lg transition-all",
                    freqRange === r.id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(MOCK_USER_STATS as any).distribution.loginFrequencyDistribution[freqRange]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" name="用户数" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Retention Matrix */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">用户留存情况</h3>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              onClick={() => {
                const csv = "首次购买日期,总用户数,1天后,2天后,3天后,4天后,5天后,6天后,7天后,8天后,9天后,10天后,11天后,12天后,13天后,14天后\n" + 
                  MOCK_USER_STATS.retentionMatrix[retentionRange].map(row => `${row.date},${row.total},${row.values.join(',')}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', `retention_${retentionRange}.csv`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <Download size={14} />
              导出数据
            </button>
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            {[
              { id: 'day', label: '日留存' },
              { id: 'week', label: '周留存' },
              { id: 'month', label: '月留存' }
            ].map(r => (
              <button 
                key={r.id}
                onClick={() => setRetentionRange(r.id as any)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  retentionRange === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        {renderRetentionMatrix()}
      </div>

      {/* Portrait */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-8">用户画像分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="h-[250px]">
            <p className="text-center text-xs font-bold text-gray-400 mb-4">学历分布</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_USER_STATS.distribution.education}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_USER_STATS.distribution.education.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px]">
            <p className="text-center text-xs font-bold text-gray-400 mb-4">性别分布</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_USER_STATS.distribution.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_USER_STATS.distribution.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#EC4899'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px]">
            <p className="text-center text-xs font-bold text-gray-400 mb-4">职位分布</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_USER_STATS.distribution.position}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_USER_STATS.distribution.position.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px]">
            <p className="text-center text-xs font-bold text-gray-400 mb-4">领域分布</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_USER_STATS.distribution.domain}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(MOCK_USER_STATS.distribution as any).domain.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Login Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">用户登录日志</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索用户账号/昵称"
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">日志ID</th>
                <th className="px-6 py-4">昵称</th>
                <th className="px-6 py-4">登录账号</th>
                <th className="px-6 py-4">渠道</th>
                <th className="px-6 py-4">登录时间</th>
                <th className="px-6 py-4">登录IP</th>
                <th className="px-6 py-4">登录设备</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-600">{log.id}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{log.nickname}</td>
                  <td className="px-6 py-4 text-gray-600">{log.account}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-xs font-bold",
                      log.channel === '微信' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {log.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{log.loginTime}</td>
                  <td className="px-6 py-4 text-gray-500">{log.ip}</td>
                  <td className="px-6 py-4 text-gray-500">{log.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">共 {MOCK_USER_STATS.loginLogs.length} 条记录</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLogPage(p => Math.max(1, p - 1))}
              disabled={logPage === 1}
              className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalLogPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setLogPage(i + 1)}
                className={cn(
                  "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                  logPage === i + 1 ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))}
              disabled={logPage === totalLogPages}
              className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <DataViewModal 
        isOpen={showGrowthData}
        onClose={() => setShowGrowthData(false)}
        title="用户新增数据"
        data={MOCK_USER_STATS.growthTrend[growthRange === 'week' || growthRange === 'month' ? 'month' : growthRange === 'custom' ? 'day' : growthRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'value', label: '新增用户' },
          { key: 'pc', label: 'PC端' },
          { key: 'h5', label: 'H5端' }
        ]}
      />

      <DataViewModal 
        isOpen={showActivityData}
        onClose={() => setShowActivityData(false)}
        title="用户活跃数据"
        data={MOCK_USER_STATS.activityTrend[activityRange === 'week' || activityRange === 'month' ? 'month' : activityRange === 'custom' ? 'day' : activityRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'value', label: '活跃用户' },
          { key: 'pc', label: 'PC端' },
          { key: 'h5', label: 'H5端' }
        ]}
      />
    </div>
  );
}

function CourseDashboard() {
  const [globalRange, setGlobalRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedSubValue, setSelectedSubValue] = useState('2023-W16');
  const [statMode, setStatMode] = useState<'added' | 'accumulated'>('added');

  useEffect(() => {
    if (globalRange === 'day') setSelectedSubValue('2023-04-21');
    else if (globalRange === 'week') setSelectedSubValue('2023-W16');
    else if (globalRange === 'month') setSelectedSubValue('2023-04');
  }, [globalRange]);

  const [browseRange, setBrowseRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [engagementRange, setEngagementRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [learningRange, setLearningRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [salesRange, setSalesRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [rankingType, setRankingType] = useState<'domain' | 'position' | 'certification'>('domain');
  const [rankingRange, setRankingRange] = useState<'week' | 'month' | 'total'>('total');
  const [rankingSort, setRankingSort] = useState<'count' | 'pv' | 'uv' | 'inquiries' | 'sales' | 'revenue'>('count');
  const [showBrowseData, setShowBrowseData] = useState(false);
  const [showEngagementData, setShowEngagementData] = useState(false);
  const [showLearningData, setShowLearningData] = useState(false);
  const [showSalesData, setShowSalesData] = useState(false);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    domain: '不限',
    position: '不限',
    certification: '不限',
    category: '不限'
  });

  const handleFilterChange = (id: string, value: string) => {
    setActiveFilters(prev => {
      const next = { ...prev, [id]: value };
      if (id === 'certification') {
        next.category = '不限';
      }
      return next;
    });
  };

  const courseFilters = useMemo(() => {
    const base = DASHBOARD_FILTER_OPTIONS.course;
    const categoryOptions = CERTIFICATION_CATEGORIES[activeFilters.certification] || ['不限'];
    return [...base, { id: 'category', label: '分类', options: categoryOptions }];
  }, [activeFilters.certification]);
  
  const c = MOCK_COURSE_DASHBOARD;
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getRankingData = () => {
    const data = c.typeRanking[rankingType][rankingRange] || [];
    return [...data].sort((a: any, b: any) => b[rankingSort] - a[rankingSort]);
  };

  const rangeLabel = globalRange === 'day' ? '本日' : globalRange === 'week' ? '本周' : '本月';

  const stats = statMode === 'accumulated' ? [
    { label: '累计上架', value: c.totalPublished.toLocaleString(), icon: <BookOpen className="text-blue-500" /> },
    { label: '累计销售量', value: c.totalSalesVolume.toLocaleString(), icon: <TrendingUp className="text-green-500" /> },
    { label: '累计销售额', value: `¥${c.conversion.revenue.toLocaleString()}`, icon: <BarChart3 className="text-purple-500" /> },
    { label: '累计课程学习人数', value: (c.studentCount || 0).toLocaleString(), icon: <Users className="text-indigo-500" /> },
    { label: '累计课时', value: `${c.totalHours.toLocaleString()}h`, icon: <Clock className="text-orange-500" /> },
    { label: '累计人均课时', value: `${c.avgHours}h`, icon: <UserIcon className="text-blue-400" /> },
    { label: '累计完课率', value: `${c.completionRate}%`, icon: <CheckCircle2 className="text-emerald-500" /> },
  ] : [
    { label: `${rangeLabel}上架`, value: c.weeklyNew.toLocaleString(), icon: <Plus className="text-cyan-500" /> },
    { label: `${rangeLabel}销售量`, value: (c.periodSales || 0).toLocaleString(), icon: <TrendingUp className="text-emerald-500" /> },
    { label: `${rangeLabel}销售额`, value: `¥${(c.periodRevenue || 0).toLocaleString()}`, icon: <BarChart3 className="text-blue-600" /> },
    { label: `${rangeLabel}课程学习人数`, value: Math.floor(c.studentCount * 0.15).toLocaleString(), icon: <Users className="text-indigo-400" /> },
    { label: `${rangeLabel}课时`, value: `${Math.floor(c.totalHours * 1.5).toLocaleString()}h`, icon: <Clock className="text-orange-400" /> },
    { label: `${rangeLabel}人均课时`, value: `${(c.avgHours * 1.2).toFixed(1)}h`, icon: <UserIcon className="text-blue-300" /> },
    { label: `${rangeLabel}完课率`, value: `${(c.completionRate * 1.1).toFixed(1)}%`, icon: <CheckCircle2 className="text-emerald-400" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Integrated Overall Data Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">整体数据</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 ml-4">
              {[
                { id: 'added', name: '新增' },
                { id: 'accumulated', name: '累计' }
              ].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setStatMode(mode.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    statMode === mode.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'day', name: '日' },
                { id: 'week', name: '周' },
                { id: 'month', name: '月' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setGlobalRange(r.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    globalRange === r.id ? "bg-white text-[#7DC16A] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <select 
              value={selectedSubValue}
              onChange={(e) => setSelectedSubValue(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 min-w-[140px]"
            >
              {globalRange === 'day' && (
                <>
                  <option value="2023-04-21">2023-04-21</option>
                  <option value="2023-04-20">2023-04-20</option>
                  <option value="2023-04-19">2023-04-19</option>
                </>
              )}
              {globalRange === 'week' && (
                <>
                  <option value="2023-W16">2023年 第16周</option>
                  <option value="2023-W15">2023年 第15周</option>
                  <option value="2023-W14">2023年 第14周</option>
                </>
              )}
              {globalRange === 'month' && (
                <>
                  <option value="2023-04">2023年 04月</option>
                  <option value="2023-03">2023年 03月</option>
                  <option value="2023-02">2023年 02月</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Stats Cards Inside Same Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 space-y-3 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Course Content Data */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">课程内容数据</h3>
          </div>
          <DashboardInlineFilters 
            filters={courseFilters} 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">课程浏览数据</h3>
                <button 
                  onClick={() => setShowBrowseData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={browseRange} onChange={setBrowseRange} color="blue" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="pv" name="PV" stroke="#3B82F6" fill="url(#colorPv)" strokeWidth={3} />
                  <Area type="monotone" dataKey="uv" name="UV" stroke="#10B981" fill="url(#colorUv)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">课程咨询转化</h3>
                <button 
                  onClick={() => setShowEngagementData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={engagementRange} onChange={setEngagementRange} color="orange" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="inquiries" name="咨询数" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="销售数" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" name="咨询转化率" stroke="#8B5CF6" strokeWidth={2} dot={{r: 4}} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">课程学习数据</h3>
                <button 
                  onClick={() => setShowLearningData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={learningRange} onChange={setLearningRange} color="emerald" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(c.contentData as any).learning[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="joined" name="加入人数" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="completed" name="完课人数" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Course Sales Data */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">课程销售数据</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">销售趋势</h3>
              <button 
                onClick={() => setShowSalesData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={salesRange} onChange={setSalesRange} color="green" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="sales" name="销量" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="销售额" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section: Course Type Data Ranking */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">课程类型数据排行</h3>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  { id: 'domain', label: '领域' },
                  { id: 'position', label: '岗位' },
                  { id: 'certification', label: '认证' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRankingType(r.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                      rankingType === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  { id: 'week', label: '周' },
                  { id: 'month', label: '月' },
                  { id: 'total', label: '累计' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRankingRange(r.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                      rankingRange === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <select 
              value={rankingSort}
              onChange={(e) => setRankingSort(e.target.value as any)}
              className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg outline-none"
            >
              <option value="count">按课程数量</option>
              <option value="pv">按PV</option>
              <option value="uv">按UV</option>
              <option value="inquiries">按咨询</option>
              <option value="sales">按销售量</option>
              <option value="revenue">按销售额</option>
            </select>
          </div>

          <div className="space-y-4">
            {getRankingData().map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  i < 3 ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {rankingSort === 'revenue' ? `¥${item.revenue.toLocaleString()}` : item[rankingSort].toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item[rankingSort] / getRankingData()[0][rankingSort]) * 100}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataViewModal 
        isOpen={showSalesData}
        onClose={() => setShowSalesData(false)}
        title="课程销售数据"
        data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'sales', label: '销量' },
          { key: 'revenue', label: '销售额', format: (v) => `¥${v.toLocaleString()}` }
        ]}
      />

      <DataViewModal 
        isOpen={showBrowseData}
        onClose={() => setShowBrowseData(false)}
        title="课程浏览数据"
        data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'pv', label: 'PV' },
          { key: 'uv', label: 'UV' }
        ]}
      />

      <DataViewModal 
        isOpen={showEngagementData}
        onClose={() => setShowEngagementData(false)}
        title="课程咨询转化数据"
        data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'inquiries', label: '咨询数' },
          { key: 'sales', label: '订单数' },
          { key: 'rate', label: '咨询转化率', format: (v) => `${v}%` }
        ]}
      />

      <DataViewModal 
        isOpen={showLearningData}
        onClose={() => setShowLearningData(false)}
        title="课程学习数据"
        data={(c.contentData as any).learning[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'joined', label: '加入人数' },
          { key: 'completed', label: '完课人数' }
        ]}
      />
    </div>
  );
}

function ClassDashboard() {
  const [globalRange, setGlobalRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedSubValue, setSelectedSubValue] = useState('2023-W16');
  const [statMode, setStatMode] = useState<'added' | 'accumulated'>('added');

  useEffect(() => {
    if (globalRange === 'day') setSelectedSubValue('2023-04-21');
    else if (globalRange === 'week') setSelectedSubValue('2023-W16');
    else if (globalRange === 'month') setSelectedSubValue('2023-04');
  }, [globalRange]);

  const [browseRange, setBrowseRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [engagementRange, setEngagementRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [learningRange, setLearningRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [salesRange, setSalesRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [rankingType, setRankingType] = useState<'domain' | 'position' | 'certification'>('domain');
  const [rankingRange, setRankingRange] = useState<'week' | 'month' | 'total'>('total');
  const [rankingSort, setRankingSort] = useState<'count' | 'pv' | 'uv' | 'inquiries' | 'sales' | 'revenue'>('count');
  const [showBrowseData, setShowBrowseData] = useState(false);
  const [showEngagementData, setShowEngagementData] = useState(false);
  const [showLearningData, setShowLearningData] = useState(false);
  const [showSalesData, setShowSalesData] = useState(false);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    domain: '不限',
    direction: '不限'
  });

  const handleFilterChange = (id: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [id]: value }));
  };
  
  const c = MOCK_CLASS_DASHBOARD;
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getRankingData = () => {
    const data = c.typeRanking[rankingType][rankingRange] || [];
    return [...data].sort((a: any, b: any) => b[rankingSort] - a[rankingSort]);
  };

  const rangeLabel = globalRange === 'day' ? '本日' : globalRange === 'week' ? '本周' : '本月';

  const stats = statMode === 'accumulated' ? [
    { label: '累计上架', value: `${c.totalPublished.toLocaleString()} (付费${Math.floor(c.totalPublished*0.6)} / 免费${Math.floor(c.totalPublished*0.4)})`, icon: <BookOpen className="text-blue-500" /> },
    { label: '累计销售量', value: c.totalSalesVolume.toLocaleString(), icon: <TrendingUp className="text-green-500" /> },
    { label: '累计销售额', value: `¥${c.conversion.revenue.toLocaleString()}`, icon: <BarChart3 className="text-purple-500" /> },
    { label: '累计班级学习人数', value: (c.studentCount || 0).toLocaleString(), icon: <Users className="text-indigo-500" /> },
    { label: '累计班级毕业人数', value: `${(c as any).graduatedCount || 0}人`, icon: <CheckCircle2 className="text-emerald-500" /> },
    { label: '累计通过率', value: `${(c as any).passRate || 0}%`, icon: <Award className="text-orange-500" /> },
  ] : [
    { label: `${rangeLabel}上架`, value: `${c.weeklyNew.toLocaleString()} (付费${Math.floor(c.weeklyNew*0.7)} / 免费${Math.floor(c.weeklyNew*0.3)})`, icon: <Plus className="text-cyan-500" /> },
    { label: `${rangeLabel}销售量`, value: (c.periodSales || 0).toLocaleString(), icon: <TrendingUp className="text-emerald-500" /> },
    { label: `${rangeLabel}销售额`, value: `¥${(c.periodRevenue || 0).toLocaleString()}`, icon: <BarChart3 className="text-blue-600" /> },
    { label: `${rangeLabel}班级学习人数`, value: Math.floor(c.studentCount * 0.12).toLocaleString(), icon: <Users className="text-indigo-400" /> },
    { label: `${rangeLabel}班级毕业人数`, value: `${Math.floor(((c as any).graduatedCount || 0) * 0.1)}人`, icon: <CheckCircle2 className="text-emerald-400" /> },
    { label: `${rangeLabel}通过率`, value: `${((c as any).passRate || 0) + 1.5}%`, icon: <Award className="text-orange-400" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Integrated Overall Data Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">整体数据</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 ml-4">
              {[
                { id: 'added', name: '新增' },
                { id: 'accumulated', name: '累计' }
              ].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setStatMode(mode.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    statMode === mode.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'day', name: '日' },
                { id: 'week', name: '周' },
                { id: 'month', name: '月' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setGlobalRange(r.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    globalRange === r.id ? "bg-white text-[#7DC16A] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <select 
              value={selectedSubValue}
              onChange={(e) => setSelectedSubValue(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7DC16A]/20 min-w-[140px]"
            >
              {globalRange === 'day' && (
                <>
                  <option value="2023-04-21">2023-04-21</option>
                  <option value="2023-04-20">2023-04-20</option>
                  <option value="2023-04-19">2023-04-19</option>
                </>
              )}
              {globalRange === 'week' && (
                <>
                  <option value="2023-W16">2023年 第16周</option>
                  <option value="2023-W15">2023年 第15周</option>
                  <option value="2023-W14">2023年 第14周</option>
                </>
              )}
              {globalRange === 'month' && (
                <>
                  <option value="2023-04">2023年 04月</option>
                  <option value="2023-03">2023年 03月</option>
                  <option value="2023-02">2023年 02月</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 space-y-3 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Class Content Data */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">班级内容数据</h3>
          </div>
          <DashboardInlineFilters 
            filters={DASHBOARD_FILTER_OPTIONS.class} 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">班级浏览数据</h3>
                <button 
                  onClick={() => setShowBrowseData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={browseRange} onChange={setBrowseRange} color="blue" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}>
                  <defs>
                    <linearGradient id="colorClassPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClassUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="pv" name="PV" stroke="#3B82F6" fill="url(#colorClassPv)" strokeWidth={3} />
                  <Area type="monotone" dataKey="uv" name="UV" stroke="#10B981" fill="url(#colorClassUv)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">班级咨询转化</h3>
                <button 
                  onClick={() => setShowEngagementData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={engagementRange} onChange={setEngagementRange} color="orange" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="inquiries" name="咨询数" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="销售数" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" name="咨询转化率" stroke="#8B5CF6" strokeWidth={2} dot={{r: 4}} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">班级学习数据</h3>
                <button 
                  onClick={() => setShowLearningData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={learningRange} onChange={setLearningRange} color="emerald" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(c.contentData as any).learning[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="joined" name="加入人数" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="completed" name="毕业人数" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Class Sales Data */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">班级销售数据</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">销售趋势</h3>
              <button 
                onClick={() => setShowSalesData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={salesRange} onChange={setSalesRange} color="green" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="sales" name="销量" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="销售额" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section: Class Type Data Ranking */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">班级类型数据排行</h3>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  { id: 'domain', label: '领域' },
                  { id: 'position', label: '岗位' },
                  { id: 'certification', label: '认证' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRankingType(r.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                      rankingType === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  { id: 'week', label: '周' },
                  { id: 'month', label: '月' },
                  { id: 'total', label: '累计' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRankingRange(r.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                      rankingRange === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <select 
              value={rankingSort}
              onChange={(e) => setRankingSort(e.target.value as any)}
              className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg outline-none"
            >
              <option value="count">按班级数量</option>
              <option value="pv">按PV</option>
              <option value="uv">按UV</option>
              <option value="inquiries">按咨询</option>
              <option value="sales">按销售量</option>
              <option value="revenue">按销售额</option>
            </select>
          </div>

          <div className="space-y-4">
            {getRankingData().map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  i < 3 ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {rankingSort === 'revenue' ? `¥${item.revenue.toLocaleString()}` : item[rankingSort].toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item[rankingSort] / getRankingData()[0][rankingSort]) * 100}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataViewModal 
        isOpen={showSalesData}
        onClose={() => setShowSalesData(false)}
        title="班级销售数据"
        data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'sales', label: '销量' },
          { key: 'revenue', label: '销售额', format: (v) => `¥${v.toLocaleString()}` }
        ]}
      />

      <DataViewModal 
        isOpen={showBrowseData}
        onClose={() => setShowBrowseData(false)}
        title="班级浏览数据"
        data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'pv', label: 'PV' },
          { key: 'uv', label: 'UV' }
        ]}
      />

      <DataViewModal 
        isOpen={showEngagementData}
        onClose={() => setShowEngagementData(false)}
        title="班级咨询转化数据"
        data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'inquiries', label: '咨询数' },
          { key: 'sales', label: '订单数' },
          { key: 'rate', label: '咨询转化率', format: (v) => `${v}%` }
        ]}
      />

      <DataViewModal 
        isOpen={showLearningData}
        onClose={() => setShowLearningData(false)}
        title="班级学习数据"
        data={(c.contentData as any).learning[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'joined', label: '加入学习人数' },
          { key: 'completed', label: '毕业人数' }
        ]}
      />
    </div>
  );
}

function CertDashboard() {
  const [globalRange, setGlobalRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedSubValue, setSelectedSubValue] = useState('2023-W16');
  const [statMode, setStatMode] = useState<'added' | 'accumulated'>('added');

  useEffect(() => {
    if (globalRange === 'day') setSelectedSubValue('2023-04-21');
    else if (globalRange === 'week') setSelectedSubValue('2023-W16');
    else if (globalRange === 'month') setSelectedSubValue('2023-04');
  }, [globalRange]);

  const [browseRange, setBrowseRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [engagementRange, setEngagementRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [learningRange, setLearningRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [salesRange, setSalesRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [rankingRange, setRankingRange] = useState<'week' | 'month' | 'total'>('total');
  const [rankingSort, setRankingSort] = useState<'count' | 'pv' | 'uv' | 'inquiries' | 'sales' | 'revenue'>('count');
  const [showBrowseData, setShowBrowseData] = useState(false);
  const [showEngagementData, setShowEngagementData] = useState(false);
  const [showLearningData, setShowLearningData] = useState(false);
  const [showSalesData, setShowSalesData] = useState(false);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    certification: '不限',
    category: '不限'
  });

  const handleFilterChange = (id: string, value: string) => {
    setActiveFilters(prev => {
      const next = { ...prev, [id]: value };
      if (id === 'certification') {
        next.category = '不限';
      }
      return next;
    });
  };

  const certFilters = useMemo(() => {
    const base = DASHBOARD_FILTER_OPTIONS.certificate;
    const categoryOptions = CERTIFICATION_CATEGORIES[activeFilters.certification] || ['不限'];
    return [...base, { id: 'category', label: '分类', options: categoryOptions }];
  }, [activeFilters.certification]);
  
  const c = MOCK_CERT_DASHBOARD;
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getRankingData = () => {
    const data = c.typeRanking[rankingRange] || [];
    return [...data].sort((a: any, b: any) => b[rankingSort] - a[rankingSort]);
  };

  const rangeLabel = globalRange === 'day' ? '本日' : globalRange === 'week' ? '本周' : '本月';

  const stats = statMode === 'accumulated' ? [
    { label: '累计颁发', value: c.totalIssued.toLocaleString(), icon: <FileCheck className="text-blue-500" /> },
    { label: '累计上架', value: c.totalPublished.toLocaleString(), icon: <BookOpen className="text-emerald-500" /> },
    { label: '累计销售量', value: c.totalSalesVolume.toLocaleString(), icon: <TrendingUp className="text-blue-600" /> },
    { label: '累计销售额', value: `¥${c.conversion.revenue.toLocaleString()}`, icon: <BarChart3 className="text-purple-500" /> },
    { label: '累计学习人数', value: (c as any).studentCount.toLocaleString(), icon: <Users className="text-indigo-500" /> },
    { label: '累计获取率', value: `${((c as any).acquisitionRate || 0).toFixed(2)}%`, icon: <CheckCircle2 className="text-emerald-600" /> },
  ] : [
    { label: `${rangeLabel}颁发`, value: Math.floor(c.totalIssued * 0.1).toLocaleString(), icon: <FileCheck className="text-blue-400" /> },
    { label: `${rangeLabel}上架`, value: c.weeklyNew.toLocaleString(), icon: <Plus className="text-cyan-500" /> },
    { label: `${rangeLabel}销售量`, value: c.periodSales.toLocaleString(), icon: <TrendingUp className="text-emerald-500" /> },
    { label: `${rangeLabel}销售额`, value: `¥${c.periodRevenue.toLocaleString()}`, icon: <BarChart3 className="text-blue-600" /> },
    { label: `${rangeLabel}学习人数`, value: Math.floor((c as any).studentCount * 0.15).toLocaleString(), icon: <Users className="text-indigo-400" /> },
    { label: `${rangeLabel}获取率`, value: `${(((c as any).acquisitionRate || 0) + 1.2).toFixed(2)}%`, icon: <CheckCircle2 className="text-emerald-400" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Integrated Overall Data Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">整体数据</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 ml-4">
              {[
                { id: 'added', name: '新增' },
                { id: 'accumulated', name: '累计' }
              ].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setStatMode(mode.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    statMode === mode.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <TimeRangeSelector range={globalRange} onChange={setGlobalRange} />
            <select 
              value={selectedSubValue}
              onChange={(e) => setSelectedSubValue(e.target.value)}
              className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              {globalRange === 'day' && (
                <>
                  <option value="2023-04-21">2023年 04月21日</option>
                  <option value="2023-04-20">2023年 04月20日</option>
                </>
              )}
              {globalRange === 'week' && (
                <>
                  <option value="2023-W16">2023年 第16周 (04.17-04.23)</option>
                  <option value="2023-W15">2023年 第15周 (04.10-04.16)</option>
                </>
              )}
              {globalRange === 'month' && (
                <>
                  <option value="2023-04">2023年 04月</option>
                  <option value="2023-03">2023年 03月</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-50 space-y-3 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Cert Content Data */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">证书内容数据</h3>
          </div>
          <DashboardInlineFilters 
            filters={certFilters} 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">证书浏览数据</h3>
                <button 
                  onClick={() => setShowBrowseData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={browseRange} onChange={setBrowseRange} color="blue" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}>
                  <defs>
                    <linearGradient id="colorCertPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCertUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="pv" name="PV" stroke="#3B82F6" fill="url(#colorCertPv)" strokeWidth={3} />
                  <Area type="monotone" dataKey="uv" name="UV" stroke="#10B981" fill="url(#colorCertUv)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">证书咨询转化</h3>
                <button 
                  onClick={() => setShowEngagementData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={engagementRange} onChange={setEngagementRange} color="orange" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="inquiries" name="咨询数" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="销售数" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" name="咨询转化率" stroke="#8B5CF6" strokeWidth={2} dot={{r: 4}} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">证书获取数据</h3>
                <button 
                  onClick={() => setShowLearningData(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <FileText size={14} />
                  查看数据
                </button>
              </div>
              <TimeRangeSelector range={learningRange} onChange={setLearningRange} color="emerald" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(c.contentData as any).acquisition[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="joined" name="加入人数" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="acquired" name="获取证书人数" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Cert Sales Data */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-green-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">证书销售数据</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">销售趋势</h3>
              <button 
                onClick={() => setShowSalesData(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                <FileText size={14} />
                查看数据
              </button>
            </div>
            <TimeRangeSelector range={salesRange} onChange={setSalesRange} color="green" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="sales" name="销量" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="销售额" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
                <Area yAxisId="left" type="monotone" dataKey="issued" name="颁发量" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section: Cert Type Data Ranking */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">证书类型排行</h3>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'week', label: '周' },
                { id: 'month', label: '月' },
                { id: 'total', label: '累计' }
              ].map(r => (
                <button 
                  key={r.id}
                  onClick={() => setRankingRange(r.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    rankingRange === r.id ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <select 
              value={rankingSort}
              onChange={(e) => setRankingSort(e.target.value as any)}
              className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg outline-none"
            >
              <option value="count">按颁发数量</option>
              <option value="pv">按PV</option>
              <option value="uv">按UV</option>
              <option value="inquiries">按咨询</option>
              <option value="sales">按销售</option>
            </select>
          </div>

          <div className="space-y-4">
            {getRankingData().map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  i < 3 ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {rankingSort === 'count' ? `${item.count}张` : item[rankingSort].toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item[rankingSort] / getRankingData()[0][rankingSort]) * 100}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataViewModal 
        isOpen={showSalesData}
        onClose={() => setShowSalesData(false)}
        title="证书销售与颁发数据"
        data={c.salesTrend[salesRange === 'week' || salesRange === 'month' ? 'month' : salesRange === 'custom' ? 'day' : salesRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'sales', label: '销量' },
          { key: 'revenue', label: '销售额', format: (v) => `¥${v.toLocaleString()}` },
          { key: 'issued', label: '颁发量' }
        ]}
      />

      <DataViewModal 
        isOpen={showBrowseData}
        onClose={() => setShowBrowseData(false)}
        title="证书浏览数据"
        data={c.contentData.browsing[browseRange === 'week' || browseRange === 'month' ? 'month' : browseRange === 'custom' ? 'day' : browseRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'pv', label: 'PV' },
          { key: 'uv', label: 'UV' }
        ]}
      />

      <DataViewModal 
        isOpen={showEngagementData}
        onClose={() => setShowEngagementData(false)}
        title="证书咨询转化数据"
        data={c.contentData.engagement[engagementRange === 'week' || engagementRange === 'month' ? 'month' : engagementRange === 'custom' ? 'day' : engagementRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'inquiries', label: '咨询数' },
          { key: 'sales', label: '订单数' },
          { key: 'rate', label: '咨询转化率', format: (v) => `${v}%` }
        ]}
      />

      <DataViewModal 
        isOpen={showLearningData}
        onClose={() => setShowLearningData(false)}
        title="证书获取数据"
        data={(c.contentData as any).acquisition[learningRange === 'week' || learningRange === 'month' ? 'month' : learningRange === 'custom' ? 'day' : learningRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'joined', label: '加入人数' },
          { key: 'acquired', label: '获取证书人数' },
          { key: 'rate', label: '证书获取率', format: (v) => `${v}%` }
        ]}
      />
    </div>
  );
}

function QuestionDashboard() {
  const [trendRange, setTrendRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [showTrendData, setShowTrendData] = useState(false);
  const q = MOCK_QUESTION_DASHBOARD;
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#14B8A6'];
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: '累计试题', value: q.totalQuestions },
          { label: '累计考试人次', value: q.totalExamsTaken.toLocaleString() },
          { label: '本周考试人次', value: q.weeklyExamsTaken.toLocaleString() },
          { label: '本周新增考试数', value: q.weeklyNewExams },
          { label: '本周刷题人次', value: q.weeklyPracticeTaken.toLocaleString() },
          { label: '本周新增刷题数', value: q.weeklyNewPractice },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">题库类型分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={q.typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {q.typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">考试类型分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={q.examTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {q.examTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Data */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">考试与刷题趋势</h3>
            <button 
              onClick={() => setShowTrendData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={trendRange} onChange={setTrendRange} color="blue" />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={q.trends[trendRange === 'week' || trendRange === 'month' ? 'month' : trendRange === 'custom' ? 'day' : trendRange]}>
              <defs>
                <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExamPass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPracticePass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPractice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Area type="monotone" dataKey="examParticipants" name="考试人数" stroke="#3B82F6" fill="url(#colorExams)" strokeWidth={3} />
              <Area type="monotone" dataKey="examPassCount" name="考试通过人数" stroke="#10B981" fill="url(#colorExamPass)" strokeWidth={3} />
              <Area type="monotone" dataKey="practiceParticipants" name="刷题人数" stroke="#F59E0B" fill="url(#colorPractice)" strokeWidth={3} />
              <Area type="monotone" dataKey="practicePassCount" name="刷题通过人数" stroke="#8B5CF6" fill="url(#colorPracticePass)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accuracy Comparison */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-8">各题目分类型正确率对比</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={q.practice.domainRate} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} width={120} />
              <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="rate" name="正确率(%)" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataViewModal 
        isOpen={showTrendData}
        onClose={() => setShowTrendData(false)}
        title="考试与刷题数据"
        data={q.trends[trendRange === 'week' || trendRange === 'month' ? 'month' : trendRange === 'custom' ? 'day' : trendRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'examParticipants', label: '考试人数' },
          { key: 'examPassCount', label: '考试通过人数' },
          { key: 'practiceParticipants', label: '刷题人数' },
          { key: 'practicePassCount', label: '刷题通过人数' }
        ]}
      />
    </div>
  );
}

function LearningDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [practiceRange, setPracticeRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');
  const [showTimeData, setShowTimeData] = useState(false);
  const [showPracticeData, setShowPracticeData] = useState(false);
  
  const l = MOCK_LEARNING_DASHBOARD;
  
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[
          { label: '人均单次学习时长', value: `${l.platformTime.day[29].sessionDuration}min`, color: 'blue' },
          { label: '单课程平均学习时长', value: `${l.courseTime.avgCourseDuration}h`, color: 'orange' },
          { label: '用户级完课率', value: `${l.completion.userRate}%`, color: 'green' },
          { label: '课程级完课率', value: `${l.completion.courseRate}%`, color: 'red' },
          { label: '平均完课周期', value: `${l.completion.cycle}天`, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">{s.label}</p>
            <p className={cn("text-2xl font-bold mt-1", `text-${s.color}-600`)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '累计完课人数', value: l.completion.completed.toLocaleString(), color: 'gray' },
          { label: '未完成人数', value: l.completion.uncompleted.toLocaleString(), color: 'gray' },
          { label: '人均日刷题量', value: l.practice.avgDailyQuestions, color: 'gray' },
          { label: '人均刷题正确率', value: `${l.practice.avgDailyAccuracy}%`, color: 'gray' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Time Analysis */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">平台人均学习时长趋势</h3>
            <button 
              onClick={() => setShowTimeData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={timeRange} onChange={setTimeRange} color="blue" />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={l.platformTime[timeRange === 'week' || timeRange === 'month' ? 'month' : timeRange === 'custom' ? 'day' : timeRange]}>
              <defs>
                <linearGradient id="learnDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="sessionDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Area type="monotone" dataKey="avgDuration" name="人均学习时长(min)" stroke="#3B82F6" fill="url(#learnDuration)" strokeWidth={3} />
              <Area type="monotone" dataKey="sessionDuration" name="人均单次时长(min)" stroke="#8B5CF6" fill="url(#sessionDuration)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Duration Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">课程学习时长分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l.courseTime.distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="课程数" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-8">单课程累计学习时长排行 (Top 5)</h3>
          <div className="space-y-4">
            {l.courseTime.topCourses.map((course, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  i < 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-700 truncate">{course.name}</span>
                    <span className="text-sm font-mono text-gray-500">{course.cumulativeTime.toLocaleString()} h</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(course.cumulativeTime / l.courseTime.topCourses[0].cumulativeTime) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="bg-blue-600 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Analysis */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">刷题量与正确率趋势</h3>
            <button 
              onClick={() => setShowPracticeData(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
            >
              <FileText size={14} />
              查看数据
            </button>
          </div>
          <TimeRangeSelector range={practiceRange} onChange={setPracticeRange} color="orange" />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={l.practice.trends[practiceRange === 'week' || practiceRange === 'month' ? 'month' : practiceRange === 'custom' ? 'day' : practiceRange]}>
              <defs>
                <linearGradient id="practiceQuestions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="practiceAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#10B981', fontSize: 10}} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="questions" name="人均刷题量" stroke="#F59E0B" fill="url(#practiceQuestions)" strokeWidth={3} />
              <Area yAxisId="right" type="monotone" dataKey="accuracy" name="人均正确率(%)" stroke="#10B981" fill="url(#practiceAccuracy)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accuracy Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">试题正确率区间分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l.practice.accuracyDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="人数" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Accuracy */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">单题型正确率对比</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l.practice.typeAccuracy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} width={70} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="accuracy" name="正确率(%)" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-8">学习完课周期分布</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={l.completion.cycleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {l.completion.cycleDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataViewModal 
        isOpen={showTimeData}
        onClose={() => setShowTimeData(false)}
        title="学习时长趋势数据"
        data={l.platformTime[timeRange === 'week' || timeRange === 'month' ? 'month' : timeRange === 'custom' ? 'day' : timeRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'avgDuration', label: '人均学习时长(min)' },
          { key: 'sessionDuration', label: '人均单次时长(min)' }
        ]}
      />

      <DataViewModal 
        isOpen={showPracticeData}
        onClose={() => setShowPracticeData(false)}
        title="刷题与正确率数据"
        data={l.practice.trends[practiceRange === 'week' || practiceRange === 'month' ? 'month' : practiceRange === 'custom' ? 'day' : practiceRange]}
        columns={[
          { key: 'date', label: '日期' },
          { key: 'questions', label: '人均刷题量' },
          { key: 'accuracy', label: '人均正确率(%)' }
        ]}
      />
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
