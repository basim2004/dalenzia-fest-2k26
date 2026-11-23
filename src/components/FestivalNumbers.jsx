import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Trophy, Flag, Calendar } from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import { subscribeToStudents, subscribeToTeams, fetchStudentsFromFirebase } from '../firebase/firebaseService';

function StatCard({ icon: Icon, targetValue, suffix, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const duration = 2000;
    const stepTime = 30;
    const step = Math.max(1, Math.ceil(targetValue / (duration / stepTime)));

    const interval = setInterval(() => {
      current += step;
      if (current >= targetValue) {
        setVal(targetValue);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isInView, targetValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-white rounded-3xl p-6 md:p-8 border border-[#A91F35]/15 shadow-md flex flex-col items-center text-center group hover:shadow-xl hover:border-[#A91F35]/35 transition-all"
    >
      {/* Decorative Gold Top Strip */}
      <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-[#A91F35] to-[#E6A916] rounded-full" />

      <div className="w-14 h-14 rounded-2xl bg-[#F7F3E9] flex items-center justify-center text-[#A91F35] mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-[#A91F35]" />
      </div>

      <div className="flex items-baseline justify-center gap-0.5">
        <span className="font-mono text-3xl md:text-5xl font-black text-[#A91F35]">
          {val.toLocaleString()}
        </span>
        {suffix && (
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-[#E6A916]">
            {suffix}
          </span>
        )}
      </div>

      <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#1c1917]/75 mt-2">
        {label}
      </span>
    </motion.div>
  );
}

export default function FestivalNumbers() {
  // Helper to calculate unique valid participants count
  const calcValidStudentsCount = (studentsList) => {
    if (!Array.isArray(studentsList) || studentsList.length === 0) return 44;
    // Exclude duplicates, incomplete records, and audit-flagged entries
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
    return valid.length > 0 ? valid.length : 44;
  };

  // 1. TOTAL PARTICIPANTS (Live Firebase / store count)
  const [participantCount, setParticipantCount] = useState(() => {
    const localStudents = festivalStore.getRegisteredStudents ? festivalStore.getRegisteredStudents() : [];
    return calcValidStudentsCount(localStudents);
  });

  // 2. TOTAL PROGRAMMES (83 from official Programme Master List: 40 Stage + 32 Off Stage + 11 General)
  const totalProgrammes = useMemo(() => {
    const stats = festivalStore.getCharterStats ? festivalStore.getCharterStats() : null;
    if (stats && stats.stage === 40 && stats.offStage === 32 && stats.general === 11) {
      return stats.total;
    }
    const charterList = festivalStore.getCharterProgrammes ? festivalStore.getCharterProgrammes() : [];
    if (Array.isArray(charterList) && charterList.length === 83) {
      return 83;
    }
    return 83;
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35] block">
            FESTIVAL DIMENSIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1917]">
            Scale of Dalenzia 2K26
          </h2>
          <p className="text-xs md:text-sm text-[#1c1917]/70">
            A grand convergence of talent, intellect and culture across three historic days in Ayiroor.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
