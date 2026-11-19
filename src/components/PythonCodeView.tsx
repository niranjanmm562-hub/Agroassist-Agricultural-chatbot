import React, { useState } from 'react';
import { Download, Copy, Check, Code, BookOpen, FileArchive, FileCode } from 'lucide-react';
import { PROJECT_FILES, downloadProjectFile, downloadProjectZip } from '../downloadUtils';

export const PythonCodeView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const activeFile = PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    downloadProjectFile(activeFile);
    setDownloadSuccess(activeFile.name);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadAllZip = () => {
    downloadProjectZip();
    setDownloadSuccess('zip');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const codeLines = activeFile.content.trim().split('\n');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 rounded-2xl shadow-md border border-emerald-700 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Code className="w-4 h-4" /> Standalone Python Project
          </div>
          <h2 className="text-2xl font-bold">AgroAssist Python Source Files</h2>
          <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
            Clean, well-documented, beginner-friendly Python code developed by Niranjan.
            Download the full project ZIP or individual files to run locally in VS Code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors border border-emerald-600/60 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : `Copy ${activeFile.name}`}</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{downloadSuccess === activeFile.name ? 'Downloaded!' : `Download ${activeFile.name}`}</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            <FileArchive className="w-4 h-4" />
            <span>{downloadSuccess === 'zip' ? 'ZIP Downloaded!' : 'Download Full Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Code Architecture Breakdown for Beginners */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Step-by-Step Code Architecture (Explained for Beginners)
        </h3>
        <p className="text-sm text-stone-600">
          As a beginner developer, here is how each section of <code className="bg-stone-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono text-xs">agroassist.py</code> works together:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
              Knowledge Dictionaries
            </div>
            <h4 className="font-semibold text-stone-800 text-sm mb-1">Predefined Answers</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Stores accurate crop facts, fertilizer tables, pest control steps, soil types, and weather tips as Python dictionaries (<code className="font-mono text-emerald-800">CROP_DATA</code>, <code className="font-mono text-emerald-800">FERTILIZER_DATA</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
              Regex Word Boundaries
            </div>
            <h4 className="font-semibold text-stone-800 text-sm mb-1">Preventing Collisions</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uses <code className="font-mono text-amber-800">\bkeyword\b</code> in <code className="font-mono text-amber-800">has_word()</code>. This guarantees <code className="font-mono">'hi'</code> does not trigger inside <code className="font-mono">'which'</code>, and <code className="font-mono">'rice'</code> does not trigger on <code className="font-mono">'price'</code>!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              Rule Hierarchy & Fallback
            </div>
            <h4 className="font-semibold text-stone-800 text-sm mb-1">If-Elif-Else Priority</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Checks specific intents (pest queries with crops first, fertilizers second, irrigation third). If no rule fires, the polite fallback guides the farmer with supported topics.
            </p>
          </div>
        </div>
      </div>

      {/* File Selector + Code Display Window */}
      <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-800">
        <div className="bg-stone-950 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <div className="hidden sm:flex items-center space-x-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {PROJECT_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedFileIndex === idx
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadSingle}
              className="px-2.5 py-1 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Save {activeFile.name}</span>
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[600px] overflow-y-auto font-mono text-xs text-stone-200 leading-relaxed scrollbar-thin">
          <pre className="overflow-x-auto">
            {codeLines.map((line, index) => (
              <div key={index} className="table-row hover:bg-stone-800/40 px-2 py-0.5 rounded">
                <span className="table-cell pr-4 text-stone-600 text-right select-none w-10">
                  {index + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {line.startsWith('#') || line.startsWith('"""') || line.startsWith(' *') ? (
                    <span className="text-emerald-400 italic">{line}</span>
                  ) : line.startsWith('def ') || line.startsWith('class ') ? (
                    <span className="text-amber-400 font-semibold">{line}</span>
                  ) : line.startsWith('import ') || line.startsWith('from ') ? (
                    <span className="text-purple-400">{line}</span>
                  ) : line.includes('return ') ? (
                    <span className="text-blue-400">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
