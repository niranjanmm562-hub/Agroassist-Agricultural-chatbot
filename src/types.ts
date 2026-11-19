import { RuleResponse } from './ruleEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  ruleData?: RuleResponse;
  rawInput?: string;
  executionTimeMs?: number;
}

export type ActiveTab = 'dashboard' | 'chat' | 'code' | 'vscode' | 'knowledge';

export interface QuickPrompt {
  id: string;
  category: string;
  label: string;
  prompt: string;
  icon: string;
}
