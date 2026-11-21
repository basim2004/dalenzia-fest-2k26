const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/admin/data/festivalStore.js');
let code = fs.readFileSync(storePath, 'utf8');

// Check if already injected
if (code.includes('getFestivalAnalyticsOverview(')) {
  console.log('Reports methods already present in festivalStore.js');
  process.exit(0);
}

const reportsMethods = `
  // =========================================================================
  // STEP 12: REPORTS & ANALYTICS MODULE INTEGRATION METHODS
  // =========================================================================

  getFestivalAnalyticsOverview(filters = {}) {
    const students = this.getStudents();
    const teams = this.getTeams();
    const competitions = this.getCompetitions();
    const programmes = this.getProgrammes();
    const judges = this.getJudges();
    const guests = this.getProgrammeGuests();
    const posters = this.data.resultPosters || [];
    const gallery = this.data.galleryMedia || [];
    const announcements = this.data.announcements || [];
    const evaluations = this.getAllSubmittedEvaluations();

    // 1. Festival Overview
    const totalStudents = students.length;
    const totalTeams = teams.filter(t => t.status === 'Active' || !t.status).length;
    const totalCompetitions = competitions.length;
    const totalProgrammes = programmes.length;
    const totalJudges = judges.filter(j => j.status === 'Active' || !j.status).length;
    const totalProgrammeGuests = guests.length;
    const publishedPosters = posters.filter(p => p.status === 'Published');
    const totalPublishedResults = publishedPosters.length;
    const totalGalleryMedia = gallery.length;

    // 2. Competition Overview
    let totalCompetitionRegistrations = 0;
    const categoryMap = {};
    competitions.forEach(c => {
      const regCount = c.participants?.length || c.registeredCount || 0;
      totalCompetitionRegistrations += regCount;
      const cat = c.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, count: 0, publishedCount: 0, registrations: 0 };
      }
      categoryMap[cat].count++;
      categoryMap[cat].registrations += regCount;
      if (c.isPublished || (c.resultPoster && c.resultPoster.status === 'Published')) {
        categoryMap[cat].publishedCount++;
      }
    });

    const completedCompetitions = competitions.filter(c => c.isPublished || c.status === 'Approved' || c.status === 'Completed').length;
    const pendingEvaluations = competitions.filter(c => !c.isPublished && (c.status === 'Under Verification' || (c.submittedEvaluationsCount > 0 && c.submittedEvaluationsCount < (c.assignedJudgeIds?.length || 1)))).length;

    const competitionCategories = Object.values(categoryMap);

    // 3. Programme Overview
    const scheduledProgrammes = programmes.filter(p => p.status === 'Scheduled').length;
    const completedProgrammes = programmes.filter(p => p.status === 'Completed').length;
    const cancelledProgrammes = programmes.filter(p => p.status === 'Cancelled').length;
    const upcomingProgrammes = scheduledProgrammes;
    const guestParticipation = programmes.filter(p => p.guestName || p.guestId || p.guest).length;

    const progCategoryMap = {};
    programmes.forEach(p => {
      const cat = p.category || 'General';
      progCategoryMap[cat] = (progCategoryMap[cat] || 0) + 1;
    });
    const programmeCategories = Object.entries(progCategoryMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalProgrammes > 0 ? Math.round((count / totalProgrammes) * 100) : 0
    }));

    // 4. Team Overview
    const totalTeamPoints = teams.reduce((acc, t) => acc + (t.points || 0), 0);
    const sortedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

    let firstPositionsCount = 0;
    let secondPositionsCount = 0;
    let thirdPositionsCount = 0;
    publishedPosters.forEach(p => {
      if (p.firstPrize) firstPositionsCount++;
      if (p.secondPrize) secondPositionsCount++;
      if (p.thirdPrize) thirdPositionsCount++;
    });

    const teamPerformanceSummary = sortedTeams.map(t => {
      let firsts = 0;
      let seconds = 0;
      let thirds = 0;
      publishedPosters.forEach(p => {
        if (p.firstPrize?.teamId === t.id) firsts++;
        if (p.secondPrize?.teamId === t.id) seconds++;
        if (p.thirdPrize?.teamId === t.id) thirds++;
      });
      return {
        teamId: t.id,
        teamCode: t.code,
        teamName: t.name,
        subname: t.subname,
        points: t.points || 0,
        rank: t.rank || 0,
        badge: t.badge,
        firsts,
        seconds,
        thirds,
        totalAwards: firsts + seconds + thirds
      };
    });

    return {
      festivalOverview: {
        totalStudents,
        totalTeams,
        totalCompetitions,
        totalProgrammes,
        totalJudges,
        totalProgrammeGuests,
        totalPublishedResults,
        totalGalleryMedia,
        totalAnnouncements: announcements.filter(a => a.status === 'Published').length,
        totalPosters: (this.data.posters || []).length
      },
      competitionOverview: {
        totalRegistrations: totalCompetitionRegistrations,
        completedCompetitions,
        pendingEvaluations,
        publishedResults: totalPublishedResults,
        categories: competitionCategories
      },
      programmeOverview: {
        totalProgrammes,
        scheduledProgrammes,
        completedProgrammes,
        cancelledProgrammes,
        upcomingProgrammes,
        guestParticipation,
        categories: programmeCategories
      },
      teamOverview: {
        totalTeamPoints,
        rankedTeams: teamPerformanceSummary,
        firstPositionsAwarded: firstPositionsCount,
        secondPositionsAwarded: secondPositionsCount,
        thirdPositionsAwarded: thirdPositionsCount,
        totalAwardsAwarded: firstPositionsCount + secondPositionsCount + thirdPositionsCount,
        topTeam: sortedTeams[0] || null,
        averageTeamPoints: teams.length > 0 ? Math.round(totalTeamPoints / teams.length) : 0
      }
    };
  }

  getTeamPerformanceReports(filters = {}) {
    const teams = this.getTeams();
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');

    let reports = teams.map(t => {
      // Find students belonging to this team
      const teamStudents = students.filter(s => s.teamId === t.id);
      
      // Count competition registrations for this team
      let compRegs = 0;
      competitions.forEach(c => {
        (c.participants || []).forEach(p => {
          if (p.teamId === t.id || teamStudents.some(s => s.id === p.studentId)) {
            compRegs++;
          }
        });
      });

      // Aggregate awards won by this team
      let firsts = 0;
      let seconds = 0;
      let thirds = 0;
      const resultsList = [];
      const categoryPoints = {};

      posters.forEach(p => {
        if (p.firstPrize?.teamId === t.id) {
          firsts++;
          const pts = p.firstPrize.points || 30;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '1st Prize (Gold)',
            rank: 1,
            studentName: p.firstPrize.name,
            chestNo: p.firstPrize.chestNo,
            score: p.firstPrize.score,
            points: pts,
            date: p.date
          });
        }
        if (p.secondPrize?.teamId === t.id) {
          seconds++;
          const pts = p.secondPrize.points || 20;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '2nd Prize (Silver)',
            rank: 2,
            studentName: p.secondPrize.name,
            chestNo: p.secondPrize.chestNo,
            score: p.secondPrize.score,
            points: pts,
            date: p.date
          });
        }
        if (p.thirdPrize?.teamId === t.id) {
          thirds++;
          const pts = p.thirdPrize.points || 10;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '3rd Prize (Bronze)',
            rank: 3,
            studentName: p.thirdPrize.name,
            chestNo: p.thirdPrize.chestNo,
            score: p.thirdPrize.score,
            points: pts,
            date: p.date
          });
        }
      });

      return {
        teamId: t.id,
        teamCode: t.code,
        teamName: t.name,
        subname: t.subname,
        leader: t.leader,
        leaderContact: t.leaderContact,
        totalStudents: t.members || teamStudents.length,
        actualStudentRecordsCount: teamStudents.length,
        totalCompetitionRegistrations: compRegs,
        totalParticipations: compRegs,
        firstPositions: firsts,
        secondPositions: seconds,
        thirdPositions: thirds,
        totalAwards: firsts + seconds + thirds,
        totalPoints: t.points || 0,
        currentRank: t.rank || 1,
        badge: t.badge,
        status: t.status || 'Active',
        results: resultsList,
        categoryPerformance: categoryPoints
      };
    });

    // Apply Filters
    if (filters.teamId && filters.teamId !== 'all') {
      reports = reports.filter(r => r.teamId === filters.teamId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.teamName.toLowerCase().includes(q) ||
        r.teamCode.toLowerCase().includes(q) ||
        (r.subname && r.subname.toLowerCase().includes(q)) ||
        (r.leader && r.leader.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sortBy === 'name_asc') {
      reports.sort((a, b) => a.teamName.localeCompare(b.teamName));
    } else if (filters.sortBy === 'awards_desc') {
      reports.sort((a, b) => b.totalAwards - a.totalAwards || (b.totalPoints - a.totalPoints));
    } else {
      // Default: Official Rank
      reports.sort((a, b) => (a.currentRank || 999) - (b.currentRank || 999));
    }

    return reports;
  }

  getStudentPerformanceReports(filters = {}) {
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');

    let reports = students.map(s => {
      // Competitions registered
      const regComps = [];
      competitions.forEach(c => {
        const isParticipant = (c.participants || []).some(
          p => p.studentId === s.id || p.chestNo === s.chestNo
        );
        if (isParticipant) {
          regComps.push({
            competitionId: c.competitionId || c.id,
            code: c.code || c.competitionCode,
            title: c.title || c.competitionTitle,
            category: c.category,
            venue: c.venue,
            date: c.date,
            time: c.time
          });
        }
      });

      // Awards won
      const awards = [];
      let earnedPoints = 0;

      posters.forEach(p => {
        if (p.firstPrize && (p.firstPrize.chestNo === s.chestNo || p.firstPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.firstPrize.points || 30;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '1st Prize (Gold)',
            rank: 1,
            score: p.firstPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
        if (p.secondPrize && (p.secondPrize.chestNo === s.chestNo || p.secondPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.secondPrize.points || 20;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '2nd Prize (Silver)',
            rank: 2,
            score: p.secondPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
        if (p.thirdPrize && (p.thirdPrize.chestNo === s.chestNo || p.thirdPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.thirdPrize.points || 10;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '3rd Prize (Bronze)',
            rank: 3,
            score: p.thirdPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
      });

      return {
        studentId: s.id,
        chestNo: s.chestNo,
        name: s.name,
        teamId: s.teamId,
        teamName: s.teamName,
        classCategory: s.classCategory || 'General',
        institution: s.institution,
        registeredCompetitions: regComps,
        registeredCount: regComps.length || s.registeredEventsCount || 0,
        results: awards,
        prizesCount: awards.length,
        totalPoints: earnedPoints || s.totalPoints || 0
      };
    });

    // Apply Filters
    if (filters.teamId && filters.teamId !== 'all') {
      reports = reports.filter(r => r.teamId === filters.teamId);
    }
    if (filters.classCategory && filters.classCategory !== 'all') {
      reports = reports.filter(r => r.classCategory === filters.classCategory);
    }
    if (filters.resultStatus === 'awarded') {
      reports = reports.filter(r => r.prizesCount > 0);
    } else if (filters.resultStatus === 'unawarded') {
      reports = reports.filter(r => r.prizesCount === 0);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.chestNo.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        (r.teamName && r.teamName.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sortBy === 'points_desc') {
      reports.sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'name_asc') {
      reports.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'chest_asc') {
      reports.sort((a, b) => a.chestNo.localeCompare(b.chestNo));
    } else {
      // Default: Prizes count desc, then registered desc
      reports.sort((a, b) => b.prizesCount - a.prizesCount || b.registeredCount - a.registeredCount);
    }

    return reports;
  }

  getCompetitionReports(filters = {}) {
    const competitions = this.getCompetitions();
    const posters = this.data.resultPosters || [];

    let reports = competitions.map(c => {
      const poster = posters.find(p => p.competitionId === (c.competitionId || c.id) || p.competitionCode === (c.code || c.competitionCode));
      const isPublished = !!(c.isPublished || (poster && poster.status === 'Published'));
      
      const winners = [];
      const sourcePoster = poster || c.resultPoster;
      if (sourcePoster) {
        if (sourcePoster.firstPrize) {
          winners.push({
            position: '1st Prize (Gold)',
            rank: 1,
            name: sourcePoster.firstPrize.name,
            chestNo: sourcePoster.firstPrize.chestNo,
            teamName: sourcePoster.firstPrize.teamName,
            teamId: sourcePoster.firstPrize.teamId,
            score: sourcePoster.firstPrize.score,
            points: sourcePoster.firstPrize.points || 30
          });
        }
        if (sourcePoster.secondPrize) {
          winners.push({
            position: '2nd Prize (Silver)',
            rank: 2,
            name: sourcePoster.secondPrize.name,
            chestNo: sourcePoster.secondPrize.chestNo,
            teamName: sourcePoster.secondPrize.teamName,
            teamId: sourcePoster.secondPrize.teamId,
            score: sourcePoster.secondPrize.score,
            points: sourcePoster.secondPrize.points || 20
          });
        }
        if (sourcePoster.thirdPrize) {
          winners.push({
            position: '3rd Prize (Bronze)',
            rank: 3,
            name: sourcePoster.thirdPrize.name,
            chestNo: sourcePoster.thirdPrize.chestNo,
            teamName: sourcePoster.thirdPrize.teamName,
            teamId: sourcePoster.thirdPrize.teamId,
            score: sourcePoster.thirdPrize.score,
            points: sourcePoster.thirdPrize.points || 10
          });
        }
      }

      // Evaluation progress
      let evalStatus = 'Pending';
      if (isPublished) {
        evalStatus = 'Published';
      } else if (c.status === 'Under Verification') {
        evalStatus = 'Under Verification';
      } else if (c.submittedEvaluationsCount > 0) {
        evalStatus = 'In Progress';
      }

      return {
        competitionId: c.competitionId || c.id,
        code: c.code || c.competitionCode,
        title: c.title || c.competitionTitle,
        category: c.category,
        type: c.type || 'Individual',
        venue: c.venue,
        date: c.date,
        time: c.time,
        registeredParticipantsCount: c.participants?.length || c.registeredCount || 0,
        participants: c.participants || [],
        assignedJudgesCount: c.assignedJudgeIds?.length || 0,
        assignedJudges: (c.assignedJudges || []).map(j => j.name),
        submittedEvaluationsCount: c.submittedEvaluationsCount || 0,
        evaluationStatus: evalStatus,
        isPublished,
        publishedAt: c.publishedAt || (poster ? poster.publishedAt : null),
        winners
      };
    });

    // Apply Filters
    if (filters.category && filters.category !== 'all') {
      reports = reports.filter(r => r.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.evaluationStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.date && filters.date !== 'all') {
      reports = reports.filter(r => r.date === filters.date);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.venue.toLowerCase().includes(q)
      );
    }

    return reports;
  }

  getJudgeActivityReports(filters = {}) {
    const judges = this.getJudges();
    const competitions = this.getCompetitions();

    let reports = judges.map(j => {
      const assignedIds = j.assignedCompIds || [];
      const submittedIds = j.submittedCompIds || [];
      const assignedCount = assignedIds.length;
      const submittedCount = submittedIds.length;
      const pendingCount = Math.max(0, assignedCount - submittedCount);
      const completionPct = assignedCount > 0 ? Math.round((submittedCount / assignedCount) * 100) : 100;

      let completionStatus = 'Pending';
      if (assignedCount > 0 && submittedCount >= assignedCount) {
        completionStatus = 'Completed';
      } else if (submittedCount > 0) {
        completionStatus = 'In Progress';
      }

      // Details of assigned competitions
      const assignedCompDetails = assignedIds.map(id => {
        const comp = competitions.find(c => (c.competitionId || c.id) === id);
        return {
          id,
          code: comp?.code || comp?.competitionCode || id,
          title: comp?.title || comp?.competitionTitle || 'Official Festival Event',
          category: comp?.category || 'General',
          submitted: submittedIds.includes(id)
        };
      });

      return {
        judgeId: j.id,
        name: j.name,
        designation: j.designation,
        institution: j.institution,
        phone: j.phone,
        email: j.email,
        status: j.status || 'Active',
        qualification: j.qualification,
        avatarColor: j.avatarColor || '#A91F35',
        assignedCount,
        submittedCount,
        pendingCount,
        completionPercentage: completionPct,
        completionStatus,
        assignedCompetitions: assignedCompDetails
      };
    });

    // Apply Filters
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.completionStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.institution && r.institution.toLowerCase().includes(q)) ||
        (r.designation && r.designation.toLowerCase().includes(q))
      );
    }

    return reports;
  }

  getProgrammeReports(filters = {}) {
    const programmes = this.getProgrammes();

    let reports = programmes.map(p => {
      return {
        programmeId: p.id,
        code: p.code,
        title: p.title,
        malayalamTitle: p.malayalamTitle,
        category: p.category,
        date: p.date,
        time: p.time,
        startTime: p.startTime,
        endTime: p.endTime,
        venue: p.venue,
        status: p.status || 'Scheduled',
        coordinatorName: p.coordinatorName,
        coordinatorPhone: p.coordinatorPhone,
        guestName: p.guestName || p.guest?.name || null,
        relatedCompetitionTitle: p.relatedComp || p.relatedCompetition?.title || null,
        isPublished: !!p.isPublished
      };
    });

    // Apply Filters
    if (filters.category && filters.category !== 'all') {
      reports = reports.filter(r => r.category === filters.category);
    }
    if (filters.date && filters.date !== 'all') {
      reports = reports.filter(r => r.date === filters.date);
    }
    if (filters.venue && filters.venue !== 'all') {
      reports = reports.filter(r => r.venue.toLowerCase().includes(filters.venue.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        (r.venue && r.venue.toLowerCase().includes(q)) ||
        (r.coordinatorName && r.coordinatorName.toLowerCase().includes(q))
      );
    }

    return reports;
  }

  getResultScoringReports(filters = {}) {
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');
    const competitions = this.getCompetitions();
    const teams = this.getTeams();

    const winnersList = [];
    posters.forEach(p => {
      if (p.firstPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '1st Prize (Gold)',
          rank: 1,
          name: p.firstPrize.name,
          chestNo: p.firstPrize.chestNo,
          teamId: p.firstPrize.teamId,
          teamName: p.firstPrize.teamName,
          score: p.firstPrize.score,
          points: p.firstPrize.points || 30,
          publishedAt: p.publishedAt
        });
      }
      if (p.secondPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '2nd Prize (Silver)',
          rank: 2,
          name: p.secondPrize.name,
          chestNo: p.secondPrize.chestNo,
          teamId: p.secondPrize.teamId,
          teamName: p.secondPrize.teamName,
          score: p.secondPrize.score,
          points: p.secondPrize.points || 20,
          publishedAt: p.publishedAt
        });
      }
      if (p.thirdPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '3rd Prize (Bronze)',
          rank: 3,
          name: p.thirdPrize.name,
          chestNo: p.thirdPrize.chestNo,
          teamId: p.thirdPrize.teamId,
          teamName: p.thirdPrize.teamName,
          score: p.thirdPrize.score,
          points: p.thirdPrize.points || 10,
          publishedAt: p.publishedAt
        });
      }
    });

    const pendingApprovals = competitions.filter(c => !c.isPublished && c.status === 'Under Verification');

    return {
      publishedResultsCount: posters.length,
      pendingApprovalsCount: pendingApprovals.length,
      publishedResults: posters,
      pendingCompetitions: pendingApprovals,
      winnersList,
      teamLeaderboard: [...teams].sort((a, b) => (b.points || 0) - (a.points || 0))
    };
  }

  getFestivalActivityReports(filters = {}) {
    const auditLogs = this.getAuditLogs();
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const programmes = this.getProgrammes();
    const gallery = this.data.galleryMedia || [];
    const announcements = this.data.announcements || [];
    const posters = this.data.posters || [];

    const stats = {
      totalStudentsEnrolled: students.length,
      totalCompetitionsConfigured: competitions.length,
      totalProgrammesScheduled: programmes.length,
      totalGalleryMediaUploaded: gallery.length,
      totalAnnouncementsBroadcast: announcements.length,
      totalPostersGenerated: posters.length,
      totalAuditLogsRecorded: auditLogs.length
    };

    return {
      stats,
      recentAuditTrail: auditLogs.slice(0, 50)
    };
  }
`;

// Insert before "export const festivalStore = new FestivalStore();"
const exportMarker = 'export const festivalStore = new FestivalStore();';
if (!code.includes(exportMarker)) {
  console.error('Cannot find exportMarker in festivalStore.js');
  process.exit(1);
}

const lastClosingBrace = code.lastIndexOf('}');
const beforeClassEnd = code.substring(0, lastClosingBrace);
const afterClassEnd = code.substring(lastClosingBrace);

const newCode = beforeClassEnd + '\n' + reportsMethods + '\n' + afterClassEnd;
fs.writeFileSync(storePath, newCode, 'utf8');
console.log('Successfully injected Step 12 Reports methods into festivalStore.js!');
