import React from 'react';
import { X, Activity, CheckCircle, ShieldAlert, Cpu, Sparkles, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';
import { cleanText } from '../ruleEngine';

interface RuleInspectorModalProps {
  message: ChatMessage | null;
  onClose: () => void;
}

export const RuleInspectorModal: React.FC<RuleInspectorModalProps> = ({ message, onClose }) => {
  if (!message || !message.ruleData) return null;

  const rawInput = message.rawInput || message.text;
  const cleaned = cleanText(rawInput);
  const words = cleaned ? cleaned.split(' ') : [];
  const matchedKeywords = message.ruleData.matchedKeywords || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Rule Engine Inspector</h3>
              <p className="text-[11px] text-stone-400 font-mono">
                Pure Rule-Based Execution • No ML Model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs text-stone-700">
          {/* Section 1: Raw vs Cleaned Input */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">1. Input Normalization:</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                clean_text()
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>
                <span className="text-stone-400">Raw Input:</span> "{rawInput}"
              </div>
              <div>
                <span className="text-stone-400">Cleaned:</span>{" "}
                <span className="text-emerald-800 font-semibold">"{cleaned}"</span>
              </div>
            </div>
          </div>

          {/* Section 2: Word Boundary Detection */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">2. Regex Word Boundary (\b) Detection:</span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                has_word()
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Words extracted from user query:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {words.map((word, i) => {
                const isMatched = matchedKeywords.some(
                  (mk) => mk.toLowerCase() === word.toLowerCase()
                );
                return (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded font-mono text-xs border ${
                      isMatched
                        ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {word} {isMatched && '✓'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Section 3: Fired Rule */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">3. Rule Decision Ladder Outcome:</span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                Category: {message.ruleData.category}
              </span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-950 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Triggered Rule Branch: {message.ruleData.categoryLabel}</span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed pl-5">
                Matched keywords: <strong className="font-mono">{matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'None (Fallback rule triggered)'}</strong>
              </p>
            </div>
          </div>

          {/* Section 4: Performance */}
          <div className="flex items-center justify-between text-stone-500 text-[11px] px-1 pt-1 border-t border-stone-100">
            <span>Execution Latency: <strong className="text-stone-800 font-mono">{message.executionTimeMs || 0.2} ms</strong> (Zero API delay)</span>
            <span>Developer: Niranjan</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
