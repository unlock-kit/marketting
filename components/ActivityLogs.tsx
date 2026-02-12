
import React, { useState } from 'react';
import { History, Search, Filter, Download, ShieldCheck, Terminal, Globe, Calendar, User } from 'lucide-react';
import { ActivityLog } from '../types';

const MOCK_LOGS: ActivityLog[] = [
  { id: '1', userId: 'u1', userName: 'Zenith Admin', action: 'Modified Sending Gateway (SMTP)', category: 'SYSTEM', ipAddress: '192.168.1.45', timestamp: '2024-03-20 14:30:22' },
  { id: '2', userId: 'u2', userName: 'Sarah Miller', action: 'Launched Campaign: Q1 Newsletter', category: 'CAMPAIGN', ipAddress: '10.0.4.12', timestamp: '2024-03-20 12:15:05' },
  { id: '3', userId: 'u1', userName: 'Zenith Admin', action: 'MFA Authentication Successful', category: 'AUTH', ipAddress: '192.168.1.45', timestamp: '2024-03-20 10:02:11' },
  { id: '4', userId: 'u3', userName: 'Team Marketing', action: 'Exported Audience List (1,240 rows)', category: 'CONTACTS', ipAddress: '82.4.192.11', timestamp: '2024-03-19 16:45:59' },
  { id: '5', userId: 'u1', userName: 'Zenith Admin', action: 'Added IP Whitelist: 216.58.214.174', category: 'SYSTEM', ipAddress: '192.168.1.45', timestamp: '2024-03-19 09:12:33' },
];

const ActivityLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'AUTH': return 'text-emerald-500';
      case 'CAMPAIGN': return 'text-indigo-500';
      case 'CONTACTS': return 'text-amber-500';
      case 'SYSTEM': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-slate-500 text-sm">Full audit trail of all actions performed in this environment.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-4 h-4" />
          Export Audit Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
         <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by action, user or IP..." 
                 className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all"
               />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600">
               <Calendar className="w-4 h-4 text-slate-400" />
               Last 7 Days
            </div>
         </div>

         <div className="space-y-2">
            {MOCK_LOGS.map(log => (
               <div key={log.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 ${getCategoryColor(log.category)}`}>
                     <Terminal className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-slate-900">{log.action}</p>
                     <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <User className="w-3 h-3" /> {log.userName}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <Globe className="w-3 h-3" /> {log.ipAddress}
                        </span>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-mono text-slate-400">{log.timestamp}</p>
                     <p className={`text-[10px] font-bold uppercase mt-1 tracking-widest ${getCategoryColor(log.category)}`}>{log.category}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
               <ShieldCheck className="w-4 h-4" />
               Immutable Log Store Active
            </div>
         </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
