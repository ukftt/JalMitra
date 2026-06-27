import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReports } from '../hooks/useReports';
import { useAuth } from '../context/AuthContext';
import { updateReportStatus } from '../api/reportsApi';
import { getStatusMeta, getIssueMeta } from '../utils/severity';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
 
const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];
 
export default function DashboardPage() {
  const { official } = useAuth();
  const { reports, loading, setReports } = useReports();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeReport, setActiveReport] = useState(null);
 
  // Officials only see reports from their own ward
  const wardReports = useMemo(
    () => reports.filter((r) => !official?.ward || r.ward === official.ward),
    [reports, official]
  );
 
  const filtered = useMemo(() => {
    return wardReports.filter((r) => {
      const matchesFilter = filter === 'ALL' || r.status === filter;
      const matchesSearch =
        !search ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        String(r.id).includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [wardReports, filter, search]);
 
  const counts = useMemo(() => {
    const c = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 };
    wardReports.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [wardReports]);
 
  const handleStatusChange = async (id, newStatus, note) => {
    // Optimistic update -- UI reflects the change immediately,
    // before the server confirms it.
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActiveReport(null);
    try {
      await updateReportStatus(id, newStatus, note, official.id);
    } catch {
      // Roll back on failure
      setReports((prev) => prev);
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-wideish text-signal-600 uppercase mb-1">
            {official?.ward || 'All Wards'}
          </p>
          <h1 className="font-display font-bold text-3xl text-ink-900 tracking-tightest">
            Report Dashboard
          </h1>
        </div>
      </div>
 
      {/* Gauge stat cards -- the signature element, reused here */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((key) => {
          const meta = getStatusMeta(key);
          const count = counts[key] || 0;
          return (
            <Card key={key} className="p-5 flex items-center gap-4">
              <div className="h-14 w-2.5 rounded-full overflow-hidden bg-ink-900/8 relative flex-shrink-0">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
                  style={{
                    height: `${Math.min(100, count * 10 + 15)}%`,
                    background: meta.color,
                  }}
                />
              </div>
              <div>
                <p className="text-3xl font-bold text-ink-900 font-display tracking-tightest">
                  {count}
                </p>
                <p className="text-sm text-ink-600">{meta.label}</p>
              </div>
            </Card>
          );
        })}
      </div>
 
      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-ink-900/5 rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                filter === f
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or description..."
          className="flex-1 min-w-[200px] rounded-lg border border-ink-900/15 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-signal-500"
        />
      </div>
 
      {/* Reports table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-900/[0.03] text-left">
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">ID</th>
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">Issue</th>
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">Description</th>
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">Upvotes</th>
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">Status</th>
              <th className="px-5 py-3 font-semibold text-xs text-ink-600 uppercase tracking-wideish">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const issue = getIssueMeta(r.issueType);
              return (
                <tr key={r.id} className="border-t border-ink-900/8 hover:bg-ink-900/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-ink-600">#{r.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-ink-900">
                      {issue.icon} {issue.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink-600 max-w-xs truncate">
                    {r.description || '\u2014'}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-ink-900">{r.upvotes}</td>
                  <td className="px-5 py-3.5"><Badge status={r.status} /></td>
                  <td className="px-5 py-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveReport(r)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-ink-600">
                  No reports match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
 
      {activeReport && (
        <StatusUpdateModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onSave={handleStatusChange}
        />
      )}
    </div>
  );
}
 
// ── Inline modal for changing a report's status ─────────────────────────
function StatusUpdateModal({ report, onClose, onSave }) {
  const [status, setStatus] = useState(report.status);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
 
  const handleSave = async () => {
    setSaving(true);
    await onSave(report.id, status, note);
    setSaving(false);
  };
 
  return (
    <div className="fixed inset-0 z-[1000] bg-ink-900/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-glass w-full max-w-sm p-6"
      >
        <h3 className="font-display font-bold text-lg text-ink-900 mb-1">
          Update Report #{report.id}
        </h3>
        <p className="text-xs text-ink-600 mb-5">
          {report.description || 'No description provided'}
        </p>
 
        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-2">
          New status
        </label>
        <div className="flex gap-2 mb-4">
          {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${
                status === s
                  ? 'border-signal-500 bg-signal-100 text-signal-600'
                  : 'border-ink-900/10 text-ink-600'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
 
        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-2">
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. Tanker dispatched, repair scheduled for Friday"
          className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm mb-5 resize-none focus:outline-none focus:ring-2 focus:ring-signal-500"
        />
 
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-semibold text-ink-700 border border-ink-900/15 rounded-lg py-2.5 hover:bg-ink-900/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 text-sm font-semibold text-white bg-ink-900 rounded-lg py-2.5 hover:bg-ink-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}