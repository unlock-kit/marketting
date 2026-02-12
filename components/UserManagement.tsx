
import React, { useState } from 'react';
import { UserPlus, Search, Shield, MoreVertical, Mail, Clock, ShieldCheck, UserCheck, UserX, X, UserCog } from 'lucide-react';
import { User, UserRole } from '../types';

const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@zenithmail.io', firstName: 'Zenith', lastName: 'Owner', role: 'OWNER', status: 'ACTIVE', lastLogin: 'Just now' },
  { id: 'u2', email: 'sarah.m@company.com', firstName: 'Sarah', lastName: 'Miller', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2 hours ago' },
  { id: 'u3', email: 'marketing@company.com', firstName: 'Team', lastName: 'Marketing', role: 'MANAGER', status: 'PENDING', lastLogin: '-' },
  { id: 'u4', email: 'analyst@company.com', firstName: 'Data', lastName: 'Analyst', role: 'ANALYST', status: 'ACTIVE', lastLogin: '1 day ago' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      OWNER: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      ADMIN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      MANAGER: 'bg-blue-50 text-blue-700 border-blue-100',
      ANALYST: 'bg-slate-50 text-slate-700 border-slate-100',
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Teams</h1>
          <p className="text-slate-500 text-sm">Manage team access and assign granular role permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
        >
          <UserPlus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
           <Shield className="w-4 h-4 text-slate-400" />
           <select className="bg-transparent text-sm font-bold text-slate-600 outline-none">
              <option>All Roles</option>
              <option>Owner</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Analyst</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Member</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Role</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Login</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://picsum.photos/seed/${user.id}/40/40`} alt="Avatar" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {user.lastLogin}
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><UserCog className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><UserX className="w-4 h-4" /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                 <h2 className="text-xl font-bold text-slate-900">Invite Teammate</h2>
                 <p className="text-xs text-slate-500">Collaborate securely on ZenithMail engine.</p>
               </div>
               <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                 <X className="w-6 h-6 text-slate-400" />
               </button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="teammate@company.com" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Level</label>
                   <div className="grid grid-cols-2 gap-3">
                      {[
                        { r: 'ADMIN', d: 'Full control' },
                        { r: 'MANAGER', d: 'Ops & Content' },
                        { r: 'ANALYST', d: 'View data only' },
                        { r: 'GUEST', d: 'Custom access' }
                      ].map(role => (
                        <button key={role.r} className="p-4 border-2 border-slate-100 rounded-2xl text-left hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group">
                           <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">{role.r}</p>
                           <p className="text-[10px] text-slate-400 mt-1">{role.d}</p>
                        </button>
                      ))}
                   </div>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all mt-4">
                  Dispatch Invite
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
