export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'voice';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  timeline: number; // months
  category: 'housing' | 'education' | 'travel' | 'health' | 'other';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: Date;
}

export interface SpendingAnalysis {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  expensesByCategory: Record<string, number>;
  recommendations: string[];
}

export interface BankProduct {
  id: string;
  name: string;
  type: 'deposit' | 'credit' | 'investment';
  description: string;
  islamicCompliant: boolean;
  minAmount: number;
  maxAmount: number;
  profitRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}