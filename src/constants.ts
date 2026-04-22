import { LiveItem, LiveStatus, CompletionConditionType, StudentStudyDetail, TaskDetail, StudyStatus, ViewPermission, TenantItem, CourseStatItem, TaskStatItem, UserProfile, FormItem, ClassItem, DiscussionItem, AnnouncementItem, GroupFileItem, ResourceFile } from './types';
import { isAfter, isBefore, addMinutes, subMinutes } from 'date-fns';

export const MOCK_USERS: UserProfile[] = [
  { id: '1', name: '李利', account: '18599125210', phone: '18599125210' },
  { id: '2', name: '周海伟', account: '15010210100', phone: '15010210100' },
  { id: '3', name: '杨浩男', account: '18334794607', phone: '18334794607' },
  { id: '4', name: '张三', account: '15259574132', phone: '15259574132' },
  { id: '5', name: '15321271557', account: '15321271557', phone: '15321271557' },
  { id: '6', name: '官老师', account: '18512219988', phone: '18512219988' },
  { id: '7', name: '丹凤', account: '18239859528', phone: '18239859528' },
  { id: '8', name: '王水亮', account: '13552272069', phone: '13552272069' },
  { id: '9', name: '090210', account: '13799329252', phone: '13799329252' },
  { id: '10', name: 'newlandschool...', account: '13685032567', phone: '13685032567' },
];

export const MOCK_CLASSES: ClassItem[] = [
  {
    id: '1',
    name: '单片机技术及应用测试班级',
    cover: 'https://picsum.photos/seed/class1/800/450',
    progress: 0,
    studentCount: 0,
    price: 0,
    viewCount: 13,
    lecturer: '侯榕婷',
    category: '物联网',
    direction: '物联网',
    validUntil: '2026-12-31',
    isJoined: false,
    introduction: '暂无简介哦~',
    courses: [
      { id: 'c1', title: '单片机技术及应用', cover: 'https://picsum.photos/seed/course1/800/450', progress: 0 }
    ],
    classTeacher: { 
      name: '侯榕婷', 
      avatar: 'https://i.pravatar.cc/150?u=teacher1',
      title: '高级讲师',
      intro: '深耕物联网领域多年，具有丰富的实战经验。'
    },
    students: []
  },
  {
    id: '2',
    name: '物联网2026',
    cover: 'https://picsum.photos/seed/class2/800/450',
    progress: 45,
    studentCount: 5,
    price: 10,
    viewCount: 120,
    lecturer: '詹思蓉',
    category: '物联网',
    direction: '语音识别',
    validUntil: '2026-06-30',
    isJoined: true,
    courses: [
      { id: 'c1', title: '物联网设备装调与维护', cover: 'https://picsum.photos/seed/course1/800/450', progress: 45 }
    ],
    classTeacher: { name: '詹思蓉', avatar: 'https://i.pravatar.cc/150?u=teacher1' },
    students: [
      { id: 's1', name: '王水亮', avatar: 'https://i.pravatar.cc/150?u=student1' }
    ]
  }
];

export const MOCK_DISCUSSIONS: DiscussionItem[] = [
  {
    id: 'd1',
    type: 'question',
    title: '关于单片机中断系统的疑问',
    author: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    role: '班主任',
    content: '老师，请问在中断嵌套中，如何设置优先级？',
    time: '2026-04-14 09:00',
    floor: 1,
    likes: 12,
    viewCount: 9,
    source: '来源: 班级研修 - 讨论区',
    isPinned: true,
    isEssence: true,
    lastReplyBy: 'wangshuiliang',
    lastReplyTime: '2小时前',
    replies: [
      {
        id: 'r1',
        author: '侯老师',
        avatar: 'https://i.pravatar.cc/150?u=teacher1',
        role: '老师',
        content: '中断优先级可以通过IP寄存器来设置。',
        time: '3小时前',
        likes: 2,
        replies: [
          {
            id: 'r1-1',
            author: 'admin',
            avatar: 'https://i.pravatar.cc/150?u=admin',
            role: '班主任',
            content: '谢谢老师，那如果是多级嵌套呢？',
            time: '2小时前',
            likes: 1
          }
        ]
      },
      {
        id: 'r2',
        author: 'wangshuiliang',
        avatar: 'https://i.pravatar.cc/150?u=student1',
        content: '同问，我也在纠结这个问题。',
        time: '2小时前',
        likes: 0
      }
    ]
  },
  {
    id: 'd2',
    type: 'topic',
    title: '大家对物联网未来发展的看法',
    author: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    role: '助教',
    content: '欢迎大家在这里畅所欲言，分享你对物联网行业的见解。',
    time: '06-18',
    floor: 2,
    likes: 5,
    viewCount: 45,
    isPinned: false,
    replies: []
  }
];

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'a1',
    title: '开班通知',
    content: '本班级于2026年4月14日正式开班，请各位学员按时参加学习。',
    time: '2026-04-14 08:00',
    isRead: false
  },
  {
    id: 'a2',
    title: '学习手册发布',
    content: '班级学习手册已上传至群文件，请大家自行下载查看。',
    time: '2026-04-13 18:00',
    isRead: true
  }
];

export const MOCK_GROUP_FILES: GroupFileItem[] = [
  {
    id: 'f1',
    name: '2026物联网学习大纲.pdf',
    size: '1.2MB',
    uploader: '詹思蓉',
    uploaderRole: '班主任',
    time: '2026-04-14 08:30',
    type: 'pdf',
    isPinned: true
  },
  {
    id: 'f2',
    name: '实验指导书.doc',
    size: '3.5MB',
    uploader: '詹思蓉',
    uploaderRole: '老师',
    time: '2026-04-14 08:35',
    type: 'doc'
  }
];

export const MOCK_RESOURCES: ResourceFile[] = [
  { id: 'res1', name: '物联网基础架构.pdf', type: 'pdf', size: '2.4MB', uploadTime: '2026-04-10 10:00' },
  { id: 'res2', name: '单片机原理图.ppt', type: 'ppt', size: '5.1MB', uploadTime: '2026-04-11 14:30' },
  { id: 'res3', name: '传感器数据表.xls', type: 'xls', size: '0.8MB', uploadTime: '2026-04-12 09:15' },
  { id: 'res4', name: 'C语言开发指南.doc', type: 'doc', size: '1.5MB', uploadTime: '2026-04-13 16:45' },
];

export const MOCK_FORMS: FormItem[] = [
  { id: '1', name: '123', bookedCount: 0, checkInCount: 0, creator: '管理员', status: 'published' },
  { id: '2', name: '李破山', bookedCount: 0, checkInCount: 0, creator: '186115...', status: 'draft' },
  { id: '3', name: '123', bookedCount: 0, checkInCount: 0, creator: '管理员', status: 'draft' },
  { id: '4', name: '3', bookedCount: 0, checkInCount: 0, creator: '186115...', status: 'draft' },
  { id: '5', name: '李破山', bookedCount: 0, checkInCount: 0, creator: '186115...', status: 'draft' },
];

export const MOCK_LIVES: LiveItem[] = [
  {
    id: '1',
    title: '2026年春季教师资格证考试大纲解析',
    cover: 'https://picsum.photos/seed/live1/800/450',
    startTime: new Date().toISOString(), // Ongoing
    duration: 60,
    completionCondition: { type: CompletionConditionType.ENTER_PAGE },
    canReplay: true,
    introduction: `
      <div class="space-y-4">
        <p><strong>直播背景：</strong> 随着2026年春季教师资格证考试的临近，广大考生进入了最后的冲刺阶段。本次直播旨在为考生提供最权威、最及时的考试大纲解读。</p>
        <h4 class="text-lg font-bold text-gray-800">直播核心内容：</h4>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li><strong>大纲变化深度对比：</strong> 逐条分析2026年新版大纲与往年的差异点。</li>
          <li><strong>高频考点预测：</strong> 基于大数据分析，梳理各学科的核心考点与命题趋势。</li>
          <li><strong>备考策略指导：</strong> 针对不同基础的考生，提供个性化的复习计划建议。</li>
          <li><strong>在线答疑环节：</strong> 专家现场回答考生关于报名、审核及备考中的疑难问题。</li>
        </ul>
        <p>无论你是初次报考还是再次挑战，这场直播都将为你拨开云雾，助力你顺利通关！</p>
      </div>
    `,
    lecturer: '张教授',
    viewPermission: ViewPermission.GUEST,
    createdAt: subMinutes(new Date(), 1000).toISOString(),
  },
  {
    id: '2',
    title: '人工智能在现代教育中的应用实践',
    cover: 'https://picsum.photos/seed/live2/800/450',
    startTime: addMinutes(new Date(), 10).toISOString(), // Not started (soon)
    duration: 90,
    completionCondition: { type: CompletionConditionType.STAY_DURATION, value: 30 },
    canReplay: false,
    introduction: `
      <div class="space-y-4">
        <p><strong>课程简介：</strong> AI技术正在以前所未有的速度重塑教育行业。本讲座将深入探讨人工智能在课堂教学、个性化学习以及教学管理中的实际应用。</p>
        <h4 class="text-lg font-bold text-gray-800">您将学到：</h4>
        <ul class="list-decimal list-inside space-y-2 text-gray-600">
          <li><strong>AI辅助教学工具：</strong> 介绍当前最热门的AI助教工具及其使用技巧。</li>
          <li><strong>个性化学习路径：</strong> 如何利用AI算法为每位学生定制专属的学习计划。</li>
          <li><strong>智能评估与反馈：</strong> 探索AI在作业批改与学情分析中的高效应用。</li>
          <li><strong>未来教育趋势：</strong> 展望AI时代下教师角色的转变与职业发展。</li>
        </ul>
        <p>加入我们，一起探索教育的无限可能！</p>
      </div>
    `,
    lecturer: '李博士',
    viewPermission: ViewPermission.REGISTERED,
    createdAt: subMinutes(new Date(), 500).toISOString(),
  },
  {
    id: '3',
    title: '职业教育数字化转型专题讲座',
    cover: 'https://picsum.photos/seed/live3/800/450',
    startTime: subMinutes(new Date(), 120).toISOString(), // Ended
    duration: 60,
    completionCondition: { type: CompletionConditionType.ENTER_PAGE },
    canReplay: true,
    introduction: `
      <div class="space-y-4">
        <p><strong>讲座背景：</strong> 数字化转型已成为职业教育高质量发展的必由之路。本次专题讲座邀请了多位行业专家，共同探讨职业院校数字化转型的路径与实践。</p>
        <h4 class="text-lg font-bold text-gray-800">精彩看点：</h4>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li><strong>政策导向解读：</strong> 深度剖析国家关于职业教育数字化转型的最新政策文件。</li>
          <li><strong>标杆案例分享：</strong> 展示国内领先职业院校在智慧校园、数字化资源建设方面的成功经验。</li>
          <li><strong>产教融合新模式：</strong> 探讨数字化背景下校企合作、产教融合的新路径。</li>
          <li><strong>转型痛点剖析：</strong> 直击职业院校在转型过程中遇到的技术、人才及机制障碍。</li>
        </ul>
        <p>通过本次讲座，您将获得可借鉴、可落地的数字化转型方案，引领学校迈向智慧教育新时代。</p>
      </div>
    `,
    lecturer: '王教授',
    viewPermission: ViewPermission.GUEST_WITH_FORM,
    formFields: ['姓名', '手机号'],
    createdAt: subMinutes(new Date(), 100).toISOString(),
  },
];

export const getLiveStatus = (live: LiveItem): LiveStatus => {
  const now = new Date();
  const start = new Date(live.startTime);
  const end = addMinutes(start, live.duration);

  if (isBefore(now, start)) return LiveStatus.NOT_STARTED;
  if (isAfter(now, end)) return LiveStatus.ENDED;
  return LiveStatus.ONGOING;
};

export const MOCK_STUDENT_DETAILS: StudentStudyDetail[] = [
  { id: '1', username: '尹沁伊人', phone: '13800138001', idCard: '440101********1234', readNotice: true, startTime: '2026-03-05 09:00', endTime: '2026-03-05 11:00', status: StudyStatus.COMPLETED, totalDuration: 120, questions: 2, notes: 5 },
  { id: '2', username: '张三', phone: '13911112222', idCard: '110101********5678', readNotice: true, startTime: '2026-03-06 14:00', status: StudyStatus.ONGOING, totalDuration: 45, questions: 0, notes: 1 },
  { id: '3', username: '李四', phone: '13733334444', idCard: '310101********9012', readNotice: false, status: StudyStatus.NOT_STARTED, totalDuration: 0, questions: 0, notes: 0 },
  { id: '4', username: '王五', phone: '13655556666', idCard: '510101********3456', readNotice: true, startTime: '2026-03-07 10:00', endTime: '2026-03-07 10:30', status: StudyStatus.COMPLETED, totalDuration: 30, questions: 1, notes: 2 },
  { id: '5', username: '赵六', phone: '13577778888', idCard: '610101********7890', readNotice: true, startTime: '2026-03-08 16:00', status: StudyStatus.ONGOING, totalDuration: 15, questions: 3, notes: 0 },
  { id: '6', username: '钱七', phone: '13499990000', idCard: '210101********1122', readNotice: false, status: StudyStatus.NOT_STARTED, totalDuration: 0, questions: 0, notes: 0 },
  { id: '7', username: '孙八', phone: '13311113333', idCard: '420101********3344', readNotice: true, startTime: '2026-03-09 08:30', endTime: '2026-03-09 12:00', status: StudyStatus.COMPLETED, totalDuration: 210, questions: 5, notes: 8 },
  { id: '8', username: '周九', phone: '13222224444', idCard: '530101********5566', readNotice: true, startTime: '2026-03-10 13:00', status: StudyStatus.ONGOING, totalDuration: 60, questions: 1, notes: 3 },
];

export const MOCK_TASKS: TaskDetail[] = [
  { id: '1', name: '任务1：大数据概论', progress: 100, status: StudyStatus.COMPLETED },
  { id: '2', name: '任务2：Hadoop架构', progress: 80, status: StudyStatus.ONGOING },
  { id: '3', name: '任务3：Spark计算', progress: 0, status: StudyStatus.NOT_STARTED },
  { id: '4', name: '任务4：数据仓库', progress: 100, status: StudyStatus.COMPLETED },
  { id: '5', name: '任务5：数据可视化', progress: 30, status: StudyStatus.ONGOING },
  { id: '6', name: '任务6：实操项目', progress: 0, status: StudyStatus.NOT_STARTED },
  { id: '7', name: '任务7：期末测试', progress: 0, status: StudyStatus.NOT_STARTED },
];

export const MOCK_TENANTS: TenantItem[] = [
  { id: '1', name: '北京教育学院', liveCount: 15, availableDuration: 500, usedDuration: 120.5 },
  { id: '2', name: '上海师范大学', liveCount: 8, availableDuration: 300, usedDuration: 45.2 },
  { id: '3', name: '广州职业技术学院', liveCount: 22, availableDuration: 1000, usedDuration: 850.75 },
];

export const MOCK_COURSE_STATS: CourseStatItem[] = [
  { id: '1', name: '2026年教师资格证冲刺班', hours: 48, taskCount: 12, viewCount: 1250, studentCount: 450, joinedCount: 380 },
  { id: '2', name: '人工智能基础与应用', hours: 32, taskCount: 8, viewCount: 890, studentCount: 320, joinedCount: 290 },
  { id: '3', name: '数字化转型实战手册', hours: 16, taskCount: 5, viewCount: 450, studentCount: 180, joinedCount: 150 },
];

export const MOCK_TASK_STATS: TaskStatItem[] = [
  { id: '1', name: '任务1：大数据概论', type: '视频', videoLength: 45, learners: 450, completers: 380, cumulativeDuration: 15200, avgDuration: 33.7, avgScore: 0 },
  { id: '2', name: '任务2：Hadoop架构', type: '视频', videoLength: 60, learners: 420, completers: 310, cumulativeDuration: 18600, avgDuration: 44.2, avgScore: 0 },
  { id: '3', name: '任务3：期中考试', type: '考试', videoLength: 0, learners: 350, completers: 345, cumulativeDuration: 0, avgDuration: 0, avgScore: 85.5 },
];

export const MOCK_DASHBOARD_OVERVIEW = {
  totalRegistered: 12580,
  monthlyRegistered: 1250,
  dau: 1250,
  monthlyActive: 18500,
  totalLearningDuration: 45800,
  totalSales: 125800,
  monthlySalesRevenue: 15800,
  monthlySalesVolume: 450,
  completionRate: 85.5,
  trends: {
    day: Array.from({ length: 30 }, (_, i) => {
      const reg_pc = Math.floor(Math.random() * 50) + 30;
      const reg_h5 = Math.floor(Math.random() * 40) + 20;
      const act_pc = Math.floor(Math.random() * 300) + 400;
      const act_h5 = Math.floor(Math.random() * 200) + 400;
      return {
        date: `04-${String(i + 1).padStart(2, '0')}`,
        registered: reg_pc + reg_h5,
        reg_pc,
        reg_h5,
        active: act_pc + act_h5,
        act_pc,
        act_h5,
      };
    }),
    week: Array.from({ length: 12 }, (_, i) => {
      const reg_pc = Math.floor(Math.random() * 300) + 150;
      const reg_h5 = Math.floor(Math.random() * 200) + 150;
      const act_pc = Math.floor(Math.random() * 1000) + 2000;
      const act_h5 = Math.floor(Math.random() * 1000) + 2000;
      return {
        date: `W${i + 1}`,
        registered: reg_pc + reg_h5,
        reg_pc,
        reg_h5,
        active: act_pc + act_h5,
        act_pc,
        act_h5,
      };
    }),
    month: Array.from({ length: 12 }, (_, i) => {
      const reg_pc = Math.floor(Math.random() * 1200) + 500;
      const reg_h5 = Math.floor(Math.random() * 800) + 500;
      const act_pc = Math.floor(Math.random() * 4000) + 7000;
      const act_h5 = Math.floor(Math.random() * 4000) + 8000;
      return {
        date: `2023-${String(i + 1).padStart(2, '0')}`,
        registered: reg_pc + reg_h5,
        reg_pc,
        reg_h5,
        active: act_pc + act_h5,
        act_pc,
        act_h5,
      };
    })
  },
  salesTrend: {
    day: Array.from({ length: 30 }, (_, i) => {
      const s_pc = Math.floor(Math.random() * 30) + 10;
      const s_h5 = Math.floor(Math.random() * 20) + 10;
      const r_pc = Math.floor(Math.random() * 3000) + 1000;
      const r_h5 = Math.floor(Math.random() * 2000) + 1000;
      return {
        date: `04-${String(i + 1).padStart(2, '0')}`,
        sales: s_pc + s_h5,
        sales_pc: s_pc,
        sales_h5: s_h5,
        revenue: r_pc + r_h5,
        revenue_pc: r_pc,
        revenue_h5: r_h5,
      };
    }),
    week: Array.from({ length: 12 }, (_, i) => {
      const s_pc = Math.floor(Math.random() * 200) + 50;
      const s_h5 = Math.floor(Math.random() * 100) + 50;
      const r_pc = Math.floor(Math.random() * 20000) + 5000;
      const r_h5 = Math.floor(Math.random() * 10000) + 5000;
      return {
        date: `W${i + 1}`,
        sales: s_pc + s_h5,
        sales_pc: s_pc,
        sales_h5: s_h5,
        revenue: r_pc + r_h5,
        revenue_pc: r_pc,
        revenue_h5: r_h5,
      };
    }),
    month: Array.from({ length: 12 }, (_, i) => {
      const s_pc = Math.floor(Math.random() * 800) + 200;
      const s_h5 = Math.floor(Math.random() * 400) + 300;
      const r_pc = Math.floor(Math.random() * 80000) + 20000;
      const r_h5 = Math.floor(Math.random() * 40000) + 30000;
      return {
        date: `2023-${String(i + 1).padStart(2, '0')}`,
        sales: s_pc + s_h5,
        sales_pc: s_pc,
        sales_h5: s_h5,
        revenue: r_pc + r_h5,
        revenue_pc: r_pc,
        revenue_h5: r_h5,
      };
    })
  },
  funnels: [
    { title: '全部', browsing: 12500, consultation: 4500, purchase: 1200, repurchase: 450 },
    { title: '课程', browsing: 8500, consultation: 3200, purchase: 850, repurchase: 320 },
    { title: '证书', browsing: 2500, consultation: 800, purchase: 220, repurchase: 85 },
    { title: '班级', browsing: 1500, consultation: 500, purchase: 130, repurchase: 42 },
  ],
  topCourses: [
    { name: '2026年教师资格证冲刺班', sales: 450, revenue: 45000, views: 12500, joined: 3800, consultation: 1250, isPaid: true },
    { name: '人工智能基础与应用', sales: 320, revenue: 32000, views: 8900, joined: 2900, consultation: 850, isPaid: true },
    { name: '数字化转型实战手册', sales: 0, revenue: 0, views: 4500, joined: 1500, consultation: 0, isPaid: false },
    { name: 'Python数据分析实战', sales: 150, revenue: 15000, views: 3200, joined: 1200, consultation: 310, isPaid: true },
    { name: '开源技术分享讲座', sales: 0, revenue: 0, views: 2800, joined: 1000, consultation: 0, isPaid: false }
  ],
  topClasses: [
    { name: '人工智能', type: 'domain', sales: 1250, revenue: 125000, views: 45000, joined: 12000, consultation: 4200 },
    { name: '大数据', type: 'domain', sales: 980, revenue: 98000, views: 32000, joined: 8500, consultation: 3100 },
    { name: '计算机视觉', type: 'direction', sales: 850, revenue: 85000, views: 28000, joined: 7200, consultation: 2500 },
    { name: '物联网', type: 'domain', sales: 720, revenue: 72000, views: 21000, joined: 5800, consultation: 1800 },
    { name: 'AI技术', type: 'direction', sales: 680, revenue: 68000, views: 19000, joined: 5200, consultation: 1500 }
  ],
  topCerts: [
    { name: '高级人工智能工程师', sales: 250, revenue: 250000, views: 12000, joined: 220, consultation: 650 },
    { name: '大数据架构师认证', sales: 180, revenue: 180000, views: 8500, joined: 150, consultation: 480 },
    { name: '数字化转型专家', sales: 150, revenue: 150000, views: 6200, joined: 130, consultation: 320 },
    { name: 'Python开发证书', sales: 120, revenue: 120000, views: 4500, joined: 100, consultation: 210 },
    { name: '云计算架构师', sales: 95, revenue: 95000, views: 3200, joined: 80, consultation: 150 }
  ],
  topQuestions: [
    { type: '大数据', count: 15800 },
    { type: '人工智能', count: 12500 },
    { type: '物联网', count: 9800 },
    { type: '工业互联网', count: 7200 },
    { type: '区块链', count: 5600 },
    { type: '创新创业', count: 4200 }
  ]
};

export const MOCK_USER_STATS = {
  dailyReg: 156,
  dailyLogin: 1120,
  dau: 1250,
  wau: 5800,
  mau: 18500,
  totalUv: 45800,
  totalRegistered: 12580,
  paidUsers: 3450,
  newChurnCount: 42,
  growthTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 100) + 50,
      pc: Math.floor(Math.random() * 40) + 20,
      h5: Math.floor(Math.random() * 60) + 30
    })),
    week: Array.from({ length: 30 }, (_, i) => ({
      date: `W${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 500) + 300,
      pc: Math.floor(Math.random() * 200) + 100,
      h5: Math.floor(Math.random() * 300) + 200
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
      date: `M${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 2000) + 1000,
      pc: Math.floor(Math.random() * 800) + 400,
      h5: Math.floor(Math.random() * 1200) + 600
    }))
  },
  activityTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 500) + 800,
      pc: Math.floor(Math.random() * 200) + 300,
      h5: Math.floor(Math.random() * 300) + 500
    })),
    week: Array.from({ length: 30 }, (_, i) => ({
      date: `W${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 2000) + 4000,
      pc: Math.floor(Math.random() * 800) + 1500,
      h5: Math.floor(Math.random() * 1200) + 2500
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
      date: `M${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 8000) + 15000,
      pc: Math.floor(Math.random() * 3000) + 6000,
      h5: Math.floor(Math.random() * 5000) + 9000
    }))
  },
  churnTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 20) + 10,
      pc: Math.floor(Math.random() * 8) + 4,
      h5: Math.floor(Math.random() * 12) + 6
    })),
    week: Array.from({ length: 30 }, (_, i) => ({
      date: `W${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 100) + 50,
      pc: Math.floor(Math.random() * 40) + 20,
      h5: Math.floor(Math.random() * 60) + 30
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
      date: `M${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 400) + 200,
      pc: Math.floor(Math.random() * 150) + 80,
      h5: Math.floor(Math.random() * 250) + 120
    }))
  },
  durationTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 40) + 20,
      pc: Math.floor(Math.random() * 50) + 30,
      h5: Math.floor(Math.random() * 30) + 15
    })),
    week: Array.from({ length: 30 }, (_, i) => ({
      date: `W${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 45) + 25,
      pc: Math.floor(Math.random() * 55) + 35,
      h5: Math.floor(Math.random() * 35) + 20
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
      date: `M${String(i + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 50) + 30,
      pc: Math.floor(Math.random() * 60) + 40,
      h5: Math.floor(Math.random() * 40) + 25
    }))
  },
  retentionMatrix: {
    day: Array.from({ length: 15 }, (_, i) => ({
      date: `2026-04-${String(15 - i).padStart(2, '0')}`,
      total: Math.floor(Math.random() * 500) + 500,
      values: Array.from({ length: 15 - i }, (_, j) => Math.floor(Math.random() * 20) + (j === 0 ? 80 : 10))
    })),
    week: Array.from({ length: 15 }, (_, i) => ({
      date: `2026-W${String(15 - i).padStart(2, '0')}`,
      total: Math.floor(Math.random() * 2000) + 2000,
      values: Array.from({ length: 15 - i }, (_, j) => Math.floor(Math.random() * 15) + (j === 0 ? 70 : 5))
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `2025-${String(12 - i).padStart(2, '0')}`,
      total: Math.floor(Math.random() * 8000) + 8000,
      values: Array.from({ length: 12 - i }, (_, j) => Math.floor(Math.random() * 10) + (j === 0 ? 60 : 2))
    }))
  },
  distribution: {
    gender: [
      { name: '男', value: 45 },
      { name: '女', value: 55 }
    ],
    education: [
      { name: '本科', value: 60 },
      { name: '硕士', value: 25 },
      { name: '博士', value: 5 },
      { name: '其他', value: 10 }
    ],
    position: [
      { name: '教师', value: 30 },
      { name: '工程师', value: 40 },
      { name: '产品经理', value: 15 },
      { name: '学生', value: 10 },
      { name: '其他', value: 5 }
    ]
  },
  loginLogs: Array.from({ length: 50 }, (_, i) => ({
    id: `L${1000 + i}`,
    nickname: `用户${i + 1}`,
    account: `183592000${String(i + 1).padStart(2, '0')}`,
    channel: i % 2 === 0 ? '微信' : 'PC',
    loginTime: '2026-04-14 22:30',
    ip: `192.168.1.${i + 1}`,
    device: i % 2 === 0 ? 'iPhone 13' : 'Windows 11'
  }))
};

export const MOCK_ORG_USERS = Array.from({ length: 15 }, (_, i) => ({
  id: `U${1000 + i}`,
  realName: i < 2 ? `学员${12 - i}` : i < 6 ? `学生${10 - i + 2}` : `用户${i + 1}`,
  loginAccount: `183592000${12 - i}`,
  phone: `183592000${12 - i}`,
  role: i === 6 ? '教师' : '学员',
  createTime: `2026-03-${23 - Math.floor(i/3)} 16:35:59`,
  status: '正常',
  wechatOpenId: `openid_${Math.random().toString(36).substring(7)}`,
  wechatNickname: `微信昵称${i + 1}`,
  gender: i % 2 === 0 ? '男' : '女',
  idCard: `11010119900101${1000 + i}`,
  school: i % 3 === 0 ? '北京大学' : i % 3 === 1 ? '清华大学' : '复旦大学',
  education: i % 2 === 0 ? '本科' : '硕士',
  position: i % 2 === 0 ? '开发工程师' : '产品经理'
}));

export const MOCK_COURSE_DASHBOARD = {
  totalPublished: 128,
  activeCount: 115,
  inactiveCount: 13,
  weeklyNew: 12,
  totalSalesVolume: 4580,
  periodSales: 320,
  periodRevenue: 4580,
  studentCount: 5280,
  avgHours: 4.2,
  totalHours: 19236,
  completionRate: 65.4,
  conversion: {
    pv: 12500,
    uv: 8500,
    favorites: 1250,
    inquiries: 450,
    rate: 14.7,
    sales: 450,
    revenue: 45800
  },
  contentData: {
    browsing: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        pv: Math.floor(Math.random() * 1000) + 500,
        uv: Math.floor(Math.random() * 600) + 300
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        pv: Math.floor(Math.random() * 5000) + 2000,
        uv: Math.floor(Math.random() * 3000) + 1000
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        pv: Math.floor(Math.random() * 20000) + 10000,
        uv: Math.floor(Math.random() * 12000) + 6000
      }))
    },
    engagement: {
      day: Array.from({ length: 30 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 50) + 20;
        const sales = Math.floor(Math.random() * 15) + 5;
        return {
          date: `04-${String(i + 1).padStart(2, '0')}`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      }),
      week: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 250) + 100;
        const sales = Math.floor(Math.random() * 80) + 20;
        return {
          date: `W${i + 1}`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      }),
      month: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 1000) + 500;
        const sales = Math.floor(Math.random() * 300) + 100;
        return {
          date: `${i + 1}月`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      })
    },
    learning: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        joined: Math.floor(Math.random() * 200) + 100,
        completed: Math.floor(Math.random() * 120) + 50
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        joined: Math.floor(Math.random() * 1000) + 500,
        completed: Math.floor(Math.random() * 600) + 300
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        joined: Math.floor(Math.random() * 4000) + 2000,
        completed: Math.floor(Math.random() * 2500) + 1200
      }))
    }
  },
  typeRanking: {
    domain: {
      total: [
  { name: '物联网', count: 45, pv: 12000, uv: 8000, inquiries: 450, sales: 120 },
  { name: '人工智能', count: 38, pv: 15000, uv: 9500, inquiries: 520, sales: 150 },
  { name: '工业互联网', count: 25, pv: 8000, uv: 5000, inquiries: 210, sales: 60 },
  { name: '大数据', count: 32, pv: 11000, uv: 7200, inquiries: 380, sales: 110 },
  { name: '区块链', count: 15, pv: 4500, uv: 3000, inquiries: 120, sales: 40 },
  { name: '数字商科', count: 22, pv: 6500, uv: 4200, inquiries: 180, sales: 55 },
  { name: '孪生元宇宙', count: 12, pv: 3800, uv: 2500, inquiries: 95, sales: 30 },
  { name: '软件与信息技术', count: 40, pv: 13500, uv: 8800, inquiries: 480, sales: 135 },
  { name: '双创', count: 18, pv: 5200, uv: 3500, inquiries: 150, sales: 48 }
],
week: [
  { name: '物联网', count: 5, pv: 1200, uv: 800, inquiries: 45, sales: 12 },
  { name: '人工智能', count: 4, pv: 1500, uv: 950, inquiries: 52, sales: 15 },
  { name: '软件与信息技术', count: 6, pv: 1350, uv: 880, inquiries: 48, sales: 13 }
],
month: [
  { name: '物联网', count: 15, pv: 4500, uv: 3000, inquiries: 150, sales: 45 },
  { name: '人工智能', count: 12, pv: 5000, uv: 3200, inquiries: 180, sales: 50 },
  { name: '软件与信息技术', count: 18, pv: 4800, uv: 3100, inquiries: 160, sales: 48 }
]
},
position: {
total: [
  { name: '教师', count: 25, pv: 8500, uv: 5500, inquiries: 280, sales: 85 },
  { name: '物联网工程师', count: 32, pv: 11500, uv: 7500, inquiries: 420, sales: 115 },
  { name: '硬件工程师', count: 28, pv: 9500, uv: 6200, inquiries: 350, sales: 95 },
  { name: '软件工程师', count: 45, pv: 16500, uv: 10500, inquiries: 580, sales: 165 },
  { name: '人工智能开发工程师', count: 35, pv: 14500, uv: 9200, inquiries: 510, sales: 145 },
  { name: '数据运维师', count: 22, pv: 7500, uv: 4800, inquiries: 240, sales: 75 },
  { name: '测试工程师', count: 26, pv: 8800, uv: 5800, inquiries: 290, sales: 88 },
  { name: '嵌入式软件工程师', count: 30, pv: 10800, uv: 7000, inquiries: 380, sales: 108 },
  { name: '产品经理', count: 20, pv: 6800, uv: 4500, inquiries: 190, sales: 68 },
  { name: '大数据工程师', count: 34, pv: 12800, uv: 8200, inquiries: 450, sales: 128 }
],
week: [
  { name: '软件工程师', count: 8, pv: 2500, uv: 1500, inquiries: 80, sales: 25 },
  { name: '人工智能开发工程师', count: 6, pv: 2200, uv: 1300, inquiries: 70, sales: 22 }
],
month: [
  { name: '软件工程师', count: 25, pv: 8500, uv: 5500, inquiries: 280, sales: 85 },
  { name: '人工智能开发工程师', count: 20, pv: 7500, uv: 4800, inquiries: 240, sales: 75 }
]
},
certification: {
total: [
  { name: '行业认证', count: 45, pv: 15000, uv: 9500, inquiries: 550, sales: 150 },
  { name: '工信部教考中心专项技术证书', count: 32, pv: 11000, uv: 7200, inquiries: 380, sales: 110 },
  { name: '数字技术工程师', count: 28, pv: 9500, uv: 6200, inquiries: 320, sales: 95 },
  { name: '职业技能等级证书', count: 35, pv: 12500, uv: 8000, inquiries: 420, sales: 125 }
],
week: [
  { name: '行业认证', count: 5, pv: 1500, uv: 950, inquiries: 55, sales: 15 },
  { name: '职业技能等级证书', count: 4, pv: 1250, uv: 800, inquiries: 42, sales: 12 }
],
month: [
  { name: '行业认证', count: 15, pv: 4500, uv: 3000, inquiries: 150, sales: 45 },
  { name: '职业技能等级证书', count: 12, pv: 4200, uv: 2800, inquiries: 140, sales: 42 }
]
    }
  },
  salesTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 5000) + 2000
    })),
    week: Array.from({ length: 12 }, (_, i) => ({
      date: `W${i + 1}`,
      sales: Math.floor(Math.random() * 250) + 100,
      revenue: Math.floor(Math.random() * 25000) + 10000
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}月`,
      sales: Math.floor(Math.random() * 1000) + 400,
      revenue: Math.floor(Math.random() * 100000) + 40000
    }))
  },
  newAdditions: {
    weekly: [
      { name: '第1周', value: 12 },
      { name: '第2周', value: 15 },
      { name: '第3周', value: 10 },
      { name: '第4周', value: 18 }
    ],
    monthly: [
      { name: '1月', value: 45 },
      { name: '2月', value: 52 },
      { name: '3月', value: 48 },
      { name: '4月', value: 35 }
    ]
  }
};

export const MOCK_CERT_DASHBOARD = {
  totalPublished: 45,
  weeklyNew: 3,
  totalSalesVolume: 1250,
  periodSales: 85,
  periodRevenue: 12400,
  studentCount: 4500,
  totalIssued: 3800,
  acquisitionRate: 84.4,
  revenue: 12500,
  conversion: {
    revenue: 185000
  },
  contentData: {
    browsing: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        pv: Math.floor(Math.random() * 800) + 300,
        uv: Math.floor(Math.random() * 400) + 150
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        pv: Math.floor(Math.random() * 4000) + 2000,
        uv: Math.floor(Math.random() * 2000) + 1000
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        pv: Math.floor(Math.random() * 15000) + 8000,
        uv: Math.floor(Math.random() * 8000) + 4000
      }))
    },
    engagement: {
      day: Array.from({ length: 30 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 40) + 10;
        const sales = Math.floor(Math.random() * 10) + 2;
        return {
          date: `04-${String(i + 1).padStart(2, '0')}`,
          sales,
          inquiries,
          rate: Number(((sales / (inquiries || 1)) * 100).toFixed(1))
        };
      }),
      week: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 200) + 80;
        const sales = Math.floor(Math.random() * 60) + 20;
        return {
          date: `W${i + 1}`,
          sales,
          inquiries,
          rate: Number(((sales / (inquiries || 1)) * 100).toFixed(1))
        };
      }),
      month: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 800) + 300;
        const sales = Math.floor(Math.random() * 200) + 80;
        return {
          date: `${i + 1}月`,
          sales,
          inquiries,
          rate: Number(((sales / (inquiries || 1)) * 100).toFixed(1))
        };
      })
    },
    acquisition: {
      day: Array.from({ length: 30 }, (_, i) => {
        const joined = Math.floor(Math.random() * 200) + 50;
        const acquired = Math.floor(joined * (Math.random() * 0.4 + 0.4));
        return {
          date: `04-${String(i + 1).padStart(2, '0')}`,
          joined,
          acquired,
          rate: Number(((acquired / (joined || 1)) * 100).toFixed(1))
        };
      }),
      week: Array.from({ length: 12 }, (_, i) => {
        const joined = Math.floor(Math.random() * 1000) + 300;
        const acquired = Math.floor(joined * (Math.random() * 0.4 + 0.4));
        return {
          date: `W${i + 1}`,
          joined,
          acquired,
          rate: Number(((acquired / (joined || 1)) * 100).toFixed(1))
        };
      }),
      month: Array.from({ length: 12 }, (_, i) => {
        const joined = Math.floor(Math.random() * 4000) + 1500;
        const acquired = Math.floor(joined * (Math.random() * 0.4 + 0.4));
        return {
          date: `${i + 1}月`,
          joined,
          acquired,
          rate: Number(((acquired / (joined || 1)) * 100).toFixed(1))
        };
      })
    }
  },
  typeRanking: {
    week: [
      { name: '行业认证', count: 12, pv: 1500, uv: 900, inquiries: 45, sales: 12 },
      { name: '工信部教考中心专项技术证书', count: 8, pv: 1100, uv: 700, inquiries: 32, sales: 9 },
      { name: '数字技术工程师', count: 5, pv: 800, uv: 500, inquiries: 25, sales: 7 },
      { name: '职业技能等级证书', count: 10, pv: 1300, uv: 850, inquiries: 38, sales: 11 }
    ],
    month: [
      { name: '行业认证', count: 45, pv: 5500, uv: 3200, inquiries: 180, sales: 45 },
      { name: '工信部教考中心专项技术证书', count: 32, pv: 4200, uv: 2500, inquiries: 120, sales: 35 },
      { name: '数字技术工程师', count: 22, pv: 3200, uv: 1800, inquiries: 95, sales: 28 },
      { name: '职业技能等级证书', count: 38, pv: 4800, uv: 2900, inquiries: 150, sales: 42 }
    ],
    total: [
      { name: '行业认证', count: 156, pv: 25000, uv: 15000, inquiries: 850, sales: 250 },
      { name: '工信部教考中心专项技术证书', count: 124, pv: 18000, uv: 11000, inquiries: 620, sales: 180 },
      { name: '数字技术工程师', count: 98, pv: 14000, uv: 8500, inquiries: 480, sales: 140 },
      { name: '职业技能等级证书', count: 142, pv: 21000, uv: 12500, inquiries: 750, sales: 210 }
    ]
  },
  salesTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 2000) + 500,
      issued: Math.floor(Math.random() * 30) + 10
    })),
    week: Array.from({ length: 12 }, (_, i) => ({
      date: `W${i + 1}`,
      sales: Math.floor(Math.random() * 100) + 30,
      revenue: Math.floor(Math.random() * 10000) + 3000,
      issued: Math.floor(Math.random() * 150) + 50
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}月`,
      sales: Math.floor(Math.random() * 400) + 150,
      revenue: Math.floor(Math.random() * 40000) + 15000,
      issued: Math.floor(Math.random() * 600) + 200
    }))
  },
  certList: Array.from({ length: 5 }, (_, i) => ({
    id: `CERT${100 + i}`,
    name: `职业资格证书${i + 1}`,
    type: i % 2 === 0 ? '专业' : '结业',
    inquiries: Math.floor(Math.random() * 100) + 20,
    sales: Math.floor(Math.random() * 50) + 10,
    issued: Math.floor(Math.random() * 200) + 50
  }))
};

export const MOCK_QUESTION_DASHBOARD = {
  totalQuestions: 5800,
  dailyNew: 120,
  totalExamsTaken: 12500,
  weeklyExamsTaken: 850,
  weeklyNewExams: 12,
  weeklyPracticeTaken: 3200,
  weeklyNewPractice: 45,
  typeDistribution: [
    { name: '大数据', value: 9 },
    { name: '物联网', value: 17 },
    { name: '人工智能', value: 3 },
    { name: '工业互联网', value: 3 },
    { name: '区块链', value: 3 },
    { name: '创新创业', value: 4 }
  ],
  examTypeDistribution: [
    { name: '物联网', value: 15 },
    { name: '人工智能', value: 20 },
    { name: '工业互联网', value: 10 },
    { name: '大数据', value: 18 },
    { name: '区块链', value: 8 },
    { name: '数字商科', value: 12 },
    { name: '孪生元宇宙', value: 5 },
    { name: '软件与信息技术', value: 12 },
    { name: '创新创业', value: 7 }
  ],
  practice: {
    avgCount: 45,
    overallRate: 78.5,
    domainRate: [
      { name: '物联网', rate: 82 },
      { name: '人工智能', rate: 75 },
      { name: '工业互联网', rate: 88 },
      { name: '大数据', rate: 72 },
      { name: '区块链', rate: 65 },
      { name: '数字商科', rate: 91 },
      { name: '孪生元宇宙', rate: 58 },
      { name: '软件与信息技术', rate: 84 },
      { name: '双创', rate: 95 }
    ]
  },
  trends: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      examParticipants: Math.floor(Math.random() * 200) + 50,
      examPassCount: Math.floor(Math.random() * 150) + 30,
      practiceParticipants: Math.floor(Math.random() * 500) + 200,
      practicePassCount: Math.floor(Math.random() * 400) + 150
    })),
    week: Array.from({ length: 12 }, (_, i) => ({
      date: `W${i + 1}`,
      examParticipants: Math.floor(Math.random() * 1000) + 300,
      examPassCount: Math.floor(Math.random() * 800) + 200,
      practiceParticipants: Math.floor(Math.random() * 2500) + 1000,
      practicePassCount: Math.floor(Math.random() * 2000) + 800
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}月`,
      examParticipants: Math.floor(Math.random() * 4000) + 1500,
      examPassCount: Math.floor(Math.random() * 3200) + 1000,
      practiceParticipants: Math.floor(Math.random() * 10000) + 4000,
      practicePassCount: Math.floor(Math.random() * 8000) + 3000
    }))
  }
};

export const MOCK_CLASS_DASHBOARD = {
  totalPublished: 120,
  weeklyNew: 8,
  totalSalesVolume: 4580,
  periodSales: 156,
  periodRevenue: 28400,
  studentCount: 3240,
  avgHours: 6.5,
  totalHours: 25400,
  completionRate: 58.2,
  conversion: {
    revenue: 458000
  },
  contentData: {
    browsing: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        pv: Math.floor(Math.random() * 1200) + 500,
        uv: Math.floor(Math.random() * 800) + 300
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        pv: Math.floor(Math.random() * 6000) + 3000,
        uv: Math.floor(Math.random() * 4000) + 2000
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        pv: Math.floor(Math.random() * 25000) + 15000,
        uv: Math.floor(Math.random() * 15000) + 8000
      }))
    },
    engagement: {
      day: Array.from({ length: 30 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 60) + 20;
        const sales = Math.floor(Math.random() * 20) + 5;
        return {
          date: `04-${String(i + 1).padStart(2, '0')}`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      }),
      week: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 300) + 100;
        const sales = Math.floor(Math.random() * 100) + 30;
        return {
          date: `W${i + 1}`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      }),
      month: Array.from({ length: 12 }, (_, i) => {
        const inquiries = Math.floor(Math.random() * 1200) + 500;
        const sales = Math.floor(Math.random() * 400) + 150;
        return {
          date: `${i + 1}月`,
          sales,
          inquiries,
          rate: Number(((sales / inquiries) * 100).toFixed(1))
        };
      })
    },
    learning: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        joined: Math.floor(Math.random() * 150) + 50,
        completed: Math.floor(Math.random() * 80) + 30
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        joined: Math.floor(Math.random() * 800) + 300,
        completed: Math.floor(Math.random() * 400) + 150
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        joined: Math.floor(Math.random() * 3000) + 1500,
        completed: Math.floor(Math.random() * 1800) + 800
      }))
    }
  },
  typeRanking: {
    domain: {
      total: [
        { name: '物联网', count: 15, pv: 15000, uv: 9000, inquiries: 600, sales: 180 },
        { name: '人工智能', count: 12, pv: 18000, uv: 11000, inquiries: 750, sales: 220 },
        { name: '工业互联网', count: 8, pv: 9000, uv: 5500, inquiries: 300, sales: 90 },
        { name: '大数据', count: 10, pv: 13000, uv: 8000, inquiries: 500, sales: 150 }
      ],
      week: [
        { name: '物联网', count: 1, pv: 1500, uv: 900, inquiries: 60, sales: 18 },
        { name: '人工智能', count: 1, pv: 1800, uv: 1100, inquiries: 75, sales: 22 }
      ],
      month: [
        { name: '物联网', count: 3, pv: 4500, uv: 2700, inquiries: 180, sales: 54 },
        { name: '人工智能', count: 2, pv: 5400, uv: 3300, inquiries: 225, sales: 66 }
      ]
    },
    position: {
      total: [
        { name: '软件工程师', count: 20, pv: 22000, uv: 14000, inquiries: 900, sales: 280 },
        { name: '人工智能开发工程师', count: 15, pv: 19000, uv: 12000, inquiries: 800, sales: 240 }
      ],
      week: [
        { name: '软件工程师', count: 2, pv: 2200, uv: 1400, inquiries: 90, sales: 28 }
      ],
      month: [
        { name: '软件工程师', count: 6, pv: 6600, uv: 4200, inquiries: 270, sales: 84 }
      ]
    },
    certification: {
      total: [
        { name: '行业认证', count: 25, pv: 28000, uv: 18000, inquiries: 1200, sales: 350 },
        { name: '数字技术工程师', count: 18, pv: 21000, uv: 13000, inquiries: 850, sales: 260 }
      ],
      week: [
        { name: '行业认证', count: 2, pv: 2800, uv: 1800, inquiries: 120, sales: 35 }
      ],
      month: [
        { name: '行业认证', count: 8, pv: 8400, uv: 5400, inquiries: 360, sales: 105 }
      ]
    }
  },
  salesTrend: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 30) + 10,
      revenue: Math.floor(Math.random() * 10000) + 5000
    })),
    week: Array.from({ length: 12 }, (_, i) => ({
      date: `W${i + 1}`,
      sales: Math.floor(Math.random() * 150) + 50,
      revenue: Math.floor(Math.random() * 50000) + 20000
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}月`,
      sales: Math.floor(Math.random() * 600) + 200,
      revenue: Math.floor(Math.random() * 200000) + 80000
    }))
  }
};

export const MOCK_LEARNING_DASHBOARD = {
  platformTime: {
    day: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${String(i + 1).padStart(2, '0')}`,
      avgDuration: Math.floor(Math.random() * 60) + 30, // min
      sessionDuration: Math.floor(Math.random() * 20) + 15 // min
    })),
    week: Array.from({ length: 12 }, (_, i) => ({
      date: `W${i + 1}`,
      avgDuration: Math.floor(Math.random() * 400) + 200,
      sessionDuration: Math.floor(Math.random() * 25) + 20
    })),
    month: Array.from({ length: 12 }, (_, i) => ({
      date: `${i + 1}月`,
      avgDuration: Math.floor(Math.random() * 1500) + 1000,
      sessionDuration: Math.floor(Math.random() * 30) + 25
    }))
  },
  courseTime: {
    avgCourseDuration: 15.5, // h
    topCourses: [
      { name: '物联网系统设计', cumulativeTime: 4500, avgTime: 12 },
      { name: '大数据分析实战', cumulativeTime: 3800, avgTime: 18 },
      { name: '人工智能导论', cumulativeTime: 3200, avgTime: 10 },
      { name: '工业互联网架构', cumulativeTime: 2900, avgTime: 15 },
      { name: '区块链技术应用', cumulativeTime: 2400, avgTime: 9 }
    ],
    distribution: [
      { range: '0-5h', count: 450 },
      { range: '5-10h', count: 820 },
      { range: '10-20h', count: 1100 },
      { range: '20-50h', count: 680 },
      { range: '50h+', count: 240 }
    ]
  },
  completion: {
    userRate: 75.8,
    courseRate: 64.2,
    completed: 12500,
    uncompleted: 4200,
    cycle: 18, // days
    cycleDistribution: [
      { name: '7天内', count: 1200 },
      { name: '7-14天', count: 3500 },
      { name: '14-30天', count: 5800 },
      { name: '30天+', count: 2000 }
    ]
  },
  practice: {
    avgDailyQuestions: 42,
    avgDailyAccuracy: 76.5,
    trends: {
      day: Array.from({ length: 30 }, (_, i) => ({
        date: `04-${String(i + 1).padStart(2, '0')}`,
        questions: Math.floor(Math.random() * 50) + 20,
        accuracy: Math.floor(Math.random() * 30) + 60
      })),
      week: Array.from({ length: 12 }, (_, i) => ({
        date: `W${i + 1}`,
        questions: Math.floor(Math.random() * 300) + 150,
        accuracy: Math.floor(Math.random() * 20) + 70
      })),
      month: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}月`,
        questions: Math.floor(Math.random() * 1200) + 800,
        accuracy: Math.floor(Math.random() * 15) + 75
      }))
    },
    accuracyDistribution: [
      { range: '0-20%', count: 150 },
      { range: '20-40%', count: 420 },
      { range: '40-60%', count: 1200 },
      { range: '60-80%', count: 3500 },
      { range: '80-100%', count: 2800 }
    ],
    typeAccuracy: [
      { type: '单选题', accuracy: 88 },
      { type: '多选题', accuracy: 65 },
      { type: '判断题', accuracy: 92 },
      { type: '填空题', accuracy: 74 },
      { type: '简答题', accuracy: 58 }
    ]
  }
};

export const CERTIFICATION_CATEGORIES: Record<string, string[]> = {
  '不限': ['不限'],
  '行业认证': ['不限', 'CAAC民航驾照', 'OFCA-OpenHarmony认证', '新大陆认证'],
  '工信部教考中心专项技术证书': ['不限', '区块链应用技术', 'Openharmony系统原理与应用技术', '数字化技能创新应用技术', '大数据应用技术', '人工智能应用技术', '工业互联网应用技术'],
  '数字技术工程师': ['不限'],
  '职业技能等级证书': ['不限']
};

export const DASHBOARD_FILTER_OPTIONS = {
  course: [
    { id: 'domain', label: '领域', options: ['不限', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '数字商科', '孪生元宇宙', '软件与信息技术', '双创', '11'] },
    { id: 'position', label: '岗位', options: ['不限', '教师', '物联网工程师', '硬件工程师', '软件工程师', '人工智能开发工程师', '数据运维师', '测试工程师', '嵌入式软件工程师', '产品经理', '大数据工程师'] },
    { id: 'certification', label: '认证', options: ['不限', '行业认证', '工信部教考中心专项技术证书', '数字技术工程师', '职业技能等级证书'] }
  ],
  class: [
    { id: 'domain', label: '领域', options: ['不限', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '数字商科', '孪生元宇宙', '软件与信息技术', '双创', '11'] },
    { id: 'direction', label: '方向', options: ['不限', 'AI技术', '语音识别', '计算机视觉', 'RPA', 'OCR', '对话机器人', '人脸与人体现别', '视频分析', '图像分类'] }
  ],
  certificate: [
    { id: 'certification', label: '认证', options: ['不限', '行业认证', '工信部教考中心专项技术证书', '数字技术工程师', '职业技能等级证书'] }
  ]
};
