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
    <aside style={{
      width: '240px',
      height: '100vh',
      flexShrink: 0,
      background: 'rgba(10,15,30,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '8px 12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flexShrink: 0, filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.6))' }}>
          <BizInsightLogo />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>BizInsight</div>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>Decision Support</div>
        </div>
        <span style={{
          flexShrink: 0,
          padding: '2px 7px',
          background: 'rgba(99,102,241,0.18)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: '6px',
          fontSize: '9px',
          fontWeight: 700,
          color: '#818cf8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
        }}>Demo</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 14px 8px' }}>
          Main Menu
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive ? '#6366f1' : '#94a3b8',
                textDecoration: 'none',
                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
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
