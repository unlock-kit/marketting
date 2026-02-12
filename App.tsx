
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  Settings, 
  BarChart3, 
  Mail, 
  Bell, 
  Search,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  FileCode,
  ChevronDown,
  ChevronRight,
  List,
  PlusCircle,
  Users2,
  History,
  Lock
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Contacts from './components/Contacts';
import SettingsView from './components/SettingsView';
import Analytics from './components/Analytics';
import EmailBuilder from './components/EmailBuilder';
import TemplateList from './components/TemplateList';
import AuthView from './components/AuthView';
import UserManagement from './components/UserManagement';
import ActivityLogs from './components/ActivityLogs';
import { EmailTemplate, User } from './types';

type View = 'dashboard' | 'campaigns' | 'contacts' | 'analytics' | 'settings' | 'templates_list' | 'templates_new' | 'users' | 'logs';

const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1',
    name: 'Summer Sale Newsletter',
    thumbnail: 'https://picsum.photos/seed/sale/400/500',
    lastModified: '2024-03-15 10:30',
    blocks: []
  },
  {
    id: 't2',
    name: 'Customer Welcome Sequence',
    thumbnail: 'https://picsum.photos/seed/welcome/400/500',
    lastModified: '2024-03-14 16:45',
    blocks: []
  }
];

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setActiveView('templates_new');
  };

  const handleCreateNewTemplate = () => {
    setEditingTemplate(null);
    setActiveView('templates_new');
  };

  const handleSaveTemplate = (template: EmailTemplate) => {
    setTemplates(prev => {
      const index = prev.findIndex(t => t.id === template.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = template;
        return updated;
      }
      return [template, ...prev];
    });
    setActiveView('templates_list');
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'campaigns': return <Campaigns />;
      case 'templates_list': return (
        <TemplateList 
          templates={templates} 
          onEdit={handleEditTemplate} 
          onCreateNew={handleCreateNewTemplate}
          onDelete={handleDeleteTemplate}
          onDuplicate={(t) => {
              const clone = { ...t, id: Math.random().toString(36).substr(2, 9), name: `${t.name} (Copy)` };
              handleSaveTemplate(clone);
          }}
        />
      );
      case 'templates_new': return (
        <EmailBuilder 
          initialTemplate={editingTemplate} 
          onBack={() => setActiveView('templates_list')} 
          onSave={handleSaveTemplate}
        />
      );
      case 'contacts': return <Contacts />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsView />;
      case 'users': return <UserManagement />;
      case 'logs': return <ActivityLogs />;
      default: return <Dashboard />;
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {!isDesktop && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 transform
          ${isDesktop ? 'translate-x-0 relative' : isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ZenithMail</span>
          </div>
          {!isDesktop && (
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('campaigns')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeView === 'campaigns' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Send className="w-5 h-5 shrink-0" />
            <span className="font-medium">Campaigns</span>
          </button>

          <div className="space-y-1">
            <button
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                activeView.startsWith('templates') 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 shrink-0" />
                <span className="font-medium">Email Builder</span>
              </div>
              {isTemplatesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {(isTemplatesOpen || activeView.startsWith('templates')) && (
              <div className="pl-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={handleCreateNewTemplate}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'templates_new' 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  New Template
                </button>
                <button
                  onClick={() => setActiveView('templates_list')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'templates_list' 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Template List
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveView('contacts')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeView === 'contacts' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="font-medium">Contacts</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeView === 'analytics' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="font-medium">Analytics</span>
          </button>

          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Administration</p>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                ['users', 'logs'].includes(activeView) 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 shrink-0" />
                <span className="font-medium">Security & IAM</span>
              </div>
              {isAdminOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {(isAdminOpen || ['users', 'logs'].includes(activeView)) && (
              <div className="pl-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActiveView('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'users' 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Users2 className="w-4 h-4" />
                  Users & Teams
                </button>
                <button
                  onClick={() => setActiveView('logs')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === 'logs' 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Activity Logs
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeView === 'settings' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-3 py-3 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            {!isDesktop && (
              <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-4 text-slate-400 focus-within:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none focus:ring-0 w-40 md:w-64 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              SESSION: AUDITED
            </div>
            <button className="relative text-slate-500 hover:text-slate-700 p-2 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold leading-none">{currentUser?.firstName} {currentUser?.lastName}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{currentUser?.role} Account</p>
              </div>
              <img 
                src={currentUser?.avatar || "https://picsum.photos/seed/admin/40/40"} 
                alt="Avatar" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-100 shadow-sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
