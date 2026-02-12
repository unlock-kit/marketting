
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Upload, Search, UserPlus, Filter, Download, MoreVertical, 
  X, Edit2, Trash2, Check, Tag, ChevronDown, CheckSquare, Square,
  Users, UserCheck, UserX, AlertTriangle, FileSpreadsheet, ArrowRight,
  Info, RefreshCcw, CheckCircle2, Loader2, Database
} from 'lucide-react';
import { Subscriber } from '../types';

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: '1', email: 'john.doe@enterprise.com', firstName: 'John', lastName: 'Doe', tags: ['Enterprise', 'Q1-Lead'], status: 'ACTIVE', createdAt: '2024-01-12' },
  { id: '2', email: 'sarah.smith@startup.io', firstName: 'Sarah', lastName: 'Smith', tags: ['SaaS', 'Newsletter'], status: 'ACTIVE', createdAt: '2024-02-01' },
  { id: '3', email: 'mike.jones@gmail.com', firstName: 'Mike', lastName: 'Jones', tags: ['B2C'], status: 'UNSUBSCRIBED', createdAt: '2023-11-15' },
  { id: '4', email: 'bounced-user@oldmail.net', firstName: 'Old', lastName: 'User', tags: ['Legacy'], status: 'BOUNCED', createdAt: '2023-12-01' },
  { id: '5', email: 'emma.wilson@trend.co', firstName: 'Emma', lastName: 'Wilson', tags: ['Influencer'], status: 'ACTIVE', createdAt: '2024-03-05' },
];

const AVAILABLE_TAGS = ['Enterprise', 'Newsletter', 'SaaS', 'B2C', 'Influencer', 'Legacy'];

const Contacts: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED'>('ALL');
  const [tagFilter, setTagFilter] = useState<string>('ALL');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportWizardOpen, setIsImportWizardOpen] = useState(false);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Import Wizard State
  const [importStep, setImportStep] = useState(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);

  // Form State
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState({
    id: '', email: '', firstName: '', lastName: '', tags: [] as string[]
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // --- STATS COMPUTATION ---
  const stats = useMemo(() => ({
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'ACTIVE').length,
    unsub: subscribers.filter(s => s.status === 'UNSUBSCRIBED').length,
    bounced: subscribers.filter(s => s.status === 'BOUNCED').length,
  }), [subscribers]);

  // --- FILTERING LOGIC ---
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      const matchesSearch = 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesTag = tagFilter === 'ALL' || s.tags.includes(tagFilter);
      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [subscribers, searchTerm, statusFilter, tagFilter]);

  // --- SELECTION ---
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubscribers.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredSubscribers.map(s => s.id)));
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // --- ACTIONS ---
  const handleAddEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (modalMode === 'add') {
      const newSub: Subscriber = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSubscribers([newSub, ...subscribers]);
    } else {
      setSubscribers(subscribers.map(s => s.id === formData.id ? { ...s, ...formData } : s));
    }
    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this subscriber permanently?')) {
      setSubscribers(subscribers.filter(s => s.id !== id));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  // --- IMPORT WIZARD LOGIC ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const headers = text.split('\n')[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        setCsvHeaders(headers);
        
        // Auto-mapping guess
        const newMapping: Record<string, string> = {};
        headers.forEach(h => {
          const lower = h.toLowerCase();
          if (lower.includes('email')) newMapping['email'] = h;
          if (lower.includes('first')) newMapping['firstName'] = h;
          if (lower.includes('last')) newMapping['lastName'] = h;
        });
        setMapping(newMapping);
        setImportStep(2);
      };
      reader.readAsText(file);
    }
  };

  const processImport = () => {
    setIsImporting(true);
    // Simulate processing delay
    setTimeout(() => {
      const mockNewCount = 125; // Simulate finding 125 new rows
      alert(`Import complete! Successfully added ${mockNewCount} subscribers.`);
      setIsImporting(false);
      setIsImportWizardOpen(false);
      setImportStep(1);
      setImportFile(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* 1. Analytics Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Audience', value: stats.total, icon: Users, color: 'indigo' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'emerald' },
          { label: 'Unsubscribed', value: stats.unsub, icon: UserX, color: 'slate' },
          { label: 'Bounced', value: stats.bounced, icon: AlertTriangle, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Header & Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audience Management</h1>
          <p className="text-slate-500 text-sm mt-1">Full control over your subscriber database and segmentation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsImportWizardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import CSV
          </button>
          <button 
            onClick={() => {
              setModalMode('add');
              setFormData({ id: '', email: '', firstName: '', lastName: '', tags: [] });
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* 3. Filtering & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4">
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-sm font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
              <option value="BOUNCED">Bounced</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <Tag className="w-4 h-4 text-slate-400" />
            <select 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Tags</option>
              {AVAILABLE_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(statusFilter !== 'ALL' || tagFilter !== 'ALL' || searchTerm) && (
            <button 
              onClick={() => {setSearchTerm(''); setStatusFilter('ALL'); setTagFilter('ALL');}}
              className="text-xs font-bold text-indigo-600 hover:underline px-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <button onClick={toggleSelectAll} className="text-slate-300 hover:text-indigo-600">
                    {selectedIds.size === filteredSubscribers.length && filteredSubscribers.length > 0 ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Segments</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Joined</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(sub.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-6 py-5">
                    <button onClick={() => toggleSelectOne(sub.id)} className="text-slate-200 group-hover:text-slate-300 transition-colors">
                      {selectedIds.has(sub.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border-2 border-white shadow-sm">
                        {(sub.firstName?.[0] || sub.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">
                          {sub.firstName} {sub.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{sub.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      sub.status === 'BOUNCED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {sub.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-mono">{sub.createdAt}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setModalMode('edit');
                          setFormData({ ...sub });
                          setIsFormModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSubscribers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="font-bold text-slate-900">No subscribers found</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
            <Database className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold">{selectedIds.size} Selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold hover:text-indigo-400 transition-colors">
              <Tag className="w-4 h-4" />
              Tag Selection
            </button>
            <button className="flex items-center gap-2 text-sm font-bold hover:text-emerald-400 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => {
                if (confirm(`Delete ${selectedIds.size} subscribers?`)) {
                  setSubscribers(subscribers.filter(s => !selectedIds.has(s.id)));
                  setSelectedIds(new Set());
                }
              }}
              className="flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Batch Delete
            </button>
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="p-1 hover:bg-slate-800 rounded-lg ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* MODAL: ADD/EDIT FORM */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{modalMode === 'add' ? 'New Subscriber' : 'Update Profile'}</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddEditSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input 
                  required type="email" value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audience Tags</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map(tag => (
                    <button
                      key={tag} type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        tags: formData.tags.includes(tag) ? formData.tags.filter(t => t !== tag) : [...formData.tags, tag]
                      })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.tags.includes(tag) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                  {modalMode === 'add' ? 'Create Contact' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT WIZARD */}
      {isImportWizardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Import Wizard</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {importStep} of 3</p>
                </div>
              </div>
              <button onClick={() => setIsImportWizardOpen(false)} className="p-2 hover:bg-slate-200 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-10">
              {/* Step 1: Upload */}
              {importStep === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">Upload your CSV</h3>
                    <p className="text-slate-500 text-sm mt-2">Prepare your file with headers like Email, First Name, and Last Name.</p>
                  </div>
                  <label className="block p-12 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer text-center group">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="font-bold text-slate-900">Click to browse or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-1">Maximum file size: 50MB</p>
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  </label>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Make sure your CSV is UTF-8 encoded to prevent character corruption during the import process.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Mapping */}
              {importStep === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">Map your columns</h3>
                    <p className="text-slate-500 text-sm mt-2">Match your CSV headers to ZenithMail fields.</p>
                  </div>
                  <div className="space-y-4">
                    {['email', 'firstName', 'lastName'].map(field => (
                      <div key={field} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-sm font-bold text-slate-700 capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()} {field === 'email' && '*'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                        <select 
                          value={mapping[field] || ''}
                          onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none w-48"
                        >
                          <option value="">(Select Column)</option>
                          {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-6">
                    <button onClick={() => setImportStep(1)} className="font-bold text-slate-400 hover:text-slate-600">Back</button>
                    <button 
                      onClick={() => setImportStep(3)}
                      disabled={!mapping['email']}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                      Validate Data
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Batch Process */}
              {importStep === 3 && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">Final Verification</h3>
                    <p className="text-slate-500 text-sm mt-2">Ready to process {importFile?.name}.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                      <Database className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900">~1,240</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Rows</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                      <RefreshCcw className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900">Active</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Default Status</p>
                    </div>
                  </div>

                  {isImporting ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Batch Processing...</span>
                        <span>74%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full w-[74%] animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between pt-6">
                      <button onClick={() => setImportStep(2)} className="font-bold text-slate-400 hover:text-slate-600">Back</button>
                      <button 
                        onClick={processImport}
                        className="flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                      >
                        Launch Batch Import
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
