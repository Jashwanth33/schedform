import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, ExternalLink, MoreVertical, Search, Filter, Plus } from 'lucide-react';
import { Link as LinkType } from '../types';
import { cn } from '../lib/utils';

export default function LinkList() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/my-links')
      .then(res => res.json())
      .then(data => {
        setLinks(data);
        setLoading(false);
      });
  }, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link to="/links/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Link
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>)
        ) : links.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-bold text-lg">No links created yet</h3>
            <p className="text-gray-500 mb-6">Create your first booking link to start accepting appointments.</p>
            <Link to="/links/new" className="btn-primary">Create Link</Link>
          </div>
        ) : (
          links.map((link, i) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  link.type === 'combined' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {link.type}
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{link.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">{link.description}</p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => copyLink(link.slug)}
                  className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Copy Link
                </button>
                <a
                  href={`/s/${link.slug}`}
                  target="_blank"
                  className="p-2 btn-secondary hover:border-brand hover:text-brand"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
