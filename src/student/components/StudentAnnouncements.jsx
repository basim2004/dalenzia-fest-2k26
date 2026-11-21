import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Calendar, AlertCircle, CheckCircle2,
  Clock, Shield, Sparkles, Filter
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentAnnouncements({ studentSession }) {
  const [announcements, setAnnouncements] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentAnnouncements(studentId);
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const toggleRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Official Bulletins & Notices
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Institutional announcements, schedule advisories, and stage rules released by the Convener Secretariat.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-xs font-bold font-mono">
          {announcements.length} Active Circulars
        </span>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Megaphone className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No active circulars</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You are fully up to date on all official festival circulars and announcements.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {announcements.map((anc) => {
            const isRead = readIds.has(anc.id);
            const isUrgent = anc.priority === 'urgent' || anc.priority === 'High';

            return (
              <div
                key={anc.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isRead
                    ? 'bg-white/70 border-stone-200 text-stone-600'
                    : 'bg-white border-stone-200/90 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-red-100 text-red-800'
                        : 'bg-[#E6A916]/20 text-[#A91F35]'
                    }`}>
                      {anc.priority || 'Notice'}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      Target: {anc.targetAudience === 'all' ? 'All Candidates' : anc.targetAudience}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {anc.publishedAt || anc.date || 'Dec 2026'}
                    </span>
                    <button
                      onClick={() => toggleRead(anc.id)}
                      className={`text-xs font-bold ${
                        isRead ? 'text-stone-400' : 'text-[#A91F35] hover:underline'
                      }`}
                    >
                      {isRead ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                  </div>
                </div>

                <h3 className={`font-serif font-black text-base ${isRead ? 'text-stone-700' : 'text-stone-900'}`}>
                  {anc.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {anc.content || anc.message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
