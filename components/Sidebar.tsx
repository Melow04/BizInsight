'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Receipt,
  Lightbulb,
  Building2,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
];

function BizInsightLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3730a3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0a0f1e" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="bar1-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="bar2-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bar3-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow-bars">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#bg-glow)" />
      <rect width="40" height="40" rx="10" fill="none" stroke="rgba(129,140,248,0.25)" strokeWidth="1" />
      {/* Bars */}
      <rect x="7"  y="27" width="6" height="7"  rx="1.5" fill="url(#bar1-grad)" filter="url(#glow-bars)" />
      <rect x="17" y="21" width="6" height="13" rx="1.5" fill="url(#bar2-grad)" filter="url(#glow-bars)" />
      <rect x="27" y="14" width="6" height="20" rx="1.5" fill="url(#bar3-grad)" filter="url(#glow-bars)" />
      {/* Trend line */}
      <polyline
        points="9,27 19,20 29,12"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow-line)"
      />
      {/* Arrow head */}
      <polygon points="29,12 34,7 30,15" fill="#22d3ee" filter="url(#glow-line)" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 w-full md:w-[240px] h-auto md:h-screen bg-[rgba(10,15,30,0.95)] border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.07)] flex md:flex-col flex-row md:p-[20px_12px] p-[10px_16px] md:sticky top-0 z-50 backdrop-blur-[20px] overflow-x-auto md:overflow-hidden items-center md:items-stretch no-scrollbar">
      {/* Logo */}
      <div className="flex items-center gap-[10px] md:pb-[24px] md:px-[12px] shrink-0 mr-6 md:mr-0">
        <div style={{ flexShrink: 0, filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.6))' }}>
          <BizInsightLogo />
        </div>
        <div className="hidden md:block flex-1 min-w-0">
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>BizInsight</div>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>Decision Support</div>
        </div>
        <span className="hidden md:block shrink-0 px-[7px] py-[2px] bg-[rgba(99,102,241,0.18)] border border-[rgba(99,102,241,0.35)] rounded-[6px] text-[9px] font-bold text-[#818cf8] tracking-[0.08em] uppercase">Demo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex md:flex-col flex-row gap-[8px] md:gap-[2px] items-center md:items-stretch overflow-x-auto no-scrollbar md:pr-0 pr-4">
        <div className="hidden md:block text-[10px] font-bold text-[#334155] uppercase tracking-[0.1em] px-[14px] pb-[8px]">
          Main Menu
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-[10px] px-[12px] py-[8px] md:px-[14px] md:py-[10px] rounded-[8px] text-[14px] font-medium transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'text-[#6366f1] bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.2)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
              }`}
            >
              <Icon size={18} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden md:flex p-[16px] bg-[rgba(255,255,255,0.03)] rounded-[12px] border border-[rgba(255,255,255,0.06)] items-center gap-[10px] mt-auto">
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Building2 size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>My Business</div>
          <div style={{ fontSize: '11px', color: '#475569' }}>Small Business</div>
        </div>
      </div>
    </aside>
  );
}
