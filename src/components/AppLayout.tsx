import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Link as LinkIcon, Calendar, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: LinkIcon, label: 'My Links', path: '/links' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-xl tracking-tight">SchedForm</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-brand text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-bottom border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-semibold text-lg">
            {navItems.find(i => i.path === location.pathname)?.label || 'Page'}
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/links/new" className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Create Link
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhu" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
