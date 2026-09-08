'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Newspaper,
  Image as ImageIcon,
  Inbox,
  Settings,
  Users,
  UserCircle,
  LogOut,
  ExternalLink,
  PanelLeft,
  X,
} from 'lucide-react';
import { logout } from '@/app/admin/actions-auth';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badge?: number };

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: 'Dashboard',
    items: [{ href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    group: 'Content',
    items: [
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/services', label: 'Services', icon: Wrench },
      { href: '/admin/posts', label: 'Posts', icon: Newspaper },
      { href: '/admin/media', label: 'Media', icon: ImageIcon },
    ],
  },
  {
    group: 'Business',
    items: [
      { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/users', label: 'Admin Users', icon: Users },
      { href: '/admin/profile', label: 'Profile', icon: UserCircle },
    ],
  },
];

export function AdminShell({ email, name, newInquiries, children }: { email: string; name: string; newInquiries: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groupedNav = NAV.map((g) => ({
    ...g,
    items: g.items.map((it) =>
      it.href === '/admin/inquiries' ? { ...it, badge: newInquiries } : it,
    ),
  }));

  const isActive = (href: string) => pathname === href;

  const NavBody = (
    <nav className="flex flex-col gap-6" aria-label="Admin">
      {groupedNav.map((g) => (
        <div key={g.group}>
          <p className="px-3 text-[0.62rem] font-bold uppercase tracking-hair text-slate-500">{g.group}</p>
          <ul className="mt-2 space-y-1">
            {g.items.map((it) => {
              const Icon = it.icon;
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                      active ? 'bg-gold-500 font-bold text-navy-950' : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {it.label}
                    </span>
                    {it.badge ? (
                      <span className={`rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold ${active ? 'bg-navy-950 text-gold-300' : 'bg-gold-500 text-navy-950'}`}>
                        {it.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <button
        type="button"
        onClick={() => logout()}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-navy-800 hover:text-white"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#eef1f5] text-ink-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-6 overflow-y-auto bg-navy-950 p-4 lg:flex">
        <div className="flex items-center gap-3 px-2 pt-2">
          <span className="flex h-9 w-9 items-center justify-center border border-gold-500/40 font-display text-sm font-black text-gold-400">
            CBS
          </span>
          <div className="leading-tight">
            <p className="font-display text-xs font-extrabold uppercase tracking-hair text-white">Admin</p>
            <p className="text-[0.66rem] text-slate-500">Customs Brokerage Services</p>
          </div>
        </div>
        <div className="flex-1">
          {NavBody}
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 border-t border-white/10 px-2 pt-4 text-xs text-slate-400 hover:text-gold-300"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          View public site
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-navy-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-gold-500/50 font-display text-xs font-black text-gold-400">
            CBS
          </span>
          <span className="font-display text-xs font-extrabold uppercase tracking-hair text-white">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" aria-label="View site" className="p-2 text-slate-300 hover:text-gold-300">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="p-2 text-slate-200"
          >
            {open ? <X className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button>
        </div>
      </header>
      {open && (
        <div className="border-b border-white/10 bg-navy-950 px-4 pb-4 lg:hidden">
          {NavBody}
        </div>
      )}

      {/* Main */}
      <div className="px-4 pb-16 pt-8 sm:px-8 lg:ml-64 lg:px-10">
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <div />
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-8 w-8 rounded-full bg-gold-500/20 font-display text-xs font-black text-gold-700 flex items-center justify-center">
              {name.slice(0, 1).toUpperCase()}
            </span>
            <span className="text-navy-900">{email}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}