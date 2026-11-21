import { festivalStore } from '../src/admin/data/festivalStore.js';

console.log('--- FESTIVAL STORE CLEAN STATE CHECK ---');
const data = festivalStore.loadData();
console.log('Teams:', data.teams.length);
console.log('Registered Students:', data.registeredStudents.length);
console.log('Programmes:', data.programmes.length);
console.log('Programme Schedules:', data.programmeSchedules.length);
console.log('Programme Guests:', data.programmeGuests.length);
console.log('Judges:', data.judges.length, data.judges[0]?.name);
console.log('Programme Assignments:', data.programmeAssignments.length);
console.log('Submitted Evaluations:', data.submittedEvaluations.length);
console.log('Result Posters:', data.resultPosters.length);
console.log('Audit Logs:', data.auditLogs.length);
console.log('Gallery Media:', data.galleryMedia.length);
console.log('Posters:', data.posters.length);
console.log('Announcements:', data.announcements.length);
console.log('Stages:', data.programmeStages.length);
console.log('Stage Controllers:', data.stageControllers.length);
console.log('Convener User:', data.convenerUser?.email);

const stats = festivalStore.getDashboardStats();
console.log('Dashboard Stats:');
console.log('  Total Students:', stats.totalStudents);
console.log('  Total Teams:', stats.totalTeams);
console.log('  Total Competitions:', stats.totalCompetitions);
console.log('  Total Judges:', stats.totalJudges);
console.log('  Total Programmes:', stats.totalProgrammes);
console.log('  Pending Evaluations:', stats.pendingEvaluations);
console.log('  Submitted Results:', stats.submittedResults);
console.log('  Published Results:', stats.publishedResults);
console.log('  Overall Points:', stats.overallTeamPoints);

console.log('Available Store Methods:');
const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(festivalStore));
console.log('Public methods:', proto.filter(p => p.toLowerCase().includes('guest') || p.toLowerCase().includes('comp') || p.toLowerCase().includes('result') || p.toLowerCase().includes('leaderboard') || p.toLowerCase().includes('public')));

console.log('Convener Dashboard Stats:');
console.log(festivalStore.getConvenerDashboardStats());
