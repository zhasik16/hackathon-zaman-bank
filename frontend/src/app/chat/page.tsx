"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, User, Bot, Calendar, Target } from "lucide-react";
import { apiService, AIResponse } from "@/services/api";
import { useUser } from "@/hooks/useUser";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const quickActions = [
  {
    icon: Target,
    text: "Поставить цель",
    prompt: "Я хочу поставить новую финансовую цель",
  },
  {
    icon: Calendar,
    text: "Анализ расходов",
    prompt: "Проанализируй мои расходы за последний месяц",
  },
];

export default function ChatPage() {
  const { user, loading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "1",
        content: `Ассаламу алейкум, ${user.fullName}! 🌙\n\nЯ ваш персональный помощник Zaman Bank. Вижу, что вы хотите достичь ${user.goals.length} финансовых целей. Давайте вместе создадим план в соответствии с принципами исламских финансов!`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Initialize voice recording
  const initializeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      return mediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw new Error("Не удалось получить доступ к микрофону");
    }
  };

  const startRecording = async () => {
    try {
      const mediaRecorder = await initializeRecording();
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          "Ошибка доступа к микрофону. Пожалуйста, разрешите доступ к микрофону и попробуйте снова.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordingStop = async () => {
    setIsProcessingVoice(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      // Send audio to backend for processing
      const response = await apiService.sendChatMessage({
        message: audioBlob,
        message_type: "voice",
      });

      // Add transcribed message to chat
      if (response.transcribed_text) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: response.transcribed_text,
          isUser: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
      }

      // Add AI response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Add recommendations if available
      if (response.recommendations && response.recommendations.length > 0) {
        const recommendationsMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `💡 Рекомендации:\n${response.recommendations
            .map((rec) => `• ${rec}`)
            .join("\n")}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, recommendationsMessage]);
      }
    } catch (error) {
      console.error("Error processing voice message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Извините, произошла ошибка при обработке голосового сообщения. Пожалуйста, попробуйте еще раз или используйте текстовый ввод.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse: AIResponse = await apiService.sendChatMessage({
        message: textToSend,
        message_type: "text",
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        const recommendationsMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `💡 Рекомендации:\n${aiResponse.recommendations
            .map((rec) => `• ${rec}`)
            .join("\n")}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, recommendationsMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка вашего профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок чата */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            Zaman AI Assistant
          </h1>
          <p className="text-white/80 text-sm sm:text-lg">
            Ваш персональный финансовый советник
          </p>
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="glass-effect px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{action.text}</span>
              </button>
            );
          })}
        </div>

        {/* Окно чата */}
        <div className="financial-card p-4 sm:p-6 h-[500px] sm:h-[600px] flex flex-col">
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${
                  message.isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? "bg-blue-500" : "bg-green-500"
                  }`}
                >
                  {message.isUser ? (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  ) : (
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 ${
                    message.isUser ? "message-user" : "message-bot"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm sm:text-base">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 sm:mt-2 block ${
                      message.isUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Voice recording indicator */}
            {isRecording && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="message-bot p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-gray-600 text-sm">
                      Запись голоса... Говорите сейчас
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Voice processing indicator */}
            {isProcessingVoice && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="message-bot p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-gray-600 text-sm">
                      Обрабатываю голосовое сообщение...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Text loading indicator */}
            {isLoading && !isProcessingVoice && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="message-bot p-3 sm:p-4">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={toggleRecording}
              disabled={isProcessingVoice || isLoading}
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : isProcessingVoice || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Задайте вопрос о ваших финансах или используйте голосовой ввод..."
                disabled={isRecording || isProcessingVoice}
                className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={1}
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={
                !inputMessage.trim() ||
                isLoading ||
                isRecording ||
                isProcessingVoice
              }
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Подсказка для голосового ввода */}
          {!isRecording && (
            <div className="text-center mt-2">
              <p className="text-gray-500 text-xs">
                Нажмите на микрофон для голосового ввода
              </p>
            </div>
          )}
        </div>

        {/* Информационная панель */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card-income text-center p-4">
            <Target className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Финансовые цели</p>
            <p className="text-lg font-bold">Помощь в планировании</p>
          </div>
          <div className="stat-card-savings text-center p-4">
            <Calendar className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Исламские финансы</p>
            <p className="text-lg font-bold">Соответствие шариату</p>
          </div>
          <div className="stat-card-expense text-center p-4">
            <Bot className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">AI Ассистент</p>
            <p className="text-lg font-bold">24/7 поддержка</p>
          </div>
        </div>
      </div>
    </div>
  );
}
