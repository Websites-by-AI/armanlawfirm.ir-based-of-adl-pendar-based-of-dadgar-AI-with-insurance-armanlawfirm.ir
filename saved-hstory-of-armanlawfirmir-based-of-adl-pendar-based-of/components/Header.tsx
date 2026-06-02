
import React, { useState, useRef, useEffect } from 'react';
import { Checkpoint, PageKey, SaveStatus, useLanguage, useAppearance } from '../types';

interface SiteHeaderProps {
    currentPage: string;
    setPage: (page: 'home' | PageKey) => void;
    checkpoints: Checkpoint[];
    onCreateCheckpoint: () => void;
    onRestoreCheckpoint: (id: string) => void;
    onDeleteCheckpoint: (id: string) => void;
    saveStatus: SaveStatus;
    onOpenSettings: () => void;
    onOpenAIGuide: () => void;
    onOpenDonation: () => void;
}

const icons: Record<string, React.ReactNode> = {
    legal_drafter:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
    court_assistant:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>,
    contract_analyzer:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    evidence_analyzer:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
    corporate_services: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
    insurance_services: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
    lawyer_finder:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    notary_finder:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>,
    map_finder:         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    general_questions:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    content_hub:        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>,
    news_summarizer:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>,
    resume_analyzer:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    job_assistant:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
    web_analyzer:       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>,
    image_generator:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    case_strategist:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    geo_referencer:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>,
    site_architect:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>,
};

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, checkpoints, onCreateCheckpoint, onRestoreCheckpoint, onDeleteCheckpoint, saveStatus, onOpenSettings, onOpenAIGuide, onOpenDonation }) => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme, customLogo } = useAppearance();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [isCheckpointOpen, setIsCheckpointOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const checkpointRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);
    const fa = language === 'fa';

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (checkpointRef.current && !checkpointRef.current.contains(e.target as Node)) setIsCheckpointOpen(false);
            if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const go = (page: 'home' | PageKey) => {
        setPage(page);
        window.scrollTo(0, 0);
        setIsMobileOpen(false);
        setHoveredMenu(null);
    };

    const scrollTo = (id: string) => {
        if (currentPage !== 'home') {
            setPage('home');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileOpen(false);
    };

    const menuOpen = (key: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHoveredMenu(key);
    };
    const menuClose = () => {
        hoverTimeout.current = setTimeout(() => setHoveredMenu(null), 150);
    };

    const menuGroups = [
        {
            key: 'legal',
            label: fa ? 'خدمات حقوقی' : 'Legal',
            cols: 2,
            items: [
                { key: 'legal_drafter',      label: fa ? 'تنظیم دادخواست' : 'Legal Drafter',      desc: fa ? 'نوشتن دادخواست با هوش مصنوعی' : 'AI petition drafting' },
                { key: 'court_assistant',    label: fa ? 'دستیار دادگاه' : 'Court Assistant',    desc: fa ? 'کمک لحظه‌ای در جلسه دادرسی' : 'Realtime courtroom AI' },
                { key: 'contract_analyzer',  label: fa ? 'تحلیل قرارداد' : 'Contract Analyzer',  desc: fa ? 'شناسایی ریسک‌های قرارداد' : 'Identify contract risks' },
                { key: 'evidence_analyzer',  label: fa ? 'تحلیل مدارک' : 'Evidence Analyzer',   desc: fa ? 'بررسی هوشمند مدارک و اسناد' : 'AI document analysis' },
                { key: 'corporate_services', label: fa ? 'خدمات شرکتی' : 'Corporate',            desc: fa ? 'ثبت شرکت و اساسنامه' : 'Company registration' },
                { key: 'insurance_services', label: fa ? 'خدمات بیمه' : 'Insurance',             desc: fa ? 'محاسبه دیه و تحلیل بیمه' : 'Diyeh & policy analysis' },
                { key: 'case_strategist',    label: fa ? 'استراتژی پرونده' : 'Case Strategy',    desc: fa ? 'برنامه‌ریزی هوشمند پرونده' : 'AI case planning' },
            ]
        },
        {
            key: 'find',
            label: fa ? 'جستجو و نقشه' : 'Finder',
            cols: 1,
            items: [
                { key: 'lawyer_finder',    label: fa ? 'وکیل‌یاب' : 'Lawyer Finder',     desc: fa ? 'یافتن وکیل متخصص' : 'Find specialist lawyers' },
                { key: 'notary_finder',    label: fa ? 'دفترخانه‌یاب' : 'Notary Finder',  desc: fa ? 'دفاتر اسناد رسمی نزدیک' : 'Nearby notary offices' },
                { key: 'map_finder',       label: fa ? 'نقشه‌یاب' : 'Map Finder',         desc: fa ? 'نقشه تعاملی دفاتر' : 'Interactive offices map' },
                { key: 'geo_referencer',   label: fa ? 'ژئورفرنسینگ' : 'Georeferencing',  desc: fa ? 'مکان‌یابی هوشمند' : 'Smart location analysis' },
                { key: 'general_questions',label: fa ? 'سوالات متداول' : 'FAQ',           desc: fa ? 'پاسخ سوالات حقوقی' : 'Legal Q&A' },
            ]
        },
        {
            key: 'tools',
            label: fa ? 'ابزارها' : 'Tools',
            cols: 2,
            items: [
                { key: 'content_hub',     label: fa ? 'تولید محتوا' : 'Content Hub',       desc: fa ? 'محتوا برای شبکه‌های اجتماعی' : 'Social media content' },
                { key: 'news_summarizer', label: fa ? 'خلاصه اخبار' : 'News',               desc: fa ? 'خلاصه اخبار حقوقی' : 'Legal news digest' },
                { key: 'resume_analyzer', label: fa ? 'تحلیل رزومه' : 'Resume Analyzer',   desc: fa ? 'امتیازدهی و بهبود رزومه' : 'Score & improve CV' },
                { key: 'job_assistant',   label: fa ? 'دستیار شغلی' : 'Job Assistant',     desc: fa ? 'رزومه اختصاصی برای هر شغل' : 'Tailored CV per job' },
                { key: 'web_analyzer',    label: fa ? 'تحلیلگر وب' : 'Web Analyzer',       desc: fa ? 'بررسی سایت‌های حقوقی' : 'Legal site analysis' },
                { key: 'site_architect',  label: fa ? 'معمار سایت' : 'Site Architect',     desc: fa ? 'تحلیل ساختار سایت' : 'Site structure review' },
                { key: 'image_generator', label: fa ? 'تصویرساز' : 'Image Generator',      desc: fa ? 'تصویر با هوش مصنوعی' : 'AI image creation' },
            ]
        },
    ];

    const allItems = menuGroups.flatMap(g => g.items);

    return (
        <>
            {/* ── Top bar ───────────────────────────────────────────── */}
            <div className="hidden lg:block bg-brand-blue dark:bg-black border-b border-white/10 text-white text-xs">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
                    <div className="flex items-center gap-5 text-gray-300">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {fa ? 'تهران، جردن، خیابان طاهری پلاک ۱۸' : 'Tehran, Jordan St., No. 18'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {fa ? 'شنبه تا پنجشنبه ۹–۱۸' : 'Sat–Thu 9:00–18:00'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {saveStatus === 'saving' && <span className="text-gray-400 flex items-center gap-1"><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{fa ? 'در حال ذخیره...' : 'Saving...'}</span>}
                        {saveStatus === 'saved' && <span className="text-brand-gold flex items-center gap-1"><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>{fa ? 'ذخیره شد' : 'Saved'}</span>}
                        <button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors">
                            {theme === 'dark' ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>}
                        </button>
                        <div className="relative" ref={langRef}>
                            <button onClick={() => setIsLangOpen(v => !v)} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4.48 9.52L12 14m0 0l-2-2m2 2v6M21 5l-9 9-4-4"/></svg>
                                {fa ? 'EN' : 'FA'}
                            </button>
                            {isLangOpen && (
                                <div className={`absolute top-full mt-1 w-24 bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 ${fa ? 'left-0' : 'right-0'}`}>
                                    <button onClick={() => { setLanguage('fa'); setIsLangOpen(false); }} className="block w-full text-right px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">فارسی</button>
                                    <button onClick={() => { setLanguage('en'); setIsLangOpen(false); }} className="block w-full text-right px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">English</button>
                                </div>
                            )}
                        </div>
                        <button onClick={onOpenSettings} className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </button>
                        <div className="relative" ref={checkpointRef}>
                            <button onClick={() => setIsCheckpointOpen(v => !v)} className="text-gray-400 hover:text-white transition-colors" title={t('header.projectHistory')}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </button>
                            {isCheckpointOpen && (
                                <div className={`absolute top-full mt-1 w-72 bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 ${fa ? 'left-0' : 'right-0'}`}>
                                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('header.projectHistory')}</span>
                                        <button onClick={onCreateCheckpoint} className="text-xs bg-brand-gold text-brand-blue px-2 py-1 rounded hover:bg-yellow-300 transition-colors font-bold">{t('header.createCheckpoint')}</button>
                                    </div>
                                    {checkpoints.length > 0 ? (
                                        <ul className="py-1 max-h-64 overflow-y-auto">
                                            {checkpoints.map(ckpt => (
                                                <li key={ckpt.id} className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                                    <div className="flex justify-between items-center gap-2">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{ckpt.name}</span>
                                                        <div className="flex gap-1 flex-shrink-0">
                                                            <button onClick={() => onRestoreCheckpoint(ckpt.id)} className="p-1 text-gray-400 hover:text-brand-gold rounded"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg></button>
                                                            <button onClick={() => onDeleteCheckpoint(ckpt.id)} className="p-1 text-gray-400 hover:text-red-400 rounded"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg></button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-gray-400 py-4 text-xs">{t('header.noCheckpoints')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main header ───────────────────────────────────────── */}
            <header className="bg-white dark:bg-[#111827] sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">

                        {/* Logo */}
                        <button onClick={() => go('home')} className="flex items-center gap-3 flex-shrink-0 group">
                            <img src={customLogo} alt="Arman Law Firm" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-brand-gold group-hover:scale-105 transition-transform"/>
                            <div className="flex flex-col leading-tight">
                                <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-brand-gold">موسسه حقوقی آرمان</span>
                                <span className="text-[10px] text-gray-400 tracking-wider hidden sm:block">Arman Law Firm</span>
                            </div>
                        </button>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center h-full">
                            {/* Home */}
                            <button onClick={() => go('home')} className={`h-full px-4 text-sm font-medium transition-colors border-b-2 ${currentPage === 'home' ? 'text-brand-gold border-brand-gold' : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-brand-gold hover:border-brand-gold/40'}`}>
                                {t('header.home')}
                            </button>

                            {/* Mega menus */}
                            {menuGroups.map(group => (
                                <div
                                    key={group.key}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => menuOpen(group.key)}
                                    onMouseLeave={menuClose}
                                >
                                    <button className={`h-full px-4 text-sm font-medium flex items-center gap-1 transition-colors border-b-2 ${allItems.filter(i => group.items.includes(i)).some(i => i.key === currentPage) ? 'text-brand-gold border-brand-gold' : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-brand-gold hover:border-brand-gold/40'}`}>
                                        {group.label}
                                        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${hoveredMenu === group.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                                    </button>

                                    {/* Mega dropdown */}
                                    {hoveredMenu === group.key && (
                                        <div
                                            className={`absolute top-full ${fa ? 'right-0' : 'left-0'} mt-0 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-2xl z-50 animate-fade-in`}
                                            style={{ minWidth: group.cols === 2 ? '480px' : '260px' }}
                                            onMouseEnter={() => menuOpen(group.key)}
                                            onMouseLeave={menuClose}
                                        >
                                            <div className={`p-3 grid gap-1 ${group.cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                {group.items.map(item => (
                                                    <button
                                                        key={item.key}
                                                        onClick={() => go(item.key as PageKey)}
                                                        className={`flex items-start gap-3 p-3 rounded-lg text-right rtl:text-right ltr:text-left transition-all group/item ${currentPage === item.key ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                                                    >
                                                        <div className={`mt-0.5 flex-shrink-0 ${currentPage === item.key ? 'text-brand-gold' : 'text-gray-400 group-hover/item:text-brand-gold'} transition-colors`}>
                                                            {icons[item.key]}
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-semibold ${currentPage === item.key ? 'text-brand-gold' : ''}`}>{item.label}</div>
                                                            <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-b-xl">
                                                <p className="text-[10px] text-gray-400">{fa ? 'موسسه حقوقی آرمان — هوش مصنوعی در خدمت عدالت' : 'Arman Law Firm — AI in the service of justice'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Other links */}
                            <button onClick={() => go('dashboard')} className={`h-full px-4 text-sm font-medium transition-colors border-b-2 ${currentPage === 'dashboard' ? 'text-brand-gold border-brand-gold' : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-brand-gold hover:border-brand-gold/40'}`}>
                                {t('header.dashboard')}
                            </button>
                            <button onClick={() => go('pricing')} className={`h-full px-4 text-sm font-medium transition-colors border-b-2 ${currentPage === 'pricing' ? 'text-brand-gold border-brand-gold' : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-brand-gold hover:border-brand-gold/40'}`}>
                                {t('header.pricing')}
                            </button>
                            <button onClick={() => scrollTo('footer')} className="h-full px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-gold border-b-2 border-transparent hover:border-brand-gold/40 transition-colors">
                                {t('header.contact')}
                            </button>
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <button onClick={onOpenAIGuide} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-blue text-sm font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-md shadow-brand-gold/20 hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                                {fa ? 'مشاوره هوشمند' : 'AI Guide'}
                            </button>
                            <button onClick={onOpenDonation} className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shadow-md shadow-red-500/20">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>
                                {fa ? 'فریادرسی' : 'Donate'}
                            </button>

                            {/* Mobile controls */}
                            <div className="flex lg:hidden items-center gap-2">
                                <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-gold transition-colors">
                                    {theme === 'dark' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>}
                                </button>
                                <button onClick={() => setIsMobileOpen(v => !v)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-gold transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Mobile drawer ──────────────────────────────────── */}
                {isMobileOpen && (
                    <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] max-h-[80vh] overflow-y-auto">
                        {/* Home */}
                        <button onClick={() => go('home')} className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold border-b border-gray-100 dark:border-gray-800 ${currentPage === 'home' ? 'text-brand-gold bg-brand-gold/5' : 'text-gray-700 dark:text-gray-200'}`}>
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            {t('header.home')}
                        </button>

                        {/* Grouped sections */}
                        {menuGroups.map(group => (
                            <div key={group.key} className="border-b border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setMobileExpanded(mobileExpanded === group.key ? null : group.key)}
                                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-white/5"
                                >
                                    <span>{group.label}</span>
                                    <svg className={`w-4 h-4 text-brand-gold transition-transform ${mobileExpanded === group.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                                </button>
                                {mobileExpanded === group.key && (
                                    <div className="py-1">
                                        {group.items.map(item => (
                                            <button
                                                key={item.key}
                                                onClick={() => go(item.key as PageKey)}
                                                className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-right rtl:text-right ${currentPage === item.key ? 'text-brand-gold bg-brand-gold/5' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                            >
                                                <span className={`${currentPage === item.key ? 'text-brand-gold' : 'text-gray-400'}`}>{icons[item.key]}</span>
                                                <div className="text-right rtl:text-right">
                                                    <div className="font-medium">{item.label}</div>
                                                    <div className="text-xs text-gray-400">{item.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Other mobile links */}
                        {[
                            { key: 'dashboard', label: t('header.dashboard'), action: () => go('dashboard') },
                            { key: 'pricing', label: t('header.pricing'), action: () => go('pricing') },
                            { key: 'contact', label: t('header.contact'), action: () => scrollTo('footer') },
                        ].map(link => (
                            <button key={link.key} onClick={link.action} className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-gray-100 dark:border-gray-800 ${currentPage === link.key ? 'text-brand-gold' : 'text-gray-700 dark:text-gray-200'}`}>
                                {link.label}
                            </button>
                        ))}

                        {/* Mobile bottom actions */}
                        <div className="p-4 flex flex-col gap-2">
                            <button onClick={() => { onOpenAIGuide(); setIsMobileOpen(false); }} className="w-full py-3 bg-brand-gold text-brand-blue text-sm font-bold rounded-lg">
                                {fa ? 'مشاوره هوشمند با AI' : 'AI Legal Guide'}
                            </button>
                            <button onClick={() => { onOpenDonation(); setIsMobileOpen(false); }} className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold rounded-lg">
                                {fa ? '❤️ فریادرسی' : '❤️ Donate'}
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default SiteHeader;
