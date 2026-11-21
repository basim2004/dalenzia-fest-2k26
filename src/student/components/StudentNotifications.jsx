import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, CheckCircle2, Clock, Trophy, Calendar,
  Shield, Check, Sparkles, AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentNotifications({ studentSession, onRefreshStats }) {
  const [notifications, setNotifications] = useState([]);

  const studentId = studentSession?.id;

  const loadNotifications = () => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentNotifications(studentId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [studentId]);

  const handleMarkAsRead = (notifId) => {
    try {
      festivalStore.markStudentNotificationAsRead(studentId, notifId);
      loadNotifications();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = () => {
    try {
      festivalStore.markAllStudentNotificationsAsRead(studentId);
      loadNotifications();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Student Notification Centre
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time stage calls, schedule alerts, and result publishing notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-500">
            {unreadCount} Unread
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No notifications</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You will receive instant alerts here as festival events progress.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white/80 border-stone-200/80 text-stone-600'
                  : 'bg-white border-[#A91F35]/30 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  notif.read
                    ? 'bg-stone-100 text-stone-400'
                    : 'bg-[#A91F35]/10 text-[#A91F35]'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#A91F35]" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.date}</span>
                  </div>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#A91F35] hover:text-white text-stone-600 text-[11px] font-bold transition-all shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
