"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  GraduationCap,
  Plane,
  Heart,
  Trash2,
} from "lucide-react";
import { apiService } from "@/services/api";

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  timeline: number;
  category: string;
  priority: string;
  monthlySaving: number;
  progressPercentage: number;
}

const categoryIcons = {
  housing: Home,
  education: GraduationCap,
  travel: Plane,
  health: Heart,
  hajj: Plane,
  marriage: Heart,
  business: TrendingUp,
  other: Target,
};

const categoryColors = {
  housing: "bg-blue-500",
  education: "bg-green-500",
  travel: "bg-purple-500",
  health: "bg-red-500",
  hajj: "bg-yellow-500",
  marriage: "bg-pink-500",
  business: "bg-indigo-500",
  other: "bg-gray-500",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем цели пользователя из localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setUserData(user);

      // Преобразуем цели пользователя в формат для отображения
      if (user.goals && user.goals.length > 0) {
        const userGoals = user.goals.map((goal: any, index: number) => {
          const targetAmount = parseInt(goal.targetAmount) || 0;
          const currentAmount = parseInt(goal.currentAmount) || 0;
          const timeline = parseInt(goal.timeline) || 12;
          const monthlySaving = targetAmount / timeline;
          const progressPercentage =
            targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

          return {
            id: `goal-${index}`,
            name: goal.name,
            targetAmount: targetAmount,
            currentAmount: currentAmount,
            timeline: timeline,
            category: goal.category,
            priority: goal.priority || "medium",
            monthlySaving: monthlySaving,
            progressPercentage: progressPercentage,
          };
        });
        setGoals(userGoals);
      }
    }
  }, []);

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    timeline: 12,
    category: "other",
    priority: "medium",
  });

  const addGoal = () => {
    const monthlySaving =
      (newGoal.targetAmount - newGoal.currentAmount) / newGoal.timeline;
    const progressPercentage =
      newGoal.targetAmount > 0
        ? (newGoal.currentAmount / newGoal.targetAmount) * 100
        : 0;

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount,
      timeline: newGoal.timeline,
      category: newGoal.category,
      priority: newGoal.priority,
      monthlySaving: monthlySaving,
      progressPercentage: progressPercentage,
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);

    // Обновляем localStorage
    if (userData) {
      const updatedUser = {
        ...userData,
        goals: updatedGoals.map((g) => ({
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          timeline: g.timeline,
          category: g.category,
          priority: g.priority,
        })),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      setUserData(updatedUser);
    }

    setNewGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      timeline: 12,
      category: "other",
      priority: "medium",
    });
    setShowForm(false);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);

    // Обновляем localStorage
    if (userData) {
      const updatedUser = {
        ...userData,
        goals: updatedGoals.map((g) => ({
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          timeline: g.timeline,
          category: g.category,
          priority: g.priority,
        })),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      setUserData(updatedUser);
    }
  };

  const handleGetRecommendations = async (goal: FinancialGoal) => {
    setIsLoading(true);
    try {
      // Отправляем запрос на бэкенд для получения рекомендаций
      const response = await apiService.sendChatMessage({
        message: `Дай рекомендации по цели: ${goal.name} на сумму ${goal.targetAmount} тенге на срок ${goal.timeline} месяцев. Категория: ${goal.category}`,
        message_type: "goal_advice",
      });

      // Показываем рекомендации в alert (в реальном приложении можно сделать модальное окно)
      alert(`Рекомендации по цели "${goal.name}":\n\n${response.response}`);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Не удалось получить рекомендации. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      housing: "Жилье",
      education: "Образование",
      travel: "Путешествия",
      health: "Здоровье",
      hajj: "Хадж",
      marriage: "Свадьба",
      business: "Бизнес",
      other: "Другое",
    };
    return labels[category] || category;
  };

  // Статистика на основе реальных данных
  const totalGoals = goals.length;
  const totalTargetAmount = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalCurrentAmount = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const totalMonthlySavings = goals.reduce(
    (sum, goal) => sum + goal.monthlySaving,
    0
  );
  const averageProgress =
    totalGoals > 0
      ? goals.reduce((sum, goal) => sum + goal.progressPercentage, 0) /
        totalGoals
      : 0;

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Мои финансовые цели
          </h1>
          <p className="text-white/80 text-lg">
            Планируйте и достигайте ваши мечты с Zaman Bank
          </p>
        </div>

        {/* Статистика на основе реальных данных */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card-income text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Всего целей</p>
                <p className="text-2xl font-bold">{totalGoals}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="stat-card-savings text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Общая цель</p>
                <p className="text-2xl font-bold">
                  {totalTargetAmount.toLocaleString("ru-RU")} ₸
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="stat-card-expense text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Накоплено</p>
                <p className="text-2xl font-bold">
                  {totalCurrentAmount.toLocaleString("ru-RU")} ₸
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="stat-card-savings text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Ежемесячно</p>
                <p className="text-2xl font-bold">
                  {totalMonthlySavings.toLocaleString("ru-RU")} ₸
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Кнопка добавления и форма */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Ваши цели</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Новая цель
          </button>
        </div>

        {showForm && (
          <div className="financial-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Создать новую цель</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Название цели</label>
                <input
                  type="text"
                  placeholder="Например: Покупка квартиры, Образование, Хадж..."
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Целевая сумма (₸)</label>
                  <input
                    type="number"
                    placeholder="5000000"
                    value={newGoal.targetAmount}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        targetAmount: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">Текущие накопления (₸)</label>
                  <input
                    type="number"
                    placeholder="500000"
                    value={newGoal.currentAmount}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        currentAmount: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Срок (месяцев)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={newGoal.timeline}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        timeline: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">Категория</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, category: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="housing">Жилье</option>
                    <option value="education">Образование</option>
                    <option value="hajj">Хадж</option>
                    <option value="marriage">Свадьба</option>
                    <option value="business">Бизнес</option>
                    <option value="health">Здоровье</option>
                    <option value="travel">Путешествия</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Приоритет</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, priority: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.name.trim() || newGoal.targetAmount <= 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Создать цель
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Сетка целей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const Icon =
              categoryIcons[goal.category as keyof typeof categoryIcons] ||
              Target;

            return (
              <div key={goal.id} className="goal-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        categoryColors[
                          goal.category as keyof typeof categoryColors
                        ]
                      } text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className="text-gray-500 text-sm capitalize">
                        {getCategoryLabel(goal.category)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-all p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Прогресс бар */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Прогресс</span>
                    <span className="font-semibold">
                      {goal.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="goal-progress">
                    <div
                      className="goal-progress-fill"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Детали */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Цель:</span>
                    <span className="font-semibold">
                      {goal.targetAmount.toLocaleString("ru-RU")} ₸
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Накоплено:</span>
                    <span className="font-semibold">
                      {goal.currentAmount.toLocaleString("ru-RU")} ₸
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ежемесячно:</span>
                    <span className="font-semibold">
                      {goal.monthlySaving.toLocaleString("ru-RU")} ₸
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Срок:</span>
                    <span className="font-semibold">{goal.timeline} мес.</span>
                  </div>
                </div>

                <button
                  onClick={() => handleGetRecommendations(goal)}
                  disabled={isLoading}
                  className="w-full btn-islamic flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Получить рекомендации
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Нет целей
              </h3>
              <p className="text-gray-500">
                Добавьте вашу первую финансовую цель
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
