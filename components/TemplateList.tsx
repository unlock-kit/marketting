
import React, { useState } from 'react';
import { 
  FileCode, Search, MoreVertical, Plus, Edit2, Trash2, 
  Copy, Eye, Clock, LayoutGrid, List as ListIcon 
} from 'lucide-react';
import { EmailTemplate } from '../types';

interface TemplateListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: EmailTemplate) => void;
  onCreateNew: () => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onEdit, onDelete, onDuplicate, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
          <p className="text-slate-500 text-sm">Create and reuse high-converting designs for your campaigns.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Create New Template
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by name..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col"
            >
              <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(template)}
                      className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-3 bg-white text-slate-700 rounded-full hover:bg-slate-50 transition-colors shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{template.name}</h3>
                  <div className="relative group/menu">
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-10 hidden group-hover/menu:block py-1">
                      <button 
                        onClick={() => onDuplicate(template)}
                        className="w-full px-4 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>
                      <button 
                        onClick={() => onDelete(template.id)}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Modified: {template.lastModified}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Template Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Modified</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{template.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {template.lastModified}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onEdit(template)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDuplicate(template)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(template.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
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
      )}

      {filteredTemplates.length === 0 && (
        <div className="bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-slate-300">
            <FileCode className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No templates found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">We couldn't find any templates matching your search. Create your first one or refine your criteria.</p>
          <button 
            onClick={onCreateNew}
            className="mt-8 flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create First Template
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
