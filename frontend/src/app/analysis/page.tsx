"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Home,
  Car,
  Heart,
  Utensils,
  Edit3,
  Save,
  X,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  housing: "#2563eb", // Brighter blue
  food: "#059669", // Brighter green
  transport: "#d97706", // Brighter amber
  health: "#dc2626", // Brighter red
  entertainment: "#7c3aed", // Brighter violet
  other: "#4b5563", // Brighter gray
};

const categoryIcons: Record<string, any> = {
  housing: Home,
  food: Utensils,
  transport: Car,
  health: Heart,
  entertainment: ShoppingCart,
  other: DollarSign,
};

export default function AnalysisPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [userData, setUserData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Calculate time-based multipliers
  const getTimeRangeMultiplier = (range: "week" | "month" | "year") => {
    switch (range) {
      case "week":
        return 0.25; // Approximately 1/4 of monthly data
      case "month":
        return 1;
      case "year":
        return 12;
      default:
        return 1;
    }
  };

  // Generate realistic time-based data
  const generateTimeBasedData = (
    user: any,
    range: "week" | "month" | "year"
  ) => {
    const monthlyIncome = parseInt(user.monthlyIncome) || 0;
    const monthlyExpenses =
      parseInt(user.monthlyExpenses) || monthlyIncome * 0.7;
    const goals = user.goals || [];

    const multiplier = getTimeRangeMultiplier(range);

    // Base expenses with some variation based on time range
    const baseExpenses = monthlyExpenses * multiplier;

    // Adjust expense distribution based on time range
    let expenseDistribution: Record<string, number>;

    switch (range) {
      case "week":
        // Weekly: More food/transport, less housing
        expenseDistribution = {
          housing: baseExpenses * 0.3, // Lower percentage weekly
          food: baseExpenses * 0.3, // Higher percentage weekly
          transport: baseExpenses * 0.2, // Higher percentage weekly
          health: baseExpenses * 0.08,
          entertainment: baseExpenses * 0.12,
        };
        break;
      case "month":
        // Monthly: Standard distribution
        expenseDistribution = {
          housing: baseExpenses * 0.4,
          food: baseExpenses * 0.25,
          transport: baseExpenses * 0.15,
          health: baseExpenses * 0.1,
          entertainment: baseExpenses * 0.1,
        };
        break;
      case "year":
        // Yearly: More housing/health (annual payments), less food/entertainment
        expenseDistribution = {
          housing: baseExpenses * 0.45, // Higher percentage yearly
          food: baseExpenses * 0.2, // Lower percentage yearly
          transport: baseExpenses * 0.12, // Lower percentage yearly
          health: baseExpenses * 0.15, // Higher percentage yearly
          entertainment: baseExpenses * 0.08,
        };
        break;
      default:
        expenseDistribution = {
          housing: baseExpenses * 0.4,
          food: baseExpenses * 0.25,
          transport: baseExpenses * 0.15,
          health: baseExpenses * 0.1,
          entertainment: baseExpenses * 0.1,
        };
    }

    // Adjust for goals
    goals.forEach((goal: any) => {
      const category = goal.category;
      if (expenseDistribution[category]) {
        expenseDistribution[category] += baseExpenses * 0.05;
      }
    });

    const totalIncome = monthlyIncome * multiplier;
    const totalExpenses = Object.values(expenseDistribution).reduce(
      (sum: number, val: number) => sum + val,
      0
    );
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? savings / totalIncome : 0;

    return {
      totalIncome,
      totalExpenses,
      savings,
      savingsRate,
      expensesByCategory: expenseDistribution,
      recommendations: generateRecommendations(
        savingsRate,
        totalIncome,
        goals.length,
        range
      ),
    };
  };

  const generateRecommendations = (
    savingsRate: number,
    income: number,
    goalsCount: number,
    range: "week" | "month" | "year"
  ) => {
    const rangeText =
      range === "week"
        ? "еженедельно"
        : range === "month"
        ? "ежемесячно"
        : "ежегодно";

    return [
      savingsRate < 0.2
        ? `Увеличьте сбережения до ${(income * 0.2).toLocaleString(
            "ru-RU"
          )} ₸ ${rangeText} (сейчас ${(income * savingsRate).toLocaleString(
            "ru-RU"
          )} ₸)`
        : "У вас хорошая норма сбережений!",
      `Рассмотрите исламские инвестиции на ${(income * 0.15).toLocaleString(
        "ru-RU"
      )} ₸ ${rangeText}`,
      `Выделяйте ${(income * 0.025).toLocaleString(
        "ru-RU"
      )} ₸ ${rangeText} на закят`,
      goalsCount > 0
        ? `Для ваших ${goalsCount} целей откладывайте ${(
            income * 0.2
          ).toLocaleString("ru-RU")} ₸ ${rangeText}`
        : "Добавьте финансовые цели для планирования",
    ].filter(Boolean);
  };

  // Load user data and generate analysis
  useEffect(() => {
    const loadUserData = () => {
      setIsLoading(true);
      try {
        const userProfile = localStorage.getItem("userProfile");
        if (userProfile) {
          const user = JSON.parse(userProfile);
          setUserData(user);
          setEditForm({
            monthlyIncome: user.monthlyIncome?.toString() || "",
            monthlyExpenses: user.monthlyExpenses?.toString() || "",
          });
          const initialAnalysis = generateTimeBasedData(user, timeRange);
          setAnalysis(initialAnalysis);
        } else {
          // Fallback demo data if no user profile exists
          const demoUser = {
            monthlyIncome: "500000",
            monthlyExpenses: "350000",
            goals: [],
            fullName: "Демо Пользователь",
          };
          setUserData(demoUser);
          setEditForm({
            monthlyIncome: "500000",
            monthlyExpenses: "350000",
          });
          const initialAnalysis = generateTimeBasedData(demoUser, timeRange);
          setAnalysis(initialAnalysis);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update analysis when time range changes
  useEffect(() => {
    if (userData && !isLoading) {
      const updatedAnalysis = generateTimeBasedData(userData, timeRange);
      setAnalysis(updatedAnalysis);
    }
  }, [timeRange, userData, isLoading]);

  // Function to get chart data
  const getChartData = () => {
    if (!analysis) return { pieData: [], barData: [] };

    const pieData = Object.entries(analysis.expensesByCategory).map(
      ([name, value]) => ({
        name: getCategoryLabel(name),
        value: value as number,
        color: categoryColors[name] || categoryColors.other,
      })
    );

    const barData = Object.entries(analysis.expensesByCategory).map(
      ([name, value]) => ({
        category: getCategoryLabel(name),
        amount: value as number,
        color: categoryColors[name] || categoryColors.other,
      })
    );

    return { pieData, barData };
  };

  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      housing: "Жилье",
      food: "Еда",
      transport: "Транспорт",
      health: "Здоровье",
      entertainment: "Развлечения",
      other: "Другое",
    };
    return labels[category] || category;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Validate inputs
      if (!editForm.monthlyIncome || !editForm.monthlyExpenses) {
        alert("Пожалуйста, заполните все поля");
        return;
      }

      // Update local storage
      const updatedUserData = {
        ...userData,
        monthlyIncome: editForm.monthlyIncome,
        monthlyExpenses: editForm.monthlyExpenses,
      };

      localStorage.setItem("userProfile", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      // Update analysis with new data
      const updatedAnalysis = generateTimeBasedData(updatedUserData, timeRange);
      setAnalysis(updatedAnalysis);

      setIsEditing(false);

      // Show success message
      alert("Профиль успешно обновлен! Все данные пересчитаны.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.");
    }
  };

  const handleCancel = () => {
    setEditForm({
      monthlyIncome: userData?.monthlyIncome?.toString() || "",
      monthlyExpenses: userData?.monthlyExpenses?.toString() || "",
    });
    setIsEditing(false);
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "week":
        return "неделю";
      case "month":
        return "месяц";
      case "year":
        return "год";
      default:
        return "месяц";
    }
  };

  const renderLabel = (entry: any) => {
    return `${entry.name}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка анализа...</p>
        </div>
      </div>
    );
  }

  if (!userData || !analysis) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-white text-lg">Ошибка загрузки данных</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  const { pieData, barData } = getChartData();

  return (
    <div className="min-h-screen pt-24 pb-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок и кнопка редактирования */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Анализ расходов
            </h1>
            <p className="text-gray-300 text-lg">
              Управляйте вашими финансами с умом
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-lg"
          >
            <Edit3 className="h-4 w-4" />
            Редактировать профиль
          </button>
        </div>

        {/* Модальное окно редактирования */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Редактировать финансовые данные
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Ежемесячный доход (₸)
                  </label>
                  <input
                    type="number"
                    value={editForm.monthlyIncome}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        monthlyIncome: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
                    placeholder="Например: 500000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Ежемесячные расходы (₸)
                  </label>
                  <input
                    type="number"
                    value={editForm.monthlyExpenses}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        monthlyExpenses: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
                    placeholder="Например: 350000"
                    min="0"
                  />
                </div>

                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
                  <p className="text-blue-200 text-sm">
                    💡 После сохранения все графики и рекомендации будут
                    автоматически пересчитаны с новыми данными.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    Сохранить изменения
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Фильтры по времени */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-xl p-1 border border-gray-600 shadow-lg">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 sm:px-6 py-2 rounded-lg transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {range === "week"
                  ? "Неделя"
                  : range === "month"
                  ? "Месяц"
                  : "Год"}
              </button>
            ))}
          </div>
        </div>

        {/* Статистика с реальными данными */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/30 border border-green-700/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Доходы</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.totalIncome.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-green-300 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 border border-red-700/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Расходы</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.totalExpenses.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-red-300 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 border border-blue-700/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Сбережения</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.savings.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-blue-300 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 border border-purple-700/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Норма сбережений</p>
                <p className="text-2xl font-bold text-white">
                  {(analysis.savingsRate * 100).toFixed(1)}%
                </p>
                <p className="text-purple-300 text-xs mt-1">от доходов</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Круговая диаграмма */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
              Распределение расходов за {getTimeRangeLabel(timeRange)}
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent } : any) => 
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("ru-RU")} ₸`,
                      "Сумма",
                    ]}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #4b5563',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Столбчатая диаграмма */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
              Расходы по категориям за {getTimeRangeLabel(timeRange)}
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#d1d5db" 
                    fontSize={12}
                    tick={{ fill: '#d1d5db' }}
                  />
                  <YAxis 
                    stroke="#d1d5db"
                    tick={{ fill: '#d1d5db' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("ru-RU")} ₸`,
                      "Сумма",
                    ]}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #4b5563',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="amount" name="Расходы" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Сравнительная аналитика по периодам */}
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6 mb-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
            📊 Сравнительная аналитика по периодам
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["week", "month", "year"] as const).map((range) => {
              const rangeAnalysis = generateTimeBasedData(userData, range);
              const rangeLabel = getTimeRangeLabel(range);

              return (
                <div
                  key={range}
                  className={`p-4 rounded-xl border transition-all ${
                    timeRange === range
                      ? "bg-blue-600/20 border-blue-500 shadow-lg scale-105"
                      : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <h4 className="font-semibold text-white mb-3 capitalize text-center">
                    {range === "week" && "📅 Неделя"}
                    {range === "month" && "📆 Месяц"}
                    {range === "year" && "🎯 Год"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Доходы:</span>
                      <span className="text-white font-semibold">
                        {rangeAnalysis.totalIncome.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Расходы:</span>
                      <span className="text-white font-semibold">
                        {rangeAnalysis.totalExpenses.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Сбережения:</span>
                      <span
                        className={`font-semibold ${
                          rangeAnalysis.savings >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {rangeAnalysis.savings.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Норма сбережений:</span>
                      <span
                        className={`font-semibold ${
                          rangeAnalysis.savingsRate >= 0.2
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {(rangeAnalysis.savingsRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Рекомендации */}
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6 mb-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
            💡 Персональные рекомендации
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map(
              (recommendation: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-lg border border-blue-700/50"
                >
                  <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100 text-sm sm:text-base">
                    {recommendation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Детализация расходов */}
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
            🏷️ Детализация расходов за {getTimeRangeLabel(timeRange)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(analysis.expensesByCategory).map(
              ([category, amount]) => {
                const Icon = categoryIcons[category] || DollarSign;
                const percentage = (
                  ((amount as number) / analysis.totalExpenses) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: categoryColors[category] + '20' }}
                      >
                        <Icon 
                          className="h-4 w-4" 
                          style={{ color: categoryColors[category] }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm sm:text-base">
                          {getCategoryLabel(category)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {percentage}% от расходов
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white text-sm sm:text-base">
                        {(amount as number).toLocaleString("ru-RU")} ₸
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}