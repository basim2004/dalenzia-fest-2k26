import fs from 'fs';

const filePath = 'c:/basim/dalanzia/src/admin/data/festivalStore.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = `  getAvailableCompetitionsForProgramme() {
    return this.data.programmeAssignments || [];
  }`;

const scheduleMethods = `  getAvailableCompetitionsForProgramme() {
    return this.data.programmeAssignments || [];
  }

  // =========================================================================
  // PROGRAMME SCHEDULE MANAGEMENT (STEP 08 - PROGRAMME SCHEDULE)
  // =========================================================================

  _parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const str = String(timeStr).trim();
    const match = str.match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = (match[3] || '').toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  getProgrammeStages() {
    return this.data.programmeStages || [];
  }

  detectScheduleConflicts(candidate, excludeScheduleId = null) {
    const conflicts = [];
    const {
      programmeId,
      date,
      startTime,
      endTime,
      stage,
      assignedGuestIds = []
    } = candidate;

    // 1. Time Range Validation
    const startMin = this._parseTimeToMinutes(startTime);
    const endMin = this._parseTimeToMinutes(endTime);

    if (startMin === null || endMin === null) {
      conflicts.push({
        type: 'INVALID_TIME_RANGE',
        severity: 'error',
        message: 'Both Start Time and End Time must be valid (e.g., "09:00 AM", "11:00 AM").'
      });
    } else if (endMin <= startMin) {
      conflicts.push({
        type: 'INVALID_TIME_RANGE',
        severity: 'error',
        message: \`Session end time (\${endTime}) must be strictly later than start time (\${startTime}).\`
      });
    }

    // 2. Festival Date Restriction (December 21–22, 2026)
    const validDates = ['Dec 21, 2026', 'Dec 22, 2026', 'December 21, 2026', 'December 22, 2026', '2026-12-21', '2026-12-22'];
    if (!date || !validDates.includes(String(date).trim())) {
      conflicts.push({
        type: 'OUTSIDE_FESTIVAL_DATES',
        severity: 'error',
        message: \`Selected date "\${date}" is outside official festival dates (December 21–22, 2026).\`
      });
    }

    if (startMin === null || endMin === null || endMin <= startMin) {
      return {
        hasConflicts: conflicts.length > 0,
        hasErrors: conflicts.some(c => c.severity === 'error'),
        conflicts
      };
    }

    const activeSchedules = (this.data.programmeSchedules || []).filter(s =>
      !s.isArchived && s.status !== 'Cancelled' && s.id !== excludeScheduleId
    );

    const candidateDateNorm = String(date).includes('21') ? 'Dec 21, 2026' : 'Dec 22, 2026';

    const normStage = (s) => String(s || '').toLowerCase().replace(/\\s*\\(stage\\s*\\d+\\)/i, '').trim();

    activeSchedules.forEach(existing => {
      const existingDateNorm = String(existing.date || '').includes('21') ? 'Dec 21, 2026' : 'Dec 22, 2026';
      if (existingDateNorm !== candidateDateNorm) return;

      const existStart = this._parseTimeToMinutes(existing.startTime);
      const existEnd = this._parseTimeToMinutes(existing.endTime);
      if (existStart === null || existEnd === null) return;

      // Interval overlap check: Math.max(start1, start2) < Math.min(end1, end2)
      const isOverlapping = Math.max(startMin, existStart) < Math.min(endMin, existEnd);
      if (!isOverlapping) return;

      // 3. Stage / Venue Overlap Conflict
      if (stage && existing.stage && normStage(stage) === normStage(existing.stage)) {
        conflicts.push({
          type: 'STAGE_OVERLAP',
          severity: 'error',
          message: \`Stage conflict: "\${existing.stage}" is already booked by "\${existing.programmeTitle}" (\${existing.timeRange || existing.startTime + ' – ' + existing.endTime}).\`,
          conflictingEntryId: existing.id,
          conflictingTitle: existing.programmeTitle,
          stage: existing.stage
        });
      }

      // 4. Guest Double-Booking Overlap Conflict
      const existingGuests = Array.isArray(existing.assignedGuestIds) ? existing.assignedGuestIds : [];
      const candidateGuests = Array.isArray(assignedGuestIds) ? assignedGuestIds : [];

      candidateGuests.forEach(gid => {
        if (existingGuests.includes(gid)) {
          const guestObj = (this.data.programmeGuests || []).find(g => g.id === gid);
          const guestName = guestObj ? guestObj.name : gid;
          conflicts.push({
            type: 'GUEST_OVERLAP',
            severity: 'error',
            message: \`Guest clash: \${guestName} is simultaneously committed to "\${existing.programmeTitle}" at \${existing.stage} during \${existing.timeRange || existing.startTime}.\`,
            conflictingEntryId: existing.id,
            guestId: gid,
            guestName
          });
        }
      });

      // 5. Duplicate Programme Session Conflict
      if (programmeId && existing.programmeId === programmeId) {
        conflicts.push({
          type: 'DUPLICATE_SESSION',
          severity: 'warning',
          message: \`Duplicate session: Programme "\${existing.programmeTitle}" already has an active schedule slot (\${existing.id}) in this time window.\`,
          conflictingEntryId: existing.id
        });
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      hasErrors: conflicts.some(c => c.severity === 'error'),
      conflicts
    };
  }

  getProgrammeSchedules({
    date = 'all',
    stage = 'all',
    category = 'all',
    guestId = 'all',
    status = 'all',
    query = '',
    sortBy = 'time',
    includeArchived = false,
    includePrivate = true
  } = {}) {
    let list = (this.data.programmeSchedules || []).filter(s => includeArchived ? true : !s.isArchived);

    // Enrich each schedule entry
    list = list.map(s => {
      const prog = (this.data.programmes || []).find(p => p.id === s.programmeId || p.code === s.programmeCode);
      const assignedIds = Array.isArray(s.assignedGuestIds) ? s.assignedGuestIds : [];
      const guests = assignedIds.map(gid =>
        (this.data.programmeGuests || []).find(g => g.id === gid)
      ).filter(Boolean);

      const stageInfo = (this.data.programmeStages || []).find(st =>
        st.name === s.stage || st.id === s.stageId || st.code === s.stageId
      );

      const enriched = {
        ...s,
        programmeTitle: s.programmeTitle || (prog ? prog.title : 'Festival Session'),
        malayalamTitle: prog ? prog.malayalamTitle : '',
        category: prog ? prog.category : 'General Conclave',
        categoryCode: prog ? prog.categoryCode : 'GEN',
        desc: prog ? prog.desc : '',
        icon: prog ? prog.icon : 'calendar',
        posterUrl: prog ? prog.posterUrl : '/assets/admin/admin_sidebar_logo.png',
        guests,
        guestCount: guests.length,
        stageInfo: stageInfo || { name: s.stage, color: '#A91F35' }
      };

      if (!includePrivate) {
        delete enriched.notes;
      }

      return enriched;
    });

    // Query filter
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(s =>
        (s.programmeTitle && s.programmeTitle.toLowerCase().includes(q)) ||
        (s.programmeCode && s.programmeCode.toLowerCase().includes(q)) ||
        (s.stage && s.stage.toLowerCase().includes(q)) ||
        (s.coordinatorName && s.coordinatorName.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        (s.guests && s.guests.some(g => g.name && g.name.toLowerCase().includes(q)))
      );
    }

    // Date filter
    if (date && date !== 'all') {
      if (date === 'day1' || date.includes('21')) {
        list = list.filter(s => String(s.date).includes('21'));
      } else if (date === 'day2' || date.includes('22')) {
        list = list.filter(s => String(s.date).includes('22'));
      } else {
        list = list.filter(s => s.date === date);
      }
    }

    // Stage filter
    if (stage && stage !== 'all') {
      const norm = (str) => String(str || '').toLowerCase().replace(/\\s*\\(stage\\s*\\d+\\)/i, '').trim();
      const targetNorm = norm(stage);
      list = list.filter(s => norm(s.stage) === targetNorm || s.stageId === stage);
    }

    // Category filter
    if (category && category !== 'all') {
      list = list.filter(s =>
        s.category === category ||
        s.categoryCode === category ||
        (s.category && s.category.toLowerCase() === category.toLowerCase())
      );
    }

    // Guest filter
    if (guestId && guestId !== 'all') {
      list = list.filter(s => Array.isArray(s.assignedGuestIds) && s.assignedGuestIds.includes(guestId));
    }

    // Status filter
    if (status && status !== 'all') {
      list = list.filter(s => s.status === status);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'time') {
        const dateOrder = (String(a.date).includes('21') ? 1 : 2) - (String(b.date).includes('21') ? 1 : 2);
        if (dateOrder !== 0) return dateOrder;
        const startA = this._parseTimeToMinutes(a.startTime) || 0;
        const startB = this._parseTimeToMinutes(b.startTime) || 0;
        return startA - startB;
      }
      if (sortBy === 'name') {
        return (a.programmeTitle || '').localeCompare(b.programmeTitle || '');
      }
      if (sortBy === 'stage') {
        return (a.stage || '').localeCompare(b.stage || '');
      }
      return (a.id || '').localeCompare(b.id || '');
    });

    return list;
  }

  getProgrammeScheduleById(id, { includePrivate = true } = {}) {
    const list = this.getProgrammeSchedules({ includeArchived: true, includePrivate });
    return list.find(s => s.id === id) || null;
  }

  getScheduleDashboardStats() {
    const all = (this.data.programmeSchedules || []).filter(s => !s.isArchived);
    const totalScheduledSessions = all.length;
    const todayProgrammes = all.filter(s => String(s.date).includes('21') && s.status !== 'Cancelled').length;
    const day2Programmes = all.filter(s => String(s.date).includes('22') && s.status !== 'Cancelled').length;
    const upcomingProgrammes = all.filter(s => s.status === 'Scheduled' || s.status === 'Upcoming').length;
    const ongoingProgrammes = all.filter(s => s.status === 'Ongoing').length;
    const completedProgrammes = all.filter(s => s.status === 'Completed').length;
    const cancelledProgrammes = all.filter(s => s.status === 'Cancelled').length;

    // Unscheduled programmes in registry
    const scheduledProgIds = new Set(all.filter(s => s.status !== 'Cancelled').map(s => s.programmeId));
    const allProgrammes = (this.data.programmes || []).filter(p => !p.isArchived);
    const unscheduledProgrammes = allProgrammes.filter(p => !scheduledProgIds.has(p.id)).length;

    // Conflicting entries
    let conflictingCount = 0;
    all.forEach(s => {
      const check = this.detectScheduleConflicts(s, s.id);
      if (check.hasErrors) conflictingCount++;
    });

    // Stage distribution
    const stages = this.getProgrammeStages();
    const norm = (str) => String(str || '').toLowerCase().replace(/\\s*\\(stage\\s*\\d+\\)/i, '').trim();
    const stageDistribution = stages.map(st => ({
      ...st,
      sessionCount: all.filter(s => norm(s.stage) === norm(st.name) && s.status !== 'Cancelled').length
    }));

    return {
      totalScheduledSessions,
      todayProgrammes,
      day2Programmes,
      upcomingProgrammes,
      ongoingProgrammes,
      completedProgrammes,
      cancelledProgrammes,
      unscheduledProgrammes,
      conflictingScheduleEntries: conflictingCount,
      stageDistribution,
      totalFestivalDays: 2
    };
  }

  addProgrammeSchedule(scheduleData, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    if (!scheduleData.programmeId) {
      throw new Error('Please select an existing programme from Programme Management.');
    }
    const prog = (this.data.programmes || []).find(p => p.id === scheduleData.programmeId || p.code === scheduleData.programmeId);
    if (!prog) {
      throw new Error(\`Selected programme "\${scheduleData.programmeId}" does not exist in Programme Management.\`);
    }

    if (!scheduleData.date) throw new Error('Programme Date is required.');
    if (!scheduleData.startTime) throw new Error('Start Time is required.');
    if (!scheduleData.endTime) throw new Error('End Time is required.');
    if (!scheduleData.stage) throw new Error('Stage / Venue selection is required.');

    // Conflict detection
    const conflictCheck = this.detectScheduleConflicts(scheduleData);
    if (conflictCheck.hasErrors && !overrideConflicts) {
      const errorMsgs = conflictCheck.conflicts.filter(c => c.severity === 'error').map(c => c.message).join(' | ');
      throw new Error(\`Schedule Conflict Detected: \${errorMsgs}\`);
    }

    const nextNum = (this.data.programmeSchedules ? this.data.programmeSchedules.length : 0) + 1;
    const newId = \`SCH-\${nextNum.toString().padStart(2, '0')}\`;

    const assignedGuestIds = Array.isArray(scheduleData.assignedGuestIds)
      ? Array.from(new Set(scheduleData.assignedGuestIds))
      : (prog.assignedGuestIds || (prog.guestId ? [prog.guestId] : []));

    const startTime = scheduleData.startTime.trim();
    const endTime = scheduleData.endTime.trim();
    const timeRange = scheduleData.timeRange || \`\${startTime} – \${endTime}\`;

    const newSchedule = {
      id: newId,
      programmeId: prog.id,
      programmeCode: prog.code,
      programmeTitle: prog.title,
      date: scheduleData.date.trim(),
      startTime,
      endTime,
      timeRange,
      stage: scheduleData.stage.trim(),
      stageId: scheduleData.stageId || 'STG-01',
      coordinatorName: scheduleData.coordinatorName ? scheduleData.coordinatorName.trim() : (prog.coordinatorName || ''),
      coordinatorPhone: scheduleData.coordinatorPhone ? scheduleData.coordinatorPhone.trim() : (prog.coordinatorPhone || ''),
      assignedGuestIds,
      notes: scheduleData.notes ? scheduleData.notes.trim() : '',
      status: scheduleData.status || 'Scheduled',
      isPublished: scheduleData.isPublished !== undefined ? Boolean(scheduleData.isPublished) : true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!this.data.programmeSchedules) this.data.programmeSchedules = [];
    this.data.programmeSchedules.push(newSchedule);

    // Bi-directionally sync schedule details to parent programme
    prog.date = newSchedule.date;
    prog.time = newSchedule.timeRange;
    prog.startTime = newSchedule.startTime;
    prog.endTime = newSchedule.endTime;
    prog.venue = newSchedule.stage;
    prog.assignedGuestIds = assignedGuestIds;
    prog.status = newSchedule.status;
    prog.updatedAt = new Date().toISOString();

    // Bi-directionally sync with guests
    assignedGuestIds.forEach(gid => {
      const guest = (this.data.programmeGuests || []).find(g => g.id === gid);
      if (guest) {
        if (!Array.isArray(guest.assignedProgrammeIds)) guest.assignedProgrammeIds = [];
        if (!guest.assignedProgrammeIds.includes(prog.id)) {
          guest.assignedProgrammeIds.push(prog.id);
        }
      }
    });

    this.addAuditLog('SCHEDULE_ENTRY_CREATED', \`Scheduled session for \${prog.title} at \${newSchedule.stage} on \${newSchedule.date} by \${adminUser}\`);
    this.saveData();
    return { success: true, schedule: newSchedule, conflicts: conflictCheck.conflicts };
  }

  updateProgrammeSchedule(id, updateData, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    const candidate = { ...schedule, ...updateData };

    const conflictCheck = this.detectScheduleConflicts(candidate, id);
    if (conflictCheck.hasErrors && !overrideConflicts) {
      const errorMsgs = conflictCheck.conflicts.filter(c => c.severity === 'error').map(c => c.message).join(' | ');
      throw new Error(\`Schedule Conflict Detected: \${errorMsgs}\`);
    }

    if (updateData.date) schedule.date = updateData.date.trim();
    if (updateData.startTime) schedule.startTime = updateData.startTime.trim();
    if (updateData.endTime) schedule.endTime = updateData.endTime.trim();
    if (updateData.startTime || updateData.endTime) {
      schedule.timeRange = \`\${schedule.startTime} – \${schedule.endTime}\`;
    }
    if (updateData.stage) schedule.stage = updateData.stage.trim();
    if (updateData.stageId) schedule.stageId = updateData.stageId.trim();
    if (updateData.coordinatorName !== undefined) schedule.coordinatorName = updateData.coordinatorName.trim();
    if (updateData.coordinatorPhone !== undefined) schedule.coordinatorPhone = updateData.coordinatorPhone.trim();
    if (updateData.notes !== undefined) schedule.notes = updateData.notes.trim();
    if (updateData.status) schedule.status = updateData.status;
    if (updateData.isPublished !== undefined) schedule.isPublished = Boolean(updateData.isPublished);

    if (Array.isArray(updateData.assignedGuestIds)) {
      schedule.assignedGuestIds = Array.from(new Set(updateData.assignedGuestIds));
    }

    schedule.updatedAt = new Date().toISOString();

    // Bi-directionally sync to parent programme
    const prog = (this.data.programmes || []).find(p => p.id === schedule.programmeId);
    if (prog) {
      prog.date = schedule.date;
      prog.time = schedule.timeRange;
      prog.startTime = schedule.startTime;
      prog.endTime = schedule.endTime;
      prog.venue = schedule.stage;
      prog.status = schedule.status;
      if (schedule.assignedGuestIds) prog.assignedGuestIds = schedule.assignedGuestIds;
      prog.updatedAt = new Date().toISOString();
    }

    this.addAuditLog('SCHEDULE_ENTRY_UPDATED', \`Updated schedule for \${schedule.programmeTitle} (\${schedule.id}) by \${adminUser}\`);
    this.saveData();
    return { success: true, schedule, conflicts: conflictCheck.conflicts };
  }

  completeProgrammeSchedule(id, adminUser = 'Super Admin') {
    return this.updateProgrammeSchedule(id, { status: 'Completed' }, { overrideConflicts: true, adminUser });
  }

  cancelProgrammeSchedule(id, reason = '', adminUser = 'Super Admin') {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    schedule.status = 'Cancelled';
    schedule.cancellationReason = reason || 'Session cancelled by festival secretariat.';
    schedule.updatedAt = new Date().toISOString();

    const prog = (this.data.programmes || []).find(p => p.id === schedule.programmeId);
    if (prog) {
      prog.status = 'Cancelled';
      prog.updatedAt = new Date().toISOString();
    }

    this.addAuditLog('SCHEDULE_ENTRY_CANCELLED', \`Cancelled schedule for \${schedule.programmeTitle} (\${schedule.id}): \${reason} by \${adminUser}\`);
    this.saveData();
    return { success: true, schedule };
  }

  rescheduleProgramme(id, { newDate, newStartTime, newEndTime, newVenue, reason }, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    const updatePayload = {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      stage: newVenue,
      status: 'Rescheduled',
      notes: reason ? \`Rescheduled: \${reason}\` : 'Rescheduled session.'
    };
    return this.updateProgrammeSchedule(id, updatePayload, { overrideConflicts, adminUser });
  }

  archiveProgrammeSchedule(id, adminUser = 'Super Admin') {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    schedule.isArchived = true;
    schedule.updatedAt = new Date().toISOString();

    this.addAuditLog('SCHEDULE_ENTRY_ARCHIVED', \`Archived schedule entry for \${schedule.programmeTitle} (\${schedule.id}) by \${adminUser}\`);
    this.saveData();
    return { success: true };
  }

  deleteProgrammeSchedule(id, { force = false, adminUser = 'Super Admin' } = {}) {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    this.data.programmeSchedules = (this.data.programmeSchedules || []).filter(s => s.id !== id);
    this.addAuditLog('SCHEDULE_ENTRY_DELETED', \`Deleted schedule entry \${id} by \${adminUser}\`);
    this.saveData();
    return { success: true };
  }

  getPublicProgrammeSchedule({ date = null } = {}) {
    let list = this.getProgrammeSchedules({
      includeArchived: false,
      includePrivate: false
    }).filter(s => s.isPublished && s.status !== 'Cancelled');

    if (date) {
      if (date === 'day1' || date.includes('21')) {
        list = list.filter(s => String(s.date).includes('21'));
      } else if (date === 'day2' || date.includes('22')) {
        list = list.filter(s => String(s.date).includes('22'));
      } else {
        list = list.filter(s => s.date === date);
      }
    }

    return list;
  }`;

if (content.includes(target)) {
  content = content.replace(target, scheduleMethods);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully appended schedule methods to FestivalStore.');
} else {
  console.error('Target not found in festivalStore.js!');
}
