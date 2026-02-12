
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Plus,
  Zap,
  Activity,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: '00:00', sent: 4000, opens: 2400 },
  { name: '04:00', sent: 3000, opens: 1398 },
  { name: '08:00', sent: 8500, opens: 6800 },
  { name: '12:00', sent: 12000, opens: 9808 },
  { name: '16:00', sent: 18000, opens: 14800 },
  { name: '20:00', sent: 15000, opens: 11000 },
  { name: '23:59', sent: 16500, opens: 12300 },
];

const MINI_CHART_DATA = [
  { v: 10 }, { v: 15 }, { v: 8 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }
];

const Dashboard: React.FC = () => {
  const [liveThroughput, setLiveThroughput] = useState(4205);
  const [cpuLoad, setCpuLoad] = useState(18);
  const [events, setEvents] = useState<{id: number, text: string, time: string, type: 'sent' | 'click' | 'open'}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveThroughput(prev => prev + Math.floor(Math.random() * 20) - 10);
      setCpuLoad(prev => {
        const next = prev + (Math.random() * 4 - 2);
        return Math.max(5, Math.min(95, parseFloat(next.toFixed(1))));
      });
      
      const types: ('sent' | 'click' | 'open')[] = ['sent', 'click', 'open'];
      const type = types[Math.floor(Math.random() * types.length)];
      const emails = ['alex@dev.io', 'sarah.j@enterprise.com', 'm.smith@startup.net', 'support@zenith.co'];
      const newEvent = {
        id: Date.now(),
        type,
        text: type === 'sent' ? `Email dispatched to ${emails[Math.floor(Math.random() * emails.length)]}` :
              type === 'open' ? `Campaign open detected from London, UK` :
              `Link click registered: /pricing-tier-enterprise`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Mission Control</h1>
          <p className="text-slate-500 text-sm">Real-time status of the ZenithMail high-volume engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-white border border-slate-200 rounded-xl">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worker Throughput</span>
                <span className="text-sm font-mono font-bold text-indigo-600">{liveThroughput.toLocaleString()} req/m</span>
             </div>
             <div className="w-px h-8 bg-slate-100"></div>
             <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Deployment Readiness Checklist */}
      <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Server className="w-48 h-48" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">VPS Deployment Checklist</h2>
            <p className="text-indigo-200 text-sm mt-2">Ensure your Ubuntu 4GB node is configured for production.</p>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Swap File (4GB Active)', status: true },
                { label: 'Docker Resource Limits (App=1G)', status: true },
                { label: 'UFW Firewall (80, 443, 22)', status: true },
                { label: 'SSL Auto-Renew (Certbot)', status: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-5 h-5 bg-indigo-500/50 rounded-full flex items-center justify-center border border-indigo-400/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
             <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-indigo-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Hot Deploy Command</span>
             </div>
             <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-indigo-200 break-all">
                chmod +x deploy.sh && ./deploy.sh
             </div>
             <button className="w-full mt-4 py-3 bg-white text-indigo-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                View Server Docs <ExternalLink className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Dispatched', value: '1.4M', icon: Zap, color: 'indigo', trend: '+14%', up: true },
          { label: 'Audience Size', value: '52,891', icon: Users, color: 'blue', trend: '+3.1%', up: true },
          { label: 'Avg Open Rate', value: '26.4%', icon: Eye, color: 'emerald', trend: '+0.8%', up: true },
          { label: 'Click-Through', value: '4.9%', icon: MousePointer2, color: 'orange', trend: '-0.2%', up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.trend}
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              <div className="h-8 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MINI_CHART_DATA}>
                    <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sending Performance</h3>
                <p className="text-slate-500 text-xs">Aggregated hourly data across all active campaigns.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white text-indigo-600 rounded-lg shadow-sm">Daily</button>
                <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly</button>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
                  />
                  <Area type="monotone" dataKey="sent" name="Dispatched" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CPU LOAD</p>
                  <p className="text-xl font-mono font-bold text-slate-900">{cpuLoad}%</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LATENCY</p>
                  <p className="text-xl font-mono font-bold text-slate-900">12ms</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SSL STATUS</p>
                  <p className="text-xl font-mono font-bold text-slate-900">ACTIVE</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Live Engine Stream</h3>
              <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            </div>
            
            <div className="space-y-4 flex-1">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 animate-in slide-in-from-right-4 duration-500">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    event.type === 'sent' ? 'bg-indigo-500' : 
                    event.type === 'open' ? 'bg-emerald-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 leading-snug line-clamp-2">{event.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <span>Queue Distribution</span>
                  <span className="text-indigo-600">82% Capacity</span>
               </div>
               <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                  <div className="bg-indigo-600 w-[60%] shadow-lg shadow-indigo-200"></div>
                  <div className="bg-emerald-500 w-[15%]"></div>
                  <div className="bg-amber-400 w-[7%]"></div>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Pending</p>
                     <p className="text-lg font-bold text-slate-900">14,302</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Retry</p>
                     <p className="text-lg font-bold text-rose-500">24</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
