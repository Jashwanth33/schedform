import React, { useEffect, useState } from 'react';
import { Calendar, User, Mail, Clock, ExternalLink } from 'lucide-react';
import { Submission } from '../types';
import { formatDate, formatTime } from '../lib/utils';

export default function Bookings() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const linksRes = await fetch('/api/my-links');
        const links = await linksRes.json();
        if (links.length > 0) {
          const subRes = await fetch(`/api/links/${links[0].id}/submissions`);
          const data = await subRes.json();
          setSubmissions(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Attendee</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Meeting Time</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-100 rounded"></div></td>
                </tr>
              ))
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                  No bookings or submissions found yet.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs">
                        {sub.user_name?.[0] || 'G'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{sub.user_name || 'Guest'}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {sub.user_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.booking_time ? (
                      <div className="space-y-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-brand" />
                          {formatDate(sub.booking_time)}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatTime(sub.booking_time.split(' ')[1] || '00:00')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Form Only</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
