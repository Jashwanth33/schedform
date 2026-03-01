import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, MousePointer2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ links: 0, bookings: 0, submissions: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const statCards = [
    { label: 'Active Links', value: stats.links, icon: MousePointer2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Form Submissions', value: stats.submissions, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Conversion Rate', value: '24.5%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Recent Activity</h2>
              <button className="text-sm text-gray-500 hover:text-brand">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">New booking from John Doe</p>
                      <p className="text-xs text-gray-500">Consultation Call • 2 hours ago</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-bold text-lg mb-2">Upgrade to Pro</h2>
              <p className="text-white/80 text-sm mb-6">Unlock unlimited links, custom branding, and advanced analytics.</p>
              <button className="w-full bg-white text-brand font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/links/new" className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-center">
                <Plus className="w-5 h-5 mx-auto mb-2 text-brand" />
                <span className="text-xs font-medium">New Link</span>
              </Link>
              <button className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-center">
                <Calendar className="w-5 h-5 mx-auto mb-2 text-brand" />
                <span className="text-xs font-medium">Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
import { Plus } from 'lucide-react';
