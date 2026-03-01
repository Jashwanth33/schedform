import React from 'react';
import { User, Bell, Shield, Globe, CreditCard } from 'lucide-react';

export default function Settings() {
  const sections = [
    { icon: User, label: 'Profile', desc: 'Manage your public profile and avatar' },
    { icon: Bell, label: 'Notifications', desc: 'Configure email reminders and alerts' },
    { icon: Shield, label: 'Security', desc: 'Password and account protection' },
    { icon: Globe, label: 'Integrations', desc: 'Connect Google Calendar and Zoom' },
    { icon: CreditCard, label: 'Billing', desc: 'Manage your subscription and invoices' },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-xl font-bold mb-1">Account Settings</h2>
          <p className="text-gray-500 text-sm">Manage your account preferences and settings.</p>
        </div>
        <div className="divide-y divide-gray-50">
          {sections.map((section) => (
            <button key={section.label} className="w-full p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors text-left group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">{section.label}</div>
                <div className="text-xs text-gray-500">{section.desc}</div>
              </div>
              <div className="text-gray-300 group-hover:text-brand transition-colors">
                <Globe className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-red-700">Danger Zone</h3>
          <p className="text-red-600/70 text-sm">Once you delete your account, there is no going back.</p>
        </div>
        <button className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
