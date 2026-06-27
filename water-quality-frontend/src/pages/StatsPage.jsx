import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import { useReports } from '../hooks/useReports';
import { getStatusMeta } from '../utils/severity';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
 
export default function StatsPage() {
  const { reports, loading } = useReports();
 
  const byWard = useMemo(() => {
    const map = {};
    reports.forEach((r) => {
      const ward = r.ward || 'Unspecified';
      map[ward] = (map[ward] || 0) + 1;
    });
    return Object.entries(map)
      .map(([ward, count]) => ({ ward, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [reports]);
 
  const byStatus = useMemo(() => {
    const map = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 };
    reports.forEach((r) => { map[r.status] = (map[r.status] || 0) + 1; });
    return Object.entries(map).map(([status, value]) => ({
      name: getStatusMeta(status).label,
      value,
      color: getStatusMeta(status).color,
    }));
  }, [reports]);
 
  const resolvedCount = byStatus.find((s) => s.name === 'Resolved')?.value || 0;
  const resolutionRate = reports.length
    ? Math.round((resolvedCount / reports.length) * 100)
    : 0;
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <p className="font-mono text-xs tracking-wideish text-signal-600 uppercase mb-1">
        Public Accountability
      </p>
      <h1 className="font-display font-bold text-3xl text-ink-900 tracking-tightest mb-8">
        Statistics
      </h1>
 
      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <p className="text-3xl font-bold text-ink-900 font-display tracking-tightest">
            {reports.length}
          </p>
          <p className="text-sm text-ink-600">Total reports filed</p>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-bold text-confirmed-600 font-display tracking-tightest">
            {resolutionRate}%
          </p>
          <p className="text-sm text-ink-600">Resolution rate</p>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-bold text-alert-600 font-display tracking-tightest">
            {byStatus.find((s) => s.name === 'Open')?.value || 0}
          </p>
          <p className="text-sm text-ink-600">Currently open</p>
        </Card>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most reported wards */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4">
            Most Reported Areas
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byWard} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0B254514" vertical={false} />
              <XAxis
                dataKey="ward"
                tick={{ fontSize: 11, fill: '#44525E' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: '#44525E' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #0B254514',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#0E7C7B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
 
        {/* Status breakdown */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4">
            Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {byStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: '#44525E' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}