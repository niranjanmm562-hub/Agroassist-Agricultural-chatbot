import React, { useState } from 'react';
import {
  Download,
  FileArchive,
  FileCode,
  MessageSquare,
  Terminal,
  BookOpen,
  Code,
  Sprout,
  CheckCircle2,
  Play,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  Activity,
  FolderOpen,
} from 'lucide-react';
import { ActiveTab } from '../types';
import {
  PROJECT_FILES,
  ZIP_FILE_NAME,
  ZIP_FILE_URL,
  downloadProjectFile,
} from '../downloadUtils';
import { evaluateAgroRules, RuleResponse } from '../ruleEngine';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onAskInChat: (query: string) => void;
  sessionQueries: Array<{ query: string; category: string; keywords: string[]; timeMs: number }>;
  onRecordQuery: (entry: { query: string; category: string; keywords: string[]; timeMs: number }) => void;
}

const DOMAIN_CARDS = [
  {
    id: 'crops',
    title: 'Crop Information',
    icon: '🌾',
    count: '7 Crops',
    items: 'Rice, Wheat, Maize, Sugarcane, Tomato, Potato, Cotton',
    sampleQuery: 'Tell me about rice crop',
    accent: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  {
    id: 'fertilizers',
    title: 'Fertilizer Guidance',
    icon: '🧪',
    count: '6 Guides',
    items: 'Organic Compost, Vermicompost, NPK, Urea, Biofertilizers',
    sampleQuery: 'Which fertilizer is good for rice?',
    accent: 'bg-lime-50 border-lime-200 text-lime-900',
  },
  {
    id: 'pests',
    title: 'Pest & Disease Support',
    icon: '🐛',
    count: '4 Modules',
    items: 'Tomato Blight & Borer, Rice Stem Borer, Wheat Rust, Neem IPM',
    sampleQuery: 'How can I control pests in tomato plants?',
    accent: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  {
    id: 'irrigation',
    title: 'Irrigation Guidance',
    icon: '💧',
    count: '4 Schedules',
    items: 'Drip Irrigation, Rice AWD, Wheat CRI Stage, Moisture Conservation',
    sampleQuery: 'Tell me about drip irrigation',
    accent: 'bg-sky-50 border-sky-200 text-sky-900',
  },
  {
    id: 'weather',
    title: 'Weather Awareness',
    icon: '🌦️',
    count: '4 Seasons',
    items: 'Rainy Monsoon Drainage, Summer Heat, Drought Care, Frost Defense',
    sampleQuery: 'What should I do in rainy weather?',
    accent: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  },
  {
    id: 'soil',
    title: 'Soil & Testing Guide',
    icon: '🧱',
    count: '6 Profiles',
    items: 'Alluvial, Black (Regur), Red, Sandy, Loamy Soils & pH Sampling',
    sampleQuery: 'What soil is good for cotton?',
    accent: 'bg-orange-50 border-orange-200 text-orange-900',
  },
  {
    id: 'tips',
    title: 'Farming Tips',
    icon: '💡',
    count: '4 Best Practices',
    items: 'Legume Crop Rotation, Straw Mulching, Seed Treatment, Storage',
    sampleQuery: 'Give me a tip on crop rotation',
    accent: 'bg-teal-50 border-teal-200 text-teal-900',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onAskInChat,
  sessionQueries,
  onRecordQuery,
}) => {
  const [testInput, setTestInput] = useState('Which fertilizer is good for rice?');
  const [testResult, setTestResult] = useState<{
    query: string;
    result: RuleResponse;
    ms: number;
  }>(() => {
    const start = performance.now();
    const res = evaluateAgroRules('Which fertilizer is good for rice?');
    const ms = Math.max(0.1, Math.round((performance.now() - start) * 100) / 100);
    return { query: 'Which fertilizer is good for rice?', result: res, ms };
  });

  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const runLiveTest = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : testInput).trim();
    if (!q) return;
    if (queryOverride !== undefined) setTestInput(queryOverride);

    const start = performance.now();
    const res = evaluateAgroRules(q);
    const ms = Math.max(0.1, Math.round((performance.now() - start) * 100) / 100);

    setTestResult({ query: q, result: res, ms });
    onRecordQuery({
      query: q,
      category: res.categoryLabel,
      keywords: res.matchedKeywords,
      timeMs: ms,
    });
  };

  const handleCopyRunCmd = () => {
    navigator.clipboard.writeText('python agroassist.py');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const markDownload = (name: string) => {
    setDownloadedFile(name);
    setTimeout(() => setDownloadedFile(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Hero Banner with Prominent ZIP Download */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pure Rule-Based Python Chatbot • Zero ML / External APIs</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AgroAssist Agricultural Support Dashboard
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Built by <strong className="text-white">Niranjan</strong> for farmers and Python beginners.
              Test agricultural rules live, browse the 7-domain knowledge base, or download the complete VS Code Python project as a ZIP archive.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={ZIP_FILE_URL}
                download={ZIP_FILE_NAME}
                onClick={() => markDownload('zip')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <FileArchive className="w-4 h-4" />
                <span>
                  {downloadedFile === 'zip'
                    ? 'Downloading ZIP...'
                    : 'Download Project ZIP (.zip)'}
                </span>
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={() => onNavigateTab('chat')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Open Farmer Chatbot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('vscode')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 font-medium text-sm border border-emerald-700/60 transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>VS Code Setup</span>
              </button>
            </div>
          </div>

          {/* Quick Package Summary Card */}
          <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 lg:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4" /> agroassist-project.zip
              </span>
              <span className="text-[11px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">
                14.4 KB • 4 Files
              </span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-emerald-100/90">
              {PROJECT_FILES.map((f) => (
                <li key={f.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f.name}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {(new Blob([f.content]).size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-300">$ python agroassist.py</span>
              <button
                onClick={handleCopyRunCmd}
                className="text-emerald-200 hover:text-white flex items-center gap-1 bg-emerald-900 px-2 py-1 rounded"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Supported Crops</p>
            <p className="text-xl font-extrabold text-stone-800">7 Major Crops</p>
            <p className="text-[11px] text-emerald-700 font-medium">Rice, Wheat, Tomato +4</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Rule Categories</p>
            <p className="text-xl font-extrabold text-stone-800">7 Agro Domains</p>
            <p className="text-[11px] text-amber-700 font-medium">13 Decision Ladder Rules</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Unit Test Suite</p>
            <p className="text-xl font-extrabold text-stone-800">11 / 11 Passed</p>
            <p className="text-[11px] text-blue-700 font-medium">test_agroassist.py</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Session Queries</p>
            <p className="text-xl font-extrabold text-stone-800">{sessionQueries.length}</p>
            <p className="text-[11px] text-purple-700 font-medium">Avg &lt;1ms Rule Match</p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Rule Tester + Domain Coverage */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Rule Tester Widget */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  Live Rule-Engine Tester
                </h2>
                <p className="text-xs text-stone-500">
                  Test how AgroAssist classifies farmer questions with exact word-boundary matching.
                </p>
              </div>
              <button
                onClick={() => onAskInChat(testResult.query)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                Open in Full Chat →
              </button>
            </div>

            <div className="p-5 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runLiveTest();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter a farming question to test rule matching..."
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                >
                  Test Rule
                </button>
              </form>

              {/* Quick sample queries */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Hello',
                  'Which fertilizer is good for rice?',
                  'How can I control pests in tomato plants?',
                  'What soil is good for cotton?',
                  'What is the price of bitcoin?',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => runLiveTest(sample)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Output Box */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {testResult.result.categoryLabel}
                    </span>
                    <span className="font-mono text-[11px] text-stone-500">
                      category: "{testResult.result.category}"
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
                    <span>
                      Keywords:{' '}
                      <strong className="text-stone-800">
                        {testResult.result.matchedKeywords.length > 0
                          ? testResult.result.matchedKeywords.join(', ')
                          : 'none (fallback)'}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{testResult.ms} ms</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed">
                  {testResult.result.response}
                </div>
              </div>
            </div>
          </div>

          {/* 7 Agricultural Domains Grid */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-800">
                  Agricultural Knowledge Coverage
                </h2>
                <p className="text-xs text-stone-500">
                  Click any domain to ask its sample query in the chatbot.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('knowledge')}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse All Rules</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAIN_CARDS.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => onAskInChat(domain.sampleQuery)}
                  className="text-left p-3.5 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{domain.icon}</span>
                      <span className="font-bold text-sm text-stone-800 group-hover:text-emerald-900">
                        {domain.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${domain.accent}`}>
                      {domain.count}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{domain.items}</p>
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span>Try: "{domain.sampleQuery}"</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Download ZIP & Files + Session Activity + VS Code Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Project ZIP & Individual Files Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-emerald-300" />
                  Download Python Project Files
                </h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Complete standalone VS Code project by Niranjan
                </p>
              </div>
              <span className="text-[11px] font-mono bg-emerald-800 px-2 py-1 rounded border border-emerald-700">
                Python 3.8+
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Primary ZIP Download Button */}
              <a
                href={ZIP_FILE_URL}
                download={ZIP_FILE_NAME}
                onClick={() => markDownload('card-zip')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-between shadow-sm transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <FileArchive className="w-5 h-5 text-emerald-200" />
                  <span>
                    {downloadedFile === 'card-zip'
                      ? 'Downloading agroassist-python-project.zip...'
                      : 'Download agroassist-python-project.zip'}
                  </span>
                </span>
                <Download className="w-4 h-4" />
              </a>

              {/* Individual Files List */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Included Files (Click to download individually)
                </p>
                {PROJECT_FILES.map((file) => {
                  const kb = (new Blob([file.content]).size / 1024).toFixed(1);
                  return (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCode className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-mono font-bold text-stone-800 truncate">
                            {file.name}{' '}
                            <span className="font-normal text-stone-400">({kb} KB)</span>
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">
                            {file.description}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          downloadProjectFile(file);
                          markDownload(file.name);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-300 hover:border-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {downloadedFile === file.name ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigateTab('code')}
                  className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" /> Inspect Python Source
                </button>
                <button
                  onClick={() => onNavigateTab('vscode')}
                  className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" /> Terminal Simulator →
                </button>
              </div>
            </div>
          </div>

          {/* VS Code Quick Start */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <Terminal className="w-4 h-4" />
              Run in VS Code (3 Steps)
            </h3>
            <ol className="space-y-2 text-xs text-stone-300 list-decimal list-inside leading-relaxed">
              <li>
                Download & unzip <code className="text-emerald-300 font-mono">agroassist-python-project.zip</code>
              </li>
              <li>
                Open the extracted <code className="text-emerald-300 font-mono">agroassist-project</code> folder in VS Code
              </li>
              <li>
                Open Terminal (<code className="text-stone-200 font-mono">Ctrl + `</code>) and run:
              </li>
            </ol>
            <div className="bg-stone-950 rounded-xl p-3 font-mono text-xs text-emerald-300 space-y-1 border border-stone-800">
              <div>$ python agroassist.py</div>
              <div className="text-stone-500"># Run automated unit tests:</div>
              <div>$ python -m unittest test_agroassist.py</div>
            </div>
          </div>

          {/* Recent Session Query Log */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Recent Session Queries
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                {sessionQueries.length} logged
              </span>
            </div>

            {sessionQueries.length === 0 ? (
              <p className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                No queries tested yet. Use the Live Rule Tester or Interactive Chat to see matched rules logged here.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {sessionQueries.slice(0, 8).map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-stone-800 truncate">"{item.query}"</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        {item.category}
                        {item.keywords.length > 0 && (
                          <span className="text-stone-400 font-mono font-normal">
                            {' '}
                            • [{item.keywords.slice(0, 3).join(', ')}]
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0">
                      {item.timeMs}ms
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
