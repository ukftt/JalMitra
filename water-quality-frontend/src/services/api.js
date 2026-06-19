import axios from 'axios';

const BASE = 'http://localhost:8080/api';

// Helper: add JWT token to requests if logged in
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllReports = () =>
  axios.get(`${BASE}/reports`);

export const submitReport = (formData) =>
  axios.post(`${BASE}/reports`, formData);  // formData is a FormData object

export const upvoteReport = (id) =>
  axios.post(`${BASE}/reports/${id}/upvote`);

export const updateReportStatus = (id, status, note, officialId) =>
  axios.patch(`${BASE}/reports/${id}/status`,
    null, { ...authHeader(), params: { status, note, officialId } });

export const login = (email, password) =>
  axios.post(`${BASE}/auth/login`, { email, password });
