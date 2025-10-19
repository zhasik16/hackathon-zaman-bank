// services/api.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 секунд таймаут
});

// Интерфейсы для TypeScript
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  age?: number;
  monthly_income?: number;
  risk_profile: string;
  islamic_knowledge: string;
}

export interface FinancialGoal {
  id: number;
  user_id: number;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  timeline_months: number;
  category: string;
  priority: string;
  islamic_importance: string;
  monthly_saving: number;
  progress_percentage: number;
}

export interface ChatMessage {
  message: string | Blob;
  message_type: 'text' | 'voice';
  context?: any;
}

export interface AIResponse {
  response: string;
  recommendations: string[];
  suggested_products: any[];
  monthly_plan?: any;
  transcribed_text?: string;
}

export interface SpendingAnalysis {
  basic_analysis: {
    total_income: number;
    total_expenses: number;
    savings_rate: number;
    expenses_by_category: Record<string, number>;
  };
  islamic_analysis: {
    spending_analysis: any;
    habits_to_improve: string[];
    islamic_recommendations: string[];
    charity_suggestions: string[];
    stress_alternatives: string[];
  };
  transactions: any[];
}

// Mock данные для демонстрации, когда бэкенд недоступен
const mockAIResponse: AIResponse = {
  response: "Ассаламу алейкум! Я ваш персональный финансовый помощник Zaman Bank. К сожалению, в данный момент сервис временно недоступен. Пожалуйста, попробуйте позже или используйте текстовый ввод для основных вопросов.",
  recommendations: [
    "Проверьте подключение к интернету",
    "Попробуйте обновить страницу",
    "Используйте текстовый ввод для общения"
  ],
  suggested_products: [],
  monthly_plan: {}
};

const mockVoiceResponse: AIResponse = {
  response: "Я получил ваше голосовое сообщение! В настоящее время сервис распознавания речи временно недоступен. Пожалуйста, напишите ваш вопрос текстом.",
  recommendations: [
    "Используйте текстовый ввод для лучшего опыта",
    "Проверьте микрофон и разрешения браузера",
    "Попробуйте позже"
  ],
  suggested_products: [],
  transcribed_text: "[Голосовое сообщение получено, но сервис транскрипции временно недоступен]"
};

// Функция для проверки доступности бэкенда
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.warn('Backend is not available, using mock data');
    return false;
  }
};

// Функция для безопасного выполнения запросов
const safeApiCall = async <T>(apiCall: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.log('Using fallback data due to network error');
        return fallback;
      }
    }
    
    throw error;
  }
};

// API функции
export const apiService = {
  // Аутентификация
  async register(userData: any) {
    return safeApiCall(
      () => api.post('/auth/register', userData).then(response => response.data),
      { success: true, message: 'Регистрация завершена (режим демо)' }
    );
  },

  async login(credentials: { username: string; password: string }) {
    return safeApiCall(
      () => api.post('/auth/token', credentials).then(response => response.data),
      { 
        access_token: 'demo-token', 
        token_type: 'bearer',
        user: {
          id: 1,
          username: credentials.username,
          full_name: 'Демо пользователь'
        }
      }
    );
  },

  // Чат с AI - обновленная функция для поддержки голосовых сообщений
  async sendChatMessage(messageData: ChatMessage): Promise<AIResponse> {
    if (messageData.message_type === 'voice' && messageData.message instanceof Blob) {
      return safeApiCall(
        async () => {
          const formData = new FormData();
          formData.append('audio', messageData.message as Blob, 'recording.webm');
          formData.append('message_type', 'voice');
          
          if (messageData.context) {
            formData.append('context', JSON.stringify(messageData.context));
          }

          const response = await api.post('/chat/message', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data;
        },
        mockVoiceResponse
      );
    } else {
      return safeApiCall(
        async () => {
          const response = await api.post('/chat/message', {
            message: messageData.message as string,
            message_type: messageData.message_type || 'text',
            context: messageData.context,
          });
          return response.data;
        },
        {
          ...mockAIResponse,
          response: `Спасибо за ваш вопрос: "${messageData.message}"\n\nК сожалению, AI сервис временно недоступен. Вот что я могу предложить:\n\n• Проверьте ваши финансовые цели в разделе "Анализ"\n• Используйте калькулятор сбережений\n• Ознакомьтесь с исламскими финансовыми продуктами`
        }
      );
    }
  },

  // Альтернативный метод для отправки только текстовых сообщений
  async sendTextMessage(message: string, context?: any): Promise<AIResponse> {
    return safeApiCall(
      async () => {
        const response = await api.post('/chat/message', {
          message,
          message_type: 'text',
          context,
        });
        return response.data;
      },
      {
        ...mockAIResponse,
        response: `Вы спросили: "${message}"\n\nВ настоящее время AI ассистент временно недоступен. Рекомендую:\n\n1. Проверить раздел "Анализ" для просмотра ваших финансов\n2. Настроить финансовые цели\n3. Ознакомиться с исламскими продуктами банка`
      }
    );
  },

  // Метод для отправки голосовых сообщений
  async sendVoiceMessage(audioBlob: Blob, context?: any): Promise<AIResponse> {
    return safeApiCall(
      async () => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('message_type', 'voice');
        
        if (context) {
          formData.append('context', JSON.stringify(context));
        }

        const response = await api.post('/chat/message', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      },
      mockVoiceResponse
    );
  },

  async generateFinancialPlan() {
    return safeApiCall(
      () => api.post('/chat/financial-plan').then(response => response.data),
      {
        plan: {
          monthly_savings: 0,
          investment_advice: "Консультация временно недоступна",
          islamic_products: []
        }
      }
    );
  },

  async analyzeSpending() {
    return safeApiCall(
      () => api.post('/chat/spending-analysis').then(response => response.data),
      {
        analysis: "Анализ расходов временно недоступен",
        recommendations: ["Попробуйте позже"]
      }
    );
  },

  // Финансовые цели
  async createGoal(goalData: any): Promise<FinancialGoal> {
    return safeApiCall(
      () => api.post('/goals/', goalData).then(response => response.data),
      {
        id: Date.now(),
        ...goalData,
        progress_percentage: 0,
        created_at: new Date().toISOString()
      }
    );
  },

  async getGoals(): Promise<FinancialGoal[]> {
    return safeApiCall(
      () => api.get('/goals/').then(response => response.data),
      [] // Пустой массив как fallback
    );
  },

  async getGoal(goalId: number): Promise<FinancialGoal> {
    return safeApiCall(
      () => api.get(`/goals/${goalId}`).then(response => response.data),
      {
        id: goalId,
        goal_name: "Демо цель",
        target_amount: 1000000,
        current_amount: 0,
        timeline_months: 12,
        category: "other",
        priority: "medium",
        progress_percentage: 0
      }
    );
  },

  // Аналитика
  async getSpendingAnalysis(): Promise<SpendingAnalysis> {
    return safeApiCall(
      () => api.get('/analysis/spending').then(response => response.data),
      {
        basic_analysis: {
          total_income: 500000,
          total_expenses: 350000,
          savings_rate: 0.3,
          expenses_by_category: {
            housing: 140000,
            food: 87500,
            transport: 52500,
            health: 35000,
            entertainment: 35000
          }
        },
        islamic_analysis: {
          spending_analysis: "Анализ временно недоступен",
          habits_to_improve: ["Регулярно отслеживайте расходы"],
          islamic_recommendations: ["Рассмотрите исламские депозиты"],
          charity_suggestions: ["Выделяйте 2.5% от сбережений"],
          stress_alternatives: ["Спорт, медитация, чтение"]
        },
        transactions: []
      }
    );
  },

  async getHabitAnalysis() {
    return safeApiCall(
      () => api.get('/analysis/habits').then(response => response.data),
      {
        habits: ["Анализ привычек временно недоступен"],
        recommendations: ["Попробуйте позже"]
      }
    );
  },

  async getIslamicProducts() {
    return safeApiCall(
      () => api.get('/analysis/islamic-products').then(response => response.data),
      {
        products: [
          {
            name: "Исламский депозит",
            type: "savings",
            description: "Беспроцентный сберегательный счет"
          }
        ]
      }
    );
  },

  async getLifeGoalsAnalysis() {
    return safeApiCall(
      () => api.get('/analysis/life-goals').then(response => response.data),
      {
        goals: ["Анализ целей временно недоступен"],
        timeline: "Попробуйте позже"
      }
    );
  },

  async validateTransaction(transaction: any) {
    return safeApiCall(
      () => api.post('/analysis/validate-transaction', transaction).then(response => response.data),
      {
        valid: true,
        message: "Транзакция проверена (демо режим)"
      }
    );
  },

  // Вспомогательные методы для работы с голосом
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return safeApiCall(
      async () => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        const response = await api.post('/chat/transcribe', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.transcribed_text;
      },
      "Голосовое сообщение получено, но сервис транскрипции временно недоступен"
    );
  },

  // Получить историю чата
  async getChatHistory() {
    return safeApiCall(
      () => api.get('/chat/history').then(response => response.data),
      { messages: [] }
    );
  },

  // Очистить историю чата
  async clearChatHistory() {
    return safeApiCall(
      () => api.delete('/chat/history').then(response => response.data),
      { success: true, message: "История очищена (демо режим)" }
    );
  },

  // Проверить доступность бэкенда
  async checkBackendHealth(): Promise<boolean> {
    return await isBackendAvailable();
  }
};

// Утилиты для работы с API
export const setupAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Перенаправление на страницу входа при истечении токена
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;