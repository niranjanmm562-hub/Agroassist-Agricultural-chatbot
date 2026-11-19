import React, { useState } from 'react';
import { 
  Terminal, CheckCircle, Play, Sparkles, AlertTriangle, 
  ExternalLink, Copy, Check, ChevronRight, Folder, FileCode, HelpCircle, Download 
} from 'lucide-react';
import { evaluateAgroRules } from '../ruleEngine';
import { downloadProjectZip } from '../downloadUtils';

export const VSCodeGuideView: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Interactive simulated terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output' | 'system'; text: string }>>([
    { type: 'system', text: 'Microsoft Windows [Version 10.0.19045.3693]\n(c) Microsoft Corporation. All rights reserved.\n\nC:\\Users\\Niranjan\\agroassist-project>' },
  ]);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [cliInput, setCliInput] = useState('');

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleStartBotInTerminal = () => {
    setTerminalHistory(prev => [
      ...prev,
      { type: 'input', text: 'python agroassist.py' },
      { 
        type: 'output', 
        text: '=================================================================\n' +
              '  🌾  AgroAssist – Agricultural Support Chatbot  🌾\n' +
              '  Developer: Niranjan | Rule-Based Chatbot for Farmers\n' +
              '=================================================================\n' +
              'Welcome to AgroAssist! Ask your farming question below.\n' +
              'Type \'help\' to see all topics, or \'exit\' / \'bye\' to quit.\n' +
              '-----------------------------------------------------------------' 
      }
    ]);
    setIsBotRunning(true);
  };

  const handleTerminalSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : cliInput).trim();
    if (!query) return;

    if (!isBotRunning) {
      if (query.toLowerCase() === 'python agroassist.py' || query.toLowerCase() === 'python3 agroassist.py') {
        handleStartBotInTerminal();
        setCliInput('');
        return;
      } else {
        setTerminalHistory(prev => [
          ...prev,
          { type: 'input', text: query },
          { type: 'output', text: `'${query}' is not recognized. Type 'python agroassist.py' to start the chatbot.` }
        ]);
        setCliInput('');
        return;
      }
    }

    const ruleRes = evaluateAgroRules(query);
    setTerminalHistory(prev => [
      ...prev,
      { type: 'input', text: `Farmer: ${query}` },
      { type: 'output', text: `AgroAssist [${ruleRes.category}]:\n${ruleRes.response}\n` }
    ]);
    setCliInput('');

    if (ruleRes.category === 'exit') {
      setIsBotRunning(false);
      setTerminalHistory(prev => [
        ...prev,
        { type: 'system', text: '\nC:\\Users\\Niranjan\\agroassist-project>' }
      ]);
    }
  };

  const clearTerminal = () => {
    setTerminalHistory([
      { type: 'system', text: 'C:\\Users\\Niranjan\\agroassist-project>' }
    ]);
    setIsBotRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Hero Card */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4" /> Beginner Tutorial for Developer Niranjan
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How to Run AgroAssist in Visual Studio Code
          </h2>
          <p className="text-stone-300 text-sm mt-2 max-w-2xl leading-relaxed">
            Follow this clear, step-by-step walkthrough to run your rule-based agricultural chatbot on your local computer using Python and VS Code.
          </p>
        </div>

        <div className="bg-stone-800/80 border border-stone-700 p-4 rounded-xl shrink-0 text-xs text-stone-300 space-y-2.5 font-mono">
          <div className="text-emerald-400 font-bold">Quick Run Command:</div>
          <div className="bg-stone-950 px-3 py-2 rounded text-emerald-300 flex items-center justify-between gap-3">
            <span>python agroassist.py</span>
            <button
              onClick={() => copyCommand('python agroassist.py', 'hero')}
              className="hover:text-white"
            >
              {copiedCmd === 'hero' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            onClick={downloadProjectZip}
            className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-sans font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Project (.zip)</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex gap-4">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-stone-800 text-base">Install Python (3.8 or higher)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Go to <a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">python.org/downloads</a> and download the installer.
            </p>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important on Windows:</strong> Check the box that says <u>"Add Python to PATH"</u> before clicking "Install Now".
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex gap-4">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-stone-800 text-base">Install Visual Studio Code</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Download and install VS Code from <a href="https://code.visualstudio.com/" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">code.visualstudio.com</a>.
            </p>
            <p className="text-xs text-stone-600">
              Open VS Code, press <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">Ctrl + Shift + X</code> (Extensions), search for <strong>Python</strong> by Microsoft, and click <strong>Install</strong>.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex gap-4">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
            3
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-stone-800 text-base">Create Project Folder & File</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Create a new folder on your computer named <code className="bg-stone-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">agroassist-project</code>.
            </p>
            <p className="text-xs text-stone-600">
              In VS Code, click <strong>File &gt; Open Folder...</strong> and choose that folder. Then click "New File" and name it <code className="font-mono text-emerald-800 font-semibold">agroassist.py</code>.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex gap-4">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
            4
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-stone-800 text-base">Paste Code & Run in Terminal</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Copy the Python code from the <strong>Python Source Code</strong> tab and paste it into <code className="font-mono text-emerald-800">agroassist.py</code>. Save with <code className="bg-stone-100 px-1 rounded font-mono">Ctrl + S</code>.
            </p>
            <p className="text-xs text-stone-600">
              Open the terminal with <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">Ctrl + `</code> or menu <strong>Terminal &gt; New Terminal</strong>, then run:
            </p>
            <div className="bg-stone-900 text-emerald-400 p-2 rounded font-mono text-xs flex justify-between items-center">
              <span>python agroassist.py</span>
              <button
                onClick={() => copyCommand('python agroassist.py', 'step4')}
                className="hover:text-white"
              >
                {copiedCmd === 'step4' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive VS Code Terminal Simulator */}
      <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-stone-800">
        <div className="bg-stone-950 px-4 py-3 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> VS Code Integrated Terminal Simulator
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {!isBotRunning ? (
              <button
                onClick={handleStartBotInTerminal}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-medium flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run: python agroassist.py</span>
              </button>
            ) : (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ● AgroAssist Running
              </span>
            )}
            <button
              onClick={clearTerminal}
              className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-stone-800"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Click Query Simulator Chips */}
        {isBotRunning && (
          <div className="bg-stone-950/80 px-4 py-2 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-400 font-mono text-[11px] shrink-0">Click to test:</span>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'Hello')}
              className="shrink-0 bg-stone-800 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded font-mono text-xs border border-stone-700"
            >
              Hello
            </button>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'Which fertilizer is good for rice?')}
              className="shrink-0 bg-stone-800 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded font-mono text-xs border border-stone-700"
            >
              Which fertilizer is good for rice?
            </button>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'How can I control pests in tomato plants?')}
              className="shrink-0 bg-stone-800 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded font-mono text-xs border border-stone-700"
            >
              Tomato pests
            </button>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'What soil is good for cotton?')}
              className="shrink-0 bg-stone-800 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded font-mono text-xs border border-stone-700"
            >
              Cotton soil
            </button>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'Thank you')}
              className="shrink-0 bg-stone-800 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded font-mono text-xs border border-stone-700"
            >
              Thank you
            </button>
            <button
              onClick={() => handleTerminalSubmit(undefined, 'exit')}
              className="shrink-0 bg-red-950 hover:bg-red-900 text-red-200 px-2 py-0.5 rounded font-mono text-xs border border-red-800"
            >
              exit
            </button>
          </div>
        )}

        {/* Terminal Screen Body */}
        <div className="p-4 font-mono text-xs text-stone-200 space-y-2 h-72 overflow-y-auto scrollbar-thin">
          {terminalHistory.map((item, idx) => (
            <div key={idx} className="whitespace-pre-line leading-relaxed">
              {item.type === 'input' && (
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span>&gt;</span>
                  <span>{item.text}</span>
                </div>
              )}
              {item.type === 'output' && (
                <div className="text-stone-300 pl-2 border-l border-stone-800">{item.text}</div>
              )}
              {item.type === 'system' && (
                <div className="text-stone-500">{item.text}</div>
              )}
            </div>
          ))}
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleTerminalSubmit} className="bg-stone-950 px-4 py-2 border-t border-stone-800 flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400">
            {isBotRunning ? 'Farmer: ' : 'PS C:\\Users\\Niranjan\\agroassist-project> '}
          </span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder={isBotRunning ? "Ask question or type 'exit'..." : "Type 'python agroassist.py' and press Enter..."}
            className="flex-1 bg-transparent font-mono text-xs text-stone-200 focus:outline-none placeholder-stone-600"
          />
        </form>
      </div>

      {/* Troubleshooting Common Beginner Errors */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          Common Beginner Questions & Troubleshooting
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-sm text-stone-800 text-red-600">
              ❌ "'python' is not recognized as an internal or external command"
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Cause:</strong> Python was installed without checking "Add Python to PATH".<br />
              <strong>Fix:</strong> Try running <code className="font-mono bg-stone-200 px-1 rounded">py agroassist.py</code> or <code className="font-mono bg-stone-200 px-1 rounded">python3 agroassist.py</code>. If that fails, re-run the Python installer, choose "Modify", and check "Add Python to PATH".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-sm text-stone-800 text-amber-600">
              ⚠️ "IndentationError: unexpected indent"
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Cause:</strong> In Python, whitespace and indentation define code blocks.<br />
              <strong>Fix:</strong> Ensure you use 4 spaces consistently for indentation inside functions and if-statements. Never mix tabs and spaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
