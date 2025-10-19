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
  housing: "#3B82F6",
  food: "#10B981",
  transport: "#F59E0B",
  health: "#EF4444",
  entertainment: "#8B5CF6",
  other: "#6B7280",
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
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setUserData(user);
      setEditForm({
        monthlyIncome: user.monthlyIncome || "",
        monthlyExpenses: user.monthlyExpenses || "",
      });
      const initialAnalysis = generateTimeBasedData(user, timeRange);
      setAnalysis(initialAnalysis);
    }
  }, []);

  // Update analysis when time range changes
  useEffect(() => {
    if (userData) {
      const updatedAnalysis = generateTimeBasedData(userData, timeRange);
      setAnalysis(updatedAnalysis);
    }
  }, [timeRange, userData]);

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
      // You can add a toast notification here
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      monthlyIncome: userData.monthlyIncome || "",
      monthlyExpenses: userData.monthlyExpenses || "",
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

  if (!userData || !analysis) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка анализа...</p>
        </div>
      </div>
    );
  }

  const { pieData, barData } = getChartData();

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок и кнопка редактирования */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              Анализ расходов
            </h1>
            <p className="text-white/80 text-lg">
              Управляйте вашими финансами с умом
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            Редактировать профиль
          </button>
        </div>

        {/* Модальное окно редактирования */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="financial-card p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Редактировать профиль
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите ваш доход"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите ваши расходы"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
          <div className="glass-effect rounded-xl p-1">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  timeRange === range
                    ? "bg-white text-blue-600"
                    : "text-white hover:bg-white/10"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card-income">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Доходы</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.totalIncome.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-white/50 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="stat-card-expense">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Расходы</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.totalExpenses.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-white/50 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="stat-card-savings">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Сбережения</p>
                <p className="text-2xl font-bold text-white">
                  {analysis.savings.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-white/50 text-xs mt-1">
                  за {getTimeRangeLabel(timeRange)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="stat-card-savings">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Норма сбережений</p>
                <p className="text-2xl font-bold text-white">
                  {(analysis.savingsRate * 100).toFixed(1)}%
                </p>
                <p className="text-white/50 text-xs mt-1">от доходов</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Круговая диаграмма */}
          <div className="financial-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">
              Распределение расходов за {getTimeRangeLabel(timeRange)}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label={renderLabel}
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
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Столбчатая диаграмма */}
          <div className="financial-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">
              Расходы по категориям за {getTimeRangeLabel(timeRange)}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("ru-RU")} ₸`,
                      "Сумма",
                    ]}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Расходы" fill="#3b82f6">
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
        <div className="financial-card p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">
            Сравнительная аналитика по периодам
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["week", "month", "year"] as const).map((range) => {
              const rangeAnalysis = generateTimeBasedData(userData, range);
              const rangeLabel = getTimeRangeLabel(range);

              return (
                <div
                  key={range}
                  className={`p-4 rounded-xl ${
                    timeRange === range
                      ? "bg-blue-500/20 border-2 border-blue-500"
                      : "bg-gray-800/50"
                  }`}
                >
                  <h4 className="font-semibold text-white mb-3 capitalize">
                    За {rangeLabel}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Доходы:</span>
                      <span className="text-white font-semibold">
                        {rangeAnalysis.totalIncome.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Расходы:</span>
                      <span className="text-white font-semibold">
                        {rangeAnalysis.totalExpenses.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Сбережения:</span>
                      <span className="text-green-400 font-semibold">
                        {rangeAnalysis.savings.toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Норма сбережений:</span>
                      <span className="text-blue-400 font-semibold">
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
        <div className="financial-card p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gradient-green">
            Персональные рекомендации
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map(
              (recommendation: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800">{recommendation}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Детализация расходов для всех периодов */}
        <div className="financial-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">
            Детализация расходов за {getTimeRangeLabel(timeRange)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-700">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {getCategoryLabel(category)}
                        </p>
                        <p className="text-gray-400 text-sm">{percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
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
