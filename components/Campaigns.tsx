
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Search, Filter, MoreHorizontal, Clock, CheckCircle2, 
  Play, Pause, Plus, Trash2, Edit2, ChevronRight, ChevronLeft, 
  Target, BarChart2, AlertCircle, X, Check, ArrowRight, ArrowLeft,
  Calendar, UserCheck, FileText, Send, Layout, Settings, Users
} from 'lucide-react';
import { Campaign, CampaignStatus, EmailTemplate } from '../types';

const INITIAL_CAMPAIGNS: Campaign[] = [
  { 
    id: '1', 
    name: 'Winter Product Launch', 
    subject: 'New Season, New Deals!', 
    status: CampaignStatus.COMPLETED, 
    sentCount: 24500, 
    failedCount: 120,
    openRate: 28.5, 
    clickRate: 4.2, 
    lastUpdated: '2 hours ago',
    audience: 'All Customers',
    sentDate: '2023-12-01'
  },
  { 
    id: '2', 
    name: 'Monthly Newsletter - Jan', 
    subject: 'Your January Update', 
    status: CampaignStatus.SENDING, 
    sentCount: 12400, 
    failedCount: 42,
    openRate: 18.2, 
    clickRate: 2.1, 
    lastUpdated: 'Just now',
    audience: 'Subscribers',
    sentDate: '2024-01-15'
  },
  { 
    id: '3', 
    name: 'Customer Reactivation', 
    subject: 'We miss you!', 
    status: CampaignStatus.DRAFT, 
    sentCount: 0, 
    failedCount: 0,
    openRate: 0, 
    clickRate: 0, 
    lastUpdated: '1 day ago',
    audience: 'Inactive Users',
    sentDate: '-'
  },
];

const MOCK_TEMPLATES: EmailTemplate[] = [
  { id: 't1', name: 'Minimalist Promo', thumbnail: 'https://picsum.photos/seed/promo1/300/400', lastModified: '', blocks: [] },
  { id: 't2', name: 'Modern Newsletter', thumbnail: 'https://picsum.photos/seed/news/300/400', lastModified: '', blocks: [] },
  { id: 't3', name: 'Event Invitation', thumbnail: 'https://picsum.photos/seed/event/300/400', lastModified: '', blocks: [] },
];

const StatusBadge = ({ status }: { status: CampaignStatus }) => {
  const styles = {
    [CampaignStatus.COMPLETED]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    [CampaignStatus.SENDING]: 'bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse',
    [CampaignStatus.DRAFT]: 'bg-slate-50 text-slate-700 border-slate-100',
    [CampaignStatus.SCHEDULED]: 'bg-amber-50 text-amber-700 border-amber-100',
    [CampaignStatus.PAUSED]: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

const Campaigns: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    fromName: 'Zenith Admin',
    fromEmail: 'admin@zenithmail.io',
    templateId: '',
    audience: 'All Subscribers',
    scheduleType: 'now',
    scheduleDate: '',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaigns(INITIAL_CAMPAIGNS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const handleLaunch = () => {
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: campaignData.name,
      subject: campaignData.subject,
      status: campaignData.scheduleType === 'now' ? CampaignStatus.SENDING : CampaignStatus.SCHEDULED,
      sentCount: 0,
      failedCount: 0,
      openRate: 0,
      clickRate: 0,
      lastUpdated: 'Just now',
      audience: campaignData.audience,
      sentDate: campaignData.scheduleType === 'now' ? new Date().toISOString().split('T')[0] : 'Scheduled'
    };
    setCampaigns([newCampaign, ...campaigns]);
    setIsWizardOpen(false);
    setWizardStep(1);
    setCampaignData({
      name: '',
      subject: '',
      fromName: 'Zenith Admin',
      fromEmail: 'admin@zenithmail.io',
      templateId: '',
      audience: 'All Subscribers',
      scheduleType: 'now',
      scheduleDate: '',
    });
  };

  const steps = [
    { id: 1, label: 'Setup', icon: Settings },
    { id: 2, label: 'Design', icon: Layout },
    { id: 3, label: 'Audience', icon: Users },
    { id: 4, label: 'Schedule', icon: Calendar },
    { id: 5, label: 'Review', icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-xl border border-slate-200"></div>
        <div className="h-96 bg-white rounded-xl border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500 text-sm">Create and track your high-performance email campaigns.</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Create New Campaign
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value={CampaignStatus.DRAFT}>Drafts</option>
          <option value={CampaignStatus.SENDING}>Sending</option>
          <option value={CampaignStatus.COMPLETED}>Completed</option>
          <option value={CampaignStatus.PAUSED}>Paused</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campaign Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Performance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{campaign.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{campaign.subject}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={campaign.status} /></td>
                <td className="px-6 py-4 text-right">
                  <p className="font-mono text-xs font-bold text-slate-900">{campaign.sentCount.toLocaleString()} Sent</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{campaign.openRate}% Open Rate</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button 
                      onClick={() => setDeleteConfirmId(campaign.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL CAMPAIGN WIZARD */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Wizard Header & Progress */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Campaign Wizard</h2>
                  <p className="text-xs text-slate-400 font-medium">Step {wizardStep} of {steps.length}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                {steps.map((step) => (
                  <React.Fragment key={step.id}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      wizardStep === step.id ? 'bg-indigo-600 text-white shadow-md' : 
                      wizardStep > step.id ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
                    }`}>
                      <step.icon className={`w-4 h-4 ${wizardStep >= step.id ? '' : 'opacity-40'}`} />
                      <span className="text-xs font-bold uppercase tracking-widest">{step.label}</span>
                    </div>
                    {step.id < steps.length && <ChevronRight className="w-4 h-4 text-slate-200" />}
                  </React.Fragment>
                ))}
              </div>

              <button onClick={() => setIsWizardOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Wizard Body */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12">
              <div className="max-w-2xl mx-auto">
                
                {/* Step 1: Basic Info */}
                {wizardStep === 1 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-900">Basic Setup</h3>
                      <p className="text-slate-500 mt-2">Let's start with the core details of your campaign.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internal Campaign Name</label>
                        <input 
                          value={campaignData.name}
                          onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                          placeholder="e.g. Q1 Product Update"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject Line</label>
                        <input 
                          value={campaignData.subject}
                          onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                          placeholder="What will users see in their inbox?"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">From Name</label>
                          <input 
                            value={campaignData.fromName}
                            onChange={(e) => setCampaignData({...campaignData, fromName: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">From Email</label>
                          <input 
                            value={campaignData.fromEmail}
                            onChange={(e) => setCampaignData({...campaignData, fromEmail: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Template Design */}
                {wizardStep === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-900">Select Design</h3>
                      <p className="text-slate-500 mt-2">Choose a pre-built template for this message.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MOCK_TEMPLATES.map((tpl) => (
                        <div 
                          key={tpl.id}
                          onClick={() => setCampaignData({...campaignData, templateId: tpl.id})}
                          className={`relative group cursor-pointer rounded-2xl border-2 transition-all overflow-hidden ${
                            campaignData.templateId === tpl.id ? 'border-indigo-600 shadow-xl scale-105' : 'border-slate-100 hover:border-indigo-200'
                          }`}
                        >
                          <img src={tpl.thumbnail} className="w-full aspect-[3/4] object-cover" />
                          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">{tpl.name}</span>
                            {campaignData.templateId === tpl.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Audience */}
                {wizardStep === 3 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-900">Choose Audience</h3>
                      <p className="text-slate-500 mt-2">Who should receive this campaign?</p>
                    </div>
                    <div className="space-y-4">
                      {['All Subscribers', 'VIP Members', 'Newsletter Only', 'Inactive 30 Days'].map(list => (
                        <button
                          key={list}
                          onClick={() => setCampaignData({...campaignData, audience: list})}
                          className={`w-full flex items-center justify-between p-6 border-2 rounded-2xl transition-all ${
                            campaignData.audience === list ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${campaignData.audience === list ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                              <Users className="w-5 h-5" />
                            </div>
                            <span className="font-bold">{list}</span>
                          </div>
                          {campaignData.audience === list && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Schedule */}
                {wizardStep === 4 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-900">Delivery Timing</h3>
                      <p className="text-slate-500 mt-2">Decide when your email hits the inbox.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setCampaignData({...campaignData, scheduleType: 'now'})}
                        className={`p-8 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${
                          campaignData.scheduleType === 'now' ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-100'
                        }`}
                      >
                        <Send className="w-10 h-10 text-indigo-600" />
                        <span className="font-bold text-slate-900">Send Now</span>
                      </button>
                      <button
                        onClick={() => setCampaignData({...campaignData, scheduleType: 'later'})}
                        className={`p-8 border-2 rounded-3xl flex flex-col items-center gap-4 transition-all ${
                          campaignData.scheduleType === 'later' ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-100'
                        }`}
                      >
                        <Calendar className="w-10 h-10 text-indigo-600" />
                        <span className="font-bold text-slate-900">Schedule Later</span>
                      </button>
                    </div>
                    {campaignData.scheduleType === 'later' && (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in duration-300">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Delivery Date & Time</label>
                        <input 
                          type="datetime-local" 
                          className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Final Review */}
                {wizardStep === 5 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-900">Final Checklist</h3>
                      <p className="text-slate-500 mt-2">One last look before we launch.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                      {[
                        { label: 'Campaign Name', value: campaignData.name, icon: FileText },
                        { label: 'Subject Line', value: campaignData.subject, icon: Mail },
                        { label: 'Target Audience', value: campaignData.audience, icon: Users },
                        { label: 'From Details', value: `${campaignData.fromName} <${campaignData.fromEmail}>`, icon: UserCheck },
                        { label: 'Template Selected', value: campaignData.templateId ? 'Yes' : 'No', icon: Layout },
                        { label: 'Delivery', value: campaignData.scheduleType === 'now' ? 'Immediate' : 'Scheduled', icon: Clock },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-900">{item.value || <span className="text-rose-500 italic">Not set</span>}</p>
                          </div>
                          {!item.value && <AlertCircle className="w-5 h-5 text-rose-500 ml-auto" />}
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                      <p className="text-sm text-emerald-800 font-medium">
                        Everything looks good! Your campaign will be processed by the high-volume worker queue immediately after launch.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Wizard Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
              <button 
                onClick={() => setWizardStep(s => s - 1)}
                disabled={wizardStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-800 disabled:opacity-0 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsWizardOpen(false)}
                  className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600"
                >
                  Save as Draft
                </button>
                {wizardStep < steps.length ? (
                  <button 
                    onClick={() => setWizardStep(s => s + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleLaunch}
                    className="flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all"
                  >
                    Launch Campaign
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Campaign?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                This action is irreversible. All tracking data will be lost.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setCampaigns(campaigns.filter(c => c.id !== deleteConfirmId));
                    setDeleteConfirmId(null);
                  }}
                  className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
