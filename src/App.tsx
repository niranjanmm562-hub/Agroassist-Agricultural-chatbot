import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { PythonCodeView } from './components/PythonCodeView';
import { VSCodeGuideView } from './components/VSCodeGuideView';
import { KnowledgeExplorerView } from './components/KnowledgeExplorerView';
import { RuleInspectorModal } from './components/RuleInspectorModal';
import { ActiveTab, ChatMessage } from './types';
import { Sprout, Code, Terminal, FileArchive } from 'lucide-react';
import { ZIP_FILE_NAME, ZIP_FILE_URL } from './downloadUtils';

export interface SessionQueryEntry {
  query: string;
  category: string;
  keywords: string[];
  timeMs: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [inspectingMessage, setInspectingMessage] = useState<ChatMessage | null>(null);
  const [pendingQuery, setPendingQuery] = useState<{ id: number; text: string } | null>(null);
  const [sessionQueries, setSessionQueries] = useState<SessionQueryEntry[]>([]);

  const handleRecordQuery = useCallback((entry: SessionQueryEntry) => {
    setSessionQueries((prev) => [entry, ...prev].slice(0, 50));
  }, []);

  // Allow clicking "Ask this in Chat" from Dashboard or Knowledge Explorer
  const handleAskInChat = useCallback((query: string) => {
    setPendingQuery({ id: Date.now(), text: query });
    setActiveTab('chat');
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onAskInChat={handleAskInChat}
            sessionQueries={sessionQueries}
            onRecordQuery={handleRecordQuery}
          />
        )}

        {activeTab === 'chat' && (
          <div className="p-2 sm:p-4">
            <ChatView
              soundEnabled={soundEnabled}
              onInspectRule={(msg) => setInspectingMessage(msg)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              pendingQuery={pendingQuery}
              onRecordQuery={handleRecordQuery}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <PythonCodeView />
        )}

        {activeTab === 'vscode' && (
          <VSCodeGuideView />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeExplorerView onAskQuestion={handleAskInChat} />
        )}
      </main>

      {/* Rule Inspector Modal */}
      <RuleInspectorModal
        message={inspectingMessage}
        onClose={() => setInspectingMessage(null)}
      />

      {/* Minimal Bottom Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-700">AgroAssist</span>
            <span>• Rule-Based Agricultural Support Chatbot</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Designed & Developed by <strong className="text-emerald-800">Niranjan</strong></span>
            <span>•</span>
            <a
              href={ZIP_FILE_URL}
              download={ZIP_FILE_NAME}
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <FileArchive className="w-3 h-3" /> Download ZIP
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveTab('code')}
              className="text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Code className="w-3 h-3" /> Python Source
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('vscode')}
              className="text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" /> VS Code Setup
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
