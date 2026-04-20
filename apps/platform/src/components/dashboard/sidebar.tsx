'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Globe,
  Flame,
  Users,
  Calendar,
  User,
  CreditCard,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/site', label: 'My Site', icon: Globe },
  { href: '/dashboard/lanterns', label: 'Lanterns', icon: Flame },
  { href: '/dashboard/community', label: 'Community', icon: Users },
  { href: '/dashboard/programming', label: 'Programming', icon: Calendar },
  { href: '/dashboard/account', label: 'Account', icon: User },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    avatarUrl?: string | null
    role: string
    plan: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const planColors: Record<string, string> = {
    FREE: 'bg-stone-200 text-stone-600',
    CREATOR: 'bg-cc-gold/20 text-cc-gold-dark',
    PRO: 'bg-amber-100 text-amber-800',
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <span className="font-serif text-xl font-bold text-foreground">Creators Circle</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-cc-gold text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
        {user.role === 'ADMIN' && (
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2 border border-dashed',
              pathname.startsWith('/admin')
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted border-border'
            )}
          >
            <Shield size={18} />
            Admin
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-cc-gold/20 flex items-center justify-center text-cc-gold font-semibold text-sm shrink-0">
            {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name ?? 'Artist'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', planColors[user.plan] ?? planColors.FREE)}>
            {user.plan}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-card fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-card border border-border shadow-sm"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-72 z-50 bg-card border-r border-border flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
