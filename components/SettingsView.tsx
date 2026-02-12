
import React, { useState, useEffect } from 'react';
import { 
  Save, Shield, Server, Globe, Mail, CheckCircle2, 
  Copy, RefreshCw, Key, Lock, Activity, Cpu, Database, 
  Terminal, ExternalLink, ShieldCheck, Eye, EyeOff, Trash2,
  Settings, Network, X, Zap, ChevronRight, Globe2
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'smtp' | 'security' | 'vps' | 'api'>('smtp');
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [ipWhitelist, setIpWhitelist] = useState(['216.58.214.174', '192.168.1.1']);
  const [newIp, setNewIp] = useState('');

  const [cpu, setCpu] = useState(12.5);
  const [ram, setRam] = useState(1.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(prev => parseFloat((prev + (Math.random() * 2 - 1)).toFixed(1)));
      setRam(prev => parseFloat((prev + (Math.random() * 0.05 - 0.025)).toFixed(2)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); alert('Settings synced to VPS cluster.'); }, 1200);
  };

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIp && !ipWhitelist.includes(newIp)) {
      setIpWhitelist([...ipWhitelist, newIp]);
      setNewIp('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Infrastructure</h1>
          <p className="text-slate-500 text-sm">Zenith Engine Global Configuration</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
           <Zap className="w-3 h-3 fill-emerald-500" />
           Gateway: ACTIVE
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        {/* Navigation */}
        <div className="w-full lg:w-72 bg-slate-50/50 border-r border-slate-200 p-6 space-y-2">
          {[
            { id: 'smtp', label: 'Sending Engine', icon: Mail, desc: 'SMTP & SES Setup' },
            { id: 'security', label: 'Access Control', icon: Shield, desc: 'IP & MFA Policies' },
            { id: 'vps', label: 'Cluster Health', icon: Server, desc: 'Resource Telemetry' },
            { id: 'api', label: 'Developer API', icon: Terminal, desc: 'Keys & Webhooks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/5 border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-200/50 text-slate-400'}`}>
                <tab.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">{tab.label}</p>
                <p className="text-[10px] opacity-60 font-medium">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-8 lg:p-12 flex-1">
            {activeTab === 'smtp' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Delivery Gateway</h3>
                  <button 
                    onClick={() => { setTestStatus('testing'); setTimeout(() => setTestStatus('success'), 2000); }}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100"
                  >
                    {testStatus === 'testing' ? 'Testing...' : testStatus === 'success' ? 'Connection Verified' : 'Test SMTP Connection'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Provider</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10">
                       <option>Amazon SES (Cluster A)</option>
                       <option>Custom SMTP Relay</option>
                       <option>SendGrid API</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hourly Capacity</label>
                    <input type="number" defaultValue={25000} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
                  </div>
                </div>

                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[24px] flex gap-4">
                   <Globe2 className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                   <div>
                     <p className="text-sm font-bold text-indigo-900">Dynamic IP Warming</p>
                     <p className="text-xs text-indigo-800/70 mt-1 leading-relaxed">Zenith engine is currently in "Warming Mode". Hourly limits will increase by 5% every 24 hours of successful delivery.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900">Access & Hardening</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-200 group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Enforce Multi-Factor (MFA)</p>
                        <p className="text-xs text-slate-500">Require MFA for all administrative team accounts.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-indigo-500" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP Whitelist restriction</label>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {ipWhitelist.map(ip => (
                        <div key={ip} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 shadow-sm animate-in zoom-in-95">
                          {ip}
                          <button onClick={() => setIpWhitelist(ipWhitelist.filter(x => x !== ip))} className="text-slate-300 hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddIp} className="flex gap-2">
                      <input 
                        type="text" value={newIp} onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Add IP (e.g. 192.168.1.1)" 
                        className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                      />
                      <button type="submit" className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800">Add Entry</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vps' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                 <h3 className="text-xl font-bold text-slate-900">Cluster Telemetry</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm space-y-4 hover:border-indigo-200 transition-colors">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Cpu className="w-5 h-5 text-indigo-500" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CPU LOAD</span>
                          </div>
                          <span className="text-2xl font-mono font-bold text-slate-900">{cpu}%</span>
                       </div>
                       <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.4)]" style={{ width: `${cpu}%` }}></div>
                       </div>
                    </div>
                    <div className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm space-y-4 hover:border-emerald-200 transition-colors">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Activity className="w-5 h-5 text-emerald-500" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">RAM USAGE</span>
                          </div>
                          <span className="text-2xl font-mono font-bold text-slate-900">{ram}GB</span>
                       </div>
                       <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ width: `${(ram/4)*100}%` }}></div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                       <Terminal className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cluster Logs</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-400/80 space-y-2 h-40 overflow-y-auto leading-relaxed custom-scrollbar">
                       <p className="text-slate-500">[{new Date().toLocaleTimeString()}] INF Worker pool initialized: 50 threads active</p>
                       <p className="text-slate-500">[{new Date().toLocaleTimeString()}] DB  PostgreSQL health check: OK (2ms)</p>
                       <p className="animate-pulse">[{new Date().toLocaleTimeString()}] WRK Batch #92 dispatched via Amazon SES Gateway</p>
                       <p className="text-amber-400">[{new Date().toLocaleTimeString()}] WARN Rate limit detected for IP 192.168.x.x - Throttling enabled</p>
                       <p className="text-slate-500">[{new Date().toLocaleTimeString()}] INF SSL Certificate expires in 84 days. Auto-renew active.</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                 <h3 className="text-xl font-bold text-slate-900">Developer API</h3>
                 <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production Master Key</label>
                    <div className="relative group">
                       <input 
                         type={showApiKey ? "text" : "password"} 
                         readOnly 
                         value="zn_live_28394KSMZ029L91MXQ091" 
                         className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-mono focus:ring-4 focus:ring-indigo-500/10 outline-none pr-32 transition-all" 
                       />
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 hover:bg-white rounded-xl text-slate-400">{showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                          <button className="p-2 hover:bg-white rounded-xl text-slate-400"><Copy className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-slate-100 rounded-[32px] text-left hover:border-indigo-600 hover:bg-indigo-50/30 transition-all">
                       <RefreshCw className="w-6 h-6 text-indigo-600 mb-3" />
                       <p className="text-sm font-bold text-slate-900">Rotate Secret</p>
                       <p className="text-[10px] text-slate-500 mt-1">Regenerate all active API keys.</p>
                    </button>
                    <button className="p-6 border-2 border-slate-100 rounded-[32px] text-left hover:border-indigo-600 hover:bg-indigo-50/30 transition-all">
                       <ExternalLink className="w-6 h-6 text-indigo-600 mb-3" />
                       <p className="text-sm font-bold text-slate-900">API Docs</p>
                       <p className="text-[10px] text-slate-500 mt-1">View the REST endpoints.</p>
                    </button>
                 </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
             <button className="px-8 py-4 text-slate-500 font-bold hover:text-slate-900">Cancel</button>
             <button onClick={handleSave} className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all">
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Sync Cluster Settings
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
