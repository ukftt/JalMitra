import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { getAllReports, createReport, upvoteReport } from '../api/reportsApi';
import { getStatusMeta, getIssueMeta, ISSUE_TYPES } from '../utils/severity';

delete L.Icon.Default.prototype._getIconUrl;

// Custom gauge-style marker built as a divIcon — a teardrop with a status-colored core
function buildIcon(status) {
  const meta = getStatusMeta(status);
  const html = `
    <div style="position:relative;width:30px;height:38px;">
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 23 15 23s15-13 15-23C30 6.7 23.3 0 15 0z"
              fill="${meta.color}" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="15" r="6" fill="white"/>
      </svg>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -36],
  });
}

function ClickCapture({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng) });
  return null;
}

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [pin, setPin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports()
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handlePick = useCallback((latlng) => {
    setPin(latlng);
    setDrawerOpen(true);
  }, []);

  const handleCreated = (newReport) => {
    setReports((prev) => [...prev, newReport]);
    setDrawerOpen(false);
    setPin(null);
  };

  const handleUpvote = async (id) => {
    await upvoteReport(id);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const counts = reports.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <ClickCapture onPick={handlePick} />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={buildIcon(report.status)}
          >
            <Popup>
              <ReportCard report={report} onUpvote={handleUpvote} />
            </Popup>
          </Marker>
        ))}

        {pin && <Marker position={pin} icon={buildIcon('PENDING')} />}
      </MapContainer>

      {/* Floating instruction pill */}
      {!drawerOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-5 left-1/2 -translate-x-1/2 z-[500] glass-panel rounded-full px-5 py-2.5 shadow-glass flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-signal-500 animate-pulse" />
          <span className="text-sm font-medium text-ink-900">
            Tap anywhere on the map to report a water issue
          </span>
        </motion.div>
      )}

      {/* Floating legend — the signature "gauge" element */}
      <div className="absolute bottom-6 left-6 z-[500] glass-panel rounded-2xl shadow-glass p-4 w-56">
        <p className="font-display font-bold text-xs tracking-wideish text-ink-700 uppercase mb-3">
          Report Gauge
        </p>
        <div className="space-y-2">
          {[
            { key: 'OPEN', count: counts.OPEN || 0 },
            { key: 'IN_PROGRESS', count: counts.IN_PROGRESS || 0 },
            { key: 'RESOLVED', count: counts.RESOLVED || 0 },
          ].map(({ key, count }) => {
            const meta = getStatusMeta(key);
            return (
              <div key={key} className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 rounded-full overflow-hidden bg-ink-900/10 relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-full"
                    style={{
                      height: `${Math.min(100, count * 12 + 20)}%`,
                      background: meta.color,
                    }}
                  />
                </div>
                <span className="text-xs text-ink-700 flex-1">{meta.label}</span>
                <span className="text-xs font-mono font-semibold text-ink-900">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[600] bg-surface-50/70 flex items-center justify-center">
          <div className="flex items-center gap-2 text-ink-700 font-medium text-sm">
            <span className="w-4 h-4 border-2 border-ink-700 border-t-transparent rounded-full animate-spin" />
            Loading reports…
          </div>
        </div>
      )}

      <AnimatePresence>
        {drawerOpen && pin && (
          <ReportDrawer
            lat={pin.lat}
            lng={pin.lng}
            onClose={() => {
              setDrawerOpen(false);
              setPin(null);
            }}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Popup card shown when an existing pin is clicked ──────────────────────
function ReportCard({ report, onUpvote }) {
  const status = getStatusMeta(report.status);
  const issue = getIssueMeta(report.issueType);
  return (
    <div className="w-full">
      {report.photoUrl && (
        <img
          src={`http://localhost:8080${report.photoUrl}`}
          alt="Reported issue"
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: status.bg, color: status.text }}
          >
            {status.label}
          </span>
          <span className="text-xs text-ink-600 font-mono">#{report.id}</span>
        </div>
        <p className="font-semibold text-sm text-ink-900 mb-1">
          {issue.icon} {issue.label}
        </p>
        {report.description && (
          <p className="text-xs text-ink-600 mb-3 leading-relaxed">
            {report.description}
          </p>
        )}
        <button
          onClick={() => onUpvote(report.id)}
          className="w-full flex items-center justify-center gap-1.5 bg-signal-100 text-signal-600 font-semibold text-xs rounded-lg py-2 hover:bg-signal-100/70 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l8 8h-5v8h-6v-8H4z" />
          </svg>
          Confirm issue — {report.upvotes}
        </button>
      </div>
    </div>
  );
}

// ── Slide-in drawer with the report submission form ────────────────────────
function ReportDrawer({ lat, lng, onClose, onCreated }) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createReport({ lat, lng, issueType, description, ward });
      onCreated(res.data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 h-full w-full sm:w-[380px] z-[700] bg-white shadow-glass overflow-y-auto scrollbar-thin"
    >
      <div className="sticky top-0 bg-white border-b border-ink-900/10 px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-ink-900 tracking-tightest">
            Report Water Issue
          </h2>
          <p className="text-xs text-ink-600 font-mono mt-0.5">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-900/5 text-ink-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-2">
            What's wrong with the water?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setIssueType(opt.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  issueType === opt.value
                    ? 'border-signal-500 bg-signal-100 text-signal-600'
                    : 'border-ink-900/10 text-ink-700 hover:border-ink-900/25'
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-2">
            Ward / Area name
          </label>
          <input
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="e.g. Ward 12, Sector 4"
            className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-2">
            Describe what you noticed
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="The water has a strong chlorine smell and looks slightly cloudy..."
            className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!issueType || submitting}
          className="w-full bg-ink-900 text-white font-semibold text-sm rounded-lg py-3 hover:bg-ink-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-gauge"
        >
          {submitting ? 'Submitting…' : 'Submit Report'}
        </button>
        <p className="text-xs text-ink-600/70 text-center -mt-2">
          Your report is public immediately and visible to municipal officials.
        </p>
      </form>
    </motion.div>
  );
}