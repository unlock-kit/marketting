
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, User, Key, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthViewProps {
  onLogin: (user: UserType) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'mfa'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Authentication & 2FA Dispatch
    setTimeout(() => {
      setLoading(false);
      if (mode !== 'mfa') {
        setMode('mfa');
      } else {
        onLogin({
          id: 'u-root',
          email: email || 'admin@zenithmail.io',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'OWNER',
          status: 'ACTIVE',
          lastLogin: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff`
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/40">
            <Mail className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ZenithMail</h1>
          <p className="text-slate-400 mt-2">Enterprise Sending Engine v1.0</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden p-8 md:p-10 border border-white/10">
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {mode === 'mfa' ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Key className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Security Check</h2>
                  <p className="text-sm text-slate-500 mt-1">Check your authenticator app for the code.</p>
                </div>
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      required
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                  ))}
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Verify & Enter
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
                <h2 className="text-xl font-bold text-slate-900">
                  {mode === 'login' ? 'Administrator Login' : 'Register Root Node'}
                </h2>

                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Organization Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="Zenith Enterprise" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@zenithmail.io" 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {mode === 'login' ? 'Sign In' : 'Setup Engine'}
                </button>

                <div className="pt-4 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {mode === 'login' ? "Need to setup a new engine?" : "Already have an engine? Login"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">SSL Enabled</span>
           </div>
           <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">AES-256</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
