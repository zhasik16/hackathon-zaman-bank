"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Heart,
  Coffee,
  BookOpen,
  Dumbbell,
  Target,
  Zap,
} from "lucide-react";

interface HabitAdviceProps {
  userSpending?: Record<string, number>;
  monthlyIncome?: number;
}

export function HabitAdvice({
  userSpending = {},
  monthlyIncome = 0,
}: HabitAdviceProps) {
  const [advice, setAdvice] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setUserData(user);
      generatePersonalizedAdvice(user);
    }
  }, [userSpending, monthlyIncome]);

  const generatePersonalizedAdvice = (user: any) => {
    const income = parseInt(user.monthlyIncome) || 0;
    const expenses = parseInt(user.monthlyExpenses) || income * 0.7;
    const age = parseInt(user.age) || 30;
    const goals = user.goals || [];

    const totalGoalsAmount = goals.reduce(
      (sum: number, goal: any) => sum + (parseInt(goal.targetAmount) || 0),
      0
    );

    const personalizedAdvice = [
      {
        icon: Coffee,
        title: "Оптимизация ежедневных расходов",
        description: `Потенциальная экономия: ${Math.min(
          15000,
          income * 0.05
        ).toLocaleString("ru-RU")} ₸/месяц`,
        action: "Готовьте кофе и еду дома",
        impact: "high",
        details: `Сократите расходы на кафе и рестораны. Вместо ${Math.min(
          15000,
          income * 0.05
        ).toLocaleString(
          "ru-RU"
        )} ₸ в месяц на питание вне дома, готовьте домашнюю еду.`,
      },
      {
        icon: BookOpen,
        title: "Инвестиции в образование",
        description: `Рекомендуемый бюджет: ${Math.max(
          5000,
          income * 0.03
        ).toLocaleString("ru-RU")} ₸/месяц`,
        action: "Курсы по исламским финансам",
        impact: "medium",
        details: `Инвестируйте в знания об исламских финансах. Это принесет пользу как в дунье, так и в ахирате.`,
      },
      {
        icon: Dumbbell,
        title: "Здоровый образ жизни",
        description: `Экономия на лечении: ${Math.min(
          10000,
          income * 0.02
        ).toLocaleString("ru-RU")} ₸/месяц`,
        action: "Бесплатные тренировки и правильное питание",
        impact: "high",
        details: `Профилактика заболеваний через спорт и здоровое питание сэкономит ${Math.min(
          10000,
          income * 0.02
        ).toLocaleString("ru-RU")} ₸ на медицинских расходах.`,
      },
      {
        icon: Heart,
        title: "Регулярная благотворительность",
        description: `Закят: ${(income * 0.025).toLocaleString(
          "ru-RU"
        )} ₸/месяц`,
        action: "Автоматические переводы на благотворительность",
        impact: "high",
        details: `Выделяйте 2.5% от дохода на закят. Это очищает ваше имущество и помогает нуждающимся.`,
      },
      {
        icon: Target,
        title: "Целевое накопление",
        description: `Для ваших целей: ${Math.max(
          income * 0.15,
          totalGoalsAmount / 60
        ).toLocaleString("ru-RU")} ₸/месяц`,
        action: "Автоматические переводы на цели",
        impact: "high",
        details: `Для достижения ${
          goals.length
        } целей на сумму ${totalGoalsAmount.toLocaleString(
          "ru-RU"
        )} ₸ откладывайте регулярно.`,
      },
      {
        icon: Zap,
        title: "Энергоэффективность",
        description: `Экономия: ${Math.min(5000, income * 0.01).toLocaleString(
          "ru-RU"
        )} ₸/месяц`,
        action: "Оптимизация потребления энергии",
        impact: "medium",
        details: `Снижение счетов за коммунальные услуги через разумное потребление.`,
      },
    ];

    setAdvice(personalizedAdvice);
  };

  const handleGetAdvice = () => {
    setIsLoading(true);
    // Имитация загрузки новых рекомендаций
    setTimeout(() => {
      if (userData) {
        generatePersonalizedAdvice(userData);
      }
      setIsLoading(false);
      // В реальном приложении здесь был бы вызов API
    }, 1000);
  };

  if (!userData) {
    return (
      <div className="financial-card p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Загрузка персонализированных рекомендаций...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gradient-green">
            Смена привычек
          </h3>
          <p className="text-gray-600">
            Персональные советы для {userData.fullName} как тратить меньше и
            жить лучше
          </p>
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={isLoading}
          className="btn-islamic flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Загрузка...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Обновить рекомендации
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advice.map((habit, index) => {
          const Icon = habit.icon;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    habit.impact === "high"
                      ? "bg-red-100 text-red-600"
                      : habit.impact === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{habit.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {habit.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{habit.details}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {habit.action}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        habit.impact === "high"
                          ? "bg-red-100 text-red-800"
                          : habit.impact === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {habit.impact === "high"
                        ? "Высокий эффект"
                        : habit.impact === "medium"
                        ? "Средний эффект"
                        : "Низкий эффект"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Итоговая статистика */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          Итоговый потенциал улучшений
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Ежемесячная экономия</p>
            <p className="font-semibold text-green-600">
              {advice
                .reduce((sum, habit) => {
                  const amount = parseInt(
                    habit.description.match(/\d+/g)?.[0] || "0"
                  );
                  return (
                    sum + (habit.description.includes("Экономия") ? amount : 0)
                  );
                }, 0)
                .toLocaleString("ru-RU")}{" "}
              ₸
            </p>
          </div>
          <div>
            <p className="text-gray-600">Инвестиции в развитие</p>
            <p className="font-semibold text-blue-600">
              {advice
                .reduce((sum, habit) => {
                  const amount = parseInt(
                    habit.description.match(/\d+/g)?.[0] || "0"
                  );
                  return (
                    sum + (habit.description.includes("бюджет") ? amount : 0)
                  );
                }, 0)
                .toLocaleString("ru-RU")}{" "}
              ₸
            </p>
          </div>
          <div>
            <p className="text-gray-600">Высокоэффективные советы</p>
            <p className="font-semibold text-red-600">
              {advice.filter((h) => h.impact === "high").length} из{" "}
              {advice.length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Годовая экономия</p>
            <p className="font-semibold text-purple-600">
              {(
                advice.reduce((sum, habit) => {
                  const amount = parseInt(
                    habit.description.match(/\d+/g)?.[0] || "0"
                  );
                  return (
                    sum + (habit.description.includes("Экономия") ? amount : 0)
                  );
                }, 0) * 12
              ).toLocaleString("ru-RU")}{" "}
              ₸
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
