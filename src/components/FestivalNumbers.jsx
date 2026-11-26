import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Users, Trophy, Flag, Calendar, Sparkles } from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import { subscribeToStudents, subscribeToTeams, fetchStudentsFromFirebase } from '../firebase/firebaseService';

function StatCard({ icon: Icon, targetValue, suffix, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setVal(targetValue);
      return;
    }

    let current = 0;
    const duration = 1800;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      // Smooth ease-out curve
      const progress = stepCount / totalSteps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      current = Math.round(targetValue * easeProgress);

      if (stepCount >= totalSteps || current >= targetValue) {
        setVal(targetValue);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isInView, targetValue, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.015 }}
      className="relative bg-white rounded-3xl p-6 md:p-8 border border-[#A91F35]/15 shadow-md flex flex-col items-center text-center group hover:shadow-2xl hover:border-[#A91F35]/35 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Gold & Crimson Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A91F35] via-[#E6A916] to-[#A91F35] group-hover:h-2 transition-all duration-300" />

      {/* Subtle Background Radial Aura on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EE]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon Capsule with Hover Scale */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#F7F3E9] flex items-center justify-center text-[#A91F35] mb-4 group-hover:scale-110 group-hover:bg-[#A91F35]/10 transition-all duration-300 border border-[#A91F35]/10">
        <Icon className="w-7 h-7 text-[#A91F35]" />
      </div>

      {/* Counter Digits */}
      <div className="relative z-10 flex items-baseline justify-center gap-0.5">
        <span className="font-mono text-3xl md:text-5xl font-black text-[#A91F35] tracking-tight">
          {val.toLocaleString()}
        </span>
        {suffix && (
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-[#E6A916]">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="relative z-10 text-xs md:text-sm font-bold uppercase tracking-wider text-[#1c1917]/75 mt-2">
        {label}
      </span>
    </motion.div>
  );
}

export default function FestivalNumbers() {
  // Helper to calculate unique valid participants count
  const calcValidStudentsCount = (studentsList) => {
    if (!Array.isArray(studentsList) || studentsList.length === 0) return 44;
    const seenChestNos = new Set();
    const valid = studentsList.filter(s => {
      if (!s || !s.name || s.status === 'Inactive') return false;
      if (s.status && s.status.includes('Duplicate')) return false;
      if (s.auditNote && s.auditNote.includes('duplicate')) return false;
      if (!s.teamId || s.teamId === 'Unassigned') return false;
      const chestNo = (s.chestNo || s.id || '').trim();
      if (!chestNo || seenChestNos.has(chestNo)) return false;
      seenChestNos.add(chestNo);
      return true;
    });
    return valid.length > 0 ? valid.length : 46;
  };

  // 1. TOTAL PARTICIPANTS (Live Firebase / store count)
  const [participantCount, setParticipantCount] = useState(() => {
    const localStudents = festivalStore.getRegisteredStudents ? festivalStore.getRegisteredStudents() : [];
    return calcValidStudentsCount(localStudents);
  });

  // 2. TOTAL PROGRAMMES (77 from updated Programme Master List: 32 Stage + 31 Off Stage + 14 General)
  const totalProgrammes = useMemo(() => {
    const stats = festivalStore.getCharterStats ? festivalStore.getCharterStats() : null;
    if (stats && stats.total > 0) {
      return stats.total;
    }
    const charterList = festivalStore.getCharterProgrammes ? festivalStore.getCharterProgrammes() : [];
    if (Array.isArray(charterList) && charterList.length > 0) {
      return charterList.length;
    }
    return 77;
  }, []);

  // 3. TOTAL TEAMS (Live Firebase / store count of active official teams: Dazzlers & Dynamos)
  const [teamsCount, setTeamsCount] = useState(() => {
    const localTeams = festivalStore.getTeams ? festivalStore.getTeams() : [];
    const active = localTeams.filter(t => t.status !== 'Inactive');
    return active.length > 0 ? active.length : 2;
  });

  // 4. FESTIVAL DAYS (3 vibrant days: Dec 21, 22, 23, 2026)
  const festivalDays = 3;

  useEffect(() => {
    // A. Subscribe to local store real-time broadcast
    const unsubStore = festivalStore.subscribe(() => {
      const localStudents = festivalStore.getRegisteredStudents ? festivalStore.getRegisteredStudents() : [];
      setParticipantCount(calcValidStudentsCount(localStudents));

      const localTeams = festivalStore.getTeams ? festivalStore.getTeams() : [];
      const active = localTeams.filter(t => t.status !== 'Inactive');
      if (active.length > 0) setTeamsCount(active.length);
    });

    // B. Real-time Firebase listeners for live synchronization
    let unsubFirebaseStudents = () => {};
    let unsubFirebaseTeams = () => {};

    try {
      unsubFirebaseStudents = subscribeToStudents((fbStudents) => {
        if (Array.isArray(fbStudents) && fbStudents.length > 0) {
          const count = calcValidStudentsCount(fbStudents);
          setParticipantCount(count);
        }
      });
    } catch (e) {
      console.warn('Firebase student subscription fallback:', e);
    }

    try {
      unsubFirebaseTeams = subscribeToTeams((fbTeams) => {
        if (Array.isArray(fbTeams) && fbTeams.length > 0) {
          const active = fbTeams.filter(t => t.status !== 'Inactive');
          if (active.length > 0) setTeamsCount(active.length);
        }
      });
    } catch (e) {
      console.warn('Firebase teams subscription fallback:', e);
    }

    // C. Fallback fetch from Firebase
    if (typeof fetchStudentsFromFirebase === 'function') {
      fetchStudentsFromFirebase().then(fbStudents => {
        if (Array.isArray(fbStudents) && fbStudents.length > 0) {
          setParticipantCount(calcValidStudentsCount(fbStudents));
        }
      }).catch(() => {});
    }

    return () => {
      if (typeof unsubStore === 'function') unsubStore();
      if (typeof unsubFirebaseStudents === 'function') unsubFirebaseStudents();
      if (typeof unsubFirebaseTeams === 'function') unsubFirebaseTeams();
    };
  }, []);

  const stats = [
    {
      id: 'participants',
      icon: Users,
      targetValue: participantCount,
      suffix: '',
      label: 'TOTAL PARTICIPANTS',
      delay: 0.1
    },
    {
      id: 'programmes',
      icon: Trophy,
      targetValue: totalProgrammes,
      suffix: '',
      label: 'TOTAL PROGRAMMES',
      delay: 0.2
    },
    {
      id: 'teams',
      icon: Flag,
      targetValue: teamsCount,
      suffix: '',
      label: 'TOTAL TEAMS',
      delay: 0.3
    },
    {
      id: 'days',
      icon: Calendar,
      targetValue: festivalDays,
      suffix: '',
      label: 'FESTIVAL DAYS',
      delay: 0.4
    },
  ];

  return (
    <section className="relative bg-[#F7F3E9] py-16 md:py-24 border-t border-[#A91F35]/15 select-none overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#A91F35]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#A91F35]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
              FESTIVAL DIMENSIONS
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1917]">
            Scale of Dalenzia 2K26
          </h2>
          <p className="text-xs md:text-sm text-[#1c1917]/75 leading-relaxed">
            A grand convergence of talent, intellect and culture across three historic days in Ayiroor.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
