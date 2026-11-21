import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Sparkles,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderGuests() {
  const [guests, setGuests] = useState(() => festivalStore.getPublicGuests());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setGuests(festivalStore.getPublicGuests());
    });
    return () => unsub();
  }, []);

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.organization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Festival Scholars & Dignitaries
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Keynote Guests & Jury Patrons
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Distinguished Islamic scholars, academicians, and literary critics presiding over DALENZIA FEST 2K26 stages.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dignitary by name or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>
      </div>

      {/* Dignitaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No dignitaries found matching search.
          </div>
        ) : (
          filteredGuests.map(g => (
            <div
              key={g.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-serif font-black text-base shadow-sm shrink-0">
                  {g.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-stone-900 text-sm leading-tight">{g.name}</h3>
                  <div className="text-[11px] text-[#A91F35] font-semibold">{g.designation}</div>
                  <div className="text-[10px] text-stone-500">{g.organization}</div>
                </div>
              </div>

              {g.bio && (
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/50">
                  {g.bio}
                </p>
              )}

              {g.associatedProgrammes && g.associatedProgrammes.length > 0 && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-bold uppercase text-[9px]">Presiding Over:</span>
                  <span className="font-bold text-stone-800 truncate max-w-44">
                    {g.associatedProgrammes[0].title}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
