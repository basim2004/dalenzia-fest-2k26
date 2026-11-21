import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderAnnouncements({ teamId }) {
  const [announcements, setAnnouncements] = useState(() => festivalStore.getTeamAnnouncements(teamId));
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`read_announcements_${teamId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setAnnouncements(festivalStore.getTeamAnnouncements(teamId));
    });
    return () => unsub();
  }, [teamId]);

  const toggleMarkAsRead = (id) => {
    let next;
    if (readIds.includes(id)) {
      next = readIds.filter(i => i !== id);
    } else {
      next = [...readIds, id];
    }
    setReadIds(next);
    try {
      localStorage.setItem(`read_announcements_${teamId}`, JSON.stringify(next));
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Circulars
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              Secretariat Broadcasts
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Announcements & Bulletins
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Official instructions, schedule updates, and circulars targeted to squad leaders and participating teams.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No official circulars currently published for your squad.
          </div>
        ) : (
          announcements.map(item => {
            const isRead = readIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isRead
                    ? 'bg-white border-stone-200'
                    : 'bg-[#F7F3E9]/80 border-[#A91F35]/30 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        item.priority === 'High' || item.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {item.priority || 'Normal'} Priority
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.publishDate || 'Dec 2026'}
                    </span>
                    {!isRead && (
                      <span className="text-[9px] font-bold bg-[#A91F35] text-white px-1.5 py-0.2 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">{item.description}</p>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => toggleMarkAsRead(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isRead
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        : 'bg-[#A91F35] hover:bg-[#8e192c] text-white shadow-xs'
                    }`}
                  >
                    {isRead ? 'Mark as Unread' : 'Mark as Read ✓'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
