
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, PageKey, useAppearance, THEME_PRESETS } from '../types';
import SeoChecker from './SeoChecker';
import { getSeoAudits, SeoAuditData } from '../services/dbService';
import { createPost, getPosts, deletePost, publishPost, Post } from '../services/postsService';
import { supabase } from '../services/supabaseClient';

// WordPress Color Palette
// #1d2327 - Sidebar/Admin Bar Dark
// #2c3338 - Sidebar Hover
// #2271b1 - WP Blue (Links, Primary Buttons)
// #f0f0f1 - Main Background
// #ffffff - Card Background
// #dcdcde - Borders

interface WordPressDashboardProps {
    setPage: (page: 'home' | PageKey) => void;
    userRole?: 'user' | 'admin';
}

const WordPressDashboard: React.FC<WordPressDashboardProps> = ({ setPage, userRole }) => {
    const { t } = useLanguage();
    const { setColorScheme, theme, toggleTheme } = useAppearance(); // Added theme hook
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false); // Theme menu state
    
    // SEO History State
    const [auditHistory, setAuditHistory] = useState<SeoAuditData[]>([]);
    
    // Posts State
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Mock Users Data
    const [users, setUsers] = useState([
        { id: 1, username: 'admin', email: 'admin@armanlawfirm.ir', role: 'Administrator', posts: 15 },
        { id: 2, username: 'editor_sara', email: 'sara@example.com', role: 'Editor', posts: 42 },
        { id: 3, username: 'author_ali', email: 'ali@example.com', role: 'Author', posts: 8 },
        { id: 4, username: 'contributor_reza', email: 'reza@example.com', role: 'Contributor', posts: 2 },
    ]);

    const menuItems = [
        { name: 'Dashboard', icon: '🏠', active: activeMenu === 'Dashboard' },
        { name: 'Posts', icon: '📝', badge: 2, active: activeMenu === 'Posts' },
        { name: 'Media', icon: '🖼️', active: activeMenu === 'Media' },
        { name: 'Pages', icon: '📄', active: activeMenu === 'Pages' },
        { name: 'Comments', icon: '💬', badge: 1, active: activeMenu === 'Comments' },
        { name: 'SEO Check', icon: '📊', active: activeMenu === 'SEO Check' },
        { name: 'Deployment', icon: '🚀', active: activeMenu === 'Deployment' },
        ...(userRole === 'admin' ? [
            { name: 'Appearance', icon: '🎨', active: activeMenu === 'Appearance' },
            { name: 'Plugins', icon: '🔌', badge: 3, active: activeMenu === 'Plugins' },
            { name: 'Users', icon: '👥', active: activeMenu === 'Users' },
            { name: 'Tools', icon: '🛠️', active: activeMenu === 'Tools' },
            { name: 'Settings', icon: '⚙️', active: activeMenu === 'Settings' },
        ] : []),
    ];

    const recentActivity = [
        { time: '12:45 pm', text: 'You published the post "Adl Pendar Legal Guide"' },
        { time: '10:30 am', text: 'Ali Rezaei commented on "Divorce Laws"' },
        { time: 'Yesterday', text: 'System backup completed successfully' },
    ];

    useEffect(() => {
        if (activeMenu === 'SEO Check') {
            loadAuditHistory();
        }
        if (activeMenu === 'Posts' || activeMenu === 'Dashboard') {
            loadPosts();
        }
    }, [activeMenu]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUser(data.user);
        });
    }, []);

    const loadPosts = async () => {
        setIsLoadingPosts(true);
        const data = await getPosts();
        setPosts(data);
        setIsLoadingPosts(false);
    };

    const handleSaveDraft = async () => {
        if (!draftTitle.trim()) {
            alert('لطفا عنوان را وارد کنید');
            return;
        }
        setIsSavingDraft(true);
        const newPost = await createPost({
            title: draftTitle,
            content: draftContent,
            status: 'draft',
            author_id: currentUser?.id,
            author_email: currentUser?.email,
        });
        if (newPost) {
            setDraftTitle('');
            setDraftContent('');
            loadPosts();
            alert('پیش‌نویس ذخیره شد!');
        } else {
            alert('خطا در ذخیره پیش‌نویس');
        }
        setIsSavingDraft(false);
    };

    const handleDeletePost = async (id: string) => {
        if (window.confirm('آیا مطمئنید که می‌خواهید این پست را حذف کنید؟')) {
            const success = await deletePost(id);
            if (success) {
                loadPosts();
            }
        }
    };

    const handlePublishPost = async (id: string) => {
        const updated = await publishPost(id);
        if (updated) {
            loadPosts();
        }
    };

    const loadAuditHistory = async () => {
        const history = await getSeoAudits();
        setAuditHistory(history);
    };

    const handleDeleteUser = (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleThemeChange = (schemeId: string) => {
        const scheme = THEME_PRESETS.find(p => p.id === schemeId);
        if (scheme) {
            setColorScheme(scheme);
            // Auto-switch mode based on preset convention
            if (schemeId === 'registry' || schemeId === 'official') {
                if (theme === 'dark') toggleTheme();
            } else if (schemeId === 'legal') {
                if (theme === 'light') toggleTheme();
            }
        }
        setIsThemeMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#f0f0f1] font-sans text-[13px] text-[#3c434a] overflow-hidden direction-ltr ltr">
            {/* Sidebar */}
            <div className={`bg-[#1d2327] text-white flex-shrink-0 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-40' : 'w-9'}`}>
                {/* Admin Bar Spacer */}
                <div className="h-8 bg-[#1d2327]"></div> 
                
                <ul className="flex-grow overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <li 
                            key={index} 
                            onClick={() => setActiveMenu(item.name)}
                            className={`group relative cursor-pointer hover:bg-[#135e96] hover:text-white transition-colors ${item.active ? 'bg-[#2271b1] text-white' : 'text-[#f0f0f1]'}`}
                        >
                            <div className="flex items-center h-[34px] px-3">
                                {/* Mock Icon */}
                                <div className={`dashicons ${item.icon} w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100`}>
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <rect width="16" height="16" x="2" y="2" rx="2" fillOpacity="0.5"/>
                                    </svg>
                                </div>
                                {isSidebarOpen && (
                                    <span className="ml-2 font-medium flex-grow truncate">{item.name}</span>
                                )}
                                {item.badge && isSidebarOpen && (
                                    <span className="ml-auto bg-[#d63638] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            {/* Hover Submenu Indicator */}
                            {!isSidebarOpen && (
                                <div className="absolute left-full top-0 w-48 bg-[#1d2327] text-white p-2 hidden group-hover:block z-50 shadow-lg">
                                    {item.name}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="h-10 text-[#a7aaad] hover:text-[#2271b1] flex items-center justify-center border-t border-[#3c434a] focus:outline-none"
                >
                    <span className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}>«</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col h-full overflow-hidden">
                {/* Admin Bar */}
                <div className="bg-[#1d2327] text-[#f0f0f1] flex items-center justify-between px-3 text-[13px] flex-shrink-0 z-40 h-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-[#72aee6] group relative">
                            <span className="font-bold w-5 h-5 flex items-center justify-center bg-[#2271b1] text-white rounded-full text-[10px]">A</span>
                            <div className="absolute top-8 left-0 w-48 bg-[#1d2327] hidden group-hover:block shadow-lg border-t-2 border-[#2271b1] z-50">
                                <div className="p-2 hover:bg-[#2271b1] text-xs">About Arman CMS</div>
                                <div className="p-2 hover:bg-[#2271b1] text-xs">Documentation</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-[#72aee6]" onClick={() => setPage('home')}>
                            🏠 <span className="font-semibold">Arman Law</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-[#72aee6]" onClick={() => setActiveMenu('Deployment')}>
                            🚀 <span>Deploy</span>
                        </div>
                        {/* TEST MODE Badge */}
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider animate-pulse">TEST MODE</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Theme Switcher */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} 
                                className="flex items-center space-x-1 cursor-pointer hover:text-[#72aee6] focus:outline-none"
                            >
                                <span className="dashicons-art">🎨</span>
                                <span>Appearance</span>
                            </button>
                            {isThemeMenuOpen && (
                                <div className="absolute top-8 right-0 w-48 bg-[#1d2327] shadow-lg border border-[#2c3338] z-50">
                                    {THEME_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handleThemeChange(preset.id)}
                                            className="block w-full text-left px-4 py-2 hover:bg-[#2271b1] hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }}></span>
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cursor-pointer hover:text-[#72aee6] font-medium flex items-center gap-2" onClick={() => setPage('dashboard')}>
                            Return to App Dashboard
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[#72aee6]">
                            <span>Howdy, {userRole === 'admin' ? 'Admin' : 'User'}</span>
                            <img src="https://messages-prod.27c852f3500f38c1e7786e2c9ff9e48f.r2.cloudflarestorage.com/f0819c9a-22ad-4d4e-9a4b-d8c2ef893dd2/1764579575951-019ad922-8b89-702a-b810-c608609faa9e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=c774f9d56a46165f86a9757e83c2bbc3%2F20251201%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20251201T085936Z&X-Amz-Expires=3600&X-Amz-Signature=2de49acd6a4c990786b04ad5454ba37dbbe609a28a39e68561559591ae5dbbc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Avatar" className="w-5 h-5 rounded-sm" />
                        </div>
                    </div>
                </div>

                {/* Mega Nav Bar — quick access to main app pages */}
                <div className="bg-white border-b border-[#dcdcde] px-4 flex items-center gap-1 text-[12px] text-[#1d2327] overflow-x-auto flex-shrink-0 h-9">
                    <span className="text-[#646970] font-semibold whitespace-nowrap mr-2">سایت:</span>
                    {[
                        { label: 'خانه', page: 'home' as PageKey | 'home' },
                        { label: 'داشبورد', page: 'dashboard' as PageKey },
                        { label: 'تنظیم دادخواست', page: 'legal_drafter' as PageKey },
                        { label: 'دستیار دادگاه', page: 'court_assistant' as PageKey },
                        { label: 'تحلیل قرارداد', page: 'contract_analyzer' as PageKey },
                        { label: 'وکیل‌یاب', page: 'lawyer_finder' as PageKey },
                        { label: 'نقشه‌یاب', page: 'map_finder' as PageKey },
                        { label: 'بیمه', page: 'insurance_services' as PageKey },
                        { label: 'تولید محتوا', page: 'content_hub' as PageKey },
                        { label: 'تصویرساز', page: 'image_generator' as PageKey },
                        { label: 'قیمت‌گذاری', page: 'pricing' as PageKey },
                        { label: '🚀 استقرار', page: null, action: () => setActiveMenu('Deployment') },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => item.action ? item.action() : item.page && setPage(item.page as 'home' | PageKey)}
                            className="whitespace-nowrap px-2 py-1 rounded hover:bg-[#f0f0f1] hover:text-[#2271b1] transition-colors text-[#1d2327] font-medium"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Body */}
                <div className="flex-grow overflow-y-auto p-5">
                    <div className="flex flex-col mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl text-[#1d2327] font-medium">{activeMenu === 'Users' ? 'Users' : activeMenu}</h1>
                            <div className="flex space-x-2">
                                <button className="border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f6f7f7]">Screen Options ▼</button>
                                <button 
                                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                                    className={`border px-3 py-1 rounded transition-colors ${isHelpOpen ? 'bg-[#2271b1] text-white border-[#2271b1]' : 'border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7]'}`}
                                >
                                    Help ▼
                                </button>
                            </div>
                        </div>
                        
                        {/* Help Panel */}
                        {isHelpOpen && (
                            <div className="bg-white border border-[#dcdcde] shadow-sm p-0 mb-5 text-[13px] animate-fade-in">
                                <div className="flex">
                                    <div className="w-1/4 bg-[#f6f7f7] border-r border-[#dcdcde]">
                                        <ul className="py-2">
                                            <li className="px-4 py-2 font-semibold text-[#1d2327] bg-white border-l-4 border-[#2271b1]">Overview</li>
                                            <li className="px-4 py-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]">Navigation</li>
                                            <li className="px-4 py-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]">Layout</li>
                                            <li className="px-4 py-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]">Content</li>
                                        </ul>
                                    </div>
                                    <div className="w-3/4 p-4 space-y-3 text-[#3c434a]">
                                        <h3 className="font-semibold text-lg text-[#1d2327]">Dashboard Overview</h3>
                                        <p>Welcome to your WordPress Dashboard! This is the central hub for managing your site.</p>
                                        <p><strong>Admin Bar:</strong> The toolbar at the top provides quick access to common tasks like adding new posts, viewing your site, and managing your profile.</p>
                                        <p><strong>Sidebar Menu:</strong> On the left, you'll find links to all the administrative areas of your site, such as Posts, Media, Pages, and Settings.</p>
                                        <p><strong>Screen Options:</strong> Use this tab (top right) to customize which widgets are displayed on this screen.</p>
                                        <p>You can drag and drop the widgets below to rearrange your dashboard layout.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {activeMenu === 'SEO Check' ? (
                        /* SEO CHECKER VIEW */
                        <div className="animate-fade-in">
                            <SeoChecker onScanComplete={loadAuditHistory} />
                            
                            <div className="mt-8 bg-white border border-[#c3c4c7] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-sm bg-white">Audit History</div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#f0f0f1] text-[#1d2327] text-xs uppercase">
                                            <th className="px-4 py-2 font-medium">Date</th>
                                            <th className="px-4 py-2 font-medium">URL</th>
                                            <th className="px-4 py-2 font-medium">Score</th>
                                            <th className="px-4 py-2 font-medium">Issues</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {auditHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-4 text-center text-[#646970]">No audit history found. Run a check above.</td>
                                            </tr>
                                        ) : (
                                            auditHistory.map((audit) => (
                                                <tr key={audit.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                                                    <td className="px-4 py-3 text-[#2271b1]">
                                                        {new Date(audit.created_at || '').toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-[#646970]">{audit.url}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-bold ${audit.score > 80 ? 'text-[#008a20]' : audit.score > 50 ? 'text-[#dba617]' : 'text-[#d63638]'}`}>
                                                            {audit.score}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-[#646970]">
                                                        {audit.results?.filter((r: any) => r.status === 'fail').length} Errors
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeMenu === 'Deployment' ? (
                        /* ── DEPLOYMENT GUIDE PANEL ─────────────────────────── */
                        <div className="animate-fade-in max-w-4xl space-y-5">
                            {/* Test Mode Notice */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start gap-3">
                                <span className="text-yellow-500 text-xl mt-0.5">⚠️</span>
                                <div>
                                    <p className="font-bold text-yellow-800 text-sm">حالت آزمایشی (TEST MODE)</p>
                                    <p className="text-yellow-700 text-xs mt-0.5">این پنل در حال اجرا روی سرور توسعه (Replit) است. برای انتشار عمومی مراحل زیر را دنبال کنید.</p>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm flex items-center gap-2">
                                    🏢 اطلاعات شرکت / Company Info
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    {[
                                        { label: 'نام', value: 'موسسه حقوقی آرمان (Arman Law Firm)' },
                                        { label: 'دامنه', value: 'armanlawfirm.ir' },
                                        { label: 'GitHub Org', value: 'Websites-by-AI' },
                                        { label: 'ایمیل', value: 'info@armanlawfirm.ir' },
                                        { label: 'آدرس', value: 'تهران، جردن، خیابان طاهری پلاک ۱۸' },
                                        { label: 'تلفن', value: '۰۲۱-۸۸۸۸۸۸۸۸' },
                                    ].map((row, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-[#646970] font-semibold w-24 flex-shrink-0">{row.label}:</span>
                                            <span className="text-[#1d2327] font-mono text-xs bg-[#f6f7f7] px-2 py-0.5 rounded">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* GitHub Repo */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm flex items-center gap-2">
                                    🐙 مخزن GitHub
                                </div>
                                <div className="p-4 space-y-3 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#646970] font-semibold text-xs uppercase tracking-wide">Repository URL</span>
                                        <a
                                            href="https://github.com/Websites-by-AI/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-xs text-[#2271b1] hover:underline bg-[#f6f7f7] px-3 py-2 rounded break-all block"
                                        >
                                            github.com/Websites-by-AI/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { label: 'Branch', value: 'main' },
                                            { label: 'زیرپوشه پروژه', value: 'saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of/' },
                                            { label: 'فایل Build', value: 'package.json (root)' },
                                            { label: 'دستور Build', value: 'npm run build' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex gap-2 items-start">
                                                <span className="text-[#646970] font-semibold w-32 flex-shrink-0 text-xs">{row.label}:</span>
                                                <code className="text-xs bg-[#f6f7f7] text-[#1d2327] px-2 py-0.5 rounded font-mono">{row.value}</code>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-[#1d2327] text-[#72aee6] rounded p-3 font-mono text-xs space-y-1">
                                        <p className="text-[#a7aaad]"># push to GitHub from Replit Shell:</p>
                                        <p>git add .</p>
                                        <p>git commit -m "update"</p>
                                        <p>git push origin main</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cloudflare Pages */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm flex items-center gap-2">
                                    ☁️ تنظیمات Cloudflare Pages
                                </div>
                                <div className="p-4 space-y-4 text-sm">
                                    <p className="text-[#646970] text-xs">در داشبورد Cloudflare → Pages → پروژه شما → Settings → Build & Deploy این مقادیر را وارد کنید:</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs border border-[#dcdcde]">
                                            <thead>
                                                <tr className="bg-[#f6f7f7]">
                                                    <th className="text-left px-3 py-2 border-b border-[#dcdcde] font-semibold text-[#1d2327]">فیلد Cloudflare</th>
                                                    <th className="text-left px-3 py-2 border-b border-[#dcdcde] font-semibold text-[#1d2327]">مقدار</th>
                                                    <th className="text-left px-3 py-2 border-b border-[#dcdcde] font-semibold text-[#1d2327]">توضیح</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { field: 'Production branch', val: 'main', note: 'شاخه اصلی Git' },
                                                    { field: 'Build command', val: 'npm run build', note: 'از root package.json اجرا می‌شود' },
                                                    { field: 'Build output dir', val: '(خالی بگذارید)', note: 'wrangler.toml خودکار تنظیم می‌کند' },
                                                    { field: 'Root directory', val: '(خالی بگذارید)', note: 'پروژه در root است' },
                                                    { field: 'NODE_VERSION', val: '20', note: 'متغیر محیطی Build' },
                                                    { field: 'GEMINI_API_KEY', val: '●●●●●●●●●●●●', note: '⚠️ از Cloudflare Secrets وارد کنید' },
                                                    { field: 'VITE_SUPABASE_URL', val: 'https://xxxx.supabase.co', note: 'آدرس پروژه Supabase' },
                                                    { field: 'VITE_SUPABASE_ANON_KEY', val: '●●●●●●●●●●●●', note: '⚠️ از Cloudflare Secrets وارد کنید' },
                                                ].map((row, i) => (
                                                    <tr key={i} className="border-b border-[#f0f0f1] hover:bg-[#f9f9f9]">
                                                        <td className="px-3 py-2 font-mono text-[#2271b1] font-semibold">{row.field}</td>
                                                        <td className="px-3 py-2"><code className="bg-[#f0f0f1] px-1.5 py-0.5 rounded font-mono">{row.val}</code></td>
                                                        <td className="px-3 py-2 text-[#646970]">{row.note}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
                                        <p className="font-bold mb-1">✅ wrangler.toml در root پروژه تنظیم شده:</p>
                                        <code className="block bg-white border border-blue-100 rounded p-2 font-mono whitespace-pre text-[11px]">{`name = "armanlawfirm"\npages_build_output_dir = "saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of/dist"`}</code>
                                    </div>
                                </div>
                            </div>

                            {/* Step-by-step deploy */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm flex items-center gap-2">
                                    📋 مراحل استقرار گام‌به‌گام
                                </div>
                                <div className="p-4">
                                    <ol className="space-y-4 text-sm">
                                        {[
                                            {
                                                n: 1,
                                                title: 'تغییرات را push کنید',
                                                desc: 'از Shell ریپلیت دستور git push origin main را اجرا کنید.',
                                                code: 'git add . && git commit -m "update" && git push origin main',
                                            },
                                            {
                                                n: 2,
                                                title: 'ورود به Cloudflare Pages',
                                                desc: 'به dash.cloudflare.com بروید → Workers & Pages → پروژه armanlawfirm',
                                                code: 'https://dash.cloudflare.com',
                                            },
                                            {
                                                n: 3,
                                                title: 'متغیرهای محیطی را تنظیم کنید',
                                                desc: 'Settings → Environment Variables → کلیدهای GEMINI_API_KEY و Supabase را اضافه کنید.',
                                                code: null,
                                            },
                                            {
                                                n: 4,
                                                title: 'Deploy را تریگر کنید',
                                                desc: 'Deployments → Retry deployment یا کافی است git push کنید — Cloudflare خودکار build می‌کند.',
                                                code: null,
                                            },
                                            {
                                                n: 5,
                                                title: 'دامنه سفارشی',
                                                desc: 'Custom Domains → armanlawfirm.ir را اضافه و DNS را در ثبت‌کننده دامنه به Cloudflare هدایت کنید.',
                                                code: 'CNAME: armanlawfirm.ir → armanlawfirm.pages.dev',
                                            },
                                        ].map((step) => (
                                            <li key={step.n} className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-xs font-bold">{step.n}</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-[#1d2327]">{step.title}</p>
                                                    <p className="text-[#646970] text-xs mt-0.5">{step.desc}</p>
                                                    {step.code && (
                                                        <code className="block mt-1.5 bg-[#1d2327] text-[#72aee6] px-3 py-1.5 rounded text-xs font-mono">{step.code}</code>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {/* Live links */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm flex items-center gap-2">
                                    🔗 لینک‌های دسترسی
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { label: '🟡 Replit Dev', url: 'https://replit.com', note: 'محیط توسعه — TEST MODE' },
                                        { label: '☁️ Cloudflare Pages', url: 'https://armanlawfirm.pages.dev', note: 'نسخه زنده پس از deploy' },
                                        { label: '🌐 دامنه اصلی', url: 'https://armanlawfirm.ir', note: 'پس از اتصال DNS' },
                                        { label: '🐙 GitHub', url: 'https://github.com/Websites-by-AI', note: 'مخزن کد' },
                                        { label: '🗄️ Supabase', url: 'https://supabase.com/dashboard', note: 'پایگاه داده و احراز هویت' },
                                        { label: '🤖 Gemini AI', url: 'https://aistudio.google.com/apikey', note: 'مدیریت API Key هوش مصنوعی' },
                                    ].map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-3 p-3 border border-[#dcdcde] rounded hover:border-[#2271b1] hover:bg-[#f0f6fc] transition-colors group"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#2271b1] group-hover:underline text-xs">{link.label}</p>
                                                <p className="text-[#646970] text-[10px] mt-0.5">{link.note}</p>
                                                <code className="text-[10px] text-[#646970] font-mono">{link.url}</code>
                                            </div>
                                            <span className="text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : activeMenu === 'Posts' ? (
                        /* POSTS MANAGEMENT VIEW */
                        <div className="animate-fade-in">
                            <div className="flex gap-2 mb-3 text-sm">
                                <button onClick={() => loadPosts()} className="text-[#2271b1] font-semibold">All <span className="text-[#50575e]">({posts.length})</span></button> |
                                <span className="text-[#2271b1]">Published <span className="text-[#50575e]">({posts.filter(p => p.status === 'published').length})</span></span> |
                                <span className="text-[#2271b1]">Drafts <span className="text-[#50575e]">({posts.filter(p => p.status === 'draft').length})</span></span>
                            </div>

                            {isLoadingPosts ? (
                                <div className="text-center py-8 text-[#646970]">Loading posts...</div>
                            ) : (
                                <table className="w-full bg-white border border-[#c3c4c7] shadow-sm text-left">
                                    <thead>
                                        <tr className="bg-[#f0f0f1]">
                                            <th className="p-2 border-b border-[#c3c4c7] w-8"><input type="checkbox" /></th>
                                            <th className="p-2 border-b border-[#c3c4c7]">Title</th>
                                            <th className="p-2 border-b border-[#c3c4c7]">Author</th>
                                            <th className="p-2 border-b border-[#c3c4c7]">Status</th>
                                            <th className="p-2 border-b border-[#c3c4c7]">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-[#646970]">No posts found. Create one using Quick Draft!</td>
                                            </tr>
                                        ) : (
                                            posts.map(post => (
                                                <tr key={post.id} className="group hover:bg-[#f6f7f7]">
                                                    <td className="p-2 border-b border-[#c3c4c7]"><input type="checkbox" /></td>
                                                    <td className="p-2 border-b border-[#c3c4c7]">
                                                        <strong className="text-[#2271b1]">{post.title}</strong>
                                                        <div className="flex gap-2 text-xs text-[#2271b1] invisible group-hover:visible mt-1">
                                                            <button className="hover:text-[#135e96]">Edit</button> |
                                                            {post.status === 'draft' && (
                                                                <>
                                                                    <button className="text-[#008a20] hover:text-[#006a10]" onClick={() => post.id && handlePublishPost(post.id)}>Publish</button> |
                                                                </>
                                                            )}
                                                            <button className="text-[#b32d2e] hover:text-[#8a2020]" onClick={() => post.id && handleDeletePost(post.id)}>Delete</button> |
                                                            <button className="hover:text-[#135e96]">View</button>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 border-b border-[#c3c4c7] text-[#646970]">{post.author_email || 'Unknown'}</td>
                                                    <td className="p-2 border-b border-[#c3c4c7]">
                                                        <span className={`px-2 py-0.5 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 border-b border-[#c3c4c7] text-[#646970]">
                                                        {new Date(post.created_at || '').toLocaleDateString('fa-IR')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                            <div className="mt-2 text-xs text-[#646970]">
                                {posts.length} items
                            </div>
                        </div>
                    ) : activeMenu === 'Users' && userRole === 'admin' ? (
                        /* USERS MANAGEMENT VIEW */
                        <div className="animate-fade-in">
                            <div className="flex gap-2 mb-3 text-sm">
                                <a href="#" className="text-[#2271b1] font-semibold">All <span className="text-[#50575e]">({users.length})</span></a> |
                                <a href="#" className="text-[#2271b1]">Administrator <span className="text-[#50575e]">(1)</span></a> | 
                                <a href="#" className="text-[#2271b1]">Editor <span className="text-[#50575e]">(1)</span></a>
                            </div>
                            
                            <div className="flex justify-between mb-3">
                                <div className="flex gap-2">
                                    <select className="border border-[#8c8f94] rounded text-[#2c3338] h-[30px] text-sm px-2">
                                        <option>Bulk Actions</option>
                                        <option>Delete</option>
                                    </select>
                                    <button className="border border-[#2271b1] text-[#2271b1] px-3 h-[30px] text-sm rounded hover:bg-[#f0f0f1]">Apply</button>
                                    <select className="border border-[#8c8f94] rounded text-[#2c3338] h-[30px] text-sm px-2 ml-2">
                                        <option>Change role to...</option>
                                        <option>Subscriber</option>
                                        <option>Contributor</option>
                                        <option>Author</option>
                                        <option>Editor</option>
                                        <option>Administrator</option>
                                    </select>
                                    <button className="border border-[#2271b1] text-[#2271b1] px-3 h-[30px] text-sm rounded hover:bg-[#f0f0f1]">Change</button>
                                </div>
                                <div className="flex gap-1">
                                    <input type="text" className="border border-[#8c8f94] rounded h-[30px] px-2 text-sm" />
                                    <button className="border border-[#2271b1] text-[#2271b1] px-3 h-[30px] text-sm rounded hover:bg-[#f0f0f1]">Search Users</button>
                                </div>
                            </div>

                            <table className="w-full bg-white border border-[#c3c4c7] shadow-sm text-left">
                                <thead>
                                    <tr>
                                        <th className="p-2 border-b border-[#c3c4c7] w-8"><input type="checkbox" /></th>
                                        <th className="p-2 border-b border-[#c3c4c7]">Username</th>
                                        <th className="p-2 border-b border-[#c3c4c7]">Name</th>
                                        <th className="p-2 border-b border-[#c3c4c7]">Email</th>
                                        <th className="p-2 border-b border-[#c3c4c7]">Role</th>
                                        <th className="p-2 border-b border-[#c3c4c7]">Posts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="group hover:bg-[#f6f7f7]">
                                            <th className="p-2 border-b border-[#c3c4c7] border-l-4 border-l-transparent"><input type="checkbox" /></th>
                                            <td className="p-2 border-b border-[#c3c4c7]">
                                                <div className="flex items-center gap-2">
                                                    <img src="https://i.sstatic.net/xVUdgkWi.jpg" className="w-8 h-8 rounded-sm bg-gray-200" alt="avatar" />
                                                    <div>
                                                        <strong className="text-[#2271b1]">{user.username}</strong>
                                                        <div className="flex gap-2 text-xs text-[#2271b1] invisible group-hover:visible mt-1">
                                                            <button className="hover:text-[#135e96]">Edit</button> | 
                                                            <button className="text-[#b32d2e] hover:text-[#b32d2e]" onClick={() => handleDeleteUser(user.id)}>Delete</button> | 
                                                            <button className="hover:text-[#135e96]">View</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2 border-b border-[#c3c4c7]">-</td>
                                            <td className="p-2 border-b border-[#c3c4c7] text-[#2271b1]">{user.email}</td>
                                            <td className="p-2 border-b border-[#c3c4c7]">{user.role}</td>
                                            <td className="p-2 border-b border-[#c3c4c7]">{user.posts}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th className="p-2 w-8"><input type="checkbox" /></th>
                                        <th className="p-2">Username</th>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">Role</th>
                                        <th className="p-2">Posts</th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="mt-2 text-xs text-[#646970]">
                                {users.length} items
                            </div>
                        </div>
                    ) : (
                        /* DASHBOARD / DEFAULT VIEW */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
                            
                            {/* At a Glance */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm p-0 h-fit">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm">At a Glance</div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center space-x-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]" onClick={() => setActiveMenu('Posts')}>
                                        <span className="dashicons-admin-post">📝</span>
                                        <span>{posts.length} Posts</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]">
                                        <span className="dashicons-admin-page">📄</span>
                                        <span>5 Pages</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#2271b1] cursor-pointer hover:text-[#135e96]">
                                        <span className="dashicons-admin-comments">💬</span>
                                        <span>1 Comment</span>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-[#f0f0f1] text-[#646970]">
                                        Running <span className="font-semibold">AdlPendar Theme</span> with <span className="font-semibold">Dadgar AI</span> plugin.
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm p-0 h-fit">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm">Activity</div>
                                <div className="p-0">
                                    <div className="px-4 py-3 border-b border-[#f0f0f1]">
                                        <p className="text-[#646970] mb-1">Recently Published</p>
                                        <ul className="space-y-3">
                                            {recentActivity.map((act, i) => (
                                                <li key={i} className="text-[#646970]">
                                                    <span className="text-[#a7aaad] mr-1">{act.time}</span>
                                                    <span className="text-[#1d2327]">{act.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Draft */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm p-0 h-fit">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm">Quick Draft</div>
                                <div className="p-4 space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        value={draftTitle}
                                        onChange={(e) => setDraftTitle(e.target.value)}
                                        className="w-full border border-[#8c8f94] p-1.5 rounded-sm text-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none"
                                    />
                                    <textarea 
                                        rows={4} 
                                        placeholder="What's on your mind?" 
                                        value={draftContent}
                                        onChange={(e) => setDraftContent(e.target.value)}
                                        className="w-full border border-[#8c8f94] p-1.5 rounded-sm text-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none resize-none"
                                    />
                                    <button 
                                        className="bg-[#2271b1] text-white px-3 py-1.5 rounded-sm text-xs font-semibold hover:bg-[#135e96] transition-colors disabled:opacity-50"
                                        onClick={handleSaveDraft}
                                        disabled={isSavingDraft}
                                    >
                                        {isSavingDraft ? 'Saving...' : 'Save Draft'}
                                    </button>
                                </div>
                            </div>

                            {/* WordPress Events and News */}
                            <div className="bg-white border border-[#dcdcde] shadow-sm p-0 h-fit">
                                <div className="px-4 py-3 border-b border-[#dcdcde] font-semibold text-sm">WordPress Events and News</div>
                                <div className="p-4 text-[#646970] space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-[#2271b1] mb-1 cursor-pointer hover:underline">WordPress 6.5 "Regina"</h4>
                                        <p>The latest version of WordPress is now available. Update today for new features and security fixes.</p>
                                    </div>
                                    <hr className="border-[#f0f0f1]" />
                                    <div>
                                        <h4 className="font-semibold text-[#2271b1] mb-1 cursor-pointer hover:underline">Community Summit 2025</h4>
                                        <p>Join the community summit to discuss the future of the project.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                    
                    <div className="mt-8 text-center text-[#646970] text-xs">
                        Thank you for creating with <a href="#" className="text-[#2271b1] hover:underline">WordPress</a>. | Version 6.5.2
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordPressDashboard;
