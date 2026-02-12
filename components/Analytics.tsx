
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const deviceData = [
  { name: 'Mobile', value: 65, color: '#4f46e5' },
  { name: 'Desktop', value: 30, color: '#10b981' },
  { name: 'Tablet', value: 5, color: '#f59e0b' },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm">In-depth insights into your engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Device Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-6 sm:mb-8">Opens by Device</h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bounce Analysis */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-6 sm:mb-8">Bounce Rate</h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { date: 'Oct', hard: 120, soft: 450 },
                { date: 'Nov', hard: 90, soft: 320 },
                { date: 'Dec', hard: 140, soft: 510 },
              ]} margin={{ left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="hard" fill="#ef4444" name="Hard" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="soft" fill="#fbbf24" name="Soft" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Links Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200">
          <h3 className="font-bold text-base sm:text-lg text-slate-900">Top Performing Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] lg:min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">URL Target</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Unique Clicks</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { url: 'https://zenith.com/pricing', clicks: 12402, ctr: 12.4 },
                { url: 'https://zenith.com/docs', clicks: 8392, ctr: 8.2 },
                { url: 'https://zenith.com/vps-opt', clicks: 5211, ctr: 5.1 },
              ].map((link, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-indigo-600 underline truncate max-w-[200px] sm:max-w-md">{link.url}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                    {link.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="hidden sm:block w-24 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5" style={{ width: `${link.ctr * 5}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{link.ctr}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
