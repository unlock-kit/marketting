
import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, Image as ImageIcon, MousePointer2, Minus, Layout, 
  Monitor, Smartphone, Code, Eye, Save, Send, Trash2, 
  AlignLeft, AlignCenter, AlignRight, Variable, X, Plus, 
  ArrowLeft, Copy, ChevronUp, ChevronDown, Layers, 
  Maximize, MoreHorizontal, Share2, Youtube, GripVertical,
  Settings
} from 'lucide-react';
import { EmailTemplate } from '../types';

type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'social' | 'video';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  styles: {
    padding?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: string;
    width?: string;
    height?: string;
    borderTop?: string;
    fontWeight?: string;
    lineHeight?: string;
  };
  link?: string;
  socialLinks?: { platform: string, url: string }[];
}

interface EmailBuilderProps {
  initialTemplate?: EmailTemplate | null;
  onBack: () => void;
  onSave: (template: EmailTemplate) => void;
}

const EmailBuilder: React.FC<EmailBuilderProps> = ({ initialTemplate, onBack, onSave }) => {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || 'Untitled Template');
  const [blocks, setBlocks] = useState<Block[]>(initialTemplate?.blocks?.length ? initialTemplate.blocks : [
    { 
      id: 'header-1', 
      type: 'image', 
      content: 'https://picsum.photos/seed/logo/200/60',
      styles: { textAlign: 'center', padding: '30px 20px 10px 20px', width: '150px' }
    },
    { 
      id: 'text-1', 
      type: 'text', 
      content: '<h1 style="margin:0; font-size: 28px;">Hello {{firstName}}!</h1><p style="color: #64748b; line-height: 1.6;">Thank you for joining ZenithMail. We are excited to help you scale your email marketing efforts with high-performance infrastructure.</p>',
      styles: { textAlign: 'center', padding: '20px', fontSize: '16px', lineHeight: '1.6' }
    },
    {
        id: 'btn-1',
        type: 'button',
        content: 'Get Started Now',
        styles: { backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: '12px', padding: '14px 32px', textAlign: 'center', fontWeight: 'bold' },
        link: 'https://zenithmail.io/start'
    }
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Auto-save logic (Simulation)
  useEffect(() => {
    if (blocks.length > 0) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => setIsAutoSaving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [blocks, templateName]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? '<p>New text section</p>' : 
               type === 'button' ? 'Click Here' : 
               type === 'image' ? 'https://picsum.photos/seed/img/600/300' : 
               type === 'social' ? 'Follow Us' : '',
      styles: {
        padding: '20px',
        textAlign: 'center',
        ...(type === 'button' ? { backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: '8px', padding: '12px 24px', fontWeight: 'bold' } : {}),
        ...(type === 'spacer' ? { height: '40px' } : {}),
        ...(type === 'divider' ? { borderTop: '1px solid #e2e8f0', padding: '20px 0' } : {})
      }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const duplicateBlock = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    const original = blocks[index];
    const clone = { ...original, id: Math.random().toString(36).substr(2, 9) };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, clone);
    setBlocks(newBlocks);
    setSelectedBlockId(clone.id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updateStyles = (id: string, styles: Partial<Block['styles']>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, styles: { ...b.styles, ...styles } } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handlePublish = () => {
    const newTemplate: EmailTemplate = {
      id: initialTemplate?.id || Math.random().toString(36).substr(2, 9),
      name: templateName,
      thumbnail: `https://picsum.photos/seed/${templateName.replace(/\s+/g, '')}/400/500`,
      lastModified: new Date().toISOString().replace('T', ' ').substr(0, 16),
      blocks: [...blocks]
    };
    onSave(newTemplate);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${templateName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 40px 0; font-family: sans-serif; background-color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden;">
          ${blocks.map(b => `
            <tr>
              <td style="padding: ${b.styles.padding}; text-align: ${b.styles.textAlign}; font-size: ${b.styles.fontSize}; color: ${b.styles.color};">
                ${b.type === 'text' ? b.content : 
                  b.type === 'image' ? `<img src="${b.content}" width="${b.styles.width || '100%'}" style="display: block; max-width: 100%; height: auto; margin: 0 auto;" />` :
                  b.type === 'button' ? `<a href="${b.link || '#'}" style="background-color: ${b.styles.backgroundColor}; color: ${b.styles.color}; padding: ${b.styles.padding}; border-radius: ${b.styles.borderRadius}; text-decoration: none; display: inline-block; font-weight: bold;">${b.content}</a>` :
                  b.type === 'spacer' ? `<div style="height: ${b.styles.height};"></div>` :
                  b.type === 'social' ? `<div style="display: flex; justify-content: center; gap: 10px;">[Social]</div>` :
                  '<hr style="border:none; border-top: 1px solid #e2e8f0; margin: 0;" />'}
              </td>
            </tr>
          `).join('')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
      
      {/* Header Studio Toolbar */}
      <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <input 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 -ml-2 w-48 transition-all"
              placeholder="Template Name"
            />
            <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-0 mt-0.5 ${isAutoSaving ? 'text-indigo-500' : 'text-emerald-500'}`}>
                {isAutoSaving ? <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div> : <CheckCircle2 className="w-2.5 h-2.5" />}
                {isAutoSaving ? 'Syncing...' : 'Saved to cloud'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
                { id: 'desktop', icon: Monitor },
                { id: 'mobile', icon: Smartphone },
                { id: 'code', icon: Code }
            ].map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setViewMode(v.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === v.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <v.icon className="w-4 h-4" />
                  <span className="capitalize hidden md:inline">{v.id}</span>
                </button>
            ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isPreviewMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Design Mode' : 'Live Preview'}
          </button>
          <button 
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Publish Template
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        {!isPreviewMode && viewMode !== 'code' && (
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="flex border-b border-slate-200 p-2">
                <button 
                  onClick={() => setActiveTab('blocks')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'blocks' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                    <Layout className="w-4 h-4" /> Content
                </button>
                <button 
                  onClick={() => setActiveTab('layers')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'layers' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                    <Layers className="w-4 h-4" /> Layers
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'blocks' ? (
                  <div className="grid grid-cols-2 gap-3">
                      {[
                          { type: 'text', icon: Type, label: 'Text' },
                          { type: 'image', icon: ImageIcon, label: 'Image' },
                          { type: 'button', icon: MousePointer2, label: 'Button' },
                          { type: 'divider', icon: Minus, label: 'Divider' },
                          { type: 'spacer', icon: Maximize, label: 'Spacer' },
                          { type: 'social', icon: Share2, label: 'Social' },
                      ].map((item) => (
                          <button
                              key={item.type}
                              onClick={() => addBlock(item.type as BlockType)}
                              className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all gap-2 group shadow-sm hover:shadow-md"
                          >
                              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 uppercase">{item.label}</span>
                          </button>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map((b, idx) => (
                      <div 
                        key={b.id} 
                        onClick={() => setSelectedBlockId(b.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedBlockId === b.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">#{idx+1}</span>
                            <span className="text-xs font-bold text-slate-700 capitalize">{b.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Workspace */}
        <div className={`flex-1 overflow-y-auto p-12 flex justify-center bg-slate-100/50 relative ${viewMode === 'mobile' ? 'px-0' : ''}`}>
          {viewMode === 'code' ? (
            <div className="w-full max-w-5xl h-full bg-slate-900 rounded-3xl p-8 font-mono text-sm text-indigo-300 overflow-auto border border-slate-800 shadow-2xl">
              <pre className="whitespace-pre-wrap leading-relaxed">{generateHTML()}</pre>
            </div>
          ) : (
            <div 
              className={`bg-white shadow-2xl transition-all duration-500 relative ${
                viewMode === 'mobile' ? 'w-[375px] rounded-[50px] border-[14px] border-slate-900 min-h-[700px] my-4' : 'w-full max-w-[640px] min-h-full rounded-2xl'
              }`}
            >
              {blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => !isPreviewMode && setSelectedBlockId(block.id)}
                  className={`group relative transition-all border-y border-transparent ${
                    !isPreviewMode && selectedBlockId === block.id ? 'ring-2 ring-indigo-500 z-20 shadow-lg' : 'hover:border-indigo-200/50'
                  }`}
                  style={{ padding: block.styles.padding, textAlign: block.styles.textAlign }}
                >
                  {!isPreviewMode && selectedBlockId === block.id && (
                    <div className="absolute -left-12 top-0 flex flex-col gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xl animate-in fade-in slide-in-from-right-2 duration-200">
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><Copy className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div 
                      className="outline-none"
                      contentEditable={!isPreviewMode}
                      dangerouslySetInnerHTML={{ __html: block.content }}
                      onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerHTML })}
                      style={{ fontSize: block.styles.fontSize, color: block.styles.color }}
                    />
                  )}

                  {block.type === 'image' && (
                    <img src={block.content} className="h-auto rounded-lg mx-auto" style={{ width: block.styles.width || '100%' }} />
                  )}

                  {block.type === 'button' && (
                    <button 
                      style={{
                        backgroundColor: block.styles.backgroundColor,
                        color: block.styles.color,
                        padding: block.styles.padding,
                        borderRadius: block.styles.borderRadius,
                        fontWeight: 'bold',
                      }}
                    >
                      {block.content}
                    </button>
                  )}

                  {block.type === 'divider' && <div className="py-4"><div style={{ borderTop: block.styles.borderTop }}></div></div>}
                  {block.type === 'spacer' && <div style={{ height: block.styles.height }}></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inspector */}
        {!isPreviewMode && viewMode !== 'code' && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
            <div className="h-14 border-b border-slate-200 flex items-center px-6">
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">Block Styles</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                {selectedBlock ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Content</label>
                        <textarea 
                            value={selectedBlock.content}
                            onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono min-h-[100px] outline-none"
                        />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alignment</label>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => updateStyles(selectedBlock.id, { textAlign: align })}
                                        className={`p-1.5 rounded-lg transition-all ${
                                            selectedBlock.styles.textAlign === align ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'
                                        }`}
                                    >
                                        {align === 'left' ? <AlignLeft className="w-4 h-4" /> : 
                                        align === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Padding</label>
                            <input type="text" value={selectedBlock.styles.padding} onChange={(e) => updateStyles(selectedBlock.id, { padding: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
                        </div>
                        {selectedBlock.type === 'button' && (
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Background</label>
                              <input type="color" value={selectedBlock.styles.backgroundColor} onChange={(e) => updateStyles(selectedBlock.id, { backgroundColor: e.target.value })} className="w-full h-8 p-0 border-none rounded-lg cursor-pointer" />
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Settings className="w-8 h-8 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-900">No Block Selected</p>
                    <p className="text-xs text-slate-400 mt-2">Pick an element on the canvas to edit its properties.</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default EmailBuilder;
