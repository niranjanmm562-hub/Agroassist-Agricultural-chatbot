import React, { useState, useRef, useEffect } from 'react';
import { Sprout, LayoutDashboard, MessageSquare, Code, Terminal, BookOpen, Volume2, VolumeX, Download, FileArchive, FileCode, Check, ChevronDown } from 'lucide-react';
import { ActiveTab } from '../types';
import { PROJECT_FILES, ZIP_FILE_NAME, ZIP_FILE_URL, downloadProjectFile } from '../downloadUtils';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markDownloaded = (name: string) => {
    setDownloadedItem(name);
    setTimeout(() => setDownloadedItem(null), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-inner border border-emerald-300/30">
              <Sprout className="w-6 h-6 text-emerald-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">AgroAssist</span>
                <span className="hidden sm:inline text-xs bg-emerald-700/80 text-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-600/50">
                  Python Rule-Based
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Agricultural Chatbot <span className="text-emerald-400 font-medium">| Dev: Niranjan</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Python Source Code</span>
            </button>

            <button
              onClick={() => setActiveTab('vscode')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'vscode'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>VS Code Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base</span>
            </button>
          </nav>

          {/* Actions & Download Menu */}
          <div className="flex items-center space-x-2">
            {/* Download Files Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {downloadMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                  <div className="px-3.5 py-1.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-800">Download Python Project</p>
                    <p className="text-[11px] text-stone-500">Ready to run in VS Code</p>
                  </div>

                  {/* Full ZIP Option */}
                  <div className="p-2 border-b border-stone-100">
                    <a
                      href={ZIP_FILE_URL}
                      download={ZIP_FILE_NAME}
                      onClick={() => markDownloaded('zip')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <span className="flex items-center gap-2">
                        <FileArchive className="w-4 h-4 text-emerald-200" />
                        <span>All Project Files (.zip)</span>
                      </span>
                      {downloadedItem === 'zip' ? (
                        <Check className="w-4 h-4 text-emerald-200" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-emerald-100" />
                      )}
                    </a>
                  </div>

                  {/* Individual Files */}
                  <div className="px-2 pt-1.5 space-y-0.5">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Individual Files
                    </p>
                    {PROJECT_FILES.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => {
                          downloadProjectFile(file);
                          markDownloaded(file.name);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-emerald-50 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-mono font-semibold text-stone-800 group-hover:text-emerald-900">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-stone-500 truncate">
                              {file.description}
                            </div>
                          </div>
                        </div>
                        {downloadedItem === file.name ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Audio Read-Aloud Enabled" : "Audio Read-Aloud Muted"}
              className={`p-2 rounded-lg transition-colors flex items-center space-x-1.5 text-xs font-medium border ${
                soundEnabled
                  ? 'bg-emerald-800 border-emerald-600 text-emerald-200 hover:bg-emerald-700'
                  : 'bg-emerald-950/80 border-emerald-900 text-emerald-400 hover:bg-emerald-800'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
              <span className="hidden lg:inline">{soundEnabled ? "Voice ON" : "Voice OFF"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-emerald-800/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'chat' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'code' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Python Code</span>
          </button>
          <button
            onClick={() => setActiveTab('vscode')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'vscode' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>VS Code</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium ${
              activeTab === 'knowledge' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
