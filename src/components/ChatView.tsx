import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Copy, Check, RotateCcw, 
  HelpCircle, Sparkles, ChevronRight, Bug, Sprout, Droplets, 
  CloudSun, Mountain, Lightbulb, Activity, CheckCircle2
} from 'lucide-react';
import { ChatMessage, QuickPrompt } from '../types';
import { evaluateAgroRules, RuleResponse } from '../ruleEngine';

interface ChatViewProps {
  soundEnabled: boolean;
  onInspectRule: (msg: ChatMessage) => void;
  onNavigateTab: (tab: 'code' | 'vscode' | 'knowledge') => void;
  pendingQuery?: { id: number; text: string } | null;
  onRecordQuery?: (entry: { query: string; category: string; keywords: string[]; timeMs: number }) => void;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', category: 'Crops', label: '🌾 Rice crop guide', prompt: 'Tell me about rice crop', icon: '🌾' },
  { id: '2', category: 'Fertilizer', label: '🧪 Rice fertilizer', prompt: 'Which fertilizer is good for rice?', icon: '🧪' },
  { id: '3', category: 'Pests', label: '🐛 Tomato pests', prompt: 'How can I control pests in tomato plants?', icon: '🐛' },
  { id: '4', category: 'Irrigation', label: '💧 Drip irrigation', prompt: 'Tell me about drip irrigation', icon: '💧' },
  { id: '5', category: 'Weather', label: '🌧️ Monsoon precautions', prompt: 'What should I do in rainy weather?', icon: '🌧️' },
  { id: '6', category: 'Soil', label: '🧱 Black soil crops', prompt: 'What soil is good for cotton?', icon: '🧱' },
  { id: '7', category: 'Tips', label: '💡 Crop rotation', prompt: 'Give me a tip on crop rotation', icon: '💡' },
  { id: '8', category: 'Fertilizer', label: '🍂 Make compost', prompt: 'How to make organic compost?', icon: '🍂' },
  { id: '9', category: 'Soil', label: '🔬 Soil testing', prompt: 'How to do soil testing and check pH?', icon: '🔬' }
];

export const ChatView: React.FC<ChatViewProps> = ({
  soundEnabled,
  onInspectRule,
  onNavigateTab,
  pendingQuery,
  onRecordQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! Welcome to AgroAssist. How can I help you with agriculture today?\n\nI am a rule-based agricultural assistant designed by Niranjan. You can ask me questions about crops, fertilizers, pest control, irrigation, weather precautions, soils, or farming tips in plain language!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ruleData: {
        response: "",
        category: "greeting",
        categoryLabel: "Welcome & Introduction",
        matchedKeywords: ["welcome", "hello"],
        suggestedFollowUps: [
          "Which fertilizer is good for rice?",
          "How can I control pests in tomato plants?",
          "What soil is good for cotton?",
          "Tell me about drip irrigation"
        ]
      },
      executionTimeMs: 0.2
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (pendingQuery && pendingQuery.text.trim()) {
      handleSendMessage(pendingQuery.text);
    }
  }, [pendingQuery]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  // Text-To-Speech Functionality
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of emojis and bullets for clearer spoken audio
    const speechFriendly = text
      .replace(/[🌾🌽🎋🍅🥔🌱🌿🍂🧪🦠🐛💧🌧️☀️🏜️❄️🧱💡👉•]/g, ' ')
      .replace(/\s+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(speechFriendly);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query) return;

    const startTime = performance.now();
    const ruleResult: RuleResponse = evaluateAgroRules(query);
    const endTime = performance.now();
    const elapsedMs = Math.round((endTime - startTime) * 100) / 100;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: ruleResult.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ruleData: ruleResult,
      rawInput: query,
      executionTimeMs: Math.max(0.1, elapsedMs)
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');

    if (onRecordQuery) {
      onRecordQuery({
        query,
        category: ruleResult.categoryLabel,
        keywords: ruleResult.matchedKeywords,
        timeMs: Math.max(0.1, elapsedMs),
      });
    }

    if (soundEnabled) {
      setTimeout(() => {
        speakText(ruleResult.response, botMessage.id);
      }, 200);
    }
  };

  const resetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Hello again! AgroAssist is ready. Ask any farming question or select a quick topic below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ruleData: {
          response: "",
          category: "greeting",
          categoryLabel: "Session Reset",
          matchedKeywords: ["reset"],
          suggestedFollowUps: [
            "Which fertilizer is good for rice?",
            "How can I control pests in tomato plants?",
            "What soil is good for cotton?"
          ]
        },
        executionTimeMs: 0.1
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-stone-50 md:shadow-lg md:rounded-2xl md:my-4 border border-stone-200 overflow-hidden">
      {/* Chat Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-600/30"></span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              AgroAssist Chatbot
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                Rule-Based Engine
              </span>
            </h1>
            <p className="text-xs text-stone-500 flex items-center gap-2">
              <span>Developer: Niranjan</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready to assist
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetChat}
            title="Reset conversation"
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Category Chips Header */}
      <div className="bg-stone-100/80 px-4 py-2 border-b border-stone-200 overflow-x-auto scrollbar-none flex items-center space-x-2">
        <span className="text-xs font-semibold text-stone-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" /> Quick Topics:
        </span>
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.id}
            onClick={() => handleSendMessage(qp.prompt)}
            className="shrink-0 text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-stone-700 px-2.5 py-1 rounded-full border border-stone-300 transition-colors shadow-2xs font-medium flex items-center space-x-1"
          >
            <span>{qp.icon}</span>
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-stone-50 to-stone-100/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[90%] md:max-w-[80%] ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {msg.sender === 'user' ? 'You' : '🌾'}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                }`}
              >
                {/* Bot Category Label */}
                {msg.sender === 'bot' && msg.ruleData && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-[11px] gap-2">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {msg.ruleData.categoryLabel || msg.ruleData.category}
                    </span>
                    {msg.ruleData.matchedKeywords.length > 0 && (
                      <span className="text-stone-400 font-mono text-[10px]">
                        Matched: {msg.ruleData.matchedKeywords.join(', ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm whitespace-pre-line leading-relaxed font-normal">
                  {msg.text}
                </div>

                {/* Footer bar for bot responses */}
                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 text-xs text-stone-400">
                    <span className="text-[10px]">{msg.timestamp}</span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        title={activeSpeechId === msg.id ? "Stop reading" : "Read aloud"}
                        className={`p-1.5 rounded-md transition-colors ${
                          activeSpeechId === msg.id
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'hover:bg-stone-100 text-stone-500'
                        }`}
                      >
                        {activeSpeechId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        title="Copy text"
                        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {msg.ruleData && (
                        <button
                          onClick={() => onInspectRule(msg)}
                          title="Inspect rule matching logic"
                          className="px-2 py-1 rounded-md text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono flex items-center gap-1 transition-colors"
                        >
                          <Activity className="w-3 h-3 text-emerald-600" />
                          <span>Inspect Rule</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {msg.sender === 'user' && (
                  <div className="text-[10px] text-emerald-100 text-right mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>

            {/* Follow-up suggestions */}
            {msg.sender === 'bot' && msg.ruleData?.suggestedFollowUps && msg.ruleData.suggestedFollowUps.length > 0 && (
              <div className="ml-10 mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                <span className="text-[11px] text-stone-500 flex items-center mr-1">
                  Ask next:
                </span>
                {msg.ruleData.suggestedFollowUps.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="text-xs bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/90 hover:border-emerald-400 px-2.5 py-1 rounded-full transition-all shadow-2xs flex items-center gap-1 font-medium text-left"
                  >
                    <span>{promptText}</span>
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="bg-white p-3 border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Microphone Voice Input */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Voice input (Speak to AgroAssist)"}
            className={`p-2.5 rounded-xl transition-all border shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse border-red-600'
                : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 border-stone-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, fertilizer, pests, irrigation, weather, or soil..."
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-stone-400">
          <span>Rule-based logic: clean string → regex word boundary → rule ladder</span>
          <button 
            onClick={() => onNavigateTab('vscode')}
            className="text-emerald-600 hover:underline font-medium"
          >
            How to run in VS Code →
          </button>
        </div>
      </div>
    </div>
  );
};
