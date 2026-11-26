/**
 * DALENZIA FEST 2K26 — CENTRALIZED RESULT CALCULATION & RULE VALIDATION ENGINE
 * Single Source of Truth for:
 *   - Category & Programme Classification Rules (Sub Junior, Junior, Senior, General)
 *   - Participation Eligibility & Limits (4+5 SubJunior, 5+6 Junior/Senior, Team 3 Ind / 2 Grp)
 *   - Mark Validation & Grade Allocation (Official grades: A+, A, B, C — active only when Admin confirms thresholds/points)
 *   - Tie Detection & Handling
 *   - Position Points (Individual: 5-3-1, Group/General: 15-10-5 from scoringConfig)
 *   - Standings & Leaderboard Aggregation (Strictly from APPROVED / Published results, zero double-counting)
 */

export const OFFICIAL_STUDENT_CATEGORIES = ['Sub Junior', 'Junior', 'Senior'];
export const OFFICIAL_ALL_CATEGORIES = ['Sub Junior', 'Junior', 'Senior', 'General'];
export const OFFICIAL_APPROVED_STATUSES = ['APPROVED', 'PUBLISHED', 'Approved', 'Published', 'Verified'];

/**
 * Normalize legacy or hyphenated category names to official Charter 2K26 labels.
 * Optionally migrates deprecated 'Minor' to 'Sub Junior' when migrateLegacy=true.
 */
export function normalizeCategoryName(category, { migrateLegacy = false } = {}) {
  const raw = String(category || '').trim();
  const compact = raw.toLowerCase().replace(/[\s_-]/g, '');
  if (compact === 'subjunior') return 'Sub Junior';
  if (compact === 'junior') return 'Junior';
  if (compact === 'senior') return 'Senior';
  if (compact === 'general' || compact === 'open' || compact === 'team') return 'General';
  if (compact === 'minor') return migrateLegacy ? 'Sub Junior' : 'Minor';
  return raw || 'Sub Junior';
}

/**
 * Normalize programme classification: 'Stage' | 'Off Stage' | 'General'
 */
export function normalizeClassification(classification, category) {
  const cat = normalizeCategoryName(category);
  if (cat === 'General') return 'General';
  const c = String(classification || '').trim().toLowerCase().replace(/[\s_-]/g, '');
  if (c === 'offstage') return 'Off Stage';
  if (c === 'general') return 'General';
  return 'Stage';
}

/**
 * Determine whether a programme or competition uses Group/General scoring rules.
 */
export function isGroupOrGeneralProgramme(item = {}) {
  if (!item) return false;
  const type = String(item.type || item.eventType || '').trim().toLowerCase();
  const cat = normalizeCategoryName(item.category);
  const cls = String(item.classification || '').trim().toLowerCase();
  return type === 'group' || type === 'team' || type === 'general' || cat === 'General' || cls === 'general';
}

/**
 * Safely read current position point rules from scoringConfig.
 */
export function getPositionPointsTable(scoringConfig = {}) {
  const pos = scoringConfig?.positionPoints || {};
  const ind = pos.individual || {};
  const grp = pos.group || {};
  return {
    individual: {
      1: Number.isFinite(Number(ind.first)) ? Number(ind.first) : 5,
      2: Number.isFinite(Number(ind.second)) ? Number(ind.second) : 3,
      3: Number.isFinite(Number(ind.third)) ? Number(ind.third) : 1,
    },
    group: {
      1: Number.isFinite(Number(grp.first)) ? Number(grp.first) : 15,
      2: Number.isFinite(Number(grp.second)) ? Number(grp.second) : 10,
      3: Number.isFinite(Number(grp.third)) ? Number(grp.third) : 5,
    },
  };
}

/**
 * Retrieve category-specific per-student Stage & Off-Stage entry limits.
 */
export function getStudentEntryLimits(category, scoringConfig = {}) {
  const normalized = normalizeCategoryName(category, { migrateLegacy: true });
  const byCat = scoringConfig?.entryLimits?.byCategory || {};
  const catRule = byCat[normalized] || {};

  if (normalized === 'Sub Junior') {
    return {
      maxStage: Number(catRule.maxStageItemsPerStudent ?? 4),
      maxOffStage: Number(catRule.maxOffStageItemsPerStudent ?? 5),
      maxEntriesPerTeamIndividual: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamIndividual ?? 3),
      maxEntriesPerTeamGroup: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamGroup ?? 2),
    };
  }
  if (normalized === 'Junior' || normalized === 'Senior') {
    return {
      maxStage: Number(catRule.maxStageItemsPerStudent ?? 5),
      maxOffStage: Number(catRule.maxOffStageItemsPerStudent ?? 6),
      maxEntriesPerTeamIndividual: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamIndividual ?? 3),
      maxEntriesPerTeamGroup: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamGroup ?? 2),
    };
  }
  return {
    maxStage: Number(scoringConfig?.entryLimits?.maxStageItemsPerStudent ?? 4),
    maxOffStage: Number(scoringConfig?.entryLimits?.maxOffStageItemsPerStudent ?? 5),
    maxEntriesPerTeamIndividual: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamIndividual ?? 3),
    maxEntriesPerTeamGroup: Number(scoringConfig?.entryLimits?.maxEntriesPerTeamGroup ?? 2),
  };
}

/**
 * Compute official Grade (A+, A, B, C) and optional Grade Points from scoringConfig.
 * Never invents missing thresholds or point values: if minMarks are null, returns grade=null.
 */
export function calculateGradeForScore({
  rawMarks,
  maxMarks = 100,
  scoringConfig = {},
  isGroup = false,
  requiredMembers = null,
}) {
  const numericScore = Number(rawMarks);
  const numericMax = Number(maxMarks) > 0 ? Number(maxMarks) : 100;
  if (!Number.isFinite(numericScore) || numericScore < 0) {
    return {
      grade: null,
      gradePoints: 0,
      percentage: 0,
      hasConfiguredThresholds: false,
      gradePointsApplied: false,
      note: 'Invalid score',
    };
  }

  const percentage = Math.min(100, Math.max(0, (numericScore / numericMax) * 100));
  const grades = Array.isArray(scoringConfig?.grades) ? scoringConfig.grades : [];

  // Only grades with explicit numeric minMarks configured by Admin participate in matching
  const configuredGrades = grades
    .filter((g) => g && g.isActive !== false && g.minMarks !== null && g.minMarks !== undefined && Number.isFinite(Number(g.minMarks)))
    .sort((a, b) => Number(b.minMarks) - Number(a.minMarks));

  if (configuredGrades.length === 0) {
    return {
      grade: null,
      gradePoints: 0,
      percentage: Number(percentage.toFixed(2)),
      hasConfiguredThresholds: false,
      gradePointsApplied: false,
      note: 'Grade mark thresholds pending Admin confirmation',
    };
  }

  const matched = configuredGrades.find((g) => percentage >= Number(g.minMarks));
  const grade = matched ? matched.grade : 'No Grade';

  // Charter p.4 note: Group grade applies to >3 / 3+ members ("മൂന്നിലധികം അംഗങ്ങൾ") unless Admin overrides
  const twoMemberGroupBlocked =
    isGroup &&
    requiredMembers !== null &&
    requiredMembers !== undefined &&
    Number(requiredMembers) <= 2 &&
    scoringConfig?.gradeRules?.allowTwoMemberGroupGradePoints !== true;

  let gradePoints = 0;
  let gradePointsApplied = false;
  if (matched && scoringConfig?.isGradePointsActive === true && !twoMemberGroupBlocked) {
    const rawPt = isGroup ? matched.groupPoints : matched.individualPoints;
    if (rawPt !== null && rawPt !== undefined && Number.isFinite(Number(rawPt))) {
      gradePoints = Number(rawPt);
      gradePointsApplied = true;
    }
  }

  return {
    grade,
    gradePoints,
    percentage: Number(percentage.toFixed(2)),
    hasConfiguredThresholds: true,
    gradePointsApplied,
    note: twoMemberGroupBlocked
      ? '2-member General item grade points await Admin confirmation (Charter p.4 note)'
      : matched
        ? matched.label || matched.grade
        : 'Below configured minimum pass grade threshold',
  };
}

/**
 * Validate mark entries before judge submission or result calculation.
 */
export function validateMarkEntries(entries = [], { maxMarks = 100, isGroup = false } = {}) {
  const errors = [];
  const warnings = [];
  const maxAllowed = Number(maxMarks) > 0 ? Number(maxMarks) : 100;

  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push('At least one scored participant/team entry is required before submitting.');
    return { isValid: false, errors, warnings };
  }

  const seenKeys = new Set();
  entries.forEach((entry, idx) => {
    const raw = entry.score ?? entry.totalScore ?? entry.total ?? entry.marks ?? entry.totalMarks;
    const label = entry.name || entry.studentName || entry.teamName || `Entry #${idx + 1}`;
    const num = Number(raw);

    if (raw === '' || raw === null || raw === undefined || !Number.isFinite(num)) {
      errors.push(`${label}: Marks must be a valid number.`);
    } else if (num < 0 || num > maxAllowed) {
      errors.push(`${label}: Marks (${num}) must be between 0 and ${maxAllowed}.`);
    }

    const dedupeKey = isGroup
      ? `${entry.teamId || 'team'}::${entry.entryIndex || entry.entryId || entry.studentId || idx}`
      : `${entry.studentId || entry.chestNo || entry.codeLetter || label}`;

    if (seenKeys.has(dedupeKey)) {
      errors.push(`Duplicate mark entry detected for ${label}.`);
    }
    seenKeys.add(dedupeKey);

    if (isGroup && !entry.teamId) {
      warnings.push(`${label}: Missing explicit teamId reference.`);
    }
  });

  // Check duplicate numeric scores for ties (warning)
  const scoreMap = new Map();
  entries.forEach((entry) => {
    const num = Number(entry.score ?? entry.totalScore ?? entry.total ?? entry.marks ?? entry.totalMarks);
    if (Number.isFinite(num) && num > 0) {
      scoreMap.set(num, (scoreMap.get(num) || 0) + 1);
    }
  });
  scoreMap.forEach((count, scoreVal) => {
    if (count > 1) {
      warnings.push(`Tie detected at score ${scoreVal} (${count} entries tied).`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate whether a student (or team entry) is eligible to register in a competition.
 * Supports:
 *   - Sub Junior: 4 Stage + 5 Off Stage
 *   - Junior / Senior: 5 Stage + 6 Off Stage
 *   - Team limit: max 3 per Individual competition, max 2 entries per Group/General competition
 */
export function validateParticipantRegistration({
  student,
  competition,
  allCompetitions = [],
  scoringConfig = {},
}) {
  if (!student) {
    return { allowed: false, reason: 'Student record not found.' };
  }
  if (!competition) {
    return { allowed: false, reason: 'Competition not found.' };
  }
  if (student.status === 'Inactive') {
    return { allowed: false, reason: `${student.name} is marked Inactive.` };
  }

  const isGroup = isGroupOrGeneralProgramme(competition);
  const compCat = normalizeCategoryName(competition.category, { migrateLegacy: true });
  const stuCat = normalizeCategoryName(student.classCategory || student.category, { migrateLegacy: true });

  // Category eligibility check for non-General events
  if (!isGroup && compCat !== 'General' && compCat !== stuCat) {
    return {
      allowed: false,
      reason: `Category mismatch: ${student.name} is in ${stuCat}, whereas "${competition.title || competition.name}" is for ${compCat}.`,
    };
  }

  const existingParticipants = Array.isArray(competition.participants) ? competition.participants : [];
  if (existingParticipants.some((p) => p.studentId === student.id)) {
    return { allowed: false, reason: `${student.name} is already registered in this programme.` };
  }

  // Team quota check within this competition
  const teamId = student.teamId;
  const limits = getStudentEntryLimits(stuCat, scoringConfig);
  if (teamId) {
    const teamEntries = existingParticipants.filter((p) => p.teamId === teamId);
    if (!isGroup) {
      if (teamEntries.length >= limits.maxEntriesPerTeamIndividual) {
        return {
          allowed: false,
          reason: `Team entry limit reached: max ${limits.maxEntriesPerTeamIndividual} entries per team in Individual items.`,
        };
      }
    } else {
      const uniqueGroupEntries = new Set(teamEntries.map((p) => p.entryIndex || p.entryId || 1));
      const reqMembers = Number(competition.requiredMembers || 0);
      if (reqMembers > 0 && teamEntries.length >= reqMembers * limits.maxEntriesPerTeamGroup) {
        return {
          allowed: false,
          reason: `Team entry limit reached: max ${limits.maxEntriesPerTeamGroup} entries (${reqMembers} members each) in Group/General items.`,
        };
      }
      if (reqMembers === 0 && uniqueGroupEntries.size >= limits.maxEntriesPerTeamGroup && !competition._allowTeamMemberAppend) {
        // Member-count check falls back when requiredMembers isn't specified
      }
    }
  }

  // Individual student Stage vs Off-Stage limits apply strictly to individual category programmes
  // (Team Leaders & Charter rules govern per-student Stage/Off-Stage limits separately from General ensemble items)
  if (!isGroup && compCat !== 'General') {
    const targetCls = normalizeClassification(competition.classification || competition.format, compCat);
    let stageCount = 0;
    let offStageCount = 0;

    allCompetitions.forEach((c) => {
      if (isGroupOrGeneralProgramme(c)) return;
      const inComp = (c.participants || []).some((p) => p.studentId === student.id);
      if (!inComp) return;
      const cCls = normalizeClassification(c.classification || c.format, c.category);
      if (cCls === 'Off Stage') offStageCount += 1;
      else if (cCls === 'Stage') stageCount += 1;
    });

    if (targetCls === 'Stage' && stageCount >= limits.maxStage) {
      return {
        allowed: false,
        reason: `${stuCat} Stage limit reached: ${student.name} is already in ${stageCount}/${limits.maxStage} Stage items.`,
      };
    }
    if (targetCls === 'Off Stage' && offStageCount >= limits.maxOffStage) {
      return {
        allowed: false,
        reason: `${stuCat} Off-Stage limit reached: ${student.name} is already in ${offStageCount}/${limits.maxOffStage} Off-Stage items.`,
      };
    }
  }

  return { allowed: true, limits };
}

/**
 * Calculate ranked results, grades, position points, grade points, ties, and team point totals
 * for a single competition evaluation.
 */
export function calculateCompetitionResults({
  competition = {},
  scores = [],
  scoringConfig = {},
  teams = [],
  registeredStudents = [],
}) {
  const isGroup = isGroupOrGeneralProgramme(competition);
  const maxMarks = Number(competition.maxMarks || competition.totalMaxMarks || 100);
  const requiredMembers = competition.requiredMembers ?? null;
  const posTable = getPositionPointsTable(scoringConfig);
  const pointsMap = isGroup ? posTable.group : posTable.individual;
  const tieMode = scoringConfig?.tieHandlingMode || 'FLAG_FOR_ADMIN';

  const teamLookup = new Map((teams || []).map((t) => [t.id, t]));
  const studentLookup = new Map((registeredStudents || []).map((s) => [s.id, s]));

  // Normalize & enrich raw input scores
  const normalized = (scores || []).map((item, idx) => {
    const stu = item.studentId ? studentLookup.get(item.studentId) : null;
    const resolvedTeamId = item.teamId || stu?.teamId || null;
    const team = resolvedTeamId ? teamLookup.get(resolvedTeamId) : null;
    const rawScore = Number(item.score ?? item.totalScore ?? item.total ?? item.marks ?? item.totalMarks ?? 0);

    return {
      ...item,
      studentId: item.studentId || null,
      chestNo: item.chestNo || stu?.chestNo || '',
      codeLetter: item.codeLetter || '',
      name: item.name || item.studentName || stu?.name || item.teamName || team?.name || `Entry ${idx + 1}`,
      teamId: resolvedTeamId,
      teamName: item.teamName || stu?.teamName || team?.name || 'Unassigned',
      entryIndex: item.entryIndex || 1,
      entryLabel: item.entryLabel || (isGroup && item.entryIndex ? `${team?.name || item.teamName || 'Team'} — Entry #${item.entryIndex}` : null),
      memberIds: Array.isArray(item.memberIds) ? item.memberIds : [],
      memberNames: Array.isArray(item.memberNames) ? item.memberNames : [],
      totalScore: Number.isFinite(rawScore) ? Number(rawScore.toFixed(2)) : 0,
      criteriaScores: item.criteriaScores || {},
    };
  });

  // Deterministic sort: highest score first; tie-breaker fallback by codeLetter/chestNo for display order
  const sorted = [...normalized].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return String(a.codeLetter || a.chestNo || a.name).localeCompare(String(b.codeLetter || b.chestNo || b.name));
  });

  // Assign standard competition ranking (1, 1, 3...) and detect ties
  const scoreGroups = new Map();
  sorted.forEach((row) => {
    const k = row.totalScore;
    if (!scoreGroups.has(k)) scoreGroups.set(k, []);
    scoreGroups.get(k).push(row);
  });

  const tieDetails = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i];
    const group = scoreGroups.get(row.totalScore) || [row];
    const isTied = group.length > 1 && row.totalScore > 0;

    if (i > 0 && row.totalScore < sorted[i - 1].totalScore) {
      currentRank = i + 1;
    }
    row.rank = currentRank;
    row.isTied = isTied;

    if (isTied && currentRank <= 3 && !tieDetails.some((t) => t.score === row.totalScore)) {
      tieDetails.push({
        rank: currentRank,
        score: row.totalScore,
        entries: group.map((g) => ({
          name: g.entryLabel || g.name,
          teamId: g.teamId,
          teamName: g.teamName,
          studentId: g.studentId,
        })),
      });
    }
  }

  // Calculate Position Points & Grades per row
  const teamPointsDelta = {};
  (teams || []).forEach((t) => {
    teamPointsDelta[t.id] = 0;
  });

  const computedEntries = sorted.map((row) => {
    const tieCount = (scoreGroups.get(row.totalScore) || [row]).length;
    let positionPoints = 0;

    if (row.totalScore > 0) {
      if (!row.isTied || tieMode === 'FULL_POINTS' || tieMode === 'FLAG_FOR_ADMIN') {
        positionPoints = pointsMap[row.rank] || 0;
      } else if (tieMode === 'SPLIT_POINTS') {
        let sum = 0;
        for (let r = row.rank; r < row.rank + tieCount; r++) {
          sum += pointsMap[r] || 0;
        }
        positionPoints = Number((sum / tieCount).toFixed(2));
      }
    }

    const gradeRes = calculateGradeForScore({
      rawMarks: row.totalScore,
      maxMarks,
      scoringConfig,
      isGroup,
      requiredMembers,
    });

    const totalPoints = Number((positionPoints + (gradeRes.gradePoints || 0)).toFixed(2));

    if (row.teamId) {
      teamPointsDelta[row.teamId] = Number(((teamPointsDelta[row.teamId] || 0) + totalPoints).toFixed(2));
    }

    return {
      ...row,
      isGroup,
      maxMarks,
      positionLabel:
        row.rank === 1 ? '1st Place' : row.rank === 2 ? '2nd Place' : row.rank === 3 ? '3rd Place' : `${row.rank}th Place`,
      positionPoints,
      grade: gradeRes.grade,
      gradePoints: gradeRes.gradePoints,
      gradePercentage: gradeRes.percentage,
      hasConfiguredGradeThresholds: gradeRes.hasConfiguredThresholds,
      gradePointsApplied: gradeRes.gradePointsApplied,
      gradeNote: gradeRes.note,
      totalPoints,
    };
  });

  const firstPlace = computedEntries.find((e) => e.rank === 1) || null;
  const secondPlace = computedEntries.find((e) => e.rank === 2) || null;
  const thirdPlace = computedEntries.find((e) => e.rank === 3) || null;

  return {
    competitionId: competition.id,
    competitionCode: competition.code || competition.competitionCode,
    competitionTitle: competition.title || competition.name || competition.competitionTitle,
    category: normalizeCategoryName(competition.category, { migrateLegacy: true }),
    classification: normalizeClassification(competition.classification || competition.format, competition.category),
    isGroup,
    maxMarks,
    requiredMembers,
    positionPointRule: isGroup ? posTable.group : posTable.individual,
    entries: computedEntries,
    winners: {
      first: firstPlace,
      second: secondPlace,
      third: thirdPlace,
    },
    hasTie: tieDetails.length > 0,
    tieDetails,
    tieHandlingMode: tieMode,
    isGradePointsActive: Boolean(scoringConfig?.isGradePointsActive),
    hasConfiguredGradeThresholds: computedEntries.some((e) => e.hasConfiguredGradeThresholds),
    teamPointsDelta,
  };
}

/**
 * Check if an evaluation or poster status is officially Approved / Published.
 */
export function isOfficiallyApprovedStatus(status) {
  if (!status) return false;
  const norm = String(status).trim().toLowerCase();
  return (
    norm === 'approved' ||
    norm === 'published' ||
    norm === 'verified' ||
    norm === 'approved by convener' ||
    norm === 'approved by admin'
  );
}

/**
 * Centralized aggregator calculating Team, Category, and Student leaderboards
 * strictly from APPROVED / Published competition evaluations (no double-counting).
 */
export function calculateStandingsFromApprovedResults({
  teams = [],
  registeredStudents = [],
  submittedEvaluations = [],
  resultPosters = [],
  programmeAssignments = [],
  scoringConfig = {},
}) {
  const assignmentMap = new Map((programmeAssignments || []).map((a) => [a.id, a]));
  const approvedByComp = new Map();

  // 1. Primary source: submittedEvaluations that are APPROVED / Published
  (submittedEvaluations || []).forEach((ev) => {
    if (!ev || !ev.competitionId) return;
    if (!isOfficiallyApprovedStatus(ev.status) && ev.isPublished !== true) return;
    const rawEntries = ev.calculatedEntries || ev.calculatedResults?.entries || ev.scores || [];
    if (rawEntries.length === 0) return;

    const comp = assignmentMap.get(ev.competitionId) || {
      id: ev.competitionId,
      code: ev.competitionCode,
      title: ev.competitionTitle,
      category: ev.category,
      classification: ev.classification,
      type: ev.type || (normalizeCategoryName(ev.category) === 'General' ? 'Group' : 'Individual'),
      requiredMembers: ev.requiredMembers ?? null,
      maxMarks: ev.maxMarks || 100,
    };

    const existing = approvedByComp.get(ev.competitionId);
    const ts = new Date(ev.approvedAt || ev.updatedAt || ev.submittedAt || 0).getTime();
    if (!existing || ts >= existing._ts) {
      approvedByComp.set(ev.competitionId, {
        _ts: ts,
        competition: comp,
        scores: rawEntries,
        evaluation: ev,
      });
    }
  });

  // 2. Legacy fallback: Published resultPosters whose competitionId is not already represented above
  (resultPosters || []).forEach((poster) => {
    if (!poster || !poster.competitionId) return;
    if (!isOfficiallyApprovedStatus(poster.status) && poster.isPublished !== true) return;
    if (approvedByComp.has(poster.competitionId)) return;

    const legacyScores = [];
    if (poster.firstPrize) {
      legacyScores.push({
        ...poster.firstPrize,
        score: poster.firstPrize.score ?? poster.firstPrize.totalScore ?? 90,
      });
    }
    if (poster.secondPrize) {
      legacyScores.push({
        ...poster.secondPrize,
        score: poster.secondPrize.score ?? poster.secondPrize.totalScore ?? 80,
      });
    }
    if (poster.thirdPrize) {
      legacyScores.push({
        ...poster.thirdPrize,
        score: poster.thirdPrize.score ?? poster.thirdPrize.totalScore ?? 70,
      });
    }
    if (legacyScores.length === 0) return;

    const comp = assignmentMap.get(poster.competitionId) || {
      id: poster.competitionId,
      code: poster.competitionCode,
      title: poster.competitionTitle,
      category: poster.category,
      classification: poster.classification,
      type: normalizeCategoryName(poster.category) === 'General' ? 'Group' : 'Individual',
      maxMarks: 100,
    };

    approvedByComp.set(poster.competitionId, {
      _ts: new Date(poster.publishedAt || 0).getTime(),
      competition: comp,
      scores: legacyScores,
      evaluation: poster,
    });
  });

  // Initialize accumulators
  const teamStatsMap = new Map();
  (teams || []).forEach((t) => {
    teamStatsMap.set(t.id, {
      id: t.id,
      name: t.name,
      displayName: t.displayName || t.name,
      code: t.code,
      color: t.color,
      leader: t.leader,
      asstLeader: t.asstLeader,
      points: 0,
      individualPoints: 0,
      groupGeneralPoints: 0,
      positionPoints: 0,
      gradePoints: 0,
      goldCount: 0,
      silverCount: 0,
      bronzeCount: 0,
      winsCount: 0,
      approvedCompetitionsCount: 0,
      categoryPoints: {
        'Sub Junior': 0,
        Junior: 0,
        Senior: 0,
        General: 0,
      },
    });
  });

  const studentStatsMap = new Map();
  (registeredStudents || []).forEach((s) => {
    studentStatsMap.set(s.id, {
      id: s.id,
      chestNo: s.chestNo,
      name: s.name,
      teamId: s.teamId,
      teamName: s.teamName,
      classCategory: normalizeCategoryName(s.classCategory || s.category, { migrateLegacy: true }),
      points: 0,
      individualPoints: 0,
      groupParticipations: 0,
      positionPoints: 0,
      gradePoints: 0,
      firstCount: 0,
      secondCount: 0,
      thirdCount: 0,
      competitions: [],
    });
  });

  const computedCompetitions = [];

  // Recompute cleanly across every unique approved competition
  approvedByComp.forEach(({ competition, scores, evaluation }) => {
    const calc = calculateCompetitionResults({
      competition,
      scores,
      scoringConfig,
      teams,
      registeredStudents,
    });
    computedCompetitions.push({ ...calc, evaluationId: evaluation.id, approvedAt: evaluation.approvedAt || evaluation.publishedAt });

    const seenTeamsInComp = new Set();
    calc.entries.forEach((entry) => {
      if (entry.teamId && teamStatsMap.has(entry.teamId)) {
        const ts = teamStatsMap.get(entry.teamId);
        ts.points = Number((ts.points + entry.totalPoints).toFixed(2));
        ts.positionPoints = Number((ts.positionPoints + entry.positionPoints).toFixed(2));
        ts.gradePoints = Number((ts.gradePoints + entry.gradePoints).toFixed(2));
        if (calc.isGroup) {
          ts.groupGeneralPoints = Number((ts.groupGeneralPoints + entry.totalPoints).toFixed(2));
        } else {
          ts.individualPoints = Number((ts.individualPoints + entry.totalPoints).toFixed(2));
        }
        const catKey = calc.category in ts.categoryPoints ? calc.category : 'General';
        ts.categoryPoints[catKey] = Number(((ts.categoryPoints[catKey] || 0) + entry.totalPoints).toFixed(2));

        if (entry.totalScore > 0) {
          if (entry.rank === 1) {
            ts.goldCount += 1;
            ts.winsCount += 1;
          } else if (entry.rank === 2) {
            ts.silverCount += 1;
            ts.winsCount += 1;
          } else if (entry.rank === 3) {
            ts.bronzeCount += 1;
            ts.winsCount += 1;
          }
        }
        if (!seenTeamsInComp.has(entry.teamId)) {
          ts.approvedCompetitionsCount += 1;
          seenTeamsInComp.add(entry.teamId);
        }
      }

      // Attribute Individual points directly to Student & note Group/General participation
      if (!calc.isGroup && entry.studentId && studentStatsMap.has(entry.studentId)) {
        const ss = studentStatsMap.get(entry.studentId);
        ss.points = Number((ss.points + entry.totalPoints).toFixed(2));
        ss.individualPoints = Number((ss.individualPoints + entry.totalPoints).toFixed(2));
        ss.positionPoints = Number((ss.positionPoints + entry.positionPoints).toFixed(2));
        ss.gradePoints = Number((ss.gradePoints + entry.gradePoints).toFixed(2));
        if (entry.totalScore > 0) {
          if (entry.rank === 1) ss.firstCount += 1;
          else if (entry.rank === 2) ss.secondCount += 1;
          else if (entry.rank === 3) ss.thirdCount += 1;
        }
        ss.competitions.push({
          competitionId: calc.competitionId,
          title: calc.competitionTitle,
          code: calc.competitionCode,
          category: calc.category,
          classification: calc.classification,
          score: entry.totalScore,
          maxMarks: calc.maxMarks,
          rank: entry.rank,
          positionLabel: entry.positionLabel,
          grade: entry.grade,
          positionPoints: entry.positionPoints,
          gradePoints: entry.gradePoints,
          totalPoints: entry.totalPoints,
        });
      } else if (calc.isGroup && Array.isArray(entry.memberIds) && entry.memberIds.length > 0) {
        entry.memberIds.forEach((mId) => {
          const ss = studentStatsMap.get(mId);
          if (ss) {
            ss.groupParticipations += 1;
            ss.competitions.push({
              competitionId: calc.competitionId,
              title: calc.competitionTitle,
              code: calc.competitionCode,
              category: 'General',
              classification: 'General',
              isGroup: true,
              entryLabel: entry.entryLabel || entry.name,
              score: entry.totalScore,
              maxMarks: calc.maxMarks,
              rank: entry.rank,
              positionLabel: entry.positionLabel,
              grade: entry.grade,
              teamPointsAwarded: entry.totalPoints,
            });
          }
        });
      }
    });
  });

  const teamStandings = Array.from(teamStatsMap.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
      return b.silverCount - a.silverCount;
    })
    .map((t, idx) => ({ ...t, rank: idx + 1 }));

  const studentLeaderboard = Array.from(studentStatsMap.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.firstCount !== a.firstCount) return b.firstCount - a.firstCount;
      return b.secondCount - a.secondCount;
    });

  const categoryLeaderboard = {
    'Sub Junior': studentLeaderboard.filter((s) => s.classCategory === 'Sub Junior'),
    Junior: studentLeaderboard.filter((s) => s.classCategory === 'Junior'),
    Senior: studentLeaderboard.filter((s) => s.classCategory === 'Senior'),
  };

  return {
    teamStandings,
    studentLeaderboard,
    categoryLeaderboard,
    computedCompetitions,
    approvedCompetitionCount: computedCompetitions.length,
  };
}
