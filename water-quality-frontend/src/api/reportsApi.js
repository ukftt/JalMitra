import client from './client';

export const getAllReports = () => client.get('/reports');

export const getReportById = (id) => client.get(`/reports/${id}`);

export const createReport = (payload) => client.post('/reports', payload);

export const upvoteReport = (id) => client.post(`/reports/${id}/upvote`);

export const updateReportStatus = (id, status, note, officialId) =>
  client.patch(`/reports/${id}/status`, null, {
    params: { status, note, officialId },
  });